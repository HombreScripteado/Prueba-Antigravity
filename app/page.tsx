import Link from "next/link"
import { CornerDecorations } from "@/components/menu/corner-decorations"
import { ArIcon } from "@/components/menu/ar-icon"
import menuData from "@/data/menu.json"

export default function HomePage() {
  return (
    <div className="menu-bg-gradient min-h-screen flex flex-col items-center justify-center p-8 relative overflow-x-hidden">
      <CornerDecorations />
      
      <div className="max-w-lg w-full text-center relative z-10">
        {/* Header */}
        <header className="mb-16">
          {/* Decorative line */}
          <div className="decorative-line w-16 h-px mx-auto mb-8" />
          
          <h1 className="text-[clamp(2.5rem,8vw,4rem)] font-light tracking-[0.15em] leading-tight mb-4 uppercase">
            Carta
            <span className="block text-menu-gold">Interactiva</span>
          </h1>
          
          <p className="font-mono text-xs font-light tracking-[0.3em] text-menu-gold-light/80 uppercase">
            Experiencia Gastronómica en 3D
          </p>
        </header>

        {/* Navigation */}
        <nav className="flex flex-col gap-6">
          {menuData.categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.id}`}
              className="nav-link block relative py-6 px-8 text-menu-cream text-[clamp(1.5rem,5vw,2rem)] font-normal tracking-[0.1em] uppercase border border-transparent transition-all duration-400 ease-out hover:text-menu-gold hover:border-menu-gold/30"
            >
              {category.name}
              <span className="block font-mono text-[0.65rem] font-light tracking-[0.25em] text-menu-gold-light/70 mt-2 uppercase">
                {category.subtitle}
              </span>
            </Link>
          ))}
        </nav>

        {/* AR Badge */}
        <div className="inline-flex items-center gap-2 mt-8 py-2 px-4 border border-menu-gold/30 font-mono text-[0.6rem] tracking-[0.15em] text-menu-gold-light">
          <ArIcon className="w-4 h-4" />
          VISUALIZACIÓN EN REALIDAD AUMENTADA
        </div>

        {/* Footer */}
        <footer className="mt-16 font-mono text-xs font-light tracking-[0.2em] text-menu-gold-light/50">
          TOCA PARA EXPLORAR
        </footer>
      </div>
    </div>
  )
}
