import { client } from '@/lib/sanity.client'
import { pageBySlugQuery } from '@/lib/queries'
import { absUrl, buildMetadata } from '@/lib/seo'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  const page = await client.fetch(pageBySlugQuery, { slug })
  return buildMetadata({
    title: page?.title,
    description: page?.seoDescription,
    path: `/${slug}`,
    image: page?.seoImageUrl || null,
    keywords: [page?.title, 'Akil Hukuk', 'hukuki danışmanlık'].filter(
      (item): item is string => Boolean(item)
    ),
  })
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const page = await client.fetch(pageBySlugQuery, { slug })
  if (!page) return notFound()

  const genericPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    url: absUrl(`/${slug}`),
    description: page.seoDescription,
  }
  const jsonLdSafe = JSON.parse(
    JSON.stringify(genericPageJsonLd, (_key, value) => (value === undefined || value === null ? undefined : value))
  )
  // Diğer sayfalar için varsayılan tasarım
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSafe) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-16">
    <article className="prose max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{page.title}</h1>
          <div className="bg-white p-8 rounded-2xl shadow-sm border">
      <PortableText value={page.content} />
          </div>
    </article>
      </div>
    </div>
  )
}
