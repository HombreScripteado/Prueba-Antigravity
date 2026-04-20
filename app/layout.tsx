import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant"
})

const _montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-montserrat"
})

export const metadata: Metadata = {
  title: 'Carta Interactiva | Restaurante Gourmet',
  description: 'Experiencia gastronómica en 3D con visualización en Realidad Aumentada',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preload" href="/HDRI/Diurno-Hotel.hdr" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/HDRI/Nocturno-Christmas.hdr" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/HDRI/Nocturno-Fireplace.hdr" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/HDRI/Nocturno-Studio.hdr" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className={`${_cormorant.variable} ${_montserrat.variable} font-serif antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
