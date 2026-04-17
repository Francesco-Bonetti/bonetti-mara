import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { getAdminFromCookies } from '@/lib/auth'
import itMessages from '@/messages/it.json'
import enMessages from '@/messages/en.json'

const messages = { it: itMessages, en: enMessages }

export const metadata: Metadata = {
  title: 'Mara Bonetti — Pittrice',
  description: 'Paesaggi a inchiostro di Mara Bonetti. Opere originali su carta e tela.',
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
        <main className="pt-[72px] md:pt-20">{children}</main>

        {/* ---------- FOOTER ---------- */}
        <footer className="border-t border-ink/10 bg-paper">
          <div className="max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-14">
            <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-start">
              <div className="md:col-span-5">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 text-ink">
                    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" aria-hidden="true">
                      <g fontFamily="Cormorant Garamond, Playfair Display, Georgia, serif" fontStyle="italic" fill="currentColor">
                        <text x="24" y="29" textAnchor="middle" fontSize="28" fontWeight="500">mb</text>
                      </g>
                      <path d="M 8 36 Q 18 34.2 24 35.4 T 40 36" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
                      <circle cx="16.5" cy="35.3" r="0.9" fill="currentColor"/>
                      <circle cx="31.5" cy="35.3" r="0.9" fill="currentColor"/>
                    </svg>
                  </span>
                  <span className="font-serif text-lg md:text-xl tracking-wide">Mara Bonetti</span>
                </div>
                <p className="text-sm text-ink/60 mt-4 max-w-sm leading-relaxed">
                  {locale === 'it'
                    ? 'Paesaggi a inchiostro. Opere originali su carta e tela.'
                    : 'Landscapes in ink. Original works on paper and canvas.'}
                </p>
              </div>

              <div className="md:col-span-3">
                <p className="eyebrow mb-4">{locale === 'it' ? 'Naviga' : 'Explore'}</p>
                <ul className="space-y-2 text-sm">
                  <li><Link href={`/${locale}`} className="text-ink/70 hover:text-ink transition-colors">{t.nav.paintings}</Link></li>
                  <li><Link href={`/${locale}/blog`} className="text-ink/70 hover:text-ink transition-colors">{t.nav.blog}</Link></li>
                  <li><Link href={`/${locale}#artista`} className="text-ink/70 hover:text-ink transition-colors">{locale === 'it' ? "Sull'artista" : 'About'}</Link></li>
                </ul>
              </div>

              <div className="md:col-span-4">
                <p className="eyebrow mb-4">{locale === 'it' ? 'Contatti' : 'Contact'}</p>
                <p className="text-sm text-ink/70 leading-relaxed">
                  {locale === 'it'
                    ? "Per informazioni o richieste d'acquisto, scrivere direttamente all'artista."
                    : 'For information or purchase enquiries, please write to the artist directly.'}
                </p>
              </div>
            </div>

            <div className="rule mt-14 mb-6" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <p className="text-xs tracking-[0.25em] uppercase text-stone">
                © {new Date().getFullYear()} Mara Bonetti. {locale === 'it' ? 'Tutti i diritti riservati.' : 'All rights reserved.'}
              </p>
              <p className="text-xs tracking-[0.25em] uppercase text-stone">
                {locale === 'it' ? 'Inchiostro · Acquarello · Carta · Tela' : 'Ink · Watercolour · Paper · Canvas'}
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
