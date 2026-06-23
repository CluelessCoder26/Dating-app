import { useEffect, useState } from 'react';

export default function Splash({ onFinish }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  // Animation phases: 'enter' -> 'orbit' -> 'pop' -> 'exit'
  const [phase, setPhase] = useState('enter'); 

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 50;
      const y = (e.clientY - window.innerHeight / 2) / 50;
      setCoords({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Sequence Timers
    // 1. Start the single orbit shortly after entering
    const orbitTimer = setTimeout(() => setPhase('orbit'), 500);

    // 2. Orbit finishes at 1.2s. Trigger the "Pop"
    const popTimer = setTimeout(() => setPhase('pop'), 1700);

    // 3. Pop takes 0.4s. Trigger the smooth exit
    const exitTimer = setTimeout(() => setPhase('exit'), 2100);

    // 4. Exit finishes in 0.5s. Tell parent to switch screens
    const finishTimer = setTimeout(() => onFinish(), 2600);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(orbitTimer);
      clearTimeout(popTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  const isExiting = phase === 'exit';

  return (
    <>
      <style>{`
        /* 1. Enter Animation */
        @keyframes splashEnter {
          from { opacity: 0; transform: scale(0.9) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        /* 2. Single Fast Orbit */
        @keyframes orbitOneRound {
          0% { transform: rotate(-90deg); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: rotate(270deg); opacity: 0; }
        }

        /* 3. The Snappy Pop */
        @keyframes popBadge {
          0% { transform: scale(1); }
          40% { transform: scale(1.25); box-shadow: 0 0 40px rgba(124,58,237,0.6); }
          100% { transform: scale(1); }
        }
        @keyframes shockwave {
          0% { transform: scale(0.8); opacity: 0.8; border-width: 8px; }
          100% { transform: scale(2.2); opacity: 0; border-width: 0px; }
        }

        /* 4. Exit Animations */
        @keyframes splashExit {
          0%   { opacity: 1; transform: scale(1); filter: blur(0px); }
          100% { opacity: 0; transform: scale(1.35); filter: blur(12px); }
        }
        @keyframes taglineExit {
          0%   { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-15px); }
        }
        @keyframes orbExit {
          0%   { opacity: 0.4; transform: scale(1); filter: blur(120px); }
          100% { opacity: 0;   transform: scale(2.2); filter: blur(60px); }
        }
        
        /* CSS Classes linked to State */
        .content-enter {
          animation: splashEnter 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .orbit-run {
          animation: orbitOneRound 1.2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        .badge-pop {
          animation: popBadge 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .shockwave-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: solid #7c3aed;
          animation: shockwave 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
        .container-exiting {
          animation: splashExit 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .tagline-idle {
          opacity: 1;
          transition: opacity 0.4s ease;
        }
        .tagline-exiting {
          animation: taglineExit 0.4s ease forwards;
        }
        .orb-base {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.4;
          transition: transform 0.3s ease;
          pointer-events: none;
        }
        .orb-exiting {
          animation: orbExit 0.5s ease forwards !important;
        }

        /* Gradient Text Utility */
        .text-gradient {
            background-image: linear-gradient(to right, #2563eb, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
        }
      `}</style>

      <div className="bg-[#f9f9ff] text-[#181c23] flex items-center justify-center min-h-screen w-screen overflow-hidden relative select-none">

        {/* Atmospheric Orbs */}
        <div
          className={`orb-base w-[400px] h-[400px] bg-[#d7e2ff] top-[-10%] left-[-10%] ${isExiting ? 'orb-exiting' : ''}`}
          style={!isExiting ? { transform: `translate(${coords.x * 0.5}px, ${coords.y * 0.5}px)` } : {}}
        />
        <div
          className={`orb-base w-[350px] h-[350px] bg-[#abc7ff] bottom-[-5%] right-[5%] ${isExiting ? 'orb-exiting' : ''}`}
          style={!isExiting ? {
            transform: `translate(${coords.x * 1.0}px, ${coords.y * 1.0}px)`,
            animationDelay: isExiting ? '0.05s' : undefined
          } : { animationDelay: '0.05s' }}
        />
        <div
          className={`orb-base w-[300px] h-[300px] bg-[#e6e8f3] right-[20%] top-[30%] opacity-30 ${isExiting ? 'orb-exiting' : ''}`}
          style={!isExiting ? {
            transform: `translate(${coords.x * 1.5}px, ${coords.y * 1.5}px)`,
            animationDelay: isExiting ? '0.08s' : undefined
          } : { animationDelay: '0.08s' }}
        />

        {/* Main Content */}
        <main className={`relative z-10 flex flex-col items-center justify-center text-center px-6 content-enter ${isExiting ? 'container-exiting' : ''}`}>

          {/* Interactive Logo Group */}
          <div className="mb-10 relative flex items-center justify-center">
            
            {/* The single-round orbit comet */}
            {(phase === 'orbit' || phase === 'pop' || phase === 'exit') && (
              <div className={`absolute -inset-6 md:-inset-8 rounded-full ${phase === 'orbit' ? 'orbit-run' : 'opacity-0'}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed] shadow-[0_0_15px_rgba(124,58,237,0.8)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
            )}

            {/* The Pop Shockwave */}
            {phase === 'pop' && <div className="shockwave-ring" />}

            {/* Central Glass Badge */}
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center relative bg-white/50 backdrop-blur-xl border border-white shadow-2xl z-10 ${phase === 'pop' ? 'badge-pop' : ''}`}>
              <span
                className="material-symbols-outlined text-gradient text-[48px] md:text-[64px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            
          </div>

          {/* Brand Name */}
          <h1 className="text-[48px] md:text-[64px] font-bold mb-2 text-gradient tracking-tight">
            Spark
          </h1>

          {/* Tagline */}
          <p className={`text-lg text-[#4f6074] max-w-xs md:max-w-md font-medium tracking-wide ${isExiting ? 'tagline-exiting' : 'tagline-idle'}`}>
            Find your spark
          </p>

          {/* Divider */}
          <div className={`mt-16 flex items-center space-x-4 opacity-40 ${isExiting ? 'opacity-0 transition-opacity duration-300' : ''}`}>
            <div className="h-[1px] w-12 bg-[#717786]" />
            <span className="text-[10px] uppercase tracking-widest text-[#717786] font-semibold">Exclusive Connections</span>
            <div className="h-[1px] w-12 bg-[#717786]" />
          </div>
        </main>

        {/* Footer */}
        <footer className={`absolute bottom-8 w-full text-center ${isExiting ? 'opacity-0 transition-opacity duration-300' : ''}`}>
          <p className="text-[11px] text-[#414754]/50 font-medium tracking-wider uppercase">
            Premium Encrypted Design
          </p>
        </footer>
      </div>
    </>
  );
}