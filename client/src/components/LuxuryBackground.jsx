import React from 'react';

export default function LuxuryBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      
      {/* Dynamic Drifting Aurora Light Orbs */}
      {/* Orb 1: Emerald Radiance (Top Left) */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-brand-500/20 via-emerald-400/15 to-transparent blur-[120px] animate-drift-1"></div>

      {/* Orb 2: Champagne Gold Beacon (Top Right) */}
      <div className="absolute top-10 -right-40 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-amber-400/15 via-gold-500/10 to-transparent blur-[140px] animate-drift-2"></div>

      {/* Orb 3: Cosmic Teal Depth (Mid Center/Bottom) */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-teal-500/10 via-brand-400/10 to-transparent blur-[150px] animate-drift-3"></div>

      {/* Orb 4: Opulent Indigo Twilight (Bottom Right) */}
      <div className="absolute -bottom-48 right-10 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-indigo-500/12 via-teal-600/10 to-transparent blur-[130px] animate-drift-1"></div>

      {/* Architectural Precision Grid Pattern with Vignette */}
      <div className="absolute inset-0 luxury-grid-pattern opacity-80"></div>

      {/* Subtle Luxury Bokeh Twinkles */}
      <div className="absolute top-24 left-[15%] w-1.5 h-1.5 rounded-full bg-emerald-400/60 shadow-[0_0_12px_#34d399] animate-pulse"></div>
      <div className="absolute top-44 right-[22%] w-2 h-2 rounded-full bg-amber-300/60 shadow-[0_0_14px_#fcd34d] animate-ping" style={{ animationDuration: '4s' }}></div>
      <div className="absolute top-[65%] left-[8%] w-1.5 h-1.5 rounded-full bg-teal-400/50 shadow-[0_0_10px_#2dd4bf] animate-pulse" style={{ animationDuration: '5s' }}></div>
      <div className="absolute top-[80%] right-[12%] w-2 h-2 rounded-full bg-emerald-400/50 shadow-[0_0_12px_#34d399] animate-pulse" style={{ animationDuration: '6s' }}></div>

      {/* Ambient Top Light Flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-b from-white/80 via-white/20 to-transparent blur-md"></div>
    </div>
  );
}
