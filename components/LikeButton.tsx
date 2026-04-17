'use client'
import { useState, useEffect } from 'react'

interface LikeButtonProps {
  paintingId: string
  initialCount: number
}

export default function LikeButton({ paintingId, initialCount }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  // Get or create session ID
  function getSessionId(): string {
    let id = localStorage.getItem('mb_session_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('mb_session_id', id)
    }
    return id
  }

  useEffect(() => {
    const likedPaintings = JSON.parse(localStorage.getItem('mb_liked') ?? '[]') as string[]
    setLiked(likedPaintings.includes(paintingId))
  }, [paintingId])

  async function handleLike() {
    if (loading) return
    setLoading(true)
    const sessionId = getSessionId()

    try {
      const res = await fetch(`/api/paintings/${paintingId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      const data = await res.json() as { liked: boolean; count: number }

      setCount(data.count)
      setLiked(data.liked)

      // Update localStorage
      const likedPaintings = JSON.parse(localStorage.getItem('mb_liked') ?? '[]') as string[]
      if (data.liked) {
        localStorage.setItem('mb_liked', JSON.stringify([...likedPaintings, paintingId]))
      } else {
        localStorage.setItem('mb_liked', JSON.stringify(likedPaintings.filter((id) => id !== paintingId)))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-2 group transition-opacity hover:opacity-70"
      aria-label="Mi piace"
    >
      <span className={`text-xl transition-transform group-active:scale-125 ${liked ? 'text-ink' : 'text-ink/30'}`}>
        {liked ? '♥' : '♡'}
      </span>
      <span className="text-sm tabular-nums text-ink/60">{count}</span>
    </button>
  )
}
