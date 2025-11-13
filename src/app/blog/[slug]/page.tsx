import { client } from '@/lib/sanity.client'
import { postBySlugQuery } from '@/lib/queries'
import { absUrl, buildMetadata } from '@/lib/seo'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

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

type RelatedPost = {
  title?: string
  slug?: string
  publishedAt?: string
}

type Author = {
  name?: string
  role?: string
  photoUrl?: string
  slug?: string
}

type BlogPost = {
  title?: string
  excerpt?: string
  content?: PortableTextBlock[]
  publishedAt?: string
  coverUrl?: string
  seoImageUrl?: string
  seoDescription?: string
  author?: Author
  relatedPosts?: RelatedPost[]
}

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post: BlogPost | null = await client.fetch(postBySlugQuery, { slug }).catch(() => null)
  const description =
    post?.seoDescription ||
    post?.excerpt ||
    'Akil Hukuk blogunda güncel hukuki gelişmeleri ve uzman yorumlarını keşfedin.'
  const keywords = [
    post?.title,
    post?.author?.name,
    'hukuk blogu',
    'Akil Hukuk',
    'Samsun avukat',
    'hukuki danışmanlık',
  ].filter((item): item is string => Boolean(item))

  return buildMetadata({
    title: post?.title,
    description,
    path: `/blog/${slug}`,
    image: post?.seoImageUrl || post?.coverUrl || null,
    keywords,
    ogType: 'article',
    publishedTime: post?.publishedAt,
    modifiedTime: post?.publishedAt,
    authors: post?.author?.name ? [post.author.name] : undefined,
  })
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post: BlogPost | null = await client.fetch(postBySlugQuery, { slug }).catch(() => null)
  if (!post) return notFound()

  const relatedPosts =
    post.relatedPosts
      ?.filter(
        (related): related is RelatedPost & { slug: string } =>
          Boolean(related?.slug) && related?.slug !== slug
      )
      .slice(0, 3) ?? []
  const authorPhotoUrl = post.author?.photoUrl
  
  const articleUrl = absUrl(`/blog/${slug}`)
  const authorUrl = post.author?.slug ? absUrl(`/calisanlar/${post.author.slug}`) : undefined
  const primaryImage = post.seoImageUrl || post.coverUrl || undefined
  const keywords = [
    post.title,
    post.author?.name,
    'hukuk blogu',
    'Akil Hukuk',
    'Samsun avukat',
  ].filter((item): item is string => Boolean(item))

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: primaryImage ? [primaryImage] : undefined,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    author: post.author?.name
      ? {
          '@type': 'Person',
          name: post.author.name,
          url: authorUrl,
        }
      : {
          '@type': 'Organization',
          name: 'Akil Hukuk',
          url: absUrl('/'),
        },
    publisher: {
      '@type': 'LegalService',
      name: 'Akil Hukuk',
      logo: {
        '@type': 'ImageObject',
        url: absUrl('/logo.svg'),
      },
    },
    keywords: keywords.length > 0 ? keywords : undefined,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ana Sayfa',
        item: absUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: absUrl('/blog'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title ?? 'Blog Yazısı',
        item: articleUrl,
      },
    ],
  }

  const jsonLdSchemas = [articleJsonLd, breadcrumbJsonLd].map((schema) =>
    JSON.parse(JSON.stringify(schema, (_key, value) => (value === undefined || value === null ? undefined : value)))
  )

  return (
    <div className="bg-white">
      {jsonLdSchemas.map((schema, index) => (
        <script
          key={`blogpost-jsonld-${index}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0C2340] to-[#1a3a5c] text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            {/* Breadcrumb */}
            <nav className="flex justify-center mb-6">
              <ol className="flex items-center space-x-2 text-sm text-white/80">
                <li><Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
                <li className="text-white/60">/</li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li className="text-white/60">/</li>
                <li className="text-white/60">{post.title}</li>
              </ol>
            </nav>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/80">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Tarih güncelleniyor'}
                </span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>5 dk okuma</span>
              </div>
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-white/80 mt-6 max-w-3xl mx-auto">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverUrl && (
        <section className="py-0">
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative -mt-8 mb-16">
              <Image 
                src={post.coverUrl} 
                alt={post.title ?? 'Blog kapak görseli'}
                width={1200}
                height={600}
                className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Article Content */}
            <article className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#0C2340] prose-strong:text-gray-900">
                  {post.content ? (
                    <PortableText value={post.content} />
                  ) : (
                    <p className="text-gray-500">İçerik bulunamadı.</p>
                  )}
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Author Info */}
                {post.author?.name && post.author.slug && (
                  <Link
                    href={`/calisanlar/${post.author.slug}`}
                    className="block bg-white rounded-xl shadow-sm border p-5 hover:border-[#0C2340] transition-colors"
                  >
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Yazar</h3>
                    <div className="flex items-center">
                      {authorPhotoUrl ? (
                        <Image
                          src={authorPhotoUrl}
                          alt={post.author?.name ?? 'Yazar görseli'}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-[#0C2340] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {(post.author?.name ?? '')
                            .split(' ')
                            .map((part) => part[0]?.toUpperCase())
                            .join('')
                            .slice(0, 2) || 'AK'}
                        </div>
                      )}
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 text-sm">
                          {post.author?.name || 'Akil Hukuk'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {post.author?.role || 'Hukuk Uzmanları'}
                        </p>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">İlgili Yazılar</h3>
                    <div className="space-y-3">
                      {relatedPosts.map((related: RelatedPost & { slug: string }) => (
                        <Link key={related.slug} href={`/blog/${related.slug}`} className="block group">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-[#0C2340] transition-colors line-clamp-2">
                            {related.title}
                          </div>
                          {related.publishedAt && (
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(related.publishedAt).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Back to Blog */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-[#0C2340] hover:text-[#0C2340]/80 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Tüm Blog Yazılarına Dön
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}