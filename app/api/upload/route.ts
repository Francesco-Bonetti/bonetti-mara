import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'
import { getAdminFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!await getAdminFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const folder = (formData.get('folder') as string) || 'paintings'

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const result = await uploadImage(buffer, folder)

  return NextResponse.json(result)
}
