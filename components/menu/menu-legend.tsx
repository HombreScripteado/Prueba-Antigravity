import { VegetarianIcon, VeganIcon, GlutenFreeIcon } from "./dietary-icons"

export function MenuLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-2 px-2 my-2 opacity-80">
      <div className="flex items-center gap-1.5">
        <VegetarianIcon className="w-3.5 h-3.5 text-green-500" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-menu-cream/70">Vegetariano</span>
      </div>
      <div className="flex items-center gap-1.5">
        <VeganIcon className="w-3.5 h-3.5 text-green-400" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-menu-cream/70">Vegano</span>
      </div>
      <div className="flex items-center gap-1.5">
        <GlutenFreeIcon className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-menu-cream/70">Sin TACC</span>
      </div>
    </div>
  )
}
