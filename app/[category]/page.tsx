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
  params: {
    category: string
  }
}

// Opcional: Para generar pre-estáticamente las páginas conocidas
export async function generateStaticParams() {
  const menuData = await getFullMenu()
  if (!menuData) return []
  return menuData.categories.map((c) => ({ category: c.id }))
}

export default async function CategoryPage({ params }: Props) {
  const menuData = await getFullMenu()
  
  if (!menuData) return notFound()

  const category = menuData.categories.find(c => c.id === params.category)
  
  if (!category) return notFound()

  return (
    <div className="menu-bg-gradient min-h-screen p-8 relative">
      <CornerDecorations />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <BackLink />
        <PageHeader title={category.name} subtitle={category.subtitle || ""} />
        
        <MenuLegend />
        
        {category.sections.map((section) => (
          <MenuSectionComponent
            key={section.title} 
            title={section.title} 
            items={section.items} 
          />
        ))}
        
        <PageFooter text="TOCA CUALQUIER PLATO PARA VER EN REALIDAD AUMENTADA" />
      </div>
    </div>
  )
}
