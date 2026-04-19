export function EnvironmentalMapping() {
  return (
    <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
      {/* Retícula de puntos base (superficie) */}
      <div 
        className="absolute w-64 h-32 opacity-30 origin-center"
        style={{
          transform: "rotateX(60deg) rotateZ(-15deg)",
          backgroundImage: "radial-gradient(var(--menu-gold) 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }}
      />
      
      {/* Smartphone SVG Animado */}
      <div className="absolute z-10 animate-scanPhone will-change-transform">
        <svg 
          width="48" 
          height="80" 
          viewBox="0 0 48 80" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          {/* Contorno del teléfono */}
          <rect x="2" y="2" width="44" height="76" rx="6" stroke="var(--menu-cream)" strokeWidth="2" fill="var(--menu-bg)" fillOpacity="0.8" />
          {/* Pantalla del teléfono */}
          <rect x="6" y="8" width="36" height="64" rx="2" stroke="var(--menu-gold)" strokeWidth="1" strokeDasharray="2 2" fill="none" />
          {/* Lente trasero del AR */}
          <circle cx="24" cy="40" r="8" stroke="var(--menu-gold)" strokeWidth="1.5" />
          <circle cx="24" cy="40" r="3" fill="var(--menu-gold)" />
          {/* Rayo de escaneo cruzando la pantalla */}
          <line x1="6" y1="40" x2="42" y2="40" stroke="var(--menu-gold)" strokeWidth="1" className="animate-pulse" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes scanPhone {
          0% { transform: translateX(-40px) translateY(-10px) rotateY(-10deg) rotateZ(5deg); }
          50% { transform: translateX(40px) translateY(10px) rotateY(10deg) rotateZ(-5deg); }
          100% { transform: translateX(-40px) translateY(-10px) rotateY(-10deg) rotateZ(5deg); }
        }
        .animate-scanPhone {
          animation: scanPhone 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
