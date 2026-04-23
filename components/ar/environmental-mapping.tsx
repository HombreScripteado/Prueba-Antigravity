export function EnvironmentalMapping() {
  return (
    <div className="relative w-full h-64 flex items-center justify-center overflow-hidden" style={{ perspective: "800px" }}>
      
      {/* Contenedor 3D */}
      <div className="relative w-full h-full max-w-sm flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
        
        {/* Retícula de puntos base (superficie de la mesa en el plano Z=0) */}
        <div 
          className="absolute w-72 h-40 opacity-40 origin-center"
          style={{
            transform: "rotateX(65deg) rotateZ(-25deg)",
            backgroundImage: "radial-gradient(var(--menu-gold) 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />
        
        {/* El Plato (Ensaladera) - En el plano Z=0 sobre la mesa */}
        <div 
          className="absolute top-1/2 left-1/2 z-20 animate-materialize-3d will-change-transform drop-shadow-2xl"
          style={{ transform: "translate(-50%, -50%) translateZ(0px)" }}
        >
          <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
            {/* Sombras y base luminosa */}
            <ellipse cx="40" cy="45" rx="25" ry="5" fill="var(--menu-gold)" opacity="0.2" className="animate-pulse" />
            
            {/* Contorno del bowl */}
            <path d="M 10 20 C 10 40, 20 45, 40 45 C 60 45, 70 40, 70 20" stroke="var(--menu-gold)" strokeWidth="1.5" fill="var(--menu-bg)" fillOpacity="0.8" />
            <ellipse cx="40" cy="20" rx="30" ry="8" stroke="var(--menu-gold)" strokeWidth="1.5" fill="var(--menu-bg)" fillOpacity="0.9" />
            <ellipse cx="40" cy="20" rx="25" ry="6" stroke="var(--menu-gold)" strokeWidth="0.5" opacity="0.5" />
            
            {/* Hojas/Ensalada abstracta dentro del bowl */}
            <path d="M 25 18 Q 30 10 35 16 T 45 12 T 55 18" stroke="var(--menu-cream)" strokeWidth="1" fill="none" opacity="0.8" />
            <path d="M 28 22 Q 35 15 40 20 T 52 22" stroke="var(--menu-cream)" strokeWidth="0.5" fill="none" opacity="0.6" />
            
            {/* Rayos láser verticales de materialización */}
            <g className="animate-laser-lines" stroke="var(--menu-gold)" strokeWidth="1" opacity="0.8">
              <line x1="20" y1="45" x2="20" y2="10" strokeDasharray="5 15" />
              <line x1="30" y1="45" x2="30" y2="5" strokeDasharray="8 20" />
              <line x1="40" y1="45" x2="40" y2="0" strokeDasharray="10 15" />
              <line x1="50" y1="45" x2="50" y2="5" strokeDasharray="6 12" />
              <line x1="60" y1="45" x2="60" y2="10" strokeDasharray="4 18" />
            </g>
          </svg>
        </div>

        {/* Smartphone y Cono de Luz en trayectoria 3D */}
        <div className="absolute top-1/2 left-1/2 z-30 animate-phone-flight will-change-transform" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Cono de Luz 3D */}
          <div className="absolute top-[41px] left-[25px] origin-top animate-beam-sequence-3d pointer-events-none mix-blend-screen" style={{ transformStyle: "preserve-3d", transform: "translateZ(-1px)" }}>
            <div 
              className="w-[120px] h-[350px]" 
              style={{ 
                transform: "translateX(-50%)", 
                background: "linear-gradient(to bottom, rgba(197, 160, 89, 0.6) 0%, rgba(197, 160, 89, 0) 100%)",
                clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)"
              }}
            />
          </div>

          {/* Smartphone SVG Isometrico */}
          <svg 
            width="50" 
            height="85" 
            viewBox="0 0 50 85" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-[-42px] left-[-25px] drop-shadow-2xl"
          >
            {/* Sombra 3D del borde */}
            <rect x="4" y="4" width="42" height="78" rx="8" fill="var(--menu-gold)" opacity="0.3" />
            
            {/* Cuerpo principal */}
            <rect x="2" y="2" width="42" height="78" rx="8" stroke="var(--menu-cream)" strokeWidth="1.5" fill="#111" />
            
            {/* Pantalla */}
            <rect x="5" y="6" width="36" height="70" rx="4" stroke="var(--menu-gold)" strokeWidth="0.5" fill="#000" />
            
            {/* Módulo de cámara */}
            <circle cx="23" cy="41" r="12" stroke="var(--menu-gold)" strokeWidth="0.5" strokeDasharray="2 2" fill="none" className="animate-[spin_4s_linear_infinite]" />
            <circle cx="23" cy="41" r="4" fill="var(--menu-cream)" className="animate-pulse" />
          </svg>
        </div>

      </div>

      <style jsx>{`
        /* Timeline General: 8 segundos infinitos */

        @keyframes phoneFlight {
          /* Entrada por la izquierda (lejos) */
          0% { 
            transform: translate3d(-180px, -120px, -400px) rotateX(10deg) rotateY(45deg) rotateZ(-20deg); 
            opacity: 0; 
          }
          10% { opacity: 1; }
          
          /* Acercamiento y llegada al centro para escanear (25%) */
          25% { 
            transform: translate3d(-20px, -60px, 300px) rotateX(45deg) rotateY(15deg) rotateZ(-10deg); 
          }
          
          /* Mantener posición de escaneo hasta 40% (15% del ciclo = 1.2s) */
          40% { 
            transform: translate3d(-20px, -60px, 300px) rotateX(45deg) rotateY(15deg) rotateZ(-10deg); 
          }
          
          /* Giro dramático hacia atrás (rotateY simétrico) */
          50% { 
            transform: translate3d(20px, -60px, 250px) rotateX(20deg) rotateY(-160deg) rotateZ(10deg); 
          }
          
          /* Salida por la derecha alejándose (achicándose por la perspectiva Z) */
          90% { opacity: 1; }
          100% { 
            transform: translate3d(180px, -120px, -400px) rotateX(10deg) rotateY(-225deg) rotateZ(20deg); 
            opacity: 0; 
          }
        }

        @keyframes beamSequence3D {
          /* Enciende exactamente cuando el celular se estabiliza */
          0%, 24% { opacity: 0; }
          25% { opacity: 1; }
          40% { opacity: 1; }
          41%, 100% { opacity: 0; }
        }

        @keyframes materialize3D {
          /* Bowl materializa en la ventana de escaneo (25% - 40%) */
          0%, 24% { opacity: 0; transform: translate(-50%, -50%) translateZ(0px) scale(0.8); filter: drop-shadow(0 0 0px var(--menu-gold)); }
          27% { opacity: 0.9; transform: translate(-50%, -50%) translateZ(0px) scale(1.05); filter: drop-shadow(0 0 20px var(--menu-gold)); }
          30% { opacity: 1; transform: translate(-50%, -50%) translateZ(0px) scale(1); filter: drop-shadow(0 0 8px var(--menu-gold)); }
          38% { opacity: 1; transform: translate(-50%, -50%) translateZ(0px) scale(1); filter: drop-shadow(0 0 8px var(--menu-gold)); }
          42%, 100% { opacity: 0; transform: translate(-50%, -50%) translateZ(0px) scale(0.9); filter: drop-shadow(0 0 0px var(--menu-gold)); }
        }

        @keyframes laserLines {
          0% { stroke-dashoffset: 50; opacity: 0; }
          30% { stroke-dashoffset: 50; opacity: 1; }
          60% { stroke-dashoffset: -50; opacity: 0; }
          100% { stroke-dashoffset: -50; opacity: 0; }
        }

        .animate-phone-flight {
          animation: phoneFlight 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .animate-beam-sequence-3d {
          animation: beamSequence3D 8s ease-in-out infinite;
        }

        .animate-materialize-3d {
          animation: materialize3D 8s ease-out infinite;
        }

        .animate-laser-lines {
          animation: laserLines 4s linear infinite;
        }
      `}</style>
    </div>
  )
}
