import { getClientBySlug, generateStaticParams as generateClientParams } from '@/lib/clients'
import { getMenuByClientId } from '@/lib/menu'
import { notFound } from 'next/navigation'
import { CornerDecorations } from '@/components/menu/corner-decorations'
import { BackLink } from '@/components/menu/back-link'
import { PageHeader } from '@/components/menu/page-header'
import { MenuSection } from '@/components/menu/menu-section'
import { PageFooter } from '@/components/menu/page-footer'
import { MenuLegend } from '@/components/menu/menu-legend'
import Link from 'next/link'

export const revalidate = 3600

export async function generateStaticParams() {
  const clientParams = generateClientParams()
  const allParams = []

  for (const clientParam of clientParams) {
    const client = getClientBySlug(clientParam.client_slug)
    if (!client) continue

    const menuData = await getMenuByClientId(client.id)
    if (!menuData) continue

    for (const category of menuData.categories) {
      allParams.push({
        client_slug: clientParam.client_slug,
        category: category.id,
      })
    }
  }

  return allParams
}

interface CategoryPageProps {
  params: Promise<{
    client_slug: string
    category: string
  }>
}

export async function generateMetadata(props: CategoryPageProps) {
  const params = await props.params
  const client = getClientBySlug(params.client_slug)

  if (!client) return {}

  const menuData = await getMenuByClientId(client.id)
  const category = menuData?.categories.find((c) => c.id === params.category)

  return {
    title: `${category?.name || 'Categoría'} | ${client.name}`,
    description: 'Explorar menú digital en 3D con Realidad Aumentada',
  }
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params
  const client = getClientBySlug(params.client_slug)

  if (!client) {
    return notFound()
  }

  const menuData = await getMenuByClientId(client.id)

  if (!menuData) {
    return notFound()
  }

  const category = menuData.categories.find((c) => c.id === params.category)

  if (!category) {
    return notFound()
  }

  return (
    <div className="menu-bg-gradient bg-black min-h-screen relative pb-16">
      <CornerDecorations />

      {/* Header Section */}
      <div className="max-w-2xl mx-auto relative z-10 pt-8 px-6 md:px-8">
        <Link
          href={`/${params.client_slug}/menu`}
          className="text-sm tracking-[0.15em] text-menu-gold/70 hover:text-menu-gold transition-colors mb-8 flex items-center gap-2 font-mono"
        >
          <span>← VOLVER AL MENÚ</span>
        </Link>

        <PageHeader title={category.name} subtitle={category.subtitle || ''} />
        <MenuLegend />
      </div>

      {/* Sticky Section Navigation */}
      {category.sections.length > 1 && (
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-y border-menu-gold/20 py-4 mb-10 shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
          <div className="max-w-2xl mx-auto px-6 md:px-8 w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-3 w-max pb-1">
              {category.sections.map((section) => (
                <a
                  key={section.title}
                  href={`#${section.title.replace(/\s+/g, '-')}`}
                  className="px-5 py-2.5 rounded-full border border-menu-gold/30 bg-menu-bg/50 text-menu-cream font-mono text-[0.65rem] md:text-xs uppercase tracking-[0.15em] hover:bg-menu-gold hover:text-black hover:border-menu-gold transition-all duration-300 whitespace-nowrap"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sections with Scroll Anchors */}
      <div className="max-w-2xl mx-auto relative z-10 px-6 md:px-8">
        {category.sections.map((section) => (
          <div
            key={section.title}
            id={section.title.replace(/\s+/g, '-')}
            className="scroll-mt-32"
          >
            <MenuSection title={section.title} items={section.items} />
          </div>
        ))}

        <PageFooter text="TOCA CUALQUIER PLATO PARA VER EN REALIDAD AUMENTADA" />
      </div>
    </div>
  )
}
