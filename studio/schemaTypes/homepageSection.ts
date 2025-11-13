import { defineType } from 'sanity'

export default defineType({
  name: 'homepageSection',
  title: 'Ana Sayfa Bölümleri',
  type: 'document',
  preview: {
    select: {
      sectionType: 'sectionType',
      title: 'title',
      footerTitle: 'footerTitle'
    },
    prepare({ sectionType, title, footerTitle }) {
      const typeLabels: Record<string, string> = {
        hero: 'Hero',
        services: 'Hizmetler',
        team: 'Takım',
        about: 'Hakkımızda',
        blog: 'Blog',
        cta: 'CTA',
        footer: 'Footer'
      }

      const label = typeLabels[sectionType] || 'Bölüm'
      const displayTitle =
        sectionType === 'footer'
          ? footerTitle || 'Footer'
          : title || `${label} Bölümü`

      return {
        title: displayTitle,
        subtitle: label
      }
    }
  },
  fields: [
    {
      name: 'sectionType',
      title: 'Bölüm Tipi',
      type: 'string',
      options: {
        list: [
          { title: 'Hero', value: 'hero' },
          { title: 'Services', value: 'services' },
          { title: 'Team', value: 'team' },
          { title: 'About', value: 'about' },
          { title: 'Blog', value: 'blog' },
          { title: 'CTA', value: 'cta' },
          { title: 'Footer', value: 'footer' }
        ]
      }
    },
    {
      name: 'order',
      title: 'Sıra',
      type: 'number',
      hidden: ({ document }) => document?.sectionType === 'footer'
    },
    {
      name: 'title',
      title: 'Başlık',
      type: 'string',
      hidden: ({ document }) => document?.sectionType === 'footer'
    },
    {
      name: 'footerTitle',
      title: 'Footer Başlığı',
      type: 'string',
      description: 'Sanity liste görünümünde kullanılacak başlık',
      hidden: ({ document }) => document?.sectionType !== 'footer'
    },
    {
      name: 'subtitle',
      title: 'Alt Başlık',
      type: 'text',
      hidden: ({ document }) => document?.sectionType === 'footer'
    },
    {
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      description: 'Hakkımızda bölümünde ikinci paragraf olarak kullanılır',
      hidden: ({ document }) => document?.sectionType !== 'about'
    },
    {
      name: 'cards',
      title: 'Bilgi Kartları (Misyon / Vizyon vb.)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Başlık', type: 'string' },
            { name: 'description', title: 'Açıklama', type: 'text' }
          ]
        }
      ],
      hidden: ({ document }) => document?.sectionType !== 'about'
    },
    {
      name: 'values',
      title: 'Değer Kartları',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Başlık', type: 'string' },
            { name: 'description', title: 'Açıklama', type: 'text' }
          ]
        }
      ],
      hidden: ({ document }) => document?.sectionType !== 'about'
    },
    {
      name: 'ctaText',
      title: 'Buton Metni',
      type: 'string',
      hidden: ({ document }) =>
        document?.sectionType === 'hero' || document?.sectionType === 'footer'
    },
    {
      name: 'ctaSubtext',
      title: 'Buton Alt Metni',
      type: 'string',
      hidden: ({ document }) =>
        document?.sectionType === 'hero' || document?.sectionType === 'footer'
    },
    {
      name: 'ctaLink',
      title: 'Buton Linki',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.sectionType === 'team' && !value) {
            return 'Takım bölümü için buton linki gerekli'
          }
          return true
        }),
      hidden: ({ document }) =>
        document?.sectionType === 'hero' || document?.sectionType === 'footer'
    },
    {
      name: 'buttons',
      title: 'Butonlar',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Buton Metni',
              type: 'string'
            },
            {
              name: 'link',
              title: 'Buton Linki',
              type: 'string'
            },
            {
              name: 'style',
              title: 'Buton Stili',
              type: 'string',
              options: {
                list: [
                  { title: 'Birincil (Beyaz)', value: 'primary' },
                  { title: 'İkincil (Çerçeve)', value: 'secondary' }
                ]
              },
              initialValue: 'primary'
            }
          ]
        }
      ],
      hidden: ({ document }) => document?.sectionType === 'footer'
    },
    {
      name: 'footerSections',
      title: 'Footer Bölümleri',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'sectionType',
              title: 'Footer Bölüm Tipi',
              type: 'string',
              options: {
                list: [
                  { title: 'Başlık & Açıklama', value: 'info' },
                  { title: 'Menü', value: 'menu' },
                  { title: 'İletişim', value: 'contact' }
                ]
              },
              validation: (Rule) => Rule.required()
            },
            {
              name: 'title',
              title: 'Başlık',
              type: 'string',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const sectionType = context.parent?.sectionType
                  if ((sectionType === 'menu' || sectionType === 'contact') && !value) {
                    return 'Bu bölüm için başlık gerekli'
                  }
                  return true
                })
            },
            {
              name: 'order',
              title: 'Sıra',
              type: 'number',
              description: 'Footer içindeki sıralama',
              validation: (Rule) => Rule.min(0)
            },
            {
              name: 'description',
              title: 'Açıklama',
              type: 'text',
              rows: 3,
              description:
                'Her satır yeni bir paragraf oluşturur. Bilgi bölümü için kullanılır.',
              hidden: ({ parent }) => parent?.sectionType !== 'info'
            }
          ]
        }
      ],
      validation: (Rule) => Rule.max(5),
      hidden: ({ document }) => document?.sectionType !== 'footer'
    }
  ]
})
