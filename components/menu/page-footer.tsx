interface PageFooterProps {
  text?: string
}

export function PageFooter({ text = "TOCA CUALQUIER ÍTEM PARA VER EN REALIDAD AUMENTADA" }: PageFooterProps) {
  return (
    <footer className="text-center mt-12 pt-8 border-t border-menu-gold/20">
      <p className="font-mono text-[0.65rem] tracking-[0.2em] text-menu-gold-light/50">
        {text}
      </p>
    </footer>
  )
}
