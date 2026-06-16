import React, { useEffect, useState } from 'react';

export default function Splash({ onFinish }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 50;
      const y = (e.clientY - window.innerHeight / 2) / 50;
      setCoords({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Auto finish after 2.5 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div className="bg-background text-on-surface flex items-center justify-center min-h-screen w-screen overflow-hidden relative select-none">
      {/* Drifting Background Atmospheric Orbs */}
      <div 
        className="absolute w-[400px] h-[400px] bg-primary-fixed top-[-10%] left-[-10%] rounded-full filter blur-[120px] opacity-40 transition-transform duration-300 pointer-events-none"
        style={{
          transform: `translate(${coords.x * 0.5}px, ${coords.y * 0.5}px)`
        }}
      ></div>
      <div 
        className="absolute w-[350px] h-[350px] bg-inverse-primary bottom-[-5%] right-[5%] rounded-full filter blur-[120px] opacity-40 transition-transform duration-300 pointer-events-none"
        style={{
          transform: `translate(${coords.x * 1.0}px, ${coords.y * 1.0}px)`
        }}
      ></div>
      <div 
        className="absolute w-[300px] h-[300px] bg-surface-container-high right-[20%] top-[30%] rounded-full filter blur-[120px] opacity-30 transition-transform duration-300 pointer-events-none"
        style={{
          transform: `translate(${coords.x * 1.5}px, ${coords.y * 1.5}px)`
        }}
      ></div>

      {/* Main Container */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        {/* Logo Section */}
        <div className="mb-8 relative animate-bounce duration-[3000ms]">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full glass-morphism flex items-center justify-center spark-glow relative bg-white/40 backdrop-blur-xl border border-white/20 shadow-2xl">
            <span className="material-symbols-outlined text-primary text-[48px] md:text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          {/* Spark Indicators */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-tertiary rounded-full animate-ping opacity-75"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-tertiary rounded-full"></div>
        </div>

        {/* Brand Name */}
        <h1 className="font-display-lg text-[42px] md:text-[54px] font-bold mb-4 bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent tracking-tight">
          Spark
        </h1>

        {/* Tagline */}
        <p className="text-lg text-secondary max-w-xs md:max-w-md font-medium tracking-wide">
          Find your spark
        </p>

        {/* Exclusive Connections Accent */}
        <div className="mt-16 flex items-center space-x-4 opacity-40">
          <div className="h-[1px] w-12 bg-outline"></div>
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-outline">Exclusive Connections</span>
          <div className="h-[1px] w-12 bg-outline"></div>
        </div>
      </main>

      {/* Footer System Name */}
      <footer className="absolute bottom-8 w-full text-center">
        <p className="font-label-sm text-[11px] text-on-surface-variant/50 tracking-wider">
          Luminous Azure Design System • 2026
        </p>
      </footer>
    </div>
  );
}
