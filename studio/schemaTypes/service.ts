import { defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Hizmetler',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'icon',
      title: 'İkon',
      type: 'string',
      description: 'İkon adı veya emoji'
    },
    {
      name: 'order',
      title: 'Sıra',
      type: 'number',
      description: 'Görüntülenme sırası (küçükten büyüğe)'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description'
    }
  }
})

