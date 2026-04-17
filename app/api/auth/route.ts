import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signAdminToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json() as { email: string; password: string }

  const adminEmail = process.env.ADMIN_EMAIL!
  const adminHash = process.env.ADMIN_PASSWORD_HASH!

  if (email !== adminEmail) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, adminHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await signAdminToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return res
}
