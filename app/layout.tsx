import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://bonetti-mara.vercel.app'),
  title: {
    default: 'Mara Bonetti — Pittrice',
    template: '%s · Mara Bonetti',
  },
  description: 'Paesaggi a inchiostro di Mara Bonetti. Opere originali su carta e tela, tra nebbia, acqua e silenzio.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'Mara Bonetti — Pittrice',
    description: 'Paesaggi a inchiostro. Opere originali su carta e tela.',
    type: 'website',
    locale: 'it_IT',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
