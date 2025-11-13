import { client } from '@/lib/sanity.client'
import { contactPageQuery } from '@/lib/queries'
import ContactForm from './ContactForm'
import { absUrl, buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const contactPage = await client.fetch(contactPageQuery).catch(() => null)
  const description =
    contactPage?.description ||
    contactPage?.subtitle ||
    'Akil Hukuk & Danışmanlık ile iletişime geçin. Uzman hukuk ekibimiz tüm sorularınız için yanınızda.'
  const keywords = [
    'Akil Hukuk iletişim',
    'Samsun avukat iletişim',
    contactPage?.officeInfo?.address,
    contactPage?.officeInfo?.phone,
    'hukuki danışmanlık',
  ].filter((item): item is string => Boolean(item))

  return buildMetadata({
    title: contactPage?.title || 'İletişim',
    description,
    path: '/iletisim',
    keywords,
  })
}

export default async function Iletisim() {
  const contactPage = await client.fetch(contactPageQuery).catch(() => null)

  type WorkingHour = { day: string; time?: string }

  const defaultWorkingHours: WorkingHour[] = [
    { day: 'Pazartesi - Cuma', time: '09:00 - 18:00' },
    { day: 'Cumartesi', time: '09:00 - 13:00' },
    { day: 'Pazar', time: 'Kapalı' }
  ]

  const workingHours: WorkingHour[] =
    contactPage?.officeInfo?.workingHours
      ?.split('\n')
      .map((line: string): WorkingHour | null => {
        const [dayPart, ...timeParts] = line.split(':')
        const day = dayPart?.trim()
        const time = timeParts.join(':').trim()
        if (!day) {
          return null
        }

        return {
          day,
          time: time || undefined
        }
      })
      .filter((item: WorkingHour | null): item is WorkingHour => Boolean(item)) || defaultWorkingHours

  const officeAddress = contactPage?.officeInfo?.address || 'İstiklal Caddesi No: 00\nMerkez, Samsun'
  const officeAddressLines = officeAddress.split('\n')
  const mapQuery =
    contactPage?.officeInfo?.address?.replace(/\n/g, ' ') || 'İstiklal Caddesi No: 00 Merkez, Samsun'
  const encodedMapQuery = encodeURIComponent(mapQuery)
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodedMapQuery}&output=embed`
  const mapLinkHref = `https://www.google.com/maps?q=${encodedMapQuery}`

  const siteUrl = absUrl('/iletisim')
  const addressLines = officeAddressLines
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: contactPage?.title || 'İletişim',
    url: siteUrl,
    description:
      contactPage?.description ||
      contactPage?.subtitle ||
      'Akil Hukuk & Danışmanlık ile iletişime geçin.',
    publisher: {
      '@type': 'LegalService',
      name: 'Akil Hukuk',
      url: absUrl('/'),
      telephone: contactPage?.officeInfo?.phone || '+90 (362) 000 00 00',
      email: contactPage?.officeInfo?.email || 'info@akilhukuk.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: addressLines[0],
        addressLocality: addressLines.slice(1).join(', ') || undefined,
        addressCountry: 'TR',
      },
    },
  }

  const jsonLdSafe = JSON.parse(
    JSON.stringify(contactJsonLd, (_key, value) => (value === undefined || value === null ? undefined : value)),
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {contactPage?.title || "İletişim"}
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              {contactPage?.subtitle || "Hukuki danışmanlık ihtiyaçlarınız için bizimle iletişime geçin. Uzman ekibimiz size en kısa sürede dönüş yapacaktır."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {contactPage?.formTitle || "Mesaj Gönderin"}
                </h2>
                <p className="text-gray-600">
                  {contactPage?.formDescription || "Hukuki danışmanlık ihtiyacınızı detaylandırın. Uzman ekibimiz size en kısa sürede dönüş yapacaktır."}
                </p>
              </div>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Office Info */}
              <div className="bg-[#F5F5F5] rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {contactPage?.officeInfo?.title || "Ofis Bilgileri"}
                </h3>
                
                {/* Google Maps */}
                <div className="mb-6">
                  <div className="w-full h-48 rounded-xl overflow-hidden shadow-sm">
                    <iframe
                      src={mapEmbedSrc}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Akil Hukuk Ofis Konumu"
                    ></iframe>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-[#0C2340] mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Adres</p>
                      <p className="text-gray-600">
                        {officeAddressLines.map((line: string, index: number) => (
                          <span key={index}>
                            {line}
                            {index < officeAddressLines.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                      <a
                        href={mapLinkHref}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#0C2340] text-sm hover:underline mt-1 inline-block"
                      >
                        Haritada Görüntüle →
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-[#0C2340] mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Telefon</p>
                      <a href={`tel:${contactPage?.officeInfo?.phone || "+90 (362) 000 00 00"}`} className="text-gray-600 hover:text-[#0C2340] transition-colors">
                        {contactPage?.officeInfo?.phone || "+90 (362) 000 00 00"}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-[#0C2340] mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">E-posta</p>
                      <a href={`mailto:${contactPage?.officeInfo?.email || "info@akilhukuk.com"}`} className="text-gray-600 hover:text-[#0C2340] transition-colors">
                        {contactPage?.officeInfo?.email || "info@akilhukuk.com"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Çalışma Saatleri</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {workingHours.map((item: WorkingHour) => (
                    <div key={item?.day} className="flex justify-between gap-4">
                      <span>{item?.day}</span>
                      <span className="font-medium text-gray-900">
                        {item?.time || '-'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-br from-[#0C2340] to-[#1a3a5c] text-white rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-4">Acil Durum</h3>
                <p className="text-white/80 mb-4">
                  {contactPage?.officeInfo?.emergencyContact || "Acil hukuki danışmanlık ihtiyacınız için 7/24 ulaşabileceğiniz numaramız:"}
                </p>
                <a 
                  href={`tel:${contactPage?.officeInfo?.phone || "+90 (362) 000 00 00"}`}
                  className="text-2xl font-bold hover:text-white/80 transition-colors"
                >
                  {contactPage?.officeInfo?.phone || "+90 (362) 000 00 00"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}