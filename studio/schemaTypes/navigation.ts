import {defineType} from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Menü',
  type: 'document',
  fields: [
    {name: 'title', title: 'Görünen Ad', type: 'string'},
    {name: 'url', title: 'Bağlantı (örn: /hakkimizda)', type: 'string'},
    {name: 'order', title: 'Sıra', type: 'number'},
  ],
})
