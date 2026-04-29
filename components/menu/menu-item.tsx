import Link from "next/link"
import { ArIcon } from "./ar-icon"
import { VegetarianIcon, VeganIcon, GlutenFreeIcon } from "./dietary-icons"

interface MenuItemProps {
  id: string
  name: string
  description: string | null
  price: number
  hasAR?: boolean
  chefRecommendation?: boolean
  currency?: string
  isVegetarian?: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
  category_id?: string
}

export function MenuItem({
  id,
  name,
  description,
  price,
  hasAR = false,
  chefRecommendation = false,
  currency = "$",
  isVegetarian = false,
  isVegan = false,
  isGlutenFree = false,
  category_id
}: MenuItemProps) {
  // Build the AR page URL with the dish ID, name, and return route
  const arUrl = hasAR ? `/ar?id=${id}&name=${encodeURIComponent(name)}${category_id ? `&returnTo=${category_id}` : ''}` : "#"

  const hasDietaryInfo = isVegetarian || isVegan || isGlutenFree

  const innerContent = (
    <>
      {/* Chef Recommendation Badge */}
      {chefRecommendation && (
        <span className="absolute top-0 right-0 bg-menu-gold text-menu-bg font-mono text-[0.55rem] tracking-widest px-3 py-1.5 rounded-bl-md shadow-lg z-10 uppercase flex items-center gap-1">
          <span className="text-[0.7rem] leading-none">★</span> Chef
        </span>
      )}

      <div className={`flex-1 ${chefRecommendation ? 'pr-16' : ''}`}>
        <h3 className="text-xl font-normal tracking-wide mb-1 flex items-center gap-3 text-menu-cream">
          {hasAR && (
            <span className="ar-icon-pulse inline-flex items-center justify-center w-6 h-6 border border-menu-gold/70 rounded flex-shrink-0 bg-menu-gold/5">
              <ArIcon className="w-3.5 h-3.5 text-menu-gold" />
            </span>
          )}
          <span className="line-clamp-2">{name}</span>

          {/* Dietary Icons */}
          {hasDietaryInfo && (
            <span className="inline-flex items-center gap-1.5 ml-1">
              {isVegetarian && <VegetarianIcon className="w-4 h-4 text-green-500" />}
              {isVegan && <VeganIcon className="w-4 h-4 text-green-400" />}
              {isGlutenFree && <GlutenFreeIcon className="w-4 h-4 text-amber-400" />}
            </span>
          )}
        </h3>
        {description && (
          <p className={`font-mono text-xs font-light text-menu-cream/60 leading-relaxed ${hasAR ? 'pl-9' : ''}`}>
            {description}
          </p>
        )}
        {hasAR && (
          <span className="ar-hint flex items-center gap-1.5 mt-2 font-mono text-[0.6rem] tracking-widest text-menu-gold pl-9">
            <span aria-hidden="true">◈</span> Ver en Realidad Aumentada
          </span>
        )}
      </div>
      <span className={`text-lg font-medium text-menu-gold whitespace-nowrap ml-4 max-sm:ml-0 ${hasAR ? 'max-sm:pl-9' : ''}`}>
        {currency}{new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)}
      </span>
    </>
  )

  const className = `menu-item-link relative flex justify-between items-start p-5 bg-menu-dark/50 border border-menu-gold/10 transition-all duration-300 ease-out max-sm:flex-col max-sm:gap-3 overflow-hidden ${hasAR ? 'menu-item-ar hover:border-menu-gold/40 hover:bg-menu-dark/80 hover:translate-x-1 cursor-pointer' : ''}`

  if (hasAR) {
    return (
      <Link href={arUrl} className={className}>
        {innerContent}
      </Link>
    )
  }

  return (
    <div className={className}>
      {innerContent}
    </div>
  )
}
