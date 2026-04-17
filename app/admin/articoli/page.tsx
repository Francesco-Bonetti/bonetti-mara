import Link from 'next/link'
import { query } from '@/lib/db'

interface Article { id: string; title_it: string; published: number; created_at: string }

export default async function AdminArticlesPage() {
  const articles = await query<Article>('SELECT id, title_it, published, created_at FROM articles ORDER BY created_at DESC')

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl">Articoli</h1>
        <Link href="/admin/articoli/nuovo" className="btn-primary">+ Nuovo articolo</Link>
      </div>
      {articles.length === 0 ? (
        <p className="text-sm text-ink/30">Nessun articolo ancora.</p>
      ) : (
        <div className="space-y-px">
          {articles.map((a) => (
            <div key={a.id} className="flex items-center gap-6 py-4 border-b border-ink/5">
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{a.title_it}</p>
                <p className="text-xs text-ink/30 mt-0.5">{new Date(a.created_at).toLocaleDateString('it-IT')}</p>
              </div>
              <span className={`text-xs tracking-widest uppercase px-2 py-1 ${a.published ? 'bg-ink text-paper' : 'border border-ink/20 text-ink/40'}`}>
                {a.published ? 'Pub.' : 'Bozza'}
              </span>
              <Link href={`/admin/articoli/${a.id}`} className="text-xs tracking-widest uppercase text-ink/40 hover:text-ink transition-colors">Modifica</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
