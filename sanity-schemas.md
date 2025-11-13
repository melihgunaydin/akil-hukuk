# Sanity Schema'ları

Aşağıdaki schema'ları Sanity Studio'da oluşturun:

## 1. Site Settings Schema

```javascript
// schemas/siteSettings.js
export default {
  name: 'siteSettings',
  title: 'Site Ayarları',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Site Adı',
      type: 'string',
      initialValue: 'AKİL HUKUK'
    },
    {
      name: 'tagline',
      title: 'Slogan',
      type: 'string',
      initialValue: 'Güvenilir, deneyimli ve çözüm odaklı hukuk danışmanlığı'
    },
    {
      name: 'description',
      title: 'Site Açıklaması',
      type: 'text',
      initialValue: 'Samsun merkezli avukatlık ve danışmanlık hizmetleri. Güvenilir ve çözüm odaklı yaklaşım.'
    },
    {
      name: 'contactInfo',
      title: 'İletişim Bilgileri',
      type: 'object',
      fields: [
        {
          name: 'phone',
          title: 'Telefon',
          type: 'string',
          initialValue: '+90 (362) 000 00 00'
        },
        {
          name: 'email',
          title: 'E-posta',
          type: 'string',
          initialValue: 'info@akilhukuk.com'
        },
        {
          name: 'address',
          title: 'Adres',
          type: 'string',
          initialValue: 'İstiklal Cd. No: 00, Samsun'
        }
      ]
    }
  ]
}
```

## 2. Homepage Section Schema

```javascript
// schemas/homepageSection.js
export default {
  name: 'homepageSection',
  title: 'Ana Sayfa Bölümleri',
  type: 'document',
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
          { title: 'Blog', value: 'blog' },
          { title: 'CTA', value: 'cta' }
        ]
      }
    },
    {
      name: 'order',
      title: 'Sıra',
      type: 'number'
    },
    {
      name: 'title',
      title: 'Başlık',
      type: 'string'
    },
    {
      name: 'subtitle',
      title: 'Alt Başlık',
      type: 'text'
    },
    {
      name: 'description',
      title: 'Açıklama',
      type: 'text'
    },
    {
      name: 'ctaText',
      title: 'Buton Metni',
      type: 'string'
    },
    {
      name: 'ctaSubtext',
      title: 'Buton Alt Metni',
      type: 'string'
    },
    {
      name: 'ctaLink',
      title: 'Buton Linki',
      type: 'string'
    }
  ]
}
```

## 3. Team Section Schema

```javascript
// schemas/teamSection.js
export default {
  name: 'teamSection',
  title: 'Ekip Bölümü',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Başlık',
      type: 'string',
      initialValue: 'Çalışma Arkadaşlarımız'
    },
    {
      name: 'subtitle',
      title: 'Alt Başlık',
      type: 'text',
      initialValue: 'Deneyimli ve uzman ekibimizle tanışın. Her biri kendi alanında uzmanlaşmış avukatlarımız.'
    },
    {
      name: 'ctaText',
      title: 'Buton Metni',
      type: 'string',
      initialValue: 'Tüm Ekibi Gör'
    },
    {
      name: 'ctaLink',
      title: 'Buton Linki',
      type: 'string',
      initialValue: '/calisanlar'
    }
  ]
}
```

## 4. Blog Section Schema

```javascript
// schemas/blogSection.js
export default {
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
}
```

## 5. Services Section Schema

```javascript
// schemas/servicesSection.js
export default {
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
}
```

## 6. CTA Section Schema

```javascript
// schemas/ctaSection.js
export default {
  name: 'ctaSection',
  title: 'CTA Bölümü',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Başlık',
      type: 'string',
      initialValue: 'Hızlı Danışmanlık Talebi'
    },
    {
      name: 'subtitle',
      title: 'Alt Başlık',
      type: 'text',
      initialValue: 'Kısa formu doldurun, aynı gün içinde size dönüş yapalım.'
    },
    {
      name: 'ctaText',
      title: 'Buton Metni',
      type: 'string',
      initialValue: 'İletişim Formu'
    },
    {
      name: 'ctaLink',
      title: 'Buton Linki',
      type: 'string',
      initialValue: '/iletisim'
    }
  ]
}
```

## 7. Contact Page Schema

```javascript
// schemas/contactPage.js
export default {
  name: 'contactPage',
  title: 'İletişim Sayfası',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Başlık',
      type: 'string',
      initialValue: 'İletişim'
    },
    {
      name: 'subtitle',
      title: 'Alt Başlık',
      type: 'text',
      initialValue: 'Hukuki danışmanlık ihtiyaçlarınız için bizimle iletişime geçin. Uzman ekibimiz size en kısa sürede dönüş yapacaktır.'
    },
    {
      name: 'description',
      title: 'Açıklama',
      type: 'text'
    },
    {
      name: 'formTitle',
      title: 'Form Başlığı',
      type: 'string',
      initialValue: 'Mesaj Gönderin'
    },
    {
      name: 'formDescription',
      title: 'Form Açıklaması',
      type: 'text',
      initialValue: 'Hukuki danışmanlık ihtiyacınızı detaylandırın. Uzman ekibimiz size en kısa sürede dönüş yapacaktır.'
    },
    {
      name: 'officeInfo',
      title: 'Ofis Bilgileri',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Başlık',
          type: 'string',
          initialValue: 'Ofis Bilgileri'
        },
        {
          name: 'address',
          title: 'Adres',
          type: 'string',
          initialValue: 'İstiklal Caddesi No: 00\nMerkez, Samsun'
        },
        {
          name: 'phone',
          title: 'Telefon',
          type: 'string',
          initialValue: '+90 (362) 000 00 00'
        },
        {
          name: 'email',
          title: 'E-posta',
          type: 'string',
          initialValue: 'info@akilhukuk.com'
        },
        {
          name: 'workingHours',
          title: 'Çalışma Saatleri',
          type: 'text',
          initialValue: 'Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 09:00 - 13:00\nPazar: Kapalı'
        },
        {
          name: 'emergencyContact',
          title: 'Acil Durum Açıklaması',
          type: 'text',
          initialValue: 'Acil hukuki danışmanlık ihtiyacınız için 7/24 ulaşabileceğiniz numaramız:'
        }
      ]
    }
  ]
}
```

## Kullanım Talimatları

1. Bu schema'ları Sanity Studio'da oluşturun
2. Her schema için gerekli içerikleri ekleyin
3. Site ayarlarını tek seferlik yapılandırın
4. Ana sayfa bölümlerini düzenleyin
5. Diğer sayfa bölümlerini yapılandırın

Bu şekilde tüm statik yazılar Sanity'den yönetilebilir hale gelecek!
