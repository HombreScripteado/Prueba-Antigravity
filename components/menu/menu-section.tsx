import { MenuItem } from "./menu-item"

interface MenuSectionProps {
  title: string
  items: {
    id: string
    name: string
    description: string
    price: number
    arModel: string
    chefRecommendation?: boolean
  }[]
}

export function MenuSection({ title, items }: MenuSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-medium tracking-[0.2em] uppercase text-menu-gold-light mb-6 pb-2 border-b border-menu-gold/15">
        {title}
      </h2>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <MenuItem key={item.id} {...item} />
        ))}
      </div>
    </section>
  )
}
