import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  Send, 
  TrendingUp, 
  ShieldAlert, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { AvatarVisual } from './AvatarVisual';
import { SkillThumbnail } from './SkillThumbnail';

export const LinkedInRightSidebar: React.FC = () => {
  const { users, currentUser, openModal, calculateCompatibility, navigateTo } = useApp();

  if (!currentUser) return null;

  // Find recommended peers (different from currentUser)
  const candidatePeers = users
    .filter((u) => u.published && u.id !== currentUser.id)
    .map((peer) => ({
      peer,
      comp: calculateCompatibility(currentUser, peer)
    }))
    .sort((a, b) => b.comp.matchPercentage - a.comp.matchPercentage)
    .slice(0, 3);

  const trendingTrades = [
    { from: 'Figma UI Design', to: 'React Component Arch', volume: '142 exchanges this week' },
    { from: 'Conversational English', to: 'HTML & CSS Debugging', volume: '98 exchanges this week' },
    { from: 'UX Copywriting', to: 'TypeScript Generics', volume: '76 exchanges this week' }
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      {/* Recommended Exchanges Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Recommended for You</span>
          </span>
          <button
            onClick={() => navigateTo('/explore')}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
          >
            View all
          </button>
        </div>

        <div className="space-y-3">
          {candidatePeers.map(({ peer, comp }) => (
            <div
              key={peer.id}
              className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-xl space-y-2.5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <AvatarVisual
                  id={peer.id}
                  name={peer.displayName}
                  initials={peer.avatarInitials}
                  gradientClass={peer.avatarColor}
                  size="sm"
                  showStatus={true}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {peer.displayName}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate">
                    {peer.headline}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                  {comp.matchPercentage}% Match
                </span>
                <button
                  onClick={() => openModal('swap_proposal', { peer })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
                >
                  <Send className="w-2.5 h-2.5" />
                  <span>Propose</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Barter Pairs Widget with Mini Skill Thumbnails */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Trending Barter Pairs</span>
          </span>
        </div>

        <div className="space-y-2.5">
          {trendingTrades.map((trade, idx) => (
            <div
              key={idx}
              className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1 hover:border-slate-200 transition-colors cursor-pointer"
              onClick={() => navigateTo('/explore')}
            >
              <p className="font-semibold text-slate-900 text-[11px] leading-tight">
                {trade.from} ⇄ {trade.to}
              </p>
              <span className="text-[10px] font-mono text-slate-400 block">
                {trade.volume}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Peer Rules & Safety Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2 text-xs">
        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Barter Safety Standard</span>
        </h4>
        <ul className="text-[11px] text-slate-500 space-y-1.5 pt-1 list-disc list-inside">
          <li>Cancellations require $\ge 2$ hours notice.</li>
          <li>Video calls take place on external Google Meet/Zoom links.</li>
          <li>No contact info is displayed publicly on profile cards.</li>
        </ul>
      </div>
    </aside>
  );
};
