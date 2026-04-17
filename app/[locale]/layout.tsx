import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import { getAdminFromCookies } from '@/lib/auth'
import itMessages from '@/messages/it.json'
import enMessages from '@/messages/en.json'

const messages = { it: itMessages, en: enMessages }

export const metadata: Metadata = {
  title: 'Mara Bonetti — Pittrice',
  description: 'Portfolio di Mara Bonetti, pittrice. Opere originali su carta e tela.',
}

export function generateStaticParams() {
  return [{ locale: 'it' }, { locale: 'en' }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isAdmin = await getAdminFromCookies()
  const t = messages[locale as 'it' | 'en'] ?? messages.it

  return (
    <html lang={locale}>
      <body className="bg-paper text-ink font-sans antialiased">
        <Navigation locale={locale} isAdmin={isAdmin} t={t.nav} />
        <main className="pt-16">{children}</main>
        <footer className="mt-24 pb-8 text-center">
          <p className="text-xs tracking-widest text-ink/30 uppercase">
            Mara Bonetti · {new Date().getFullYear()}
          </p>
        </footer>
      </body>
    </html>
  )
}
