// src/lib/queries.ts
import groq from 'groq'

// Type definitions
export interface SiteSettings {
  siteName?: string
  tagline?: string
  description?: string
  homepageAboutTitle?: string
  homepageAboutIntro?: string
  homepageAboutSecondary?: string
  contactInfo?: {
    phone?: string
    email?: string
    address?: string
  }
  practiceAreasTitle?: string
  practiceAreas?: string[]
  footerNote?: string
}

export interface FooterSectionItem {
  _key?: string
  sectionType: 'info' | 'menu' | 'contact'
  title?: string
  description?: string
  order?: number
}

export interface HomepageSection {
  sectionType: 'hero' | 'services' | 'team' | 'blog' | 'cta' | 'about' | 'footer'
  order?: number
  title?: string
  subtitle?: string
  imageUrl?: string
  imageAlt?: string
  description?: string
  ctaText?: string
  ctaSubtext?: string
  ctaLink?: string
  buttons?: Array<{
    text: string
    link: string
    style: 'primary' | 'secondary'
  }>
  footerSections?: FooterSectionItem[]
}

export interface BrandingSettings {
  siteName?: string
  logoAlt?: string
  logoWidth?: number
  logoScale?: number
  logo?: {
    url?: string
    dimensions?: {
      width?: number
      height?: number
    }
  }
}

export interface AboutPage {
  heroTitle?: string
  heroSubtitle?: string
  missionVision?: Array<{
    _key?: string
    variant?: 'mission' | 'vision'
    title?: string
    description?: string
    icon?: string
  }>
  valuesTitle?: string
  values?: Array<{
    _key?: string
    title?: string
    description?: string
    icon?: string
  }>
  practiceAreasTitle?: string
  practiceAreas?: string[]
  body?: any[]
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  ctaButtonLink?: string
}


export interface ContactPage {
  title?: string
  subtitle?: string
  description?: string
  formTitle?: string
  formDescription?: string
  officeInfo?: {
    title?: string
    address?: string
    phone?: string
    email?: string
    workingHours?: string
    emergencyContact?: string
  }
}

export const menuQuery = groq`*[_type=="navigation"] | order(order asc){ title, url }`

export const pagesQuery = groq`*[_type=="page"]{
  title, "slug": slug.current, content, seoDescription
}`

export const pageBySlugQuery = groq`*[_type=="page" && slug.current==$slug][0]{
  title,
  "slug": slug.current,
  content,
  seoDescription,
  "seoImageUrl": seoImage.asset->url
}`

export const postListQuery = groq`*[_type=="post"] | order(publishedAt desc){
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "coverUrl": coverImage.asset->url
}`
export const postBySlugQuery = groq`*[_type=="post" && slug.current==$slug][0]{
  title,
  "slug": slug.current,
  content,
  excerpt,
  seoDescription,
  publishedAt,
  "coverUrl": coverImage.asset->url,
  "seoImageUrl": seoImage.asset->url,
  author->{
    name,
    role,
    "photoUrl": photo.asset->url,
    "slug": slug.current
  },
  relatedPosts[]->{
    title,
    "slug": slug.current,
    publishedAt
  }
}`

export const peopleQuery = groq`*[_type=="person"] | order(name asc){
  name, role, "slug": slug.current, "photoUrl": photo.asset->url, bio, email, phone
}`

export const personBySlugQuery = groq`*[_type=="person" && slug.current==$slug][0]{
  name, role, "slug": slug.current, "photoUrl": photo.asset->url, bio, email, phone
}`

// Site Settings
export const siteSettingsQuery = groq`*[_type=="siteSettings"][0]{
  siteName,
  tagline,
  description,
  contactInfo{
    phone,
    email,
    address
  },
  homepageAboutTitle,
  homepageAboutIntro,
  homepageAboutSecondary,
  practiceAreasTitle,
  practiceAreas,
  footerNote
}`

export const brandingSettingsQuery = groq`*[_type=="brandingSettings"][0]{
  siteName,
  logoAlt,
  logoWidth,
  logoScale,
  logo{
    "url": asset->url,
    "dimensions": asset->metadata.dimensions
  }
}`

// Homepage Sections
export const homepageSectionsQuery = groq`*[_type=="homepageSection"] | order(order asc){
  sectionType,
  title,
  subtitle,
  "imageUrl": image.asset->url,
  imageAlt,
  description,
  cards[]{
    _key,
    title,
    description
  },
  values[]{
    _key,
    title,
    description
  },
  ctaText,
  ctaSubtext,
  ctaLink,
  buttons[]{
    text,
    link,
    style
  },
  footerSections[]{
    _key,
    sectionType,
    title,
    description,
    order
  }
}`

export const aboutPageQuery = groq`*[_type=="aboutPage"][0]{
  heroTitle,
  heroSubtitle,
  missionVision[]{
    _key,
    variant,
    title,
    description,
    icon
  },
  valuesTitle,
  values[]{
    _key,
    title,
    description,
    icon
  },
  practiceAreasTitle,
  practiceAreas,
  body,
  ctaTitle,
  ctaDescription,
  ctaButtonText,
  ctaButtonLink
}`


// Contact Page
export const contactPageQuery = groq`*[_type=="contactPage"][0]{
  title,
  subtitle,
  description,
  formTitle,
  formDescription,
  officeInfo{
    title,
    address,
    phone,
    email,
    workingHours,
    emergencyContact
  }
}`
