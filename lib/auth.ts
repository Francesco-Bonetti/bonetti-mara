import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const COOKIE_NAME = 'admin_token'

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function getAdminFromCookies(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifyAdminToken(token)
}

export async function getAdminFromRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifyAdminToken(token)
}

export { COOKIE_NAME }
