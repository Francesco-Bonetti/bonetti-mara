'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      router.push('/admin/quadri')
    } else {
      setError('Credenziali non valide')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl mb-12 text-center">Mara Bonetti</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="admin-label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="admin-label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
            {loading ? '…' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}
