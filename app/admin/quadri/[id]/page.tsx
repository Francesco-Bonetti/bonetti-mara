import { notFound } from 'next/navigation'
import { query } from '@/lib/db'
import PaintingForm from '@/components/PaintingForm'

interface Painting {
  id: string; title_it: string; title_en: string
  short_desc_it: string; short_desc_en: string
  long_desc_it: string | null; long_desc_en: string | null
  image_url: string; thumb_url: string
  published: number
}

export default async function EditPaintingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const rows = await query<Painting>('SELECT * FROM paintings WHERE id = ?', [id])
  const p = rows[0]
  if (!p) notFound()

  return (
    <div>
      <h1 className="font-serif text-3xl mb-10">Modifica quadro</h1>
      <PaintingForm initial={{
        id: p.id,
        title_it: p.title_it,
        title_en: p.title_en,
        short_desc_it: p.short_desc_it,
        short_desc_en: p.short_desc_en,
        long_desc_it: p.long_desc_it ?? undefined,
        long_desc_en: p.long_desc_en ?? undefined,
        image_url: p.image_url,
        thumb_url: p.thumb_url,
        published: !!p.published,
      }} />
    </div>
  )
}
