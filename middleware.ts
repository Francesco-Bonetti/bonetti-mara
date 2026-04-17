import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-secret')

const LOCALES = ['it', 'en']
const DEFAULT_LOCALE = 'it'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    try {
      await jwtVerify(token, JWT_SECRET)
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }

  // i18n redirect: / → /it or /en based on Accept-Language
  if (pathname === '/') {
    const acceptLang = req.headers.get('accept-language') ?? ''
    const preferred = acceptLang.split(',')[0]?.split('-')[0]?.toLowerCase()
    const locale = LOCALES.includes(preferred ?? '') ? preferred : DEFAULT_LOCALE
    const localeCookie = req.cookies.get('NEXT_LOCALE')?.value
    const finalLocale = LOCALES.includes(localeCookie ?? '') ? localeCookie : locale
    return NextResponse.redirect(new URL(`/${finalLocale}`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/admin/:path*'],
}
