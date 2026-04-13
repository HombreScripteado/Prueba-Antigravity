interface IconProps {
  className?: string
}

export function VegetarianIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-label="Vegetariano"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6c-2 3-2 6 0 9" strokeLinecap="round" />
      <path d="M9 8c1 2 2 4 3 4s2-2 3-4" strokeLinecap="round" />
    </svg>
  )
}

export function VeganIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-label="Vegano"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 16c0-4 2-8 6-10" strokeLinecap="round" />
      <path d="M10 12c2-1 4 0 5 2" strokeLinecap="round" />
      <circle cx="14" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function GlutenFreeIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-label="Sin TACC"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 18V8" strokeLinecap="round" />
      <path d="M9 10l3-2 3 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13l3-2 3 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 16l2-2 2 2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Crossed out line */}
      <path d="M5 19L19 5" strokeWidth="2" />
    </svg>
  )
}
