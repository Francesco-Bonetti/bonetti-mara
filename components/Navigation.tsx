'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  locale: string
  isAdmin?: boolean
  t: { paintings: string; blog: string; admin?: string }
}

export default function Navigation({ locale, isAdmin, t }: NavigationProps) {
  const pathname = usePathname()
  const other = locale === 'it' ? 'en' : 'it'

  // Swap locale in current path
  const otherPath = pathname.replace(`/${locale}`, `/${other}`) || `/${other}`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-ink/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-serif text-lg tracking-wide">
          Mara Bonetti
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href={`/${locale}`}
            className={`text-sm tracking-wide hover:opacity-60 transition-opacity ${pathname === `/${locale}` ? 'opacity-100' : 'opacity-50'}`}
          >
            {t.paintings}
          </Link>
          <Link
            href={`/${locale}/blog`}
            className={`text-sm tracking-wide hover:opacity-60 transition-opacity ${pathname.includes('/blog') ? 'opacity-100' : 'opacity-50'}`}
          >
            {t.blog}
          </Link>
          {isAdmin && (
            <Link href="/admin/quadri" className="text-sm tracking-wide opacity-50 hover:opacity-100 transition-opacity">
              {t.admin}
            </Link>
          )}

          {/* Language toggle */}
          <Link
            href={otherPath}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${other};path=/;max-age=31536000`
            }}
            className="text-xs tracking-widest border border-ink/20 px-2.5 py-1 hover:border-ink transition-colors"
          >
            {other.toUpperCase()}
          </Link>
        </div>
      </div>
    </nav>
  )
}
