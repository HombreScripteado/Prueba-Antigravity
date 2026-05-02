import { MenuItem } from "./menu-item"

interface MenuSectionProps {
  title: string
  items: {
    id: string
    name: string
    description: string | null
    price: number
    hasAR?: boolean
    chefRecommendation?: boolean
    isVegetarian?: boolean
    isVegan?: boolean
    isGlutenFree?: boolean
  }[]
}

export function MenuSection({ title, items }: MenuSectionProps) {
  return (
    <section className="mb-14">
      <div className="flex items-center gap-4 mb-7">
        <div className="h-px flex-1 bg-menu-gold/15" />
        <h2 className="text-sm font-medium tracking-[0.28em] uppercase text-menu-gold-light/80 whitespace-nowrap">
          {title}
        </h2>
        <div className="h-px flex-1 bg-menu-gold/15" />
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <MenuItem key={item.id} {...item} />
        ))}
      </div>
    </section>
  )
}
