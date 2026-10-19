import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { ExplorePage } from './components/ExplorePage';
import { RequestsPage } from './components/RequestsPage';
import { SessionsPage } from './components/SessionsPage';
import { DashboardPage } from './components/DashboardPage';
import { OnboardingPage } from './components/OnboardingPage';
import { LinkedInLeftSidebar } from './components/LinkedInLeftSidebar';
import { LinkedInRightSidebar } from './components/LinkedInRightSidebar';
import { SwapProposalModal } from './components/SwapProposalModal';
import { SessionDetailModal } from './components/SessionDetailModal';
import { FeedbackModal } from './components/FeedbackModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { ArrowLeftRight, Heart, ShieldCheck, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRoute, activeModal, modalPayload, currentUser, navigateTo } = useApp();

  const isFullWidthRoute = currentRoute === '/' || currentRoute === '/onboarding';

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Top Bar */}
      <Header />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {isFullWidthRoute ? (
          <>
            {currentRoute === '/' && <LandingPage />}
            {currentRoute === '/onboarding' && <OnboardingPage />}
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* LinkedIn Left Sidebar */}
              <LinkedInLeftSidebar />

              {/* Central Feed / Main Viewport */}
              <div className="flex-1 min-w-0 w-full space-y-6">
                {currentRoute === '/explore' && <ExplorePage />}
                {currentRoute === '/requests' && <RequestsPage />}
                {currentRoute === '/sessions' && <SessionsPage />}
                {currentRoute === '/dashboard' && <DashboardPage />}
              </div>

              {/* LinkedIn Right Sidebar (Desktop) */}
              <div className="hidden xl:block">
                <LinkedInRightSidebar />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Active Modal Portals */}
      {activeModal === 'swap_proposal' && modalPayload?.peer && (
        <SwapProposalModal peer={modalPayload.peer} />
      )}

      {activeModal === 'session_detail' && modalPayload?.session && (
        <SessionDetailModal session={modalPayload.session} />
      )}

      {activeModal === 'feedback' && modalPayload?.session && (
        <FeedbackModal session={modalPayload.session} />
      )}

      {activeModal === 'profile_settings' && <ProfileSettingsModal />}

      {/* Quiet Footer (Conforms to Frontend Design Constitution: clean copyright, no telemetry tickers) */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">SkillSwap</span>
            <span aria-hidden="true">·</span>
            <span>Reciprocal Peer Knowledge Exchange Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigateTo('/')}
              className="hover:text-slate-900 transition-colors"
            >
              Platform Principles
            </button>
            <button
              onClick={() => navigateTo('/explore')}
              className="hover:text-slate-900 transition-colors"
            >
              Peer Directory
            </button>
            <button
              onClick={() => navigateTo('/sessions')}
              className="hover:text-slate-900 transition-colors"
            >
              Exchange Hub
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Zero-payment barter protocol · v1.0
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
