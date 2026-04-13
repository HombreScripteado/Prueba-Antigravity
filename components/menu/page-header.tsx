interface PageHeaderProps {
  title: string
  subtitle: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="text-center mb-12 pb-8 border-b border-menu-gold/20">
      <h1 className="text-[clamp(2rem,6vw,3rem)] font-light tracking-[0.15em] uppercase text-menu-gold mb-2">
        {title}
      </h1>
      <p className="font-mono text-xs font-light tracking-[0.25em] text-menu-cream/70">
        {subtitle}
      </p>
    </header>
  )
}
