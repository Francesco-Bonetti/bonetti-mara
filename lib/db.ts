// Cloudflare D1 REST API wrapper

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const CF_DB_ID = process.env.CLOUDFLARE_D1_DB_ID!
const CF_API_KEY = process.env.CLOUDFLARE_API_KEY!
const CF_EMAIL = process.env.CLOUDFLARE_EMAIL!

const D1_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_DB_ID}/query`

interface D1Result<T = Record<string, unknown>> {
  results: T[]
  success: boolean
  meta: { duration: number; rows_read: number; rows_written: number }
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<T[]> {
  const res = await fetch(D1_URL, {
    method: 'POST',
    headers: {
      'X-Auth-Email': CF_EMAIL,
      'X-Auth-Key': CF_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`D1 HTTP error: ${res.status}`)
  }

  const data = (await res.json()) as { success: boolean; errors: unknown[]; result: D1Result<T>[] }

  if (!data.success) {
    throw new Error(`D1 query error: ${JSON.stringify(data.errors)}`)
  }

  return data.result[0]?.results ?? []
}

export async function run(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<{ meta: { rows_written: number } }> {
  const res = await fetch(D1_URL, {
    method: 'POST',
    headers: {
      'X-Auth-Email': CF_EMAIL,
      'X-Auth-Key': CF_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`D1 HTTP error: ${res.status}`)
  const data = await res.json() as { success: boolean; errors: unknown[]; result: D1Result[] }
  if (!data.success) throw new Error(`D1 run error: ${JSON.stringify(data.errors)}`)
  return { meta: data.result[0]?.meta ?? { rows_written: 0 } }
}
