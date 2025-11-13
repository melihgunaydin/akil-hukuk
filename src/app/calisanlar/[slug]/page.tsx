import { client } from "@/lib/sanity.client"
import { personBySlugQuery } from "@/lib/queries"
import { absUrl, buildMetadata } from "@/lib/seo"
import { PortableText } from "@portabletext/react"
import { notFound } from "next/navigation"
import Link from "next/link"

type PortableTextChild = {
  _key: string
  _type: string
  text?: string
  [key: string]: unknown
}

type PortableTextBlock = {
  _key: string
  _type: string
  children?: PortableTextChild[]
  [key: string]: unknown
}

export const revalidate = 60

const portableTextToPlain = (blocks?: PortableTextBlock[] | null) => {
  if (!Array.isArray(blocks)) return ""
  return blocks
    .map((block) =>
      Array.isArray((block as any)?.children)
        ? (block as any).children.map((child: any) => child?.text ?? "").join(" ").trim()
        : "",
    )
    .filter(Boolean)
    .join(" ")
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const person = await client.fetch(personBySlugQuery, { slug }).catch(() => null)
  const bioText = portableTextToPlain(person?.bio)
  const description =
    person?.role && bioText
      ? `${person.name} - ${person.role}. ${bioText.slice(0, 140)}`
      : person?.role
        ? `${person?.name ?? "Ekibimiz"} - ${person.role}`
        : `${person?.name ?? "Akil Hukuk"} uzman ekibiyle tanışın.`
  const keywords = [
    person?.name,
    person?.role,
    "Akil Hukuk",
    "Samsun avukat",
    "hukuk danışmanlığı",
  ].filter((item): item is string => Boolean(item))

  return buildMetadata({
    title: `${person?.name} - Akil Hukuk`,
    description,
    path: `/calisanlar/${slug}`,
    image: person?.photoUrl || null,
    keywords,
    ogType: "profile",
  })
}

export default async function PersonDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const person = await client.fetch(personBySlugQuery, { slug }).catch(() => null)

  if (!person) return notFound()

  const profileUrl = absUrl(`/calisanlar/${slug}`)
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    image: person.photoUrl ?? undefined,
    url: profileUrl,
    email: person.email ?? undefined,
    telephone: person.phone ?? undefined,
    worksFor: {
      "@type": "LegalService",
      name: "Akil Hukuk",
      url: absUrl("/"),
    },
  }

  const jsonLdSafe = JSON.parse(
    JSON.stringify(personJsonLd, (_key, value) => (value === undefined || value === null ? undefined : value)),
  )

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSafe) }}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0C2340] to-[#1a3a5c] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            {/* Breadcrumb */}
            <nav className="flex justify-center mb-6">
              <ol className="flex items-center space-x-2 text-sm text-white/80">
                <li><Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
                <li className="text-white/60">/</li>
                <li><Link href="/calisanlar" className="hover:text-white transition-colors">Çalışma Arkadaşlarımız</Link></li>
                <li className="text-white/60">/</li>
                <li className="text-white/60">{person.name}</li>
              </ol>
            </nav>

            {/* Profile Photo */}
            {person.photoUrl && (
              <div className="mb-6">
                <img 
                  src={person.photoUrl} 
                  alt={person.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/20 shadow-2xl"
                />
              </div>
            )}

            {/* Name and Role */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {person.name}
            </h1>
            {person.role && (
              <p className="text-xl text-white/80 mb-6">
                {person.role}
              </p>
            )}

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/80">
              {person.email && (
                <a 
                  href={`mailto:${person.email}`}
                  className="flex items-center hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {person.email}
                </a>
              )}
              {person.phone && (
                <a 
                  href={`tel:${person.phone}`}
                  className="flex items-center hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {person.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <article className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hakkında</h2>
                {person.bio && (
                  <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#0C2340] prose-strong:text-gray-900">
                    <PortableText value={person.bio} />
                  </div>
                )}
              </div>
          </article>
        </div>
      </section>

    </div>
  )
}