import {defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Sayfa',
  type: 'document',
  fields: [
    {name: 'title', title: 'Başlık', type: 'string'},
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    },
    {
      name: 'content',
      title: 'İçerik',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'seoDescription',
      title: 'SEO Açıklaması',
      type: 'text',
      description: 'Bu yazı Google sonuçlarında nasıl görünsün? (150–160 karakter arası önerilir)',
      validation: (Rule) => Rule.max(160).warning('SEO açıklaması 160 karakteri geçmemeli.'),
    },
    {
      name: 'seoImage',
      title: 'SEO Görseli (Open Graph)',
      type: 'image',
      options: { hotspot: true },
    }],
})
