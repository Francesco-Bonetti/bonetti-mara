import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mara Bonetti — Pittrice',
  description: 'Portfolio di Mara Bonetti, pittrice',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
