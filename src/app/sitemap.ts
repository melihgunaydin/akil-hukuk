import { client } from "@/lib/sanity.client"
import { groq } from "next-sanity"

export const revalidate = 60 * 60 // her saatte bir yeniden oluştur

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://akilhukuk.com"

  const [pages, posts, people] = await Promise.all([
    client.fetch(groq`*[_type=="page"]{ "slug": slug.current }`),
    client.fetch(groq`*[_type=="post"]{ "slug": slug.current, publishedAt }`),
    client.fetch(groq`*[_type=="person"]{ "slug": slug.current }`),
  ])

  const staticRoutes = [
    "",
    "/blog",
    "/iletisim",
    "/calisanlar",
    // eğer alias kullandıysan:
    "/calisma-arkadaslarimiz",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }))

  const dynamicRoutes = [
    ...pages.map((p: any) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: new Date().toISOString(),
    })),
    ...posts.map((p: any) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.publishedAt || new Date().toISOString(),
    })),
    ...people.map((p: any) => ({
      url: `${baseUrl}/calisanlar/${p.slug}`,
      lastModified: new Date().toISOString(),
    })),
  ]

  return [...staticRoutes, ...dynamicRoutes]
}
