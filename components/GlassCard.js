'use client';

export default function GlassCard({ children, className = '', hover = true }) {
  return (
    <div
      className={`
        rounded-2xl
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        ${hover ? 'hover:border-purple-500/30 hover:bg-white/10 transition-all' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
