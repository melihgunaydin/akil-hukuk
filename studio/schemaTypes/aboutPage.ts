import { defineType } from 'sanity'

const iconOptions = [
  { title: 'Hedef', value: 'target' },
  { title: 'Göz', value: 'eye' },
  { title: 'Kalkan', value: 'shield' },
  { title: 'Yıldırım', value: 'zap' },
  { title: 'Parıltı', value: 'sparkles' },
  { title: 'Terazi', value: 'balance' },
]

export default defineType({
  name: 'aboutPage',
  title: 'Hakkımızda Sayfası',
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: 'Hero Başlığı',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Alt Başlığı',
      type: 'text',
      rows: 3,
    },
    {
      name: 'missionVision',
      title: 'Misyon & Vizyon',
      type: 'array',
      description: 'Maksimum iki öğe (misyon ve vizyon) ekleyin.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'variant',
              title: 'Tür',
              type: 'string',
              options: {
                list: [
                  { title: 'Misyon', value: 'mission' },
                  { title: 'Vizyon', value: 'vision' },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Başlık',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Açıklama',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'icon',
              title: 'İkon',
              type: 'string',
              options: {
                list: iconOptions,
              },
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(2),
    },
    {
      name: 'valuesTitle',
      title: 'Değerler Bölümü Başlığı',
      type: 'string',
      initialValue: 'Değerlerimiz',
    },
    {
      name: 'values',
      title: 'Değerler',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Başlık',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Açıklama',
              type: 'text',
              rows: 3,
            },
            {
              name: 'icon',
              title: 'İkon',
              type: 'string',
              options: {
                list: iconOptions,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'practiceAreasTitle',
      title: 'Hizmet Alanları Başlığı',
      type: 'string',
      initialValue: 'Hizmet Alanlarımız',
    },
    {
      name: 'practiceAreas',
      title: 'Hizmet Alanları',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'body',
      title: 'Detay İçerik',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'ctaTitle',
      title: 'CTA Başlığı',
      type: 'string',
    },
    {
      name: 'ctaDescription',
      title: 'CTA Açıklaması',
      type: 'text',
      rows: 3,
    },
    {
      name: 'ctaButtonText',
      title: 'CTA Buton Metni',
      type: 'string',
    },
    {
      name: 'ctaButtonLink',
      title: 'CTA Buton Linki',
      type: 'string',
    },
  ],
  preview: {
    select: {
      title: 'heroTitle',
    },
    prepare({ title }) {
      return {
        title: title || 'Hakkımızda Sayfası',
      }
    },
  },
})


