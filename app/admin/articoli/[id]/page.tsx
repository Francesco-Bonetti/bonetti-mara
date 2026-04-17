import { notFound } from 'next/navigation'
import { query } from '@/lib/db'
import ArticleForm from '@/components/ArticleForm'

interface Article {
  id: string; slug: string
  title_it: string; title_en: string
  excerpt_it: string | null; excerpt_en: string | null
  content_it: string; content_en: string
  cover_image_url: string | null; published: number
}

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const rows = await query<Article>('SELECT * FROM articles WHERE id = ?', [id])
  const a = rows[0]
  if (!a) notFound()

  return (
    <div>
      <h1 className="font-serif text-3xl mb-10">Modifica articolo</h1>
      <ArticleForm initial={{ ...a, published: !!a.published }} />
    </div>
  )
}
