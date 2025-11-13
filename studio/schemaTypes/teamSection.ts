
export default {
  name: 'teamSection',
  title: 'Ekip Bölümü',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Başlık',
      type: 'string',
      initialValue: 'Çalışma Arkadaşlarımız'
    },
    {
      name: 'subtitle',
      title: 'Alt Başlık',
      type: 'text',
      initialValue: 'Deneyimli ve uzman ekibimizle tanışın. Her biri kendi alanında uzmanlaşmış avukatlarımız.'
    },
    {
      name: 'ctaText',
      title: 'Buton Metni',
      type: 'string',
      initialValue: 'Tüm Ekibi Gör'
    },
    {
      name: 'ctaLink',
      title: 'Buton Linki',
      type: 'string',
      initialValue: '/calisanlar'
    }
  ]
}
