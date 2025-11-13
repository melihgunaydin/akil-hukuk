import { defineType } from 'sanity'

export default defineType({
  name: 'servicesSection',
  title: 'Hizmetler Bölümü',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Başlık',
      type: 'string',
      initialValue: 'Uzmanlık Alanlarımız'
    },
    {
      name: 'subtitle',
      title: 'Alt Başlık',
      type: 'text'
    },
    {
      name: 'ctaText',
      title: 'Buton Metni',
      type: 'string'
    },
    {
      name: 'ctaLink',
      title: 'Buton Linki',
      type: 'string'
    }
  ]
})  
