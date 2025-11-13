// src/app/layout.tsx
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/lib/sanity.client';
import {
  menuQuery,
  siteSettingsQuery,
  homepageSectionsQuery,
  brandingSettingsQuery,
  type HomepageSection,
  contactPageQuery,
  type FooterSectionItem,
  type BrandingSettings,
} from '@/lib/queries';
import type { Metadata } from 'next'
import { absUrl, buildMetadata } from '@/lib/seo'



export const revalidate = 60;
export const metadata: Metadata = buildMetadata({
  // boş bırakırsan lib/seo.ts'taki varsayılanlar devrede
})


type FooterItem = {
  text: string
  url?: string
}

type FooterRenderableSection =
  | {
      type: 'info'
      title?: string
      description?: string
    }
  | {
      type: 'menu'
      title?: string
      items: FooterItem[]
    }
  | {
      type: 'contact'
      title?: string
      items: FooterItem[]
    }

const createMenuItems = (menu: any[]): FooterItem[] =>
  Array.isArray(menu)
    ? menu
        .filter((item) => item?.title && item?.url)
        .map((item) => ({
          text: item.title,
          url: item.url,
        }))
    : []

const sanitizePhoneForHref = (phone?: string) =>
  phone ? phone.replace(/[^+\d]/g, '') : undefined

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [menu, siteSettings, brandingSettings, contactPage, homepageSections] = await Promise.all([
    client.fetch(menuQuery).catch(() => []),
    client.fetch(siteSettingsQuery).catch(() => null),
    client.fetch(brandingSettingsQuery).catch(() => null),
    client.fetch(contactPageQuery).catch(() => null),
    client.fetch(homepageSectionsQuery).catch(() => [] as HomepageSection[])
  ]);

  const practiceAreas: string[] =
    siteSettings?.practiceAreas && siteSettings.practiceAreas.length > 0
      ? siteSettings.practiceAreas
      : ['Aile Hukuku', 'İş Hukuku', 'Ticaret Hukuku'];
  const practiceAreasTitle = siteSettings?.practiceAreasTitle || 'Uzmanlık';

  const footerSection = (homepageSections as HomepageSection[]).find(
    (section) => section.sectionType === 'footer'
  );

  const footerSectionsRaw = (
    (footerSection?.footerSections as FooterSectionItem[] | undefined) ?? []
  )
    .slice()
    .sort((a, b) => {
      const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER
      const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })
    .slice(0, 5);

  const menuItems = createMenuItems(menu);

  const contactSource =
    contactPage?.officeInfo ?? siteSettings?.contactInfo ?? {};

  const contactItems: FooterItem[] = [
    contactSource.phone
      ? {
          text: contactSource.phone,
          url: `tel:${sanitizePhoneForHref(contactSource.phone)}`,
        }
      : undefined,
    contactSource.email
      ? {
          text: contactSource.email,
          url: `mailto:${contactSource.email}`,
        }
      : undefined,
    contactSource.address
      ? {
          text: contactSource.address,
        }
      : undefined,
  ].filter((item): item is FooterItem => Boolean(item?.text));

  const footerContentFromSanity: FooterRenderableSection[] = footerSectionsRaw
    .map((section) => {
      switch (section.sectionType) {
        case 'info':
          if (!section.title && !section.description) return null
          return {
            type: 'info' as const,
            title: section.title,
            description: section.description ?? '',
          }
        case 'menu':
          if (menuItems.length === 0) return null
          return {
            type: 'menu' as const,
            title: section.title ?? 'Bağlantılar',
            items: menuItems,
          }
        case 'contact':
          if (contactItems.length === 0) return null
          return {
            type: 'contact' as const,
            title: section.title ?? 'İletişim',
            items: contactItems,
          }
        default:
          return null
      }
    })
    .filter((section): section is FooterRenderableSection => Boolean(section));

  const fallbackFooterContent: FooterRenderableSection[] = [
    {
      type: 'info',
      title: siteSettings?.siteName || 'AKİL HUKUK',
      description:
        siteSettings?.description ||
        'Samsun merkezli avukatlık ve danışmanlık hizmetleri. Güvenilir ve çözüm odaklı yaklaşım.',
    },
    ...(menuItems.length > 0
      ? [
          {
            type: 'menu' as const,
            title: 'Bağlantılar',
            items: menuItems,
          },
        ]
      : []),
    ...(practiceAreas.length > 0
      ? [
          {
            type: 'menu' as const,
            title: practiceAreasTitle,
            items: practiceAreas.map((area) => ({ text: area })),
          },
        ]
      : []),
    ...(contactItems.length > 0
      ? [
          {
            type: 'contact' as const,
            title: 'İletişim',
            items: contactItems,
          },
        ]
      : []),
  ];

  const footerContent =
    footerContentFromSanity.length > 0
      ? footerContentFromSanity
      : fallbackFooterContent.slice(0, 5);

  const brandingSettingsData = brandingSettings as BrandingSettings | null

  const headerSiteName =
    brandingSettingsData?.siteName ||
    siteSettings?.siteName ||
    'AKİL HUKUK';
  const headerLogoUrl = brandingSettingsData?.logo?.url;
  const headerLogoWidth = brandingSettingsData?.logoWidth ?? 80;
  const intrinsicLogoWidth = brandingSettingsData?.logo?.dimensions?.width;
  const intrinsicLogoHeight = brandingSettingsData?.logo?.dimensions?.height;
  const headerLogoHeight =
    intrinsicLogoWidth && intrinsicLogoHeight
      ? Math.round((intrinsicLogoHeight / intrinsicLogoWidth) * headerLogoWidth)
      : headerLogoWidth;
  const headerLogoAlt =
    brandingSettingsData?.logoAlt ||
    `${headerSiteName} Logo`;
  const headerLogoScale =
    brandingSettingsData?.logoScale && brandingSettingsData.logoScale > 0
      ? brandingSettingsData.logoScale
      : 1;

  const footerColumnClass = (() => {
    const count = Math.min(footerContent.length, 4);
    switch (count) {
      case 1:
        return 'md:grid-cols-1';
      case 2:
        return 'md:grid-cols-2';
      case 3:
        return 'md:grid-cols-3';
      default:
        return 'md:grid-cols-4';
    }
  })();

  const footerButtons =
    footerSection?.buttons?.filter((button) => button?.text && button?.link) ?? [];

  const footerNote =
    siteSettings?.footerNote || 'Akil Hukuk & Danışmanlık';

  const siteUrl = absUrl('/')
  const defaultLogo = headerLogoUrl ?? absUrl('/logo.svg')
  const addressLines =
    typeof contactSource.address === 'string'
      ? contactSource.address.split('\n').map((line) => line.trim()).filter(Boolean)
      : []
  const [streetAddress, ...restAddress] = addressLines
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: headerSiteName,
    url: siteUrl,
    logo: defaultLogo,
    image: defaultLogo,
    description:
      siteSettings?.description ??
      'Akil Hukuk & Danışmanlık, Samsun merkezli profesyonel hukuk bürosu.',
    telephone: contactSource.phone,
    email: contactSource.email,
    address:
      streetAddress
        ? {
            '@type': 'PostalAddress',
            streetAddress,
            addressLocality: restAddress.join(', ') || undefined,
            addressRegion: 'Samsun',
            addressCountry: 'TR',
          }
        : undefined,
    areaServed: 'TR',
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: headerSiteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?s={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const structuredData = [organizationJsonLd, websiteJsonLd].map((schema) =>
    JSON.parse(JSON.stringify(schema, (_key, value) => (value === undefined || value === null ? undefined : value)))
  )

  return (
    <html lang="tr">
      <head>
        {structuredData.map((schema, index) => (
          <script
            key={`jsonld-${index}`}
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="bg-white text-gray-900">
        <div className="flex min-h-screen flex-col">
          <header className="border-b bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-4 group">
                {headerLogoUrl ? (
                  <div
                    className="relative overflow-hidden rounded-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                    style={{ width: headerLogoWidth, height: headerLogoHeight }}
                  >
                    <Image
                      src={headerLogoUrl}
                      alt={headerLogoAlt}
                      fill
                      sizes={`${headerLogoWidth}px`}
                      className="object-cover"
                      priority
                      style={{ transform: `scale(${headerLogoScale})` }}
                    />
                  </div>
                ) : (
                  <Image
                    src="/logo.svg"
                    alt="Akil Hukuk Logo"
                    width={80}
                    height={80}
                    priority
                    className="drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <span className="text-3xl font-bold tracking-wide text-[#0C2340]">
                  {headerSiteName}
                </span>
              </Link>
              <nav>
                <ul className="flex items-center gap-9 text-lg font-semibold text-[#0C2340]/80">
                  {(menu ?? []).map((item: any) => (
                    <li key={item.url}>
                      <Link
                        href={item.url}
                        className="relative pb-1 transition-all duration-200 hover:text-[#0C2340] hover:pb-2 after:absolute after:left-0 after:bottom-0 after:h-1 after:w-full after:scale-x-0 after:bg-[#0C2340] after:transition-transform after:duration-200 hover:after:scale-x-100"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="bg-[#0C2340] text-white">
            <div className={`max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 gap-8 text-sm ${footerColumnClass}`}>
              {footerContent.map((section, index) => {
              switch (section.type) {
                case 'info':
                  return (
                    <div key={`footer-info-${index}`}>
                      {section.title && <div className="text-xl font-semibold">{section.title}</div>}
                      {section.description && (
                        <div className="mt-2 space-y-2 text-white/70">
                          {section.description
                            .split('\n')
                            .map((paragraph, paragraphIndex) => (
                              <p key={`footer-info-${index}-paragraph-${paragraphIndex}`}>{paragraph}</p>
                            ))}
                        </div>
                      )}
                      {index === 0 && footerButtons.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {footerButtons.map((button, buttonIndex) => {
                            const linkClass = `px-3 py-2 rounded-md text-xs font-medium border border-white/20 hover:border-white/40 transition-colors ${
                              button.style === 'secondary'
                                ? 'text-white hover:bg-white/10'
                                : 'bg-white text-[#0C2340] hover:bg-white/90'
                            }`

                            const href = button.link
                            const isInternal = href.startsWith('/') || href.startsWith('#')
                            const isMailOrTel =
                              href.startsWith('mailto:') || href.startsWith('tel:')

                            if (isInternal) {
                              return (
                                <Link key={`${button.link}-${buttonIndex}`} href={href} className={linkClass}>
                                  {button.text}
                                </Link>
                              )
                            }

                            return (
                              <a
                                key={`${button.link}-${buttonIndex}`}
                                href={href}
                                className={linkClass}
                                target={isMailOrTel ? undefined : '_blank'}
                                rel={isMailOrTel ? undefined : 'noopener noreferrer'}
                              >
                                {button.text}
                              </a>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                case 'menu':
                  return (
                    <div key={`footer-menu-${index}`}>
                      {section.title && <div className="font-semibold">{section.title}</div>}
                      <ul className="mt-2 space-y-1 text-white/80">
                        {section.items.map((item, itemIndex) => {
                          if (!item.url) {
                            return (
                              <li key={`footer-menu-${index}-item-${itemIndex}`}>{item.text}</li>
                            )
                          }

                          const isInternal = item.url.startsWith('/') || item.url.startsWith('#')
                          const isMailOrTel =
                            item.url.startsWith('mailto:') || item.url.startsWith('tel:')

                          if (isInternal) {
                            return (
                              <li key={`footer-menu-${index}-item-${itemIndex}`}>
                                <Link href={item.url}>{item.text}</Link>
                              </li>
                            )
                          }

                          return (
                            <li key={`footer-menu-${index}-item-${itemIndex}`}>
                              <a
                                href={item.url}
                                target={isMailOrTel ? undefined : '_blank'}
                                rel={isMailOrTel ? undefined : 'noopener noreferrer'}
                              >
                                {item.text}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                case 'contact':
                  return (
                    <div key={`footer-contact-${index}`}>
                      {section.title && <div className="font-semibold">{section.title}</div>}
                      <ul className="mt-2 space-y-1 text-white/80">
                        {section.items.map((item, itemIndex) => {
                          if (!item.url) {
                            return (
                              <li key={`footer-contact-${index}-item-${itemIndex}`}>{item.text}</li>
                            )
                          }

                          const isMailOrTel =
                            item.url.startsWith('mailto:') || item.url.startsWith('tel:')

                          return (
                            <li key={`footer-contact-${index}-item-${itemIndex}`}>
                              <a
                                href={item.url}
                                target={isMailOrTel ? undefined : '_blank'}
                                rel={isMailOrTel ? undefined : 'noopener noreferrer'}
                              >
                                {item.text}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                default:
                  return null
              }
            })}
          </div>
          <div className="text-center text-xs text-white/60 pb-6">© {new Date().getFullYear()} {footerNote}</div>
        </footer>
        </div>
      </body>
    </html>
  );
}
