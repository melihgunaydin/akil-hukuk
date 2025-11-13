import { client } from '@/lib/sanity.client'
import { aboutPageQuery, type AboutPage } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { absUrl, buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const aboutContent = (await client.fetch(aboutPageQuery).catch(() => null)) as AboutPage | null

  return buildMetadata({
    title: aboutContent?.heroTitle || 'Hakkımızda',
    description:
      aboutContent?.heroSubtitle ||
      'Akil Hukuk & Danışmanlık hakkında detaylı bilgi edinin.',
    path: '/hakkimizda',
    keywords: [
      'Akil Hukuk hakkında',
      'hukuk bürosu Samsun',
      'hukuk danışmanlığı',
      'Akil Hukuk vizyon',
      'Akil Hukuk misyon',
    ],
  })
}

const IconSvg = ({ icon, className }: { icon?: string; className?: string }) => {
  switch (icon) {
    case 'target':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <path d="M12 7v5l3 3" />
        </svg>
      )
    case 'eye':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'shield':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 12v6" />
        </svg>
      )
    case 'zap':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    case 'sparkles':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v4" />
          <path d="M12 17v4" />
          <path d="M5.2 5.2l2.8 2.8" />
          <path d="M16 16l2.8 2.8" />
          <path d="M3 12h4" />
          <path d="M17 12h4" />
          <path d="M5.2 18.8l2.8-2.8" />
          <path d="M16 8l2.8-2.8" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'balance':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v3" />
          <path d="M6 7l6 2 6-2" />
          <path d="M6 7l-3 7h6l-3-7Z" />
          <path d="M18 7l-3 7h6l-3-7Z" />
          <path d="M12 19a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3Z" />
        </svg>
      )
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      )
  }
}

export default async function AboutPage() {
  const aboutContent = (await client.fetch(aboutPageQuery).catch(() => null)) as AboutPage | null

  const heroTitle = aboutContent?.heroTitle || 'Hakkımızda'
  const heroSubtitle =
    aboutContent?.heroSubtitle ||
    'Adalet ve hukukun üstünlüğü ilkesiyle, müvekkillerimize en kaliteli hukuki hizmeti sunmak için buradayız.'

  const missionFallback = {
    variant: 'mission' as const,
    title: 'Misyonumuz',
    description:
      'Müvekkillerimizin haklarını korumak ve adaletin tecellisini sağlamak için deneyimli hukuk ekibimizle birlikte çalışıyoruz.',
    icon: 'target',
  }

  const visionFallback = {
    variant: 'vision' as const,
    title: 'Vizyonumuz',
    description:
      'Türkiye\'nin önde gelen hukuk bürolarından biri olmak ve hukuki danışmanlık alanında standartları yükselterek sektöre öncülük etmek.',
    icon: 'eye',
  }

  const missionVisionRaw = aboutContent?.missionVision ?? []
  const missionCard = missionVisionRaw.find((item) => item?.variant === 'mission') || missionFallback
  const visionCard = missionVisionRaw.find((item) => item?.variant === 'vision') || visionFallback
  const missionVisionCards = [missionCard, visionCard].filter(Boolean)

  const valuesFallback = [
    {
      title: 'Güvenilirlik',
      description: 'Müvekkillerimizle kurduğumuz güven ilişkisi bizim en değerli varlığımızdır.',
      icon: 'shield',
    },
    {
      title: 'Hız',
      description: 'Hızlı ve etkili çözümlerle müvekkillerimizin zamanını koruyoruz.',
      icon: 'zap',
    },
    {
      title: 'Yenilik',
      description: 'Hukuki teknolojileri takip ederek hizmet kalitemizi sürekli geliştiriyoruz.',
      icon: 'sparkles',
    },
  ]

  const values = (aboutContent?.values?.length ? aboutContent.values : valuesFallback).map((value) => ({
    title: value.title || 'Başlık',
    description: value.description || '',
    icon: value.icon,
  }))

  const practiceAreasTitle = aboutContent?.practiceAreasTitle || 'Hizmet Alanlarımız'
  const practiceAreas =
    aboutContent?.practiceAreas?.length
      ? aboutContent.practiceAreas
      : ['Ticaret Hukuku', 'İş Hukuku', 'Gayrimenkul Hukuku', 'Aile Hukuku', 'Ceza Hukuku', 'Vergi Hukuku']

  const portableBody = aboutContent?.body ?? []

  const ctaTitle =
    aboutContent?.ctaTitle || 'Hukuki Danışmanlığa İhtiyacınız mı Var?'
  const ctaDescription =
    aboutContent?.ctaDescription ||
    'Deneyimli hukuk ekibimizle iletişime geçin ve size en uygun çözümü bulalım.'
  const ctaButtonText = aboutContent?.ctaButtonText || 'İletişime Geçin'
  const ctaButtonLink = aboutContent?.ctaButtonLink || '/iletisim'

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: heroTitle,
    url: absUrl('/hakkimizda'),
    description: heroSubtitle,
    publisher: {
      '@type': 'LegalService',
      name: 'Akil Hukuk',
      url: absUrl('/'),
    },
  }

  const jsonLdSafe = JSON.parse(
    JSON.stringify(aboutJsonLd, (_key, value) => (value === undefined || value === null ? undefined : value)),
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{heroTitle}</h1>
            {heroSubtitle && (
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {missionVisionCards.map((card) => (
              <div key={card.title} className="bg-white p-8 rounded-2xl shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#0C2340]/10 rounded-lg flex items-center justify-center mr-4">
                    <IconSvg icon={card.icon || (card.variant === 'vision' ? 'eye' : 'target')} className="w-6 h-6 text-[#0C2340]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">{card.title}</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              {aboutContent?.valuesTitle || 'Değerlerimiz'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 bg-[#13467B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconSvg icon={value.icon} className="w-8 h-8 text-[#13467B]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  {value.description && <p className="text-gray-600 text-sm">{value.description}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Practice Areas */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">{practiceAreasTitle}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practiceAreas.map((area, index) => (
                <div key={`${area}-${index}`} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#0C2340] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rich Content */}
          {portableBody.length > 0 && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border">
              <div className="prose max-w-none">
                <PortableText value={portableBody} />
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {ctaTitle}
            </h2>
            {ctaDescription && <p className="text-gray-600 mb-8">{ctaDescription}</p>}
            <Link
              href={ctaButtonLink}
              className="inline-block bg-[#0C2340] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0C2340]/90 transition-colors"
            >
              {ctaButtonText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}


