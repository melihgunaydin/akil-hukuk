import { defineType } from 'sanity'

export default defineType({
  name: 'blogSection',
  title: 'Blog Bölümü',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Başlık',
      type: 'string',
      initialValue: 'Blog'
    },
    {
      name: 'subtitle',
      title: 'Alt Başlık',
      type: 'text',
      initialValue: 'Hukuki gelişmeler, uzman analizler ve pratik bilgiler. Güncel hukuk dünyasından haberler.'
    },
    {
      name: 'ctaText',
      title: 'Buton Metni',
      type: 'string',
      initialValue: 'Tüm Yazılar'
    },
    {
      name: 'ctaLink',
      title: 'Buton Linki',
      type: 'string',
      initialValue: '/blog'
    }
  ]
})
