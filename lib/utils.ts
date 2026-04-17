import slugify from 'slugify'

export function createSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, locale: 'it' })
}

export function formatDate(dateStr: string, locale: string = 'it'): string {
  return new Date(dateStr).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '…'
}
