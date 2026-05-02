interface PageHeaderProps {
  title: string
  subtitle: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="text-center mb-1 pb-8 border-b border-menu-gold/20">
      <h1 className="text-[clamp(2rem,6vw,3rem)] font-light tracking-[0.15em] uppercase text-menu-gold mb-3">
        {title}
      </h1>
      {subtitle && (
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-px w-6 bg-menu-gold/40" />
          <p className="font-mono text-[0.65rem] font-light tracking-[0.28em] text-menu-cream/60 uppercase">
            {subtitle}
          </p>
          <div className="h-px w-6 bg-menu-gold/40" />
        </div>
      )}
    </header>
  )
}
