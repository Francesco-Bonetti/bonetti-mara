'use client'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'

interface Comment {
  id: string; author_name: string; content: string; created_at: string
}

interface CommentSectionProps {
  articleSlug: string
  comments: Comment[]
  locale: string
}

export default function CommentSection({ articleSlug, comments: initialComments, locale }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/articles/${articleSlug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: name, content: text }),
      })
      if (res.ok) {
        const newComment = await res.json() as Comment
        setComments((prev) => [...prev, newComment])
        setName('')
        setText('')
        setSent(true)
        setTimeout(() => setSent(false), 3000)
      }
    } finally {
      setLoading(false)
    }
  }

  const t = {
    comments: locale === 'it' ? 'Commenti' : 'Comments',
    noComments: locale === 'it' ? 'Nessun commento ancora. Sii il primo!' : 'No comments yet. Be the first!',
    leaveComment: locale === 'it' ? 'Lascia un commento' : 'Leave a comment',
    name: locale === 'it' ? 'Il tuo nome' : 'Your name',
    comment: locale === 'it' ? 'Il tuo commento' : 'Your comment',
    send: locale === 'it' ? 'Invia' : 'Send',
    thanks: locale === 'it' ? 'Commento inviato!' : 'Comment sent!',
  }

  return (
    <div>
      <h2 className="font-serif text-2xl mb-8">{t.comments}</h2>

      {comments.length === 0 ? (
        <p className="text-sm text-ink/30 mb-12">{t.noComments}</p>
      ) : (
        <div className="space-y-8 mb-16">
          {comments.map((c) => (
            <div key={c.id} className="border-l-2 border-ink/10 pl-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm font-medium">{c.author_name}</span>
                <span className="text-xs text-ink/30">{formatDate(c.created_at, locale)}</span>
              </div>
              <p className="text-sm leading-relaxed text-ink/70">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      <h3 className="font-serif text-xl mb-6">{t.leaveComment}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="admin-label">{t.name}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
            maxLength={80}
          />
        </div>
        <div>
          <label className="admin-label">{t.comment}</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-field resize-none"
            rows={4}
            required
            maxLength={1000}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {sent ? t.thanks : loading ? '…' : t.send}
        </button>
      </form>
    </div>
  )
}
