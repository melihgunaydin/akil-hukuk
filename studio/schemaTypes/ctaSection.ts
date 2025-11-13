import { defineType } from 'sanity'

export default defineType({
  name: 'ctaSection',
  title: 'CTA Bölümü',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Başlık',
      type: 'string',
      initialValue: 'Hızlı Danışmanlık Talebi'
    },
    {
      name: 'subtitle',
      title: 'Alt Başlık',
      type: 'text',
      initialValue: 'Kısa formu doldurun, aynı gün içinde size dönüş yapalım.'
    },
    {
      name: 'ctaText',
      title: 'Buton Metni',
      type: 'string',
      initialValue: 'İletişim Formu'
    },
    {
      name: 'ctaLink',
      title: 'Buton Linki',
      type: 'string',
      initialValue: '/iletisim'
    }
  ]
})
