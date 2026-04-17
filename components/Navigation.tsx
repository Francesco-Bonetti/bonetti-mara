'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface NavigationProps {
  locale: string
  isAdmin?: boolean
  t: { paintings: string; blog: string; about?: string; admin?: string }
}

/** Monogramma "mb" + linea d'orizzonte + due punti (acqua). viewBox 48×48 per più respiro. */
function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <g fontFamily="Cormorant Garamond, Playfair Display, Georgia, serif" fontStyle="italic" fill="currentColor">
        <text x="24" y="29" textAnchor="middle" fontSize="28" fontWeight="500">mb</text>
      </g>
      <path d="M 8 36 Q 18 34.2 24 35.4 T 40 36" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
      <circle cx="16.5" cy="35.3" r="0.9" fill="currentColor"/>
      <circle cx="31.5" cy="35.3" r="0.9" fill="currentColor"/>
    </svg>
  )
}

export default function Navigation({ locale, isAdmin, t }: NavigationProps) {
  const pathname = usePathname()
  const other = locale === 'it' ? 'en' : 'it'
  const otherPath = pathname.replace(`/${locale}`, `/${other}`) || `/${other}`

  const isHome = pathname === `/${locale}`
  const isBlog = pathname.includes('/blog')

  const [open, setOpen] = useState(false)

  // Chiudi menu al cambio pagina
  useEffect(() => { setOpen(false) }, [pathname])

  // Blocca scroll del body quando menu mobile aperto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/90 backdrop-blur-md border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-[72px] md:h-20 flex items-center justify-between">
        {/* Logo + nome */}
        <Link href={`/${locale}`} className="flex items-center gap-3 group min-w-0" onClick={() => setOpen(false)}>
          <span className="w-11 h-11 md:w-12 md:h-12 shrink-0 flex items-center justify-center text-ink group-hover:opacity-70 transition-opacity">
            <LogoMark className="w-full h-full" />
          </span>
          <span className="flex flex-col leading-none min-w-0">
            <span className="font-serif text-lg md:text-xl tracking-wide truncate">Mara Bonetti</span>
            <span className="eyebrow mt-1 hidden sm:block">
              {locale === 'it' ? 'Pittrice' : 'Painter'}
            </span>
          </span>
        </Link>

        {/* Menu desktop */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
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

        {/* Toggle mobile (hamburger) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden -mr-2 w-11 h-11 flex flex-col items-center justify-center gap-[6px] text-ink"
          aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={open}
        >
          <span className={`block h-px w-6 bg-current transition-transform duration-300 ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
          <span className={`block h-px w-6 bg-current transition-transform duration-300 ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Pannello mobile */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out bg-paper border-t border-ink/5 ${open ? 'max-h-[80vh]' : 'max-h-0'}`}
      >
        <div className="px-5 py-8 flex flex-col gap-6">
          <Link
            href={`/${locale}`}
            onClick={() => setOpen(false)}
            className={`text-base tracking-[0.25em] uppercase ${isHome ? 'text-ink' : 'text-ink/60'}`}
          >
            {t.paintings}
          </Link>
          <Link
            href={`/${locale}/blog`}
            onClick={() => setOpen(false)}
            className={`text-base tracking-[0.25em] uppercase ${isBlog ? 'text-ink' : 'text-ink/60'}`}
          >
            {t.blog}
          </Link>
          {isAdmin && (
            <Link
              href="/admin/quadri"
              onClick={() => setOpen(false)}
              className="text-base tracking-[0.25em] uppercase text-ink/60"
            >
              {t.admin}
            </Link>
          )}

          <div className="rule my-2" />

          <Link
            href={otherPath}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${other};path=/;max-age=31536000`
              setOpen(false)
            }}
            className="flex items-center text-sm tracking-[0.3em] uppercase text-ink/60"
            aria-label={`Switch to ${other.toUpperCase()}`}
          >
            <span className={locale === 'it' ? 'text-ink' : ''}>IT</span>
            <span className="mx-2 text-ink/30">/</span>
            <span className={locale === 'en' ? 'text-ink' : ''}>EN</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
