import { defineType } from 'sanity'
export default defineType({
  name: 'contactPage',
  title: 'İletişim Sayfası',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Başlık',
      type: 'string',
      initialValue: 'İletişim'
    },
    {
      name: 'subtitle',
      title: 'Alt Başlık',
      type: 'text',
      initialValue: 'Hukuki danışmanlık ihtiyaçlarınız için bizimle iletişime geçin. Uzman ekibimiz size en kısa sürede dönüş yapacaktır.'
    },
    {
      name: 'description',
      title: 'Açıklama',
      type: 'text'
    },
    {
      name: 'formTitle',
      title: 'Form Başlığı',
      type: 'string',
      initialValue: 'Mesaj Gönderin'
    },
    {
      name: 'formDescription',
      title: 'Form Açıklaması',
      type: 'text',
      initialValue: 'Hukuki danışmanlık ihtiyacınızı detaylandırın. Uzman ekibimiz size en kısa sürede dönüş yapacaktır.'
    },
    {
      name: 'officeInfo',
      title: 'Ofis Bilgileri',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Başlık',
          type: 'string',
          initialValue: 'Ofis Bilgileri'
        },
        {
          name: 'address',
          title: 'Adres',
          type: 'string',
          initialValue: 'İstiklal Caddesi No: 00\nMerkez, Samsun'
        },
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
          name: 'workingHours',
          title: 'Çalışma Saatleri',
          type: 'text',
          initialValue: 'Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 09:00 - 13:00\nPazar: Kapalı'
        },
        {
          name: 'emergencyContact',
          title: 'Acil Durum Açıklaması',
          type: 'text',
          initialValue: 'Acil hukuki danışmanlık ihtiyacınız için 7/24 ulaşabileceğiniz numaramız:'
        }
      ]
    }
  ]
})
