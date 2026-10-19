import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Download, 
  Inbox, 
  Compass, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowLeftRight,
  Plus
} from 'lucide-react';
import { AvatarVisual } from './AvatarVisual';

export const DashboardPage: React.FC = () => {
  const { 
    currentUser, 
    requests, 
    sessions, 
    navigateTo, 
    openModal, 
    getPartnerForSession,
    exportCalendarIcs 
  } = useApp();

  if (!currentUser) return null;

  // Filter incoming pending requests
  const pendingIncoming = requests.filter(
    (r) => r.recipientId === currentUser.id && r.status === 'Pending'
  );

  // Filter next scheduled session
  const userScheduledSessions = sessions
    .filter(
      (s) =>
        (s.userAId === currentUser.id || s.userBId === currentUser.id) &&
        s.status === 'Scheduled'
    )
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const nextSession = userScheduledSessions[0];
  const nextSessionPartner = nextSession
    ? getPartnerForSession(nextSession, currentUser.id)
    : undefined;

  // Filter pending confirmation sessions
  const pendingConfirmationSessions = sessions.filter(
    (s) =>
      (s.userAId === currentUser.id || s.userBId === currentUser.id) &&
      s.status === 'Pending Confirmation'
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome & Reciprocity Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AvatarVisual
              id={currentUser.id}
              name={currentUser.displayName}
              initials={currentUser.avatarInitials}
              gradientClass={currentUser.avatarColor}
              size="lg"
              showStatus={true}
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Welcome back, {currentUser.displayName}
                </h1>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  Active Member
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentUser.headline} · {currentUser.timezone.replace('_', ' ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => openModal('profile_settings')}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Edit Skills
            </button>
            <button
              onClick={() => navigateTo('/explore')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Peers</span>
            </button>
          </div>
        </div>

        {/* Core Exchange Metrics Strip (Tabular, clean, no decorative charts) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50/70 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Reputation Score
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-mono">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="text-lg font-bold text-slate-900 tabular-nums">
                {currentUser.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Completed Swaps
            </span>
            <p className="text-lg font-bold text-slate-900 font-mono mt-1 tabular-nums">
              {currentUser.totalCompletedSessions} <span className="text-xs font-normal text-slate-500">sessions</span>
            </p>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Offered Skills
            </span>
            <p className="text-lg font-bold text-slate-900 font-mono mt-1 tabular-nums">
              {currentUser.skillsOffered.length} <span className="text-xs font-normal text-slate-500">topics</span>
            </p>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Requested Skills
            </span>
            <p className="text-lg font-bold text-slate-900 font-mono mt-1 tabular-nums">
              {currentUser.skillsRequested.length} <span className="text-xs font-normal text-slate-500">topics</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Next Session & Pending Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Next Confirmed Session Spotlight (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Next Scheduled Session</span>
              </h2>
              {nextSession && (
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md font-semibold">
                  Confirmed
                </span>
              )}
            </div>

            {nextSession ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <AvatarVisual
                    id={nextSessionPartner?.id || 'unknown'}
                    name={nextSessionPartner?.displayName || 'Peer'}
                    initials={nextSessionPartner?.avatarInitials || 'P'}
                    gradientClass={nextSessionPartner?.avatarColor || 'from-slate-700 to-slate-900'}
                    size="md"
                    showStatus={true}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      With {nextSessionPartner?.displayName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Trading: <strong>{nextSession.skillTaughtByA}</strong> ⇄ <strong>{nextSession.skillTaughtByB}</strong>
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Date & Time:</span>
                    <span className="font-bold text-slate-900">
                      {nextSession.date} at {nextSession.time} ({nextSession.durationMinutes} min)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Timezone:</span>
                    <span className="text-slate-700">{currentUser.timezone.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Meeting Link Bar */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <span className="font-mono text-slate-600 truncate max-w-[240px]">
                    {nextSession.meetingUrl}
                  </span>
                  <a
                    href={nextSession.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Join Room</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-medium text-slate-700">No confirmed upcoming sessions</p>
                <p className="mt-1 text-slate-400">Accept an incoming swap proposal or send a request to schedule your next exchange.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
            {nextSession && (
              <button
                onClick={() => exportCalendarIcs(nextSession)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export .ics Calendar</span>
              </button>
            )}
            <button
              onClick={() => navigateTo('/sessions')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-700 transition-colors ml-auto"
            >
              <span>All Sessions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Items / Requests Requiring Attention (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Inbox className="w-4 h-4 text-amber-600" />
                <span>Proposals Requiring Action</span>
              </h2>
              {pendingIncoming.length > 0 && (
                <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                  {pendingIncoming.length} new
                </span>
              )}
            </div>

            {pendingIncoming.length > 0 ? (
              <div className="mt-4 space-y-3">
                {pendingIncoming.slice(0, 2).map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{req.senderSkill} ⇄ {req.recipientSkill}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Pending</span>
                    </div>
                    <p className="text-slate-600 italic line-clamp-2 text-[11px]">
                      "{req.introNote}"
                    </p>
                  </div>
                ))}
              </div>
            ) : pendingConfirmationSessions.length > 0 ? (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1">
                  <p className="font-semibold text-amber-900">
                    Schedule Counter-Proposal Received
                  </p>
                  <p className="text-amber-700 text-[11px]">
                    You have a session proposal awaiting time confirmation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-medium text-slate-700">All caught up!</p>
                <p className="mt-1 text-slate-400">No pending proposals or scheduling actions.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => navigateTo('/requests')}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <span>Open Proposals Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Skills Inventory Showcase */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Your Active Exchange Portfolio
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Offered */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Skills You Teach (Offered)
            </span>
            <div className="space-y-2">
              {currentUser.skillsOffered.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs"
                >
                  <span className="font-semibold text-slate-800">{s.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{s.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Requested */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Skills You Want (Requested)
            </span>
            <div className="space-y-2">
              {currentUser.skillsRequested.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs"
                >
                  <span className="font-medium text-slate-800">{s.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono">Target: {s.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
