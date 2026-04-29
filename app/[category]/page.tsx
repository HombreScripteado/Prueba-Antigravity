import { CornerDecorations } from "@/components/menu/corner-decorations"
import { BackLink } from "@/components/menu/back-link"
import { PageHeader } from "@/components/menu/page-header"
import { MenuSection as MenuSectionComponent } from "@/components/menu/menu-section"
import { PageFooter } from "@/components/menu/page-footer"
import { MenuLegend } from "@/components/menu/menu-legend"
import { getFullMenu } from "@/lib/menu"
import { notFound } from "next/navigation"

export const revalidate = 3600 // ISR: revalida con petición pasada una hora

type Props = {
  params: Promise<{
    category: string
  }>
}

// Opcional: Para generar pre-estáticamente las páginas conocidas
export async function generateStaticParams() {
  const menuData = await getFullMenu()
  if (!menuData) return []
  return menuData.categories.map((c) => ({ category: c.id }))
}

export default async function CategoryPage(props: Props) {
  const params = await props.params
  const menuData = await getFullMenu()
  
  if (!menuData) return notFound()

  const category = menuData.categories.find(c => c.id === params.category)
  
  if (!category) return notFound()

  return (
    <div className="menu-bg-gradient bg-black min-h-screen relative pb-16">
      <CornerDecorations />
      
      {/* Top Header Section */}
      <div className="max-w-2xl mx-auto relative z-10 pt-8 px-6 md:px-8">
        <BackLink />
        <PageHeader title={category.name} subtitle={category.subtitle || ""} />
        <MenuLegend />
      </div>

      {/* Sticky Rapid Navigation Menu */}
      {category.sections.length > 0 && (
        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-y border-menu-gold/20 py-4 mt-6 mb-10 shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
          <div className="max-w-2xl mx-auto px-6 md:px-8 w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Scrollable Pills container */}
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
      
      {/* Sections rendering with Anchors */}
      <div className="max-w-2xl mx-auto relative z-10 px-6 md:px-8">
        {category.sections.map((section) => (
          <div 
            key={section.title} 
            id={section.title.replace(/\s+/g, '-')} 
            className="scroll-mt-32"
          >
            <MenuSectionComponent
              title={section.title} 
              items={section.items} 
            />
          </div>
        ))}
        
        <PageFooter text="TOCA CUALQUIER PLATO PARA VER EN REALIDAD AUMENTADA" />
      </div>
    </div>
  )
}
