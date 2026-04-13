import { CornerDecorations } from "@/components/menu/corner-decorations"
import { BackLink } from "@/components/menu/back-link"
import { PageHeader } from "@/components/menu/page-header"
import { MenuSection } from "@/components/menu/menu-section"
import { PageFooter } from "@/components/menu/page-footer"
import { MenuLegend } from "@/components/menu/menu-legend"
import menuData from "@/data/menu.json"

export default function ComidasPage() {
  const category = menuData.categories.find(c => c.id === "comidas")
  
  if (!category) return null

  return (
    <div className="menu-bg-gradient min-h-screen p-8 relative">
      <CornerDecorations />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <BackLink />
        <PageHeader title={category.name} subtitle={category.subtitle} />
        
        <MenuLegend />
        
        {category.sections.map((section) => (
          <MenuSection 
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
