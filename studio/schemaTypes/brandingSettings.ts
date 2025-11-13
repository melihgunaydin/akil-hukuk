import { defineType } from 'sanity'

export default defineType({
  name: 'brandingSettings',
  title: 'Site Markası',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Site Adı',
      type: 'string',
      initialValue: 'AKİL HUKUK',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'logoAlt',
      title: 'Logo Alt Metni',
      type: 'string',
      description: 'Logo görüntüsü yüklenirse kullanılacak alternatif metin.',
    },
    {
      name: 'logoWidth',
      title: 'Logo Genişliği (px)',
      type: 'number',
      description: 'Header içinde gösterilecek logo genişliği. Yükseklik otomatik ayarlanır.',
      initialValue: 80,
      validation: (Rule) => Rule.min(24).max(240),
    },
    {
      name: 'logoScale',
      title: 'Logo Ölçeği',
      type: 'number',
      description: 'Logo görselini büyütüp küçültmek için 0.5 - 2 arası değer kullanın.',
      initialValue: 1,
      validation: (Rule) => Rule.min(0.5).max(2),
    },
  ],
  preview: {
    select: {
      title: 'siteName',
      media: 'logo',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Site Markası',
        media,
      }
    },
  },
})


