import { defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Yazısı',
  type: 'document',
  fields: [
    { name: 'title', title: 'Başlık', type: 'string' },
    { name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'title' } },
    { name: 'excerpt', title: 'Özet', type: 'text' },
    { name: 'coverImage', title: 'Kapak Görseli', type: 'image', options: { hotspot: true } },
    {
      name: 'content',
      title: 'İçerik',
      type: 'array',
      of: [{ type: 'block' }],
    },
    { name: 'publishedAt', title: 'Yayın Tarihi', type: 'datetime' },
    {
      name: 'seoDescription',
      title: 'SEO Açıklaması',
      type: 'text',
      description:
        'Bu yazı Google sonuçlarında nasıl görünsün? (150–160 karakter arası önerilir)',
      validation: (Rule) => Rule.max(160).warning('SEO açıklaması 160 karakteri geçmemeli.'),
    },{
      name: 'seoImage',
      title: 'SEO Görseli (Open Graph)',
      type: 'image',
      description: 'Sosyal medya kartlarında görünecek görsel (1200x630 önerilir)',
      options: { hotspot: true },
    },
    {
      name: 'author',
      title: 'Yazar',
      type: 'reference',
      to: [{ type: 'person' }], // varsa 'person' şemasına bağlanır
    },
    {
      name: 'relatedPosts',
      title: 'İlgili Yazılar',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'post' }],
        },
      ],
      description: 'Bu yazıyla ilişkili diğer blog yazılarını seçin (en fazla 3 adet önerilir).',
      validation: (Rule) => Rule.max(3).warning('En fazla 3 ilgili yazı seçilmesi önerilir.'),
    },
    
  ],
})
