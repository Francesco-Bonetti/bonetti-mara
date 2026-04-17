'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

interface ArticleData {
  id?: string; slug?: string
  title_it?: string; title_en?: string
  excerpt_it?: string; excerpt_en?: string
  content_it?: string; content_en?: string
  cover_image_url?: string; published?: boolean
}

function Editor({ content, onChange }: { content: string; onChange: (json: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, TiptapImage, Link.configure({ openOnClick: false })],
    content: content ? JSON.parse(content) : { type: 'doc', content: [] },
    onUpdate: ({ editor }) => onChange(JSON.stringify(editor.getJSON())),
    editorProps: { attributes: { class: 'tiptap-content min-h-[200px] outline-none text-sm' } },
  })

  return (
    <div className="border border-ink/20 p-4">
      {editor && (
        <div className="flex gap-2 flex-wrap mb-3 pb-3 border-b border-ink/10">
          {[
            ['B', () => editor.chain().focus().toggleBold().run()],
            ['I', () => editor.chain().focus().toggleItalic().run()],
            ['H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run()],
            ['H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run()],
            ['• Lista', () => editor.chain().focus().toggleBulletList().run()],
          ].map(([label, action]) => (
            <button key={String(label)} type="button" onClick={() => (action as () => void)()} className="text-xs px-2 py-1 border border-ink/20 hover:border-ink transition-colors">
              {String(label)}
            </button>
          ))}
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}

export default function ArticleForm({ initial }: { initial?: ArticleData }) {
  const router = useRouter()
  const isEdit = !!initial?.id
  const fileRef = useRef<HTMLInputElement>(null)

  const [titleIt, setTitleIt] = useState(initial?.title_it ?? '')
  const [titleEn, setTitleEn] = useState(initial?.title_en ?? '')
  const [excerptIt, setExcerptIt] = useState(initial?.excerpt_it ?? '')
  const [excerptEn, setExcerptEn] = useState(initial?.excerpt_en ?? '')
  const [contentIt, setContentIt] = useState(initial?.content_it ?? '')
  const [contentEn, setContentEn] = useState(initial?.content_en ?? '')
  const [coverUrl, setCoverUrl] = useState(initial?.cover_image_url ?? '')
  const [published, setPublished] = useState(initial?.published ?? false)
  const [activeTab, setActiveTab] = useState<'it' | 'en'>('it')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const form = new FormData(); form.append('file', file); form.append('folder', 'articles')
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    if (res.ok) { const d = await res.json() as { url: string }; setCoverUrl(d.url) }
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    const payload = { titleIt, titleEn, excerptIt, excerptEn, contentIt, contentEn, coverImageUrl: coverUrl || undefined, published }
    const url = isEdit ? `/api/admin/articles/${initial!.id}` : '/api/admin/articles'
    const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) { router.push('/admin/articoli'); router.refresh() }
    else { setError('Errore nel salvataggio'); setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm('Eliminare questo articolo?')) return
    await fetch(`/api/admin/articles/${initial!.id}`, { method: 'DELETE' })
    router.push('/admin/articoli'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Cover */}
      <div>
        <label className="admin-label">Immagine copertina</label>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
        {coverUrl ? (
          <div className="flex items-start gap-6">
            <div className="relative w-32 h-24 painting-frame overflow-hidden">
              <Image src={coverUrl} alt="cover" fill className="object-cover" />
            </div>
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost text-xs">
              {uploading ? 'Caricamento…' : 'Cambia'}
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost w-full py-8 text-sm text-ink/40">
            {uploading ? 'Caricamento…' : '+ Carica copertina'}
          </button>
        )}
      </div>

      {/* Titles */}
      <div className="grid grid-cols-2 gap-4">
        <div><label className="admin-label">Titolo IT</label><input value={titleIt} onChange={(e) => setTitleIt(e.target.value)} className="input-field" required /></div>
        <div><label className="admin-label">Titolo EN</label><input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="input-field" required /></div>
      </div>

      {/* Excerpts */}
      <div className="grid grid-cols-2 gap-4">
        <div><label className="admin-label">Anteprima IT</label><textarea value={excerptIt} onChange={(e) => setExcerptIt(e.target.value)} className="input-field resize-none" rows={3} /></div>
        <div><label className="admin-label">Anteprima EN</label><textarea value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} className="input-field resize-none" rows={3} /></div>
      </div>

      {/* Content with tabs */}
      <div>
        <div className="flex gap-0 mb-0">
          {(['it', 'en'] as const).map((l) => (
            <button key={l} type="button" onClick={() => setActiveTab(l)}
              className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors ${activeTab === l ? 'bg-ink text-paper border-ink' : 'border-ink/20 text-ink/40 hover:border-ink'}`}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div className={activeTab === 'it' ? '' : 'hidden'}>
          <label className="admin-label mt-4">Testo articolo (IT)</label>
          <Editor content={contentIt} onChange={setContentIt} />
        </div>
        <div className={activeTab === 'en' ? '' : 'hidden'}>
          <label className="admin-label mt-4">Testo articolo (EN)</label>
          <Editor content={contentEn} onChange={setContentEn} />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-4 h-4" />
        <span className="text-sm">Pubblica</span>
      </label>

      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Salvataggio…' : 'Salva'}</button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">Annulla</button>
        {isEdit && <button type="button" onClick={handleDelete} className="ml-auto text-xs text-red-400 hover:text-red-600 transition-colors">Elimina</button>}
      </div>
    </form>
  )
}
