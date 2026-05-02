import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google'
import './landing.css'

const _inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
})

const _cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif',
})

const _jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${_inter.variable} ${_cormorant.variable} ${_jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  )
}
