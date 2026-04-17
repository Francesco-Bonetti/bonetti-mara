import Link from 'next/link'

async function AdminLogout() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button type="submit" className="text-xs tracking-widest uppercase text-ink/40 hover:text-ink transition-colors">
        Esci
      </button>
    </form>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="bg-paper text-ink font-sans antialiased">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-ink/5">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="font-serif text-sm">Admin</span>
              <Link href="/admin/quadri" className="text-xs tracking-widest uppercase text-ink/50 hover:text-ink transition-colors">
                Quadri
              </Link>
              <Link href="/admin/articoli" className="text-xs tracking-widest uppercase text-ink/50 hover:text-ink transition-colors">
                Articoli
              </Link>
              <Link href="/it" className="text-xs tracking-widest uppercase text-ink/50 hover:text-ink transition-colors">
                ← Sito
              </Link>
            </div>
            <AdminLogout />
          </div>
        </nav>
        <main className="pt-14 max-w-5xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  )
}
