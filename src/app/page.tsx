// src/app/page.tsx
import { client } from '@/lib/sanity.client'
import { postListQuery, homepageSectionsQuery, type HomepageSection } from '@/lib/queries'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'
import HeroCarousel from '@/components/HeroCarousel'

type AboutCard = {
  _key?: string
  title?: string
  description?: string
}

type AboutSectionData = HomepageSection & {
  cards?: AboutCard[]
  values?: AboutCard[]
}

type SectionThemeVariant = {
  about: {
    wrapper: string
    heading: string
    primaryText: string
    secondaryText: string
    button: string
    card: string
    cardHeading: string
    cardText: string
    valueContainer: string
    valueCard: string
    valueHeading: string
    valueText: string
  }
  blog: {
    wrapper: string
    heading: string
    button: string
    card: string
    cardHeading: string
    cardText: string
    cardMeta: string
    cardLink: string
  }
  team: {
    wrapper: string
    heading: string
    text: string
    button: string
  }
  cta: {
    wrapper: string
    heading: string
    text: string
    button: string
  }
}

const sectionThemes: SectionThemeVariant[] = [
  {
    about: {
      wrapper: 'bg-white text-gray-900',
      heading: 'text-gray-900',
      primaryText: 'text-gray-600',
      secondaryText: 'text-gray-700',
      button: 'bg-[#13467B] text-white hover:bg-[#0C2340]',
      card: 'bg-white border border-gray-200 text-gray-900',
      cardHeading: 'text-gray-900',
      cardText: 'text-gray-600',
      valueContainer: 'bg-[#F5F5F5] border border-gray-200 text-gray-900',
      valueCard: 'bg-white',
      valueHeading: 'text-[#13467B]',
      valueText: 'text-gray-600'
    },
    blog: {
      wrapper: 'bg-white text-gray-900',
      heading: 'text-gray-900',
      button: 'bg-[#13467B] text-white hover:bg-[#0C2340]',
      card: 'border border-gray-200 bg-white text-gray-900',
      cardHeading: 'text-gray-900 group-hover:text-[#0C2340]',
      cardText: 'text-gray-700',
      cardMeta: 'text-gray-500',
      cardLink: 'text-[#13467B] group-hover:text-[#0C2340]'
    },
    team: {
      wrapper: 'bg-white text-gray-900',
      heading: 'text-gray-900',
      text: 'text-gray-700',
      button: 'bg-[#13467B] text-white hover:bg-[#0C2340]'
    },
    cta: {
      wrapper: 'bg-white text-gray-900',
      heading: 'text-gray-900',
      text: 'text-gray-700',
      button: 'bg-[#13467B] text-white hover:bg-[#0C2340]'
    }
  },
  {
    about: {
      wrapper: 'bg-gradient-to-b from-[#0C2340] to-[#13467B] text-white',
      heading: 'text-white',
      primaryText: 'text-white/80',
      secondaryText: 'text-white/80',
      button: 'bg-white text-[#0C2340] hover:bg-white/90',
      card: 'bg-white/10 border border-white/10 text-white',
      cardHeading: 'text-white',
      cardText: 'text-white/80',
      valueContainer: 'bg-white/10 border border-white/10 text-white',
      valueCard: 'bg-white/10',
      valueHeading: 'text-white',
      valueText: 'text-white/70'
    },
    blog: {
      wrapper: 'bg-gradient-to-b from-[#0C2340] to-[#13467B] text-white',
      heading: 'text-white',
      button: 'bg-white text-[#0C2340] hover:bg-white/90',
      card: 'border border-white/20 bg-white/10 text-white',
      cardHeading: 'text-white group-hover:text-white',
      cardText: 'text-white/80',
      cardMeta: 'text-white/70',
      cardLink: 'text-white group-hover:text-white/80'
    },
    team: {
      wrapper: 'bg-gradient-to-b from-[#0C2340] to-[#13467B] text-white',
      heading: 'text-white',
      text: 'text-white/80',
      button: 'bg-white text-[#0C2340] hover:bg-white/90'
    },
    cta: {
      wrapper: 'bg-gradient-to-b from-[#0C2340] to-[#13467B] text-white',
      heading: 'text-white',
      text: 'text-white/80',
      button: 'bg-white text-[#0C2340] hover:bg-white/90'
    }
  }
]

type RenderSection =
  | { type: 'hero'; data: HomepageSection[] }
  | { type: 'about'; data: AboutSectionData }
  | { type: 'blog'; data: HomepageSection }
  | { type: 'team'; data: HomepageSection }
  | { type: 'cta'; data: HomepageSection }

export const revalidate = 60

export const metadata: Metadata = buildMetadata({
  title: 'Akil Hukuk - Ana Sayfa',
  description: 'Akil Hukuk & Danışmanlık - Profesyonel hukuki hizmetler, deneyimli avukatlar ve güvenilir danışmanlık.',
  path: '/',
  keywords: [
    'Akil Hukuk',
    'Samsun avukat',
    'hukuki danışmanlık',
    'iş hukuku',
    'aile hukuku',
    'ticaret hukuku',
  ],
})

export default async function Home() {
  const [posts, homepageSections] = await Promise.all([
    client.fetch(postListQuery),
    client.fetch(homepageSectionsQuery)
  ])

  const renderSections: RenderSection[] = []
  const heroBuffer: HomepageSection[] = []
  const seen = new Set<RenderSection['type']>()

  for (const section of homepageSections ?? []) {
    switch (section.sectionType) {
      case 'hero': {
        heroBuffer.push(section)
        if (!seen.has('hero')) {
          renderSections.push({ type: 'hero', data: heroBuffer })
          seen.add('hero')
        }
        break
      }
      case 'about': {
        if (!seen.has('about')) {
          renderSections.push({ type: 'about', data: section as AboutSectionData })
          seen.add('about')
        }
        break
      }
      case 'blog': {
        if (!seen.has('blog')) {
          renderSections.push({ type: 'blog', data: section })
          seen.add('blog')
        }
        break
      }
      case 'team': {
        if (!seen.has('team')) {
          renderSections.push({ type: 'team', data: section })
          seen.add('team')
        }
        break
      }
      case 'cta': {
        if (!seen.has('cta')) {
          renderSections.push({ type: 'cta', data: section })
          seen.add('cta')
        }
        break
      }
      default:
        break
    }
  }

  const heroSections = renderSections.find((section) => section.type === 'hero')?.data ?? []
  const aboutSection = renderSections.find(
    (section): section is Extract<RenderSection, { type: 'about' }> => section.type === 'about'
  )?.data
  const blogSectionData = renderSections.find(
    (section): section is Extract<RenderSection, { type: 'blog' }> => section.type === 'blog'
  )?.data
  const teamSectionData = renderSections.find(
    (section): section is Extract<RenderSection, { type: 'team' }> => section.type === 'team'
  )?.data
  const ctaSectionData = renderSections.find(
    (section): section is Extract<RenderSection, { type: 'cta' }> => section.type === 'cta'
  )?.data

  const fallbackIntro =
    'Adalet ve hukukun üstünlüğü ilkesiyle, müvekkillerimize en kaliteli hukuki hizmeti sunmak için buradayız.'
  const fallbackSecondary =
    'Akil Hukuk & Danışmanlık olarak, müvekkillerimize güvenilir ve çözüm odaklı hukuki destek sağlamaktayız.'

  const aboutParagraphs = [
    aboutSection?.subtitle,
    aboutSection?.description
  ]
    .map((text) => text?.trim())
    .filter((text): text is string => Boolean(text))

  const aboutIntro = aboutParagraphs[0] || fallbackIntro
  const aboutSecondary =
    aboutParagraphs.length > 1
      ? aboutParagraphs[1]
      : aboutParagraphs.length === 0
        ? fallbackSecondary
        : undefined

  const aboutCards = (aboutSection?.cards || []).filter(
    (card) => card?.title || card?.description
  )
  const aboutValues = (aboutSection?.values || []).filter(
    (value) => value?.title || value?.description
  )

  let themePointer = 0

  return (
    <div className="bg-white text-gray-900">
      {renderSections.map((section, index) => {
        if (section.type === 'hero') {
          if (sectionThemes.length > 1) {
            const heroThemeIndex = 1 % sectionThemes.length
            themePointer = (heroThemeIndex + 1) % sectionThemes.length
          }

          return heroSections.length > 0 ? (
            <HeroCarousel key={`section-hero-${index}`} heroes={heroSections} />
          ) : null
        }

        const getNextTheme = () => {
          const theme = sectionThemes[themePointer % sectionThemes.length]
          themePointer = (themePointer + 1) % sectionThemes.length
          return theme
        }

        switch (section.type) {
          case 'about':
            const aboutTheme = getNextTheme()
            return (aboutIntro || aboutSecondary) ? (
              <section key={`section-about-${index}`} className={aboutTheme.about.wrapper}>
                <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
                  <div className="grid lg:grid-cols-2 gap-10 items-start">
                    <div className="space-y-5">
                      <h2 className={`text-3xl font-semibold ${aboutTheme.about.heading}`}>
                        {aboutSection?.title || 'Hakkımızda'}
                      </h2>
                      <div className="space-y-3 leading-relaxed">
                        {aboutIntro && <p className={aboutTheme.about.primaryText}>{aboutIntro}</p>}
                        {aboutSecondary && <p className={aboutTheme.about.secondaryText}>{aboutSecondary}</p>}
                      </div>
                      <Link
                        href={aboutSection?.ctaLink || '/hakkimizda'}
                        className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg shadow-sm transition-colors ${aboutTheme.about.button}`}
                      >
                        {aboutSection?.ctaText || 'Hakkımızda Sayfasını İncele'}
                      </Link>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {aboutCards.length > 0 ? (
                        aboutCards.map((card, cardIndex) => (
                          <div
                            key={card._key ?? `${card.title}-${cardIndex}`}
                            className={`rounded-2xl border shadow-sm p-6 h-full ${aboutTheme.about.card}`}
                          >
                            <h3 className={`text-lg font-semibold ${aboutTheme.about.cardHeading}`}>{card.title}</h3>
                            {card.description && (
                              <p className={`mt-2 ${aboutTheme.about.cardText}`}>{card.description}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <>
                          <div className={`rounded-2xl border shadow-sm p-6 ${aboutTheme.about.card}`}>
                            <h3 className={`text-lg font-semibold ${aboutTheme.about.cardHeading}`}>Misyonumuz</h3>
                            <p className={`mt-2 ${aboutTheme.about.cardText}`}>
                              Müvekkillerimizin haklarını korumak ve adaletin tecellisini sağlamak için deneyimli hukuk ekibimizle birlikte çalışıyoruz.
                            </p>
                          </div>
                          <div className={`rounded-2xl border shadow-sm p-6 ${aboutTheme.about.card}`}>
                            <h3 className={`text-lg font-semibold ${aboutTheme.about.cardHeading}`}>Vizyonumuz</h3>
                            <p className={`mt-2 ${aboutTheme.about.cardText}`}>
                              Türkiye'nin önde gelen hukuk bürolarından biri olmak ve hukuki danışmanlık alanında standartları yükselterek sektöre öncülük etmek.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`rounded-2xl border shadow-sm p-6 ${aboutTheme.about.valueContainer}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${aboutTheme.about.heading}`}>Değerlerimiz</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {aboutValues.length > 0 ? (
                        aboutValues.map((value, valueIndex) => (
                          <div
                            key={value._key ?? `${value.title}-${valueIndex}`}
                            className={`text-center rounded-xl p-6 ${aboutTheme.about.valueCard}`}
                          >
                            <div className={`text-2xl font-semibold mb-2 ${aboutTheme.about.valueHeading}`}>{value.title}</div>
                            {value.description && (
                              <p className={`text-sm ${aboutTheme.about.valueText}`}>{value.description}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <>
                          <div className={`text-center rounded-xl p-6 ${aboutTheme.about.valueCard}`}>
                            <div className={`text-2xl font-semibold mb-2 ${aboutTheme.about.valueHeading}`}>Güvenilirlik</div>
                            <p className={`text-sm ${aboutTheme.about.valueText}`}>Müvekkillerimizle kurduğumuz güven ilişkisi bizim en değerli varlığımızdır.</p>
                          </div>
                          <div className={`text-center rounded-xl p-6 ${aboutTheme.about.valueCard}`}>
                            <div className={`text-2xl font-semibold mb-2 ${aboutTheme.about.valueHeading}`}>Hız</div>
                            <p className={`text-sm ${aboutTheme.about.valueText}`}>Hızlı ve etkili çözümlerle müvekkillerimizin zamanını koruyoruz.</p>
                          </div>
                          <div className={`text-center rounded-xl p-6 ${aboutTheme.about.valueCard}`}>
                            <div className={`text-2xl font-semibold mb-2 ${aboutTheme.about.valueHeading}`}>Yenilik</div>
                            <p className={`text-sm ${aboutTheme.about.valueText}`}>Hukuki teknolojileri takip ederek hizmet kalitemizi sürekli geliştiriyoruz.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            ) : null
          case 'blog':
            const blogTheme = getNextTheme()
            return (
              <section key={`section-blog-${index}`} className={blogTheme.blog.wrapper}>
                <div className="max-w-6xl mx-auto px-4 py-16">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-2xl font-semibold ${blogTheme.blog.heading}`}>{blogSectionData?.title || "Güncel Yazılar"}</h2>
                    <Link
                      href="/blog"
                      className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg shadow-sm transition-colors ${blogTheme.blog.button}`}
                    >
                      {blogSectionData?.ctaText || "Tüm Yazılar"}
                    </Link>
                  </div>
                  <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts?.slice(0, 3).map((post: any) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className={`group rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col gap-4 ${blogTheme.blog.card}`}
                      >
                        <div className="space-y-3">
                          <div className={`text-sm ${blogTheme.blog.cardMeta}`}>
                            {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                          <h3 className={`text-lg font-semibold transition-colors line-clamp-2 ${blogTheme.blog.cardHeading}`}>
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className={`text-sm line-clamp-3 ${blogTheme.blog.cardText}`}>{post.excerpt}</p>
                          )}
                        </div>
                        <div>
                          <div className={`inline-flex items-center text-sm font-medium transition-colors ${blogTheme.blog.cardLink}`}>
                            Devamını Oku →
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )
          case 'team':
            const teamTheme = getNextTheme()
            return (
              <section key={`section-team-${index}`} className={teamTheme.team.wrapper}>
                <div className="max-w-6xl mx-auto px-4 py-16">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-4 max-w-3xl">
                      <h2 className={`text-2xl font-semibold ${teamTheme.team.heading}`}>{teamSectionData?.title || "Çalışma Arkadaşlarımız"}</h2>
                      {(teamSectionData?.description || !teamSectionData?.subtitle) && (
                        <p className={teamTheme.team.text}>
                          {teamSectionData?.description ||
                            "Deneyimli avukat ve danışman ekibimiz farklı hukuk alanlarında uzmanlaşmıştır. Müvekkillerimizin ihtiyaçlarına özel çözümler üretmek için birlikte çalışıyoruz."}
                        </p>
                      )}
                    </div>
                    <div className="md:text-right">
                      <Link
                        href={teamSectionData?.ctaLink ?? "/calisanlar"}
                        className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg shadow-sm transition-colors ${teamTheme.team.button}`}
                      >
                        {teamSectionData?.ctaText || "Tüm Ekibi Gör"}
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )
          case 'cta':
            const ctaTheme = getNextTheme()
            return (
              <section key={`section-cta-${index}`} className={ctaTheme.cta.wrapper}>
                <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className={`text-2xl font-semibold ${ctaTheme.cta.heading}`}>{ctaSectionData?.title || "Hızlı Danışmanlık Talebi"}</h3>
                    <p className={ctaTheme.cta.text}>{ctaSectionData?.subtitle || "Kısa formu doldurun, aynı gün içinde size dönüş yapalım."}</p>
                  </div>
                  <Link
                    href={ctaSectionData?.ctaLink || "/iletisim"}
                    className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold transition-colors ${ctaTheme.cta.button}`}
                  >
                    {ctaSectionData?.ctaText || "İletişim Formu"}
                  </Link>
                </div>
              </section>
            )
          default:
            return null
        }
      })}
    </div>
  )
}