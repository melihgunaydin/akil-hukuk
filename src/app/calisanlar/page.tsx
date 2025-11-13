import Link from 'next/link'
import { client } from '@/lib/sanity.client'
import { peopleQuery, homepageSectionsQuery, type HomepageSection } from '@/lib/queries'
import { absUrl, buildMetadata } from '@/lib/seo'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'Çalışma Arkadaşlarımız - Akil Hukuk',
  description: 'Akil Hukuk ekibimizi tanıyın. Deneyimli avukatlarımız ve uzmanlık alanları hakkında bilgi edinin.',
  path: '/calisanlar',
  keywords: [
    'Akil Hukuk ekip',
    'Samsun avukat kadrosu',
    'hukuk danışmanı',
    'deneyimli avukatlar',
  ],
})

export default async function Calisanlar() {
  const [people, homepageSections] = await Promise.all([
    client.fetch(peopleQuery),
    client.fetch(homepageSectionsQuery)
  ])
  
  const teamSection = homepageSections?.find((section: HomepageSection) => section.sectionType === 'team')

  const teamJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: teamSection?.title || 'Akil Hukuk Ekibi',
    itemListElement: (people ?? []).map((person: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: person.name,
      url: person.slug ? absUrl(`/calisanlar/${person.slug}`) : undefined,
    })),
  }

  const jsonLdSafe = JSON.parse(
    JSON.stringify(teamJsonLd, (_key, value) => (value === undefined || value === null ? undefined : value)),
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{teamSection?.title || "Çalışma Arkadaşlarımız"}</h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              {teamSection?.subtitle || "Deneyimli ve uzman ekibimizle tanışın. Her biri kendi alanında uzmanlaşmış avukatlarımız."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {people?.map((person: any) => (
            <Link 
              key={person.slug} 
              href={`/calisanlar/${person.slug}`} 
              className="group rounded-2xl border bg-white overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {person.photoUrl && (
                <img 
                  src={person.photoUrl} 
                  alt={person.name} 
                  className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-[#0C2340] transition-colors">
                  {person.name}
                </h2>
                <p className="text-[#0C2340] font-medium mt-1">{person.role}</p>
                {person.bio && (
                  <div className="text-gray-600 text-sm mt-3 line-clamp-3">
                    <PortableText value={person.bio} />
                  </div>
                )}
                <div className="mt-4 flex items-center text-sm font-medium text-[#0C2340] group-hover:text-[#0C2340]/80">
                  Profili Gör
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>
    </div>
  )
}