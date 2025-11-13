import {defineType} from 'sanity'

export default defineType({
  name: 'person',
  title: 'Çalışan',
  type: 'document',
  fields: [
    {name: 'name', title: 'Ad Soyad', type: 'string'},
    {name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}},
    {name: 'role', title: 'Pozisyon', type: 'string'},
    {name: 'bio', title: 'Kısa Biyografi', type: 'array', of: [{type: 'block'}]},
    {name: 'photo', title: 'Fotoğraf', type: 'image', options: {hotspot: true}},
    {name: 'email', title: 'E-posta', type: 'string'},
    {name: 'phone', title: 'Telefon', type: 'string'},{
      name: 'seoDescription',
      title: 'SEO Açıklaması',
      type: 'text',
      description: 'Bu yazı Google sonuçlarında nasıl görünsün? (150–160 karakter arası önerilir)',
      validation: (Rule) => Rule.max(160).warning('SEO açıklaması 160 karakteri geçmemeli.'),
    }
  ],
})
