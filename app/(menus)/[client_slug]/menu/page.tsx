import { getClientBySlug, generateStaticParams as generateClientParams } from '@/lib/clients'
import { getMenuByClientId } from '@/lib/menu'
import { notFound } from 'next/navigation'
import { CornerDecorations } from '@/components/menu/corner-decorations'
import { ArIcon } from '@/components/menu/ar-icon'
import Link from 'next/link'

export const revalidate = 3600

export async function generateStaticParams() {
  return generateClientParams()
}

interface MenuPortadaProps {
  params: Promise<{
    client_slug: string
  }>
}

export async function generateMetadata(props: MenuPortadaProps) {
  const params = await props.params
  const client = getClientBySlug(params.client_slug)
  return {
    title: `${client?.name || 'Menú'} | Digital Menu`,
    description: 'Experiencia gastronómica en 3D con visualización en Realidad Aumentada',
  }
}

export default async function MenuPortada(props: MenuPortadaProps) {
  const params = await props.params
  const client = getClientBySlug(params.client_slug)

  if (!client) {
    return notFound()
  }

  const menuData = await getMenuByClientId(client.id)

  if (!menuData || menuData.categories.length === 0) {
    return notFound()
  }

  return (
    <div className="menu-bg-gradient bg-black min-h-screen flex flex-col items-center justify-center p-8 relative overflow-x-hidden">
      <CornerDecorations />

      <div className="max-w-lg w-full text-center relative z-10">
        {/* Header */}
        <header className="mb-16 animate-fade-up" style={{ animationDelay: '0ms' }}>
          {/* Decorative line */}
          <div className="decorative-line w-16 h-px mx-auto mb-8" />

          <h1 className="text-[clamp(2.5rem,8vw,4rem)] font-light tracking-[0.15em] leading-tight mb-4 uppercase">
            Carta
            <span className="block text-menu-gold">Interactiva</span>
          </h1>

          {/* Subtitle divider */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-8 bg-menu-gold/40" />
            <p className="font-mono text-xs font-light tracking-[0.3em] text-menu-gold-light/80 uppercase">
              Experiencia Gastronómica en 3D
            </p>
            <div className="h-px w-8 bg-menu-gold/40" />
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex flex-col gap-6">
          {menuData.categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/${params.client_slug}/menu/${category.id}`}
              className="nav-link animate-fade-up block relative py-6 px-8 text-menu-cream text-[clamp(1.5rem,5vw,2rem)] font-normal tracking-[0.1em] uppercase border border-transparent transition-all duration-400 ease-out hover:text-menu-gold hover:border-menu-gold/30"
              style={{ animationDelay: `${100 + index * 90}ms` }}
            >
              {category.name}
              <span className="block font-mono text-[0.65rem] font-light tracking-[0.25em] text-menu-gold-light/70 mt-2 uppercase">
                {category.subtitle || `Explorar ${category.name.toLowerCase()}`}
              </span>
            </Link>
          ))}
        </nav>

        {/* AR Badge */}
        <div
          className="animate-fade-up inline-flex items-center gap-2.5 mt-10 py-2.5 px-5 border border-menu-gold/40 bg-menu-gold/5 font-mono text-[0.6rem] tracking-[0.15em] text-menu-gold"
          style={{ animationDelay: `${100 + menuData.categories.length * 90 + 80}ms` }}
        >
          <ArIcon className="w-4 h-4" />
          VISUALIZACIÓN EN REALIDAD AUMENTADA
        </div>

        {/* Footer */}
        <footer
          className="animate-fade-up mt-14 font-mono text-xs font-light tracking-[0.2em] text-menu-gold-light/40 uppercase"
          style={{ animationDelay: `${100 + menuData.categories.length * 90 + 180}ms` }}
        >
          Toca una categoría para explorar
        </footer>
      </div>
    </div>
  )
}
