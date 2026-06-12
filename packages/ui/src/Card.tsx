import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'indigo' | 'rose' | 'emerald';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = 'indigo',
  children,
  className = ''
}) => {
  const badgeColors = {
    indigo: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  };

  return (
    <div className={`p-6 rounded-2xl border border-white/5 bg-slate-900/60 backdrop-blur-md relative overflow-hidden shadow-lg flex flex-col justify-between ${className}`}>
      {(title || badge) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="font-heading text-lg font-bold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {badge && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColors[badgeColor]}`}>
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
