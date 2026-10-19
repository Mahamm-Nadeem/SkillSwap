import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Inbox, 
  Calendar, 
  Star, 
  Settings, 
  ShieldCheck, 
  ArrowLeftRight, 
  BookOpen, 
  PlusCircle,
  ExternalLink,
  Award
} from 'lucide-react';
import { AvatarVisual } from './AvatarVisual';

export const LinkedInLeftSidebar: React.FC = () => {
  const { 
    currentUser, 
    requests, 
    sessions, 
    currentRoute, 
    navigateTo, 
    openModal, 
    startNewUserOnboarding 
  } = useApp();

  if (!currentUser) return null;

  const pendingIncomingCount = requests.filter(
    (r) => r.recipientId === currentUser.id && r.status === 'Pending'
  ).length;

  const scheduledSessionsCount = sessions.filter(
    (s) =>
      (s.userAId === currentUser.id || s.userBId === currentUser.id) &&
      s.status === 'Scheduled'
  ).length;

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-4">
      {/* LinkedIn-style User Identity Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        
        {/* Banner Cover */}
        <div className="h-16 bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
        </div>

        {/* Avatar & Header details */}
        <div className="px-4 pb-4 pt-0 relative text-center">
          <div className="-mt-8 mb-2 flex justify-center">
            <div className="p-0.5 bg-white rounded-2xl shadow-xs">
              <AvatarVisual
                id={currentUser.id}
                name={currentUser.displayName}
                initials={currentUser.avatarInitials}
                gradientClass={currentUser.avatarColor}
                size="lg"
                showStatus={true}
              />
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 leading-tight">
            {currentUser.displayName}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-0.5">
            {currentUser.headline}
          </p>
          <p className="text-[10px] text-slate-400 font-mono mt-1">
            {currentUser.timezone.replace('_', ' ')}
          </p>

          {/* Metrics Strip */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-[11px] text-slate-500">Completed Swaps</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {currentUser.totalCompletedSessions}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="text-[11px] text-slate-500">Reputation Rating</span>
              <span className="font-mono font-bold text-slate-900 flex items-center gap-1 tabular-nums">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                {currentUser.averageRating.toFixed(1)}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="text-[11px] text-slate-500">Reciprocity Ratio</span>
              <span className="font-mono text-emerald-600 font-bold text-[11px]">
                100% Balanced
              </span>
            </div>
          </div>

          {/* Quick Edit CTA */}
          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <button
              onClick={() => openModal('profile_settings')}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Skills & Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shortcuts & Primary Navigation Menu */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-1 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 block">
          Barter Workspace
        </span>

        <button
          onClick={() => navigateTo('/explore')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors ${
            currentRoute === '/explore'
              ? 'bg-slate-900 text-white font-semibold shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>Explore Peers</span>
          </div>
        </button>

        <button
          onClick={() => navigateTo('/requests')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors ${
            currentRoute === '/requests'
              ? 'bg-slate-900 text-white font-semibold shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4" />
            <span>Swap Proposals</span>
          </div>
          {pendingIncomingCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
              currentRoute === '/requests' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-900'
            }`}>
              {pendingIncomingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigateTo('/sessions')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors ${
            currentRoute === '/sessions'
              ? 'bg-slate-900 text-white font-semibold shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Scheduled Sessions</span>
          </div>
          {scheduledSessionsCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
              currentRoute === '/sessions' ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-100 text-emerald-900'
            }`}>
              {scheduledSessionsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigateTo('/dashboard')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors ${
            currentRoute === '/dashboard'
              ? 'bg-slate-900 text-white font-semibold shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>My Exchange Stats</span>
          </div>
        </button>
      </div>

      {/* Reciprocity Policy Notice */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero-Money Guarantee</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          SkillSwap is 100% peer barter. No cash or tokens ever change hands.
        </p>
      </div>
    </aside>
  );
};
