export function EnvironmentalMapping() {
  return (
    <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
      {/* Retícula de puntos base (superficie de la mesa) */}
      <div 
        className="absolute w-72 h-40 opacity-40 origin-center"
        style={{
          transform: "rotateX(65deg) rotateZ(-25deg)",
          backgroundImage: "radial-gradient(var(--menu-gold) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
          top: "50%",
        }}
      />
      
      {/* Contenedor principal de la animación */}
      <div className="relative w-full h-full max-w-sm flex items-center justify-center">
        
        {/* El Plato (Ensaladera) - Se materializa */}
        <div className="absolute z-20 animate-materialize will-change-transform drop-shadow-2xl mt-16">
          <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sombras y base luminosa */}
            <ellipse cx="40" cy="45" rx="25" ry="5" fill="var(--menu-gold)" opacity="0.2" className="animate-pulse" />
            
            {/* Contorno del bowl */}
            <path d="M 10 20 C 10 40, 20 45, 40 45 C 60 45, 70 40, 70 20" stroke="var(--menu-gold)" strokeWidth="1.5" fill="var(--menu-bg)" fillOpacity="0.8" />
            <ellipse cx="40" cy="20" rx="30" ry="8" stroke="var(--menu-gold)" strokeWidth="1.5" fill="var(--menu-bg)" fillOpacity="0.9" />
            <ellipse cx="40" cy="20" rx="25" ry="6" stroke="var(--menu-gold)" strokeWidth="0.5" opacity="0.5" />
            
            {/* Hojas/Ensalada abstracta dentro del bowl */}
            <path d="M 25 18 Q 30 10 35 16 T 45 12 T 55 18" stroke="var(--menu-cream)" strokeWidth="1" fill="none" opacity="0.8" />
            <path d="M 28 22 Q 35 15 40 20 T 52 22" stroke="var(--menu-cream)" strokeWidth="0.5" fill="none" opacity="0.6" />
            
            {/* Rayos láser verticales de materialización (Efecto Sci-Fi) */}
            <g className="animate-laser-lines" stroke="var(--menu-gold)" strokeWidth="1" opacity="0.8">
              <line x1="20" y1="45" x2="20" y2="10" strokeDasharray="5 15" />
              <line x1="30" y1="45" x2="30" y2="5" strokeDasharray="8 20" />
              <line x1="40" y1="45" x2="40" y2="0" strokeDasharray="10 15" />
              <line x1="50" y1="45" x2="50" y2="5" strokeDasharray="6 12" />
              <line x1="60" y1="45" x2="60" y2="10" strokeDasharray="4 18" />
            </g>
          </svg>
        </div>

        {/* Smartphone y Cono de Luz */}
        <div className="absolute z-30 animate-phone-sequence will-change-transform mb-16 ml-12">
          {/* Cono de Luz (Rayo escáner) */}
          <div className="absolute top-[40px] left-[15px] origin-top animate-beam-sequence pointer-events-none mix-blend-screen">
            <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 0 L -60 120 L 60 120 Z" fill="url(#beam-gradient)" />
              <defs>
                <linearGradient id="beam-gradient" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--menu-gold)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--menu-gold)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Smartphone SVG Isometrico */}
          <svg 
            width="50" 
            height="85" 
            viewBox="0 0 50 85" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-2xl relative z-10"
            style={{ transform: "rotateZ(15deg) rotateX(20deg) rotateY(-15deg)" }}
          >
            {/* Sombra 3D del borde */}
            <rect x="4" y="4" width="42" height="78" rx="8" fill="var(--menu-gold)" opacity="0.3" />
            
            {/* Cuerpo principal */}
            <rect x="2" y="2" width="42" height="78" rx="8" stroke="var(--menu-cream)" strokeWidth="1.5" fill="#111" />
            
            {/* Pantalla */}
            <rect x="5" y="6" width="36" height="70" rx="4" stroke="var(--menu-gold)" strokeWidth="0.5" fill="#000" />
            
            {/* Módulo de cámara (simulado en la parte trasera pero visible por transparencia o diseño de UI) */}
            <circle cx="23" cy="41" r="12" stroke="var(--menu-gold)" strokeWidth="0.5" strokeDasharray="2 2" fill="none" className="animate-[spin_4s_linear_infinite]" />
            <circle cx="23" cy="41" r="4" fill="var(--menu-cream)" className="animate-pulse" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        /* 
         Timeline General: 6 segundos infinitos
         0% - 20%: Teléfono entra y escanea
         20% - 30%: Teléfono se detiene, enfoca
         30% - 70%: Plato se materializa
         70% - 85%: Plato brillando totalmente visible
         85% - 100%: Fade out y reset
        */

        @keyframes phoneSequence {
          0% { transform: translate(-80px, -20px) rotateY(-30deg) scale(0.9); }
          20% { transform: translate(0px, 0px) rotateY(0deg) scale(1); }
          85% { transform: translate(0px, 0px) rotateY(0deg) scale(1); opacity: 1; }
          95% { transform: translate(40px, -10px) rotateY(20deg) scale(0.9); opacity: 0; }
          100% { transform: translate(-80px, -20px) rotateY(-30deg) scale(0.9); opacity: 0; }
        }

        @keyframes beamSequence {
          0% { opacity: 0; transform: scaleY(0.5) rotateZ(-20deg); }
          15% { opacity: 0.2; transform: scaleY(0.8) rotateZ(-10deg); }
          20% { opacity: 0.8; transform: scaleY(1) rotateZ(0deg); }
          75% { opacity: 0.8; transform: scaleY(1) rotateZ(0deg); }
          85% { opacity: 0; transform: scaleY(0.5) rotateZ(10deg); }
          100% { opacity: 0; }
        }

        @keyframes materialize {
          0% { clip-path: inset(100% 0 0 0); opacity: 0; filter: drop-shadow(0 0 0px var(--menu-gold)); }
          30% { clip-path: inset(100% 0 0 0); opacity: 0.8; }
          60% { clip-path: inset(0 0 0 0); opacity: 1; filter: drop-shadow(0 0 15px var(--menu-gold)); }
          80% { clip-path: inset(0 0 0 0); opacity: 1; filter: drop-shadow(0 0 5px var(--menu-gold)); }
          90% { opacity: 0; }
          100% { clip-path: inset(100% 0 0 0); opacity: 0; }
        }

        @keyframes laserLines {
          0% { stroke-dashoffset: 50; opacity: 0; }
          30% { stroke-dashoffset: 50; opacity: 1; }
          60% { stroke-dashoffset: -50; opacity: 0; }
          100% { stroke-dashoffset: -50; opacity: 0; }
        }

        .animate-phone-sequence {
          animation: phoneSequence 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .animate-beam-sequence {
          animation: beamSequence 6s ease-in-out infinite;
        }

        .animate-materialize {
          animation: materialize 6s ease-out infinite;
        }

        .animate-laser-lines {
          animation: laserLines 6s linear infinite;
        }
      `}</style>
    </div>
  )
}
