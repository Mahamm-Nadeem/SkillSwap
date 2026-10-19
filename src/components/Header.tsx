import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeftRight, 
  Calendar, 
  Inbox, 
  Compass, 
  UserCheck, 
  Sparkles, 
  ChevronDown, 
  Settings, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { AvatarVisual } from './AvatarVisual';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    users, 
    switchUser, 
    startNewUserOnboarding, 
    currentRoute, 
    navigateTo, 
    requests, 
    sessions,
    openModal
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute pending incoming requests for currentUser
  const pendingIncomingCount = currentUser
    ? requests.filter((r) => r.recipientId === currentUser.id && r.status === 'Pending').length
    : 0;

  // Compute scheduled active sessions for currentUser
  const activeSessionsCount = currentUser
    ? sessions.filter(
        (s) =>
          (s.userAId === currentUser.id || s.userBId === currentUser.id) &&
          (s.status === 'Scheduled' || s.status === 'Pending Confirmation')
      ).length
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo(currentUser?.published ? '/dashboard' : '/')}
            className="flex items-center gap-2.5 text-slate-900 hover:opacity-90 transition-opacity focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-lg font-bold tracking-tight whitespace-nowrap">
              SkillSwap
            </span>
          </button>
          <span className="hidden lg:inline text-xs text-slate-500 font-medium border-l border-slate-200 pl-3">
            Peer Barter Platform
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line, unboxed, hover underline/color) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => navigateTo('/explore')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              currentRoute === '/explore'
                ? 'text-slate-900 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>Explore Peers</span>
          </button>

          <button
            onClick={() => navigateTo('/requests')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors relative ${
              currentRoute === '/requests'
                ? 'text-slate-900 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <Inbox className="w-4 h-4 text-slate-500" />
            <span>Requests</span>
            {pendingIncomingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[11px] font-mono font-medium bg-amber-100 text-amber-900 rounded-md">
                {pendingIncomingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigateTo('/sessions')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors relative ${
              currentRoute === '/sessions'
                ? 'text-slate-900 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Sessions</span>
            {activeSessionsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[11px] font-mono font-medium bg-slate-100 text-slate-700 rounded-md">
                {activeSessionsCount}
              </span>
            )}
          </button>

          {currentUser?.published && (
            <button
              onClick={() => navigateTo('/dashboard')}
              className={`whitespace-nowrap transition-colors ${
                currentRoute === '/dashboard'
                  ? 'text-slate-900 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action & Persona Switcher */}
        <div className="flex items-center gap-3 shrink-0" ref={menuRef}>
          {currentUser && currentUser.published ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-left transition-colors focus:outline-none"
                aria-expanded={userMenuOpen}
              >
                <AvatarVisual
                  id={currentUser.id}
                  name={currentUser.displayName}
                  initials={currentUser.avatarInitials}
                  gradientClass={currentUser.avatarColor}
                  size="sm"
                  showStatus={true}
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser.displayName}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono leading-none truncate max-w-[110px]">
                    {currentUser.skillsOffered[0]?.name || 'Peer'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Persona Switcher & Account Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Active User
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {currentUser.displayName}
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {currentUser.headline}
                    </p>
                  </div>

                  {/* Persona quick switch for bilateral testing */}
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                      Switch Persona (PRD Test Cohort)
                    </p>
                    <div className="space-y-1">
                      {users.filter(u => u.published).map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors ${
                            u.id === currentUser.id
                              ? 'bg-slate-100 text-slate-900 font-medium'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <AvatarVisual
                              id={u.id}
                              name={u.displayName}
                              initials={u.avatarInitials}
                              gradientClass={u.avatarColor}
                              size="sm"
                            />
                            <span>{u.displayName}</span>
                          </div>
                          {u.id === currentUser.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => {
                        openModal('profile_settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Edit Profile & Skills</span>
                    </button>

                    <button
                      onClick={() => {
                        startNewUserOnboarding();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-600" />
                      <span>Test New User Onboarding</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTo('/explore')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Browse Directory
              </button>
              <button
                onClick={() => startNewUserOnboarding()}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Navigation Row */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center justify-around bg-slate-50/80 text-xs font-medium text-slate-600">
        <button
          onClick={() => navigateTo('/explore')}
          className={`flex items-center gap-1 py-1 ${currentRoute === '/explore' ? 'text-slate-900 font-semibold' : ''}`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Explore</span>
        </button>
        <button
          onClick={() => navigateTo('/requests')}
          className={`flex items-center gap-1 py-1 relative ${currentRoute === '/requests' ? 'text-slate-900 font-semibold' : ''}`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Requests</span>
          {pendingIncomingCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>
        <button
          onClick={() => navigateTo('/sessions')}
          className={`flex items-center gap-1 py-1 ${currentRoute === '/sessions' ? 'text-slate-900 font-semibold' : ''}`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Sessions</span>
        </button>
        {currentUser?.published && (
          <button
            onClick={() => navigateTo('/dashboard')}
            className={`flex items-center gap-1 py-1 ${currentRoute === '/dashboard' ? 'text-slate-900 font-semibold' : ''}`}
          >
            <span>Dashboard</span>
          </button>
        )}
      </div>
    </header>
  );
};
