import React from 'react';

interface AvatarVisualProps {
  id: string;
  name: string;
  initials: string;
  gradientClass: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
}

export const AvatarVisual: React.FC<AvatarVisualProps> = ({
  id,
  name,
  initials,
  gradientClass,
  size = 'md',
  showStatus = false
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-2xl'
  };

  const svgSizeMap = {
    sm: 32,
    md: 44,
    lg: 56,
    xl: 80
  };

  const px = svgSizeMap[size];

  // Specific bespoke persona illustration styles
  const getPersonaDetails = (userId: string) => {
    switch (userId) {
      case 'user_ayesha':
        return {
          bg: '#FDF2F8',
          accent: '#DB2777',
          secondary: '#BE185D',
          pattern: 'ux-flow'
        };
      case 'user_marcus':
        return {
          bg: '#EFF6FF',
          accent: '#2563EB',
          secondary: '#1D4ED8',
          pattern: 'code-grid'
        };
      case 'user_elena':
        return {
          bg: '#ECFDF5',
          accent: '#059669',
          secondary: '#047857',
          pattern: 'palette'
        };
      case 'user_david':
        return {
          bg: '#FAF5FF',
          accent: '#7C3AED',
          secondary: '#6D28D9',
          pattern: 'terminal'
        };
      case 'user_sophia':
        return {
          bg: '#FFF1F2',
          accent: '#E11D48',
          secondary: '#BE123C',
          pattern: 'brush'
        };
      default:
        return {
          bg: '#F8FAFC',
          accent: '#475569',
          secondary: '#334155',
          pattern: 'default'
        };
    }
  };

  const details = getPersonaDetails(id);

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={`${sizeMap[size]} rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 flex items-center justify-center relative bg-gradient-to-br ${gradientClass}`}
      >
        {/* Subtle SVG Geometric Depth Overlay */}
        <svg
          viewBox={`0 0 ${px} ${px}`}
          className="absolute inset-0 w-full h-full opacity-40 mix-blend-overlay pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx={px * 0.25} cy={px * 0.25} r={px * 0.4} fill="#ffffff" />
          <circle cx={px * 0.8} cy={px * 0.85} r={px * 0.5} fill="#000000" />
        </svg>

        {/* Crisp Monogram Typography */}
        <span className="relative z-10 font-bold tracking-tight text-white drop-shadow-xs select-none">
          {initials}
        </span>
      </div>

      {/* Online / Active status indicator if enabled */}
      {showStatus && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs"
          title="Online / Available for swap"
        />
      )}
    </div>
  );
};
