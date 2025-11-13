export default function robots() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://akilhukuk.com"
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio"], // Sanity Studio’yu indexleme
      },
      sitemap: `${siteUrl}/sitemap.xml`,
    }
  }
  