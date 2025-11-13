import { defineType } from 'sanity'
export default defineType({
  name: 'siteSettings',
  title: 'Site Ayarları',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Site Adı',
      type: 'string',
      initialValue: 'AKİL HUKUK'
    },
    {
      name: 'homepageAboutTitle',
      title: 'Ana Sayfa / Hakkımızda Başlığı',
      type: 'string',
      initialValue: 'Hakkımızda'
    },
    {
      name: 'homepageAboutIntro',
      title: 'Ana Sayfa / Hakkımızda Giriş Metni (kısa)',
      type: 'text',
      rows: 3,
      initialValue: 'Adalet ve hukukun üstünlüğü ilkesiyle, müvekkillerimize en kaliteli hukuki hizmeti sunmak için buradayız.'
    },
    {
      name: 'homepageAboutSecondary',
      title: 'Ana Sayfa / Hakkımızda İkinci Cümle',
      type: 'text',
      rows: 2,
      initialValue: 'Akil Hukuk ve Danışmanlık Samsun’da hizmet veren bir hukuk bürosudur.'
    },
    {
      name: 'tagline',
      title: 'Slogan',
      type: 'string',
      initialValue: 'Güvenilir, deneyimli ve çözüm odaklı hukuk danışmanlığı'
    },
    {
      name: 'description',
      title: 'Site Açıklaması',
      type: 'text',
      initialValue: 'Samsun merkezli avukatlık ve danışmanlık hizmetleri. Güvenilir ve çözüm odaklı yaklaşım.'
    },
    {
      name: 'contactInfo',
      title: 'İletişim Bilgileri',
      type: 'object',
      fields: [
        {
          name: 'phone',
          title: 'Telefon',
          type: 'string',
          initialValue: '+90 (362) 000 00 00'
        },
        {
          name: 'email',
          title: 'E-posta',
          type: 'string',
          initialValue: 'info@akilhukuk.com'
        },
        {
          name: 'address',
          title: 'Adres',
          type: 'string',
          initialValue: 'İstiklal Cd. No: 00, Samsun'
        }
      ]
    },
    {
      name: 'practiceAreasTitle',
      title: 'Uzmanlık Başlığı',
      type: 'string',
      initialValue: 'Uzmanlık'
    },
    {
      name: 'practiceAreas',
      title: 'Uzmanlık Alanları',
      type: 'array',
      description: 'Footer kısmında listelenecek uzmanlık alanları',
      of: [{ type: 'string' }],
      initialValue: ['Aile Hukuku', 'İş Hukuku', 'Ticaret Hukuku']
    },
    {
      name: 'footerNote',
      title: 'Alt Bilgi Notu',
      type: 'string',
      description: 'Copyright bölümünde gösterilecek metin',
      initialValue: 'Akil Hukuk & Danışmanlık'
    }
  ]
})
