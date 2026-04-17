import Image from 'next/image'
import Link from 'next/link'
import { query } from '@/lib/db'
import LikeButton from '@/components/LikeButton'

export const dynamic = 'force-dynamic'

interface Painting {
  id: string
  title_it: string
  title_en: string
  short_desc_it: string
  short_desc_en: string
  image_url: string
  thumb_url: string
  like_count: number
}

async function getPaintings(): Promise<Painting[]> {
  try {
    return await query<Painting>(`
      SELECT p.id, p.title_it, p.title_en, p.short_desc_it, p.short_desc_en,
             p.image_url, p.thumb_url,
             COUNT(pl.id) as like_count
      FROM paintings p
      LEFT JOIN painting_likes pl ON pl.painting_id = p.id
      WHERE p.published = 1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `)
  } catch {
    return []
  }
}

const copy = {
  it: {
    eyebrow: 'Portfolio · 2026',
    heroLine1: 'Paesaggi',
    heroLine2: 'a inchiostro.',
    heroSub: "Acqua, nebbia, alberi. Ciò che resta quando il rumore si ritira.",
    worksEyebrow: 'Le opere',
    worksTitle: 'Una scelta di quadri recenti',
    worksIntro: "Ogni quadro è un pezzo unico, realizzato a mano su carta o tela. Per richieste sulla disponibilità o sull'acquisto, contattare direttamente l'artista.",
    aboutEyebrow: "Sull'artista",
    aboutTitle: 'Mara Bonetti',
    aboutBody: "Mara Bonetti dipinge paesaggi a inchiostro e acquarello, sospesi tra figurazione e astrazione. La sua ricerca si muove attorno a poche costanti — l'acqua, la linea dell'orizzonte, il silenzio di un bosco sul far della sera — restituite con una gestualità asciutta e una palette volutamente ridotta al nero e alle sue sfumature.",
    aboutBody2: "Nasce e lavora in Italia. Le sue opere sono tutte originali, realizzate a mano e firmate.",
    emptyState: 'Le opere saranno disponibili a breve.',
    readBlog: 'Leggi il blog',
    contactEyebrow: 'Contatti',
    contactLine: "Per informazioni o richieste di acquisto:",
  },
  en: {
    eyebrow: 'Portfolio · 2026',
    heroLine1: 'Landscapes',
    heroLine2: 'in ink.',
    heroSub: 'Water, mist, trees. What remains when the noise withdraws.',
    worksEyebrow: 'Works',
    worksTitle: 'A selection of recent paintings',
    worksIntro: 'Each painting is a unique piece, made by hand on paper or canvas. For availability or purchase enquiries, please contact the artist directly.',
    aboutEyebrow: 'About the artist',
    aboutTitle: 'Mara Bonetti',
    aboutBody: 'Mara Bonetti paints ink and watercolour landscapes, suspended between figuration and abstraction. Her work revolves around a few constants — water, the line of the horizon, the silence of a forest at dusk — rendered with a spare gesture and a palette intentionally reduced to black and its shades.',
    aboutBody2: 'She was born and works in Italy. Her works are all originals, made by hand and signed.',
    emptyState: 'Works coming soon.',
    readBlog: 'Read the journal',
    contactEyebrow: 'Contact',
    contactLine: 'For information or purchase enquiries:',
  },
} as const

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const paintings = await getPaintings()
  const t = copy[locale as 'it' | 'en'] ?? copy.it

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-10 pt-14 md:pt-28 pb-16 md:pb-28">
          <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-end">
            <div className="md:col-span-7 animate-fadeUp">
              <p className="eyebrow mb-6 md:mb-8">{t.eyebrow}</p>
              <h1 className="font-serif font-light text-[clamp(2.75rem,11vw,8rem)] leading-[0.95] tracking-tight text-balance">
                {t.heroLine1}<br />
                <span className="italic text-stone">{t.heroLine2}</span>
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 animate-fadeUp" style={{ animationDelay: '0.15s' }}>
              <div className="rule mb-5 md:mb-6" />
              <p className="font-serif italic text-lg md:text-2xl leading-snug text-ink/80 text-pretty">
                {t.heroSub}
              </p>
            </div>
          </div>
        </div>

        {/* Decorazione: linea d'orizzonte sottile */}
        <div className="absolute left-0 right-0 bottom-0 h-px bg-ink/10" />
      </section>

      {/* ---------- GALLERIA ---------- */}
      <section id="opere" className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10 mb-12 md:mb-20">
          <div className="md:col-span-5">
            <p className="eyebrow mb-4 md:mb-5">{t.worksEyebrow}</p>
            <h2 className="font-serif text-[2rem] md:text-5xl leading-tight text-balance">{t.worksTitle}</h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 self-end">
            <p className="text-[15px] leading-relaxed text-ink/70 text-pretty">{t.worksIntro}</p>
          </div>
        </div>

        {paintings.length === 0 ? (
          <div className="py-24 text-center">
            <p className="eyebrow">{t.emptyState}</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 md:gap-10">
            {paintings.map((p) => {
              const title = locale === 'it' ? p.title_it : p.title_en
              const shortDesc = locale === 'it' ? p.short_desc_it : p.short_desc_en

              return (
                <div key={p.id} className="painting-card group break-inside-avoid mb-8 sm:mb-10 md:mb-14">
                  <Link href={`/${locale}/quadri/${p.id}`} className="block">
                    <div className="painting-frame">
                      <Image
                        src={p.thumb_url || p.image_url}
                        alt={title}
                        width={0}
                        height={0}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-auto block transition-transform duration-[1200ms] ease-out group-hover:scale-[1.015]"
                      />
                    </div>
                  </Link>
                  <div className="flex items-start justify-between gap-4 mt-5">
                    <Link href={`/${locale}/quadri/${p.id}`} className="min-w-0 block hover:opacity-70 transition-opacity">
                      <h3 className="font-serif text-xl md:text-2xl leading-snug">{title}</h3>
                      {shortDesc && (
                        <p className="text-[12px] tracking-[0.18em] uppercase text-stone mt-1.5">{shortDesc}</p>
                      )}
                    </Link>
                    <div className="shrink-0 pt-1.5">
                      <LikeButton paintingId={p.id} initialCount={Number(p.like_count)} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ---------- SULL'ARTISTA ---------- */}
      <section id="artista" className="border-t border-ink/10 bg-wash/40">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28">
          <div className="grid md:grid-cols-12 gap-8 md:gap-16">
            <div className="md:col-span-5">
              <p className="eyebrow mb-4 md:mb-5">{t.aboutEyebrow}</p>
              <h2 className="font-serif text-[2.5rem] md:text-6xl leading-[1.05] italic">{t.aboutTitle}</h2>
            </div>
            <div className="md:col-span-6 md:col-start-7 space-y-5 md:space-y-6">
              <p className="font-serif text-[17px] md:text-xl leading-[1.75] md:leading-[1.8] text-ink/85 text-pretty">
                {t.aboutBody}
              </p>
              <p className="text-[15px] leading-relaxed text-ink/60 text-pretty">
                {t.aboutBody2}
              </p>
              <div className="pt-2 md:pt-4">
                <Link href={`/${locale}/blog`} className="btn-ghost">
                  {t.readBlog}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
