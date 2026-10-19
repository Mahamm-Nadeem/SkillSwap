import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Video, 
  Mic, 
  Share2, 
  Monitor, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Code2,
  Figma,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { AvatarVisual } from './AvatarVisual';

export const ExchangeInteractiveMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'agenda'>('workspace');
  const [elapsedSeconds, setElapsedSeconds] = useState(1425); // 23 mins 45s

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      {/* Top Session Window Bar */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-slate-400 pl-2 border-l border-slate-800">
            skillswap-room · sess_live_ayesha_marcus
          </span>
        </div>

        {/* Live Status */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE · {formatTime(elapsedSeconds)} / 45:00
          </span>
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <span>45 min bilateral slot</span>
          </div>
        </div>
      </div>

      {/* Main Split Screen Area */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Left Side: Live Shared Workspace Preview (7 cols) */}
        <div className="md:col-span-7 bg-slate-950 rounded-2xl p-4 border border-slate-800/90 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/70">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-200">
                Ayesha's Shared Canvas
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Figma Wireframes
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('workspace')}
                className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                  activeTab === 'workspace'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Canvas
              </button>
              <button
                onClick={() => setActiveTab('agenda')}
                className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                  activeTab === 'agenda'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Barter Split
              </button>
            </div>
          </div>

          {activeTab === 'workspace' ? (
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Figma className="w-3.5 h-3.5" /> Component Review
                </span>
                <span>Frame 04: Mobile Navigation</span>
              </div>

              {/* Wireframe UI Simulation */}
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2.5">
                <div className="h-4 bg-slate-800 rounded w-2/3 animate-pulse" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 bg-slate-800/60 rounded p-1.5 flex flex-col justify-between">
                    <span className="text-[9px] text-slate-500">CTA Button</span>
                    <span className="text-[10px] text-emerald-400 font-bold">48px Touch</span>
                  </div>
                  <div className="h-12 bg-slate-800/60 rounded p-1.5 flex flex-col justify-between">
                    <span className="text-[9px] text-slate-500">Padding</span>
                    <span className="text-[10px] text-blue-400 font-bold">16px Baseline</span>
                  </div>
                  <div className="h-12 bg-slate-800/60 rounded p-1.5 flex flex-col justify-between">
                    <span className="text-[9px] text-slate-500">Contrast</span>
                    <span className="text-[10px] text-amber-400 font-bold">4.7:1 AA</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                Marcus: "The touch target geometry is great. In return, let's practice pronunciation for your design portfolio pitch next."
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <p className="font-semibold text-slate-200">First 22 Mins · Marcus Teaches</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Responsive layout debugging, media queries, and flexbox alignment.
                </p>
                <span className="text-[10px] text-emerald-400 font-mono mt-1 block">✓ Completed</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <p className="font-semibold text-slate-200">Second 23 Mins · Ayesha Teaches</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Spoken English fluency, technical interview questions, and conversational idiom practice.
                </p>
                <span className="text-[10px] text-amber-400 font-mono mt-1 block">▶ In Progress (Active)</span>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px]">Google Meet integration active</span>
            <span className="text-[11px] text-emerald-400 font-mono">Mutual Reciprocity: 100%</span>
          </div>
        </div>

        {/* Right Side: Two Peer Webcams & Mutual Status (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Peer 1: Ayesha */}
          <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AvatarVisual
                id="user_ayesha"
                name="Ayesha Khan"
                initials="AK"
                gradientClass="from-amber-600 to-rose-600"
                size="md"
                showStatus={true}
              />
              <div>
                <p className="text-xs font-bold text-white">Ayesha Khan</p>
                <p className="text-[10px] text-slate-400">New York (EDT) · Learner & Coach</p>
                <span className="text-[10px] text-amber-400 font-mono">Teaching: Conversational English</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <Video className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Peer 2: Marcus */}
          <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AvatarVisual
                id="user_marcus"
                name="Marcus Lee"
                initials="ML"
                gradientClass="from-blue-600 to-indigo-600"
                size="md"
                showStatus={true}
              />
              <div>
                <p className="text-xs font-bold text-white">Marcus Lee</p>
                <p className="text-[10px] text-slate-400">San Francisco (PDT) · Developer</p>
                <span className="text-[10px] text-blue-400 font-mono">Teaching: HTML & CSS</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <Video className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Mutual Rating Preview Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Post-Session Evaluation</span>
              <span className="text-[10px] font-mono text-emerald-400">Unlocks at 45:00</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '53%' }} />
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Mutual peer feedback updates both users' reputation and marks the barter completed.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
