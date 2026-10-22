import React from 'react';
import { 
  Figma, 
  Code2, 
  Globe2, 
  FileText, 
  Palette, 
  Briefcase, 
  Cpu, 
  Terminal, 
  Layers,
  Sparkles
} from 'lucide-react';

interface SkillThumbnailProps {
  skillName: string;
  category?: string;
  size?: 'sm' | 'md' | 'lg' | 'banner';
  className?: string;
}

export const SkillThumbnail: React.FC<SkillThumbnailProps> = ({
  skillName,
  category,
  size = 'md',
  className = ''
}) => {
  // Normalize skill name to match specific visual themes
  const name = skillName.toLowerCase();

  const getTheme = () => {
    if (name.includes('figma') || name.includes('ux') || name.includes('ui') || name.includes('design')) {
      return {
        type: 'figma',
        bg: 'from-purple-900 via-indigo-900 to-slate-900',
        accent: '#A855F7',
        badge: 'UI/UX Craft',
        tag: 'Figma',
        icon: Figma
      };
    }
    if (name.includes('html') || name.includes('css') || name.includes('responsive')) {
      return {
        type: 'html',
        bg: 'from-blue-900 via-sky-900 to-slate-900',
        accent: '#38BDF8',
        badge: 'Web Layout',
        tag: 'CSS Grid',
        icon: Code2
      };
    }
    if (name.includes('javascript') || name.includes('react') || name.includes('typescript') || name.includes('code')) {
      return {
        type: 'code',
        bg: 'from-amber-950 via-slate-900 to-zinc-900',
        accent: '#F59E0B',
        badge: 'Engineering',
        tag: 'TS / React',
        icon: Terminal
      };
    }
    if (name.includes('english') || name.includes('spanish') || name.includes('language') || name.includes('french')) {
      return {
        type: 'language',
        bg: 'from-emerald-950 via-teal-900 to-slate-900',
        accent: '#34D399',
        badge: 'Language',
        tag: 'Spoken Barter',
        icon: Globe2
      };
    }
    if (name.includes('writing') || name.includes('copy') || name.includes('academic') || name.includes('essay')) {
      return {
        type: 'writing',
        bg: 'from-rose-950 via-pink-900 to-slate-900',
        accent: '#FB7185',
        badge: 'Editorial',
        tag: 'Copywriting',
        icon: FileText
      };
    }
    if (name.includes('procreate') || name.includes('illustration') || name.includes('vector') || name.includes('animat')) {
      return {
        type: 'illustration',
        bg: 'from-fuchsia-950 via-purple-900 to-slate-900',
        accent: '#E879F9',
        badge: 'Illustration',
        tag: 'Digital Art',
        icon: Palette
      };
    }
    // Default business / scoping
    return {
      type: 'business',
      bg: 'from-slate-900 via-neutral-900 to-slate-950',
      accent: '#94A3B8',
      badge: 'Strategy',
      tag: 'Scoping',
      icon: Briefcase
    };
  };

  const theme = getTheme();
  const Icon = theme.icon;

  const sizeClasses = {
    sm: 'h-16 w-full rounded-xl',
    md: 'h-28 w-full rounded-xl',
    lg: 'h-36 w-full rounded-2xl',
    banner: 'h-44 w-full rounded-2xl'
  };

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${theme.bg} text-white shadow-xs border border-white/10 group ${sizeClasses[size]} ${className}`}
    >
      {/* Background Stylized Abstract Vector Wireframe / Geometry */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 150"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`grad-${theme.type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Dynamic Pattern based on skill domain */}
        {theme.type === 'figma' && (
          <g stroke={theme.accent} strokeWidth="1" fill="none">
            <rect x="20" y="20" width="80" height="50" rx="6" />
            <rect x="120" y="20" width="160" height="110" rx="8" />
            <line x1="140" y1="40" x2="260" y2="40" strokeDasharray="3 3" />
            <circle cx="150" cy="70" r="12" fill={theme.accent} fillOpacity="0.2" />
            <circle cx="190" cy="70" r="12" />
            <path d="M 40 100 Q 80 80 120 120" stroke={theme.accent} strokeWidth="1.5" />
          </g>
        )}

        {theme.type === 'html' && (
          <g stroke={theme.accent} strokeWidth="1" fill="none">
            <rect x="25" y="15" width="250" height="120" rx="8" />
            <line x1="25" y1="35" x2="275" y2="35" />
            <circle cx="40" cy="25" r="3" fill={theme.accent} />
            <circle cx="52" cy="25" r="3" fill="#ffffff" fillOpacity="0.4" />
            <circle cx="64" cy="25" r="3" fill="#ffffff" fillOpacity="0.4" />
            <rect x="40" y="50" width="100" height="30" rx="4" strokeDasharray="2 2" />
            <rect x="155" y="50" width="105" height="70" rx="4" />
          </g>
        )}

        {theme.type === 'code' && (
          <g fill={theme.accent} opacity="0.3" fontFamily="monospace" fontSize="12">
            <text x="30" y="40">&lt;Component /&gt;</text>
            <text x="30" y="70">const [state, set] = use()</text>
            <text x="30" y="100">return &lt;Trade active /&gt;</text>
            <path d="M 220 30 L 260 70 L 220 110" stroke={theme.accent} strokeWidth="2" fill="none" />
          </g>
        )}

        {theme.type === 'language' && (
          <g stroke={theme.accent} strokeWidth="1" fill="none">
            <circle cx="150" cy="75" r="55" />
            <ellipse cx="150" cy="75" rx="55" ry="24" />
            <line x1="95" y1="75" x2="205" y2="75" />
            <path d="M 120 30 C 130 50 170 50 180 30" />
            <path d="M 115 120 C 130 100 170 100 185 120" />
          </g>
        )}

        {theme.type === 'writing' && (
          <g stroke={theme.accent} strokeWidth="1" fill="none">
            <rect x="70" y="15" width="160" height="120" rx="6" />
            <line x1="90" y1="35" x2="210" y2="35" strokeWidth="2" />
            <line x1="90" y1="55" x2="210" y2="55" />
            <line x1="90" y1="75" x2="190" y2="75" />
            <line x1="90" y1="95" x2="170" y2="95" />
            <circle cx="210" cy="115" r="10" fill={theme.accent} fillOpacity="0.3" />
          </g>
        )}

        {(theme.type === 'illustration' || theme.type === 'business') && (
          <g stroke={theme.accent} strokeWidth="1" fill="none">
            <polygon points="150,20 220,130 80,130" opacity="0.4" />
            <circle cx="150" cy="80" r="30" strokeDasharray="4 4" />
            <line x1="40" y1="140" x2="260" y2="140" />
          </g>
        )}
      </svg>

      {/* Modern Gradient Light Mesh Glow */}
      <div
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-40 pointer-events-none"
        style={{ backgroundColor: theme.accent }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 h-full p-3.5 sm:p-4 flex flex-col justify-between">
        {/* Top Header inside Thumbnail */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-[10px] font-semibold text-white/90 border border-white/10 uppercase tracking-wider">
            <Icon className="w-3 h-3" style={{ color: theme.accent }} />
            {theme.badge}
          </span>
          <span className="text-[10px] font-mono text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            {theme.tag}
          </span>
        </div>

        {/* Title & Domain text */}
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug drop-shadow-xs line-clamp-1">
            {skillName}
          </h4>
          <p className="text-[10px] text-white/70 line-clamp-1 mt-0.5">
            1-to-1 practical peer exchange
          </p>
        </div>
      </div>
    </div>
  );
};
