import Link from "next/link"
import { BackArrowIcon } from "./ar-icon"

export function BackLink() {
  return (
    <Link 
      href="/"
      className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-menu-gold-light mb-8 transition-colors duration-300 hover:text-menu-gold"
    >
      <BackArrowIcon className="w-4 h-4" />
      Volver al menú
    </Link>
  )
}
