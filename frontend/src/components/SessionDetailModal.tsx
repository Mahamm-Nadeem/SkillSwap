import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SwapSession, SessionDuration } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Download, 
  Check, 
  AlertCircle, 
  XCircle, 
  RefreshCw,
  Globe,
  Share2
} from 'lucide-react';
import { AvatarVisual } from './AvatarVisual';

interface SessionDetailModalProps {
  session: SwapSession;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ session }) => {
  const { 
    currentUser, 
    closeModal, 
    getPartnerForSession, 
    confirmSessionSchedule, 
    proposeSessionSchedule, 
    cancelSession, 
    exportCalendarIcs,
    openModal
  } = useApp();

  const partner = currentUser ? getPartnerForSession(session, currentUser.id) : undefined;

  // Reschedule form state
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [newDate, setNewDate] = useState(session.date);
  const [newTime, setNewTime] = useState(session.time);
  const [newDuration, setNewDuration] = useState<SessionDuration>(session.durationMinutes);
  const [newMeetingUrl, setNewMeetingUrl] = useState(session.meetingUrl);
  
  // Cancel form state
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('Unexpected schedule conflict');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!currentUser) return null;

  const isProposer = session.proposedBy === currentUser.id;
  const isScheduled = session.status === 'Scheduled';
  const isPending = session.status === 'Pending Confirmation';

  // Time conversion preview
  const formatTimezonePreview = () => {
    try {
      const dt = new Date(`${newDate}T${newTime}:00`);
      const userTimeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        userTime: `${userTimeStr} (${currentUser.timezone.replace('_', ' ')})`,
        partnerTime: partner ? `Calculated in ${partner.timezone.replace('_', ' ')}` : ''
      };
    } catch {
      return { userTime: newTime, partnerTime: '' };
    }
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    const res = proposeSessionSchedule({
      sessionId: session.id,
      date: newDate,
      time: newTime,
      durationMinutes: newDuration,
      meetingUrl: newMeetingUrl
    });

    if (res.success) {
      setActionSuccess('Counter-proposal sent! Awaiting partner confirmation.');
      setIsEditingSchedule(false);
    } else {
      setActionError(res.error || 'Failed to update schedule.');
    }
  };

  const handleConfirmSchedule = () => {
    confirmSessionSchedule(session.id);
    setActionSuccess('Schedule successfully confirmed!');
  };

  const handleExecuteCancel = () => {
    setActionError(null);
    const res = cancelSession(session.id, cancelReason);
    if (res.success) {
      setActionSuccess('Session has been cancelled.');
      setIsCancelling(false);
    } else {
      setActionError(res.error || 'Cancellation failed.');
    }
  };

  const tzInfo = formatTimezonePreview();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Session Management
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              ID: {session.id} · Status: {session.status}
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {actionError && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{actionError}</span>
            </div>
          )}

          {actionSuccess && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Partner & Exchange Overview */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center gap-3">
              <AvatarVisual
                id={partner?.id || 'unknown'}
                name={partner?.displayName || 'Peer'}
                initials={partner?.avatarInitials || 'P'}
                gradientClass={partner?.avatarColor || 'from-slate-600 to-slate-800'}
                size="md"
                showStatus={true}
              />
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {partner?.displayName || 'Peer Partner'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Timezone: {partner?.timezone.replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                Trade Exchange
              </span>
              <span className="font-semibold text-slate-900">
                {session.skillTaughtByA} ⇄ {session.skillTaughtByB}
              </span>
            </div>
          </div>

          {/* Reschedule View or Normal View */}
          {isEditingSchedule ? (
            <form onSubmit={handleSaveReschedule} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Propose New Time or Meeting URL
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Time (Local: {currentUser.timezone.replace('_', ' ')})
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                    className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Duration Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Session Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([30, 45, 60] as SessionDuration[]).map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setNewDuration(dur)}
                      className={`py-1.5 px-3 text-xs font-semibold rounded-lg border transition-all ${
                        newDuration === dur
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {dur} mins
                    </button>
                  ))}
                </div>
              </div>

              {/* Meeting URL */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Third-Party Meeting URL (Google Meet, Zoom, Teams)
                </label>
                <input
                  type="url"
                  value={newMeetingUrl}
                  onChange={(e) => setNewMeetingUrl(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  required
                  className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Example: https://meet.google.com/abc-defg-hij
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditingSchedule(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  Send Counter-Proposal
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Confirmed / Proposed Time Summary */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Scheduled Date & Time
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {session.date} at {session.time}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Duration
                  </span>
                  <span className="font-mono text-slate-900 font-semibold">
                    {session.durationMinutes} minutes
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <span className="text-slate-500 font-medium block">
                    Timezone Verification
                  </span>
                  <p className="font-mono text-[11px] text-slate-700">
                    • Your local time: <strong>{tzInfo.userTime}</strong>
                  </p>
                  {partner && (
                    <p className="font-mono text-[11px] text-slate-500">
                      • Partner's local timezone: <strong>{partner.timezone.replace('_', ' ')}</strong>
                    </p>
                  )}
                </div>

                {/* Meeting Link Box */}
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Virtual Meeting Link
                  </span>
                  <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-lg">
                    <span className="text-xs font-mono text-slate-700 truncate">
                      {session.meetingUrl}
                    </span>
                    <a
                      href={session.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Join Call</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions Strip */}
              <div className="flex flex-wrap items-center gap-2.5">
                {isScheduled && (
                  <button
                    onClick={() => exportCalendarIcs(session)}
                    className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Download .ICS File</span>
                  </button>
                )}

                {isPending && !isProposer && (
                  <button
                    onClick={handleConfirmSchedule}
                    className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm This Schedule</span>
                  </button>
                )}

                {session.status !== 'Cancelled' && session.status !== 'Completed' && (
                  <button
                    onClick={() => setIsEditingSchedule(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Propose New Time</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Cancellation Section with 2-hour rule info */}
          {session.status !== 'Cancelled' && session.status !== 'Completed' && (
            <div className="border-t border-slate-100 pt-4">
              {isCancelling ? (
                <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    Confirm Cancellation (2-Hour Rule Check)
                  </h4>
                  <p className="text-xs text-rose-700">
                    Platform policy requires cancellations to be made at least <strong>2 hours prior</strong> to session start. Cancellations inside 2 hours cannot be processed self-serve to protect peer accountability.
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Reason for cancellation:
                    </label>
                    <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                    >
                      <option value="Unexpected schedule conflict">Unexpected schedule conflict</option>
                      <option value="Need to reschedule for next week">Need to reschedule for next week</option>
                      <option value="Personal emergency">Personal emergency</option>
                      <option value="Technical issues with meeting platform">Technical issues with meeting platform</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCancelling(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Keep Session
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteCancel}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
                    >
                      Execute Cancellation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Need to cancel this booking?</span>
                  <button
                    onClick={() => setIsCancelling(true)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
                  >
                    Cancel Session
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Feedback Prompt Button */}
          {session.status === 'Scheduled' && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-semibold text-amber-900">
                  Ready for mutual feedback?
                </p>
                <p className="text-amber-700 text-[11px]">
                  Feedback window unlocks post-session to rate punctuality, knowledge sharing, and verify attendance.
                </p>
              </div>
              <button
                onClick={() => {
                  closeModal();
                  openModal('feedback', { session });
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-amber-300 rounded-lg hover:bg-amber-100/50 transition-colors shrink-0 shadow-xs"
              >
                Open Feedback Form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
