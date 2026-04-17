'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface PaintingData {
  id?: string
  title_it?: string; title_en?: string
  short_desc_it?: string; short_desc_en?: string
  long_desc_it?: string; long_desc_en?: string
  image_url?: string; thumb_url?: string
  published?: boolean
}

export default function PaintingForm({ initial }: { initial?: PaintingData }) {
  const router = useRouter()
  const isEdit = !!initial?.id
  const fileRef = useRef<HTMLInputElement>(null)

  const [titleIt, setTitleIt] = useState(initial?.title_it ?? '')
  const [titleEn, setTitleEn] = useState(initial?.title_en ?? '')
  const [shortIt, setShortIt] = useState(initial?.short_desc_it ?? '')
  const [shortEn, setShortEn] = useState(initial?.short_desc_en ?? '')
  const [longIt, setLongIt] = useState(initial?.long_desc_it ?? '')
  const [longEn, setLongEn] = useState(initial?.long_desc_en ?? '')
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? '')
  const [thumbUrl, setThumbUrl] = useState(initial?.thumb_url ?? '')
  const [published, setPublished] = useState(initial?.published ?? false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('folder', 'paintings')
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    if (res.ok) {
      const data = await res.json() as { url: string; thumbUrl: string }
      setImageUrl(data.url)
      setThumbUrl(data.thumbUrl)
    }
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!imageUrl) { setError('Carica un\'immagine prima di salvare'); return }
    setSaving(true)
    setError('')

    const payload = { titleIt, titleEn, shortDescIt: shortIt, shortDescEn: shortEn, longDescIt: longIt, longDescEn: longEn, imageUrl, thumbUrl, published }

    const url = isEdit ? `/api/admin/paintings/${initial!.id}` : '/api/admin/paintings'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

    if (res.ok) {
      router.push('/admin/quadri')
      router.refresh()
    } else {
      setError('Errore nel salvataggio')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Eliminare questo quadro?')) return
    await fetch(`/api/admin/paintings/${initial!.id}`, { method: 'DELETE' })
    router.push('/admin/quadri')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Image upload */}
      <div>
        <label className="admin-label">Immagine</label>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        {imageUrl ? (
          <div className="flex items-start gap-6">
            <div className="relative w-32 h-40 painting-frame overflow-hidden">
              <Image src={thumbUrl || imageUrl} alt="preview" fill className="object-cover" />
            </div>
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost text-xs">
              {uploading ? 'Caricamento…' : 'Cambia immagine'}
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost w-full py-12 text-sm text-ink/40">
            {uploading ? 'Caricamento…' : '+ Carica immagine'}
          </button>
        )}
      </div>

      {/* Titles */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Titolo italiano</label>
          <input value={titleIt} onChange={(e) => setTitleIt(e.target.value)} className="input-field" required />
        </div>
        <div>
          <label className="admin-label">Titolo inglese</label>
          <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="input-field" required />
        </div>
      </div>

      {/* Short desc */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Riga breve (IT) — max 80 char</label>
          <input value={shortIt} onChange={(e) => setShortIt(e.target.value)} className="input-field" maxLength={80} required />
        </div>
        <div>
          <label className="admin-label">Riga breve (EN)</label>
          <input value={shortEn} onChange={(e) => setShortEn(e.target.value)} className="input-field" maxLength={80} required />
        </div>
      </div>

      {/* Long desc */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Descrizione lunga (IT)</label>
          <textarea value={longIt} onChange={(e) => setLongIt(e.target.value)} className="input-field resize-none" rows={6} />
        </div>
        <div>
          <label className="admin-label">Descrizione lunga (EN)</label>
          <textarea value={longEn} onChange={(e) => setLongEn(e.target.value)} className="input-field resize-none" rows={6} />
        </div>
      </div>

      {/* Published */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-4 h-4" />
        <span className="text-sm">Pubblica</span>
      </label>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-4">
        <button type="submit" disabled={saving || uploading} className="btn-primary">
          {saving ? 'Salvataggio…' : 'Salva'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">Annulla</button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className="ml-auto text-xs text-red-400 hover:text-red-600 transition-colors">
            Elimina
          </button>
        )}
      </div>
    </form>
  )
}
