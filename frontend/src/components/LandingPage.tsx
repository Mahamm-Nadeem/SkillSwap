import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeftRight, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Star, 
  Compass, 
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Palette,
  Code2,
  Globe2,
  FileText,
  Briefcase,
  Layers,
  Check
} from 'lucide-react';
import { ExchangeInteractiveMockup } from './ExchangeInteractiveMockup';
import { AvatarVisual } from './AvatarVisual';

export const LandingPage: React.FC = () => {
  const { navigateTo, startNewUserOnboarding, users } = useApp();

  const skillCategories = [
    {
      name: 'Design & UI/UX',
      desc: 'Figma components, design systems, wireframing, UX research',
      icon: Palette,
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      name: 'Frontend & Fullstack',
      desc: 'HTML/CSS layouts, JavaScript debugging, React performance',
      icon: Code2,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      name: 'Conversational Languages',
      desc: 'Spoken English fluency, conversational Spanish, French pronunciation',
      icon: Globe2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      name: 'Writing & Content',
      desc: 'Academic essays, UX copywriting, technical articles, portfolio review',
      icon: FileText,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      name: 'Freelance & Business',
      desc: 'Client proposals, project intake scoping, freelance contracts',
      icon: Briefcase,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      name: 'Illustration & Animation',
      desc: 'Vector art, Procreate workflows, 2D storyboarding, asset packs',
      icon: Layers,
      color: 'text-pink-600 bg-pink-50 border-pink-200'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-16 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Direct 1-to-1 Skill Barter · Zero Payments & No Fees</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] max-w-4xl mx-auto">
            Trade What You Know for What You Need to Master.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tutoring is expensive and self-study lacks accountability. SkillSwap connects independent freelancers, developers, designers, and students for direct, reciprocal knowledge exchanges.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('/explore')}
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Explore Peer Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => startNewUserOnboarding()}
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-xs"
            >
              Publish Your Exchange Profile
            </button>
          </div>

          {/* Eye-Catching Interactive Live Session Mockup */}
          <div className="pt-10">
            <div className="text-left mb-3 max-w-4xl mx-auto flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-slate-400 font-mono text-[11px]">
                Interactive Workflow Simulation
              </span>
              <span className="font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Live Prototype
              </span>
            </div>
            <ExchangeInteractiveMockup />
          </div>

          {/* Social Proof / Quantitative Verification Strip */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-left border-t border-slate-200 max-w-4xl mx-auto mt-12">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Platform Exchange Fee
              </span>
              <p className="text-2xl font-bold text-slate-900 font-mono mt-0.5">$0.00</p>
              <p className="text-xs text-slate-500">100% reciprocal barter</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Match Conversion Rate
              </span>
              <p className="text-2xl font-bold text-slate-900 font-mono mt-0.5 tabular-nums">28.4%</p>
              <p className="text-xs text-slate-500">Proposal to confirmed match</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Average Rating
              </span>
              <p className="text-2xl font-bold text-slate-900 font-mono mt-0.5 tabular-nums">4.8 / 5</p>
              <p className="text-xs text-slate-500">Across verified sessions</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Scheduling Window
              </span>
              <p className="text-2xl font-bold text-slate-900 font-mono mt-0.5">&lt; 48 hours</p>
              <p className="text-xs text-slate-500">Average time to schedule</p>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Exchange Categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Exchange Domains
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              What Freelancers & Creators Are Bartering
            </h2>
          </div>
          <button
            onClick={() => navigateTo('/explore')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-700"
          >
            <span>View All Profiles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => navigateTo('/explore')}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3.5 ${cat.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-950">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>Browse matches</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Principles & 4-Stage Pathway */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Engineered for Mutual Accountability
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            No endless chat threads, no ghosting, no unbalanced trades. Our strict 4-stage workflow makes every exchange explicit and structured.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 relative">
            <span className="text-xs font-mono font-bold text-slate-400">STAGE 01</span>
            <h3 className="text-base font-bold text-slate-900">
              Publish Skills
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every profile lists 1–5 skills offered and 1–5 skills requested with proficiency tags. No passive lurkers.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 relative">
            <span className="text-xs font-mono font-bold text-slate-400">STAGE 02</span>
            <h3 className="text-base font-bold text-slate-900">
              Bilateral Proposal
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select what you teach in direct exchange for what you learn. Add a 20–500 character note detailing your agenda.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 relative">
            <span className="text-xs font-mono font-bold text-slate-400">STAGE 03</span>
            <h3 className="text-base font-bold text-slate-900">
              Calendar & ICS Sync
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Agree on 30, 45, or 60 minutes with Google Meet / Zoom URL. Local timezone previews and instant .ics calendar export.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 relative">
            <span className="text-xs font-mono font-bold text-slate-400">STAGE 04</span>
            <h3 className="text-base font-bold text-slate-900">
              Mutual Feedback
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rate punctuality, knowledge sharing, and overall experience. No-show reports prevent unearned completion credit.
            </p>
          </div>
        </div>
      </section>

      {/* Bilateral Peer Testimonials Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Verified Peer Testimonials
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real feedback from completed reciprocal sessions on SkillSwap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AvatarVisual
                  id="user_ayesha"
                  name="Ayesha Khan"
                  initials="AK"
                  gradientClass="from-amber-600 to-rose-600"
                  size="md"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Ayesha Khan</h4>
                  <p className="text-xs text-slate-500">Aspiring UX Designer · New York</p>
                </div>
              </div>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Professional UI/UX tutoring was quoted at $70/hr which I couldn't afford. Through SkillSwap, I gave Marcus two sessions of conversational English practice and in return he audited my Figma design portfolio. Pure value with zero awkward money talks."
            </p>
            <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
              Exchanged: Conversational English ⇄ HTML & CSS Architecture
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AvatarVisual
                  id="user_david"
                  name="David Chen"
                  initials="DC"
                  gradientClass="from-purple-600 to-violet-800"
                  size="md"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">David Chen</h4>
                  <p className="text-xs text-slate-500">Senior Frontend Engineer · Chicago</p>
                </div>
              </div>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "I love mentoring engineers on TypeScript systems, but I was struggling to write compelling client proposals for my freelance consulting. Ayesha helped structure my proposal deck, and I taught her React state patterns. Everyone wins."
            </p>
            <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
              Exchanged: TypeScript Systems ⇄ Academic & Proposal Writing
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
