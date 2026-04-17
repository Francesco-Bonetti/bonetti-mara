'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  locale: string
  isAdmin?: boolean
  t: { paintings: string; blog: string; about?: string; admin?: string }
}

export default function Navigation({ locale, isAdmin, t }: NavigationProps) {
  const pathname = usePathname()
  const other = locale === 'it' ? 'en' : 'it'
  const otherPath = pathname.replace(`/${locale}`, `/${other}`) || `/${other}`

  const isHome = pathname === `/${locale}`
  const isBlog = pathname.includes('/blog')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/90 backdrop-blur-md border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        {/* Logo + name */}
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <span className="w-9 h-9 flex items-center justify-center text-ink group-hover:opacity-70 transition-opacity">
            {/* Inline monogramma */}
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full" aria-hidden="true">
              <g fontFamily="Cormorant Garamond, Playfair Display, Georgia, serif" fontStyle="italic" fill="currentColor">
                <text x="20" y="24" textAnchor="middle" fontSize="20" fontWeight="500">mb</text>
              </g>
              <path d="M 8 30 Q 16 28.5 20 29.5 T 32 30" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
              <circle cx="14.5" cy="29.4" r="0.7" fill="currentColor"/>
              <circle cx="25.5" cy="29.4" r="0.7" fill="currentColor"/>
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-xl tracking-wide">Mara Bonetti</span>
            <span className="eyebrow mt-1">
              {locale === 'it' ? 'Pittrice' : 'Painter'}
            </span>
          </span>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            href={`/${locale}`}
            className={`text-[13px] tracking-[0.25em] uppercase transition-colors ${isHome ? 'text-ink' : 'text-ink/50 hover:text-ink'}`}
          >
            {t.paintings}
          </Link>
          <Link
            href={`/${locale}/blog`}
            className={`text-[13px] tracking-[0.25em] uppercase transition-colors ${isBlog ? 'text-ink' : 'text-ink/50 hover:text-ink'}`}
          >
            {t.blog}
          </Link>
          {isAdmin && (
            <Link href="/admin/quadri" className="text-[13px] tracking-[0.25em] uppercase text-ink/50 hover:text-ink transition-colors">
              {t.admin}
            </Link>
          )}

          {/* Toggle lingua */}
          <Link
            href={otherPath}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${other};path=/;max-age=31536000`
            }}
            className="flex items-center text-[11px] tracking-[0.3em] uppercase text-ink/50 hover:text-ink transition-colors border-l border-ink/15 pl-6"
            aria-label={`Switch to ${other.toUpperCase()}`}
          >
            <span className={locale === 'it' ? 'text-ink' : ''}>IT</span>
            <span className="mx-1.5 text-ink/30">/</span>
            <span className={locale === 'en' ? 'text-ink' : ''}>EN</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
