import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import './menus-base.css'

const _cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const _montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-montserrat',
})

export default function MenusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${_cormorant.variable} ${_montserrat.variable} scroll-smooth`}>
      <head>
        <link rel="preload" href="/HDRI/Diurno-Hotel.hdr" as="fetch" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="/HDRI/Nocturno-Christmas.hdr"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/HDRI/Nocturno-Fireplace.hdr"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/HDRI/Nocturno-Studio.hdr"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-serif antialiased">{children}</body>
    </html>
  )
}
