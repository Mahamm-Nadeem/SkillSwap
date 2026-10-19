import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SwapSession } from '../types';
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ArrowRight,
  Star,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { AvatarVisual } from './AvatarVisual';

export const SessionsPage: React.FC = () => {
  const { 
    currentUser, 
    sessions, 
    getPartnerForSession, 
    exportCalendarIcs, 
    openModal, 
    navigateTo 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'scheduled' | 'pending' | 'completed'>('scheduled');

  if (!currentUser) return null;

  // Filter sessions relevant to currentUser
  const userSessions = sessions.filter(
    (s) => s.userAId === currentUser.id || s.userBId === currentUser.id
  );

  const scheduledSessions = userSessions.filter((s) => s.status === 'Scheduled');
  const pendingSessions = userSessions.filter((s) => s.status === 'Pending Confirmation');
  const pastSessions = userSessions.filter(
    (s) => s.status === 'Completed' || s.status === 'No-Show Reported' || s.status === 'Cancelled'
  );

  let displayedSessions: SwapSession[] = [];
  if (activeTab === 'scheduled') displayedSessions = scheduledSessions;
  if (activeTab === 'pending') displayedSessions = pendingSessions;
  if (activeTab === 'completed') displayedSessions = pastSessions;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Exchange Sessions Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Coordinate meeting links, time slots, calendar exports, and post-session peer reviews.
          </p>
        </div>

        {/* Tab Controls (Functional Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'scheduled'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Scheduled</span>
            {scheduledSessions.length > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-900 text-[10px] font-mono rounded">
                {scheduledSessions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Proposal</span>
            {pendingSessions.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] font-mono rounded">
                {pendingSessions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Past & History</span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({pastSessions.length})
            </span>
          </button>
        </div>
      </div>

      {/* Sessions List */}
      {displayedSessions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            No {activeTab} sessions found
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'scheduled'
              ? 'Confirmed sessions with meeting URLs and agreed times will appear here.'
              : activeTab === 'pending'
              ? 'Sessions awaiting confirmation or counter-proposals will appear here.'
              : 'Past sessions and submitted feedback will be listed in this history tab.'}
          </p>
          <div className="mt-5">
            <button
              onClick={() => navigateTo('/explore')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Find an Exchange Partner
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedSessions.map((session) => {
            const partner = getPartnerForSession(session, currentUser.id);
            const myFeedback = session.feedbacks[currentUser.id];
            const partnerFeedback = partner ? session.feedbacks[partner.id] : null;

            return (
              <div
                key={session.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Partner & Skill Exchange Summary */}
                  <div className="flex items-start gap-3.5">
                    <AvatarVisual
                      id={partner?.id || 'unknown'}
                      name={partner?.displayName || 'Peer'}
                      initials={partner?.avatarInitials || 'P'}
                      gradientClass={partner?.avatarColor || 'from-slate-600 to-slate-800'}
                      size="md"
                      showStatus={true}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {partner?.displayName || 'Peer'}
                        </h3>
                        <span className="text-xs text-slate-500 font-mono">
                          {partner?.timezone.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        Trading: <strong>{session.skillTaughtByA}</strong> ⇄ <strong>{session.skillTaughtByB}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Right: Status Badge */}
                  <div>
                    {session.status === 'Scheduled' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Confirmed Scheduled
                      </span>
                    )}
                    {session.status === 'Pending Confirmation' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Pending Confirmation
                      </span>
                    )}
                    {session.status === 'Completed' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 rounded-md">
                        <Star className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                        Completed & Reviewed
                      </span>
                    )}
                    {session.status === 'No-Show Reported' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-md">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        No-Show Reported
                      </span>
                    )}
                    {session.status === 'Cancelled' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-md">
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* Date, Time, Duration & Link Bar */}
                <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-slate-700 font-mono">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {session.time} ({session.durationMinutes} min)
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Your local: {currentUser.timezone.replace('_', ' ')}
                    </span>
                  </div>

                  {session.meetingUrl && session.status !== 'Cancelled' && (
                    <a
                      href={session.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-800 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                      <span>{session.meetingUrl.replace('https://', '')}</span>
                    </a>
                  )}
                </div>

                {/* Cancel note if cancelled */}
                {session.status === 'Cancelled' && session.cancelReason && (
                  <p className="mt-3 text-xs text-rose-700 bg-rose-50/60 border border-rose-100 p-2.5 rounded-lg">
                    <strong>Cancellation reason:</strong> {session.cancelReason}
                  </p>
                )}

                {/* Reviews snippet if completed */}
                {session.status === 'Completed' && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    {myFeedback && (
                      <div className="text-slate-600">
                        <span className="font-semibold text-slate-800">Your feedback: </span>
                        <span>{myFeedback.overallRating} ★ — "{myFeedback.reviewText || 'No comment'}"</span>
                      </div>
                    )}
                    {partnerFeedback && (
                      <div className="text-slate-600">
                        <span className="font-semibold text-slate-800">{partner?.displayName}'s feedback: </span>
                        <span>{partnerFeedback.overallRating} ★ — "{partnerFeedback.reviewText || 'No comment'}"</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    {session.status === 'Scheduled' && (
                      <button
                        onClick={() => exportCalendarIcs(session)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Download standard .ics file for Google Calendar, Outlook, or Apple Calendar"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Export .ICS</span>
                      </button>
                    )}

                    {session.status === 'Scheduled' && (
                      <button
                        onClick={() => openModal('feedback', { session })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        <span>Submit Feedback / Attendance</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => openModal('session_detail', { session })}
                    className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs ml-auto"
                  >
                    <span>Manage Session & Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
