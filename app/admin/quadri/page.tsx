import Image from 'next/image'
import Link from 'next/link'
import { query } from '@/lib/db'

interface Painting {
  id: string; title_it: string; thumb_url: string; image_url: string; published: number; created_at: string
}

async function getPaintings() {
  return query<Painting>('SELECT id, title_it, thumb_url, image_url, published, created_at FROM paintings ORDER BY created_at DESC')
}

export default async function AdminPaintingsPage() {
  const paintings = await getPaintings()

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl">Quadri</h1>
        <Link href="/admin/quadri/nuovo" className="btn-primary">+ Nuovo quadro</Link>
      </div>

      {paintings.length === 0 ? (
        <p className="text-sm text-ink/30">Nessun quadro ancora.</p>
      ) : (
        <div className="space-y-px">
          {paintings.map((p) => (
            <div key={p.id} className="flex items-center gap-6 py-4 border-b border-ink/5">
              <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden painting-frame">
                <Image src={p.thumb_url || p.image_url} alt={p.title_it} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{p.title_it}</p>
                <p className="text-xs text-ink/30 mt-0.5">{new Date(p.created_at).toLocaleDateString('it-IT')}</p>
              </div>
              <span className={`text-xs tracking-widest uppercase px-2 py-1 ${p.published ? 'bg-ink text-paper' : 'border border-ink/20 text-ink/40'}`}>
                {p.published ? 'Pub.' : 'Bozza'}
              </span>
              <Link href={`/admin/quadri/${p.id}`} className="text-xs tracking-widest uppercase text-ink/40 hover:text-ink transition-colors">
                Modifica
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
