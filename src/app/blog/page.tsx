import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity.client'
import { postListQuery, homepageSectionsQuery, type HomepageSection } from '@/lib/queries'
import { absUrl, buildMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'Blog - Akil Hukuk',
  description: 'Akil Hukuk Blog\'da iş, aile ve ticaret hukuku alanlarında güncel yasal gelişmeleri ve uzman analizlerini okuyun.',
  path: '/blog',
  keywords: [
    'Akil Hukuk blog',
    'hukuki makaleler',
    'Samsun hukuk blogu',
    'iş hukuku yazıları',
    'aile hukuku rehberi',
  ],
})

export default async function Blog() {
  const [posts, homepageSections] = await Promise.all([
    client.fetch(postListQuery),
    client.fetch(homepageSectionsQuery)
  ])
  
  const blogSection = homepageSections?.find((section: HomepageSection) => section.sectionType === 'blog')

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: blogSection?.title || 'Akil Hukuk Blog',
    url: absUrl('/blog'),
    description:
      blogSection?.subtitle ||
      "Akil Hukuk & Danışmanlık blogunda güncel hukuki gelişmeleri ve yorumları okuyun.",
    publisher: {
      '@type': 'LegalService',
      name: 'Akil Hukuk',
    },
  }

  const schemaSafe = JSON.parse(
    JSON.stringify(blogJsonLd, (_key, value) => (value === undefined || value === null ? undefined : value)),
  )

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaSafe) }}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0C2340] to-[#1a3a5c] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{blogSection?.title || "Blog"}</h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              {blogSection?.subtitle || "Hukuki gelişmeler, uzman analizler ve pratik bilgiler. Güncel hukuk dünyasından haberler."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post: any) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border bg-white overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
            >
              {post.coverUrl ? (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.coverUrl}
                    alt={post.title || 'Blog kapak görseli'}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-[#0C2340]/10 to-[#0C2340]/5 group-hover:from-[#0C2340]/20 group-hover:to-[#0C2340]/10 transition-all duration-300 flex items-center justify-center">
                  <div className="text-[#0C2340]/60 text-sm font-medium">Blog Görseli</div>
                </div>
              )}
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-[#0C2340] transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-4 inline-flex items-center text-sm font-medium text-[#0C2340] group-hover:text-[#0C2340]/80 transition-colors">
                  Devamını Oku
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