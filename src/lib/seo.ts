import type { Metadata } from "next"

const SITE_NAME = "Akil Hukuk"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
const DEFAULT_KEYWORDS = [
  "Akil Hukuk",
  "Samsun avukat",
  "hukuk bürosu",
  "hukuki danışmanlık",
  "iş hukuku",
  "aile hukuku",
  "ticaret hukuku",
]

// küçük yardımcı
export function absUrl(path = "/") {
  try {
    return new URL(path, SITE_URL).toString()
  } catch {
    return SITE_URL
  }
}

type DateLike = string | Date | null | undefined

const toIsoDate = (value: DateLike) => {
  if (!value) return undefined
  try {
    return (value instanceof Date ? value : new Date(value)).toISOString()
  } catch {
    return undefined
  }
}

type SeoInput = {
  title?: string | null
  description?: string | null
  path?: string
  image?: string | null
  keywords?: string[] | string | null
  ogType?: "website" | "article" | "profile" | "legalService"
  publishedTime?: DateLike
  modifiedTime?: DateLike
  authors?: string[] | string | null
  robots?: Metadata["robots"]
  locale?: string
}

export function buildMetadata(input: SeoInput): Metadata {
  const title = input.title ?? SITE_NAME
  const description =
    input.description ??
    "Akil Hukuk, Samsun’da bireylere ve kurumlara profesyonel hukuk danışmanlığı sunar. Blogumuzda güncel hukuki içerikleri keşfedin."

  const url = absUrl(input.path ?? "/")
  const ogImage = input.image ?? absUrl("/og-default.jpg")
  const keywordsRaw = input.keywords ?? DEFAULT_KEYWORDS
  const keywords =
    typeof keywordsRaw === "string" ? keywordsRaw.split(",").map((kw) => kw.trim()).filter(Boolean) : keywordsRaw
  const ogType = input.ogType ?? "website"
  const resolvedOgType = ogType === "legalService" ? "website" : ogType
  const authorsRaw = input.authors
  const authors =
    typeof authorsRaw === "string"
      ? [authorsRaw].filter(Boolean)
      : Array.isArray(authorsRaw)
        ? authorsRaw.filter(Boolean)
        : undefined
  const locale = input.locale ?? "tr_TR"

  const metadata: Metadata = {
    title: { default: SITE_NAME, template: "%s | Akil Hukuk" },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        tr: url,
      },
    },
    openGraph: {
      type: resolvedOgType,
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? SITE_NAME,
      description,
      images: [ogImage],
    },
    icons: {
      icon: "/logo.svg",
      shortcut: "/logo.svg",
      apple: "/logo.svg",
    },
  }

  if (keywords && keywords.length > 0) {
    metadata.keywords = keywords
  }

  if (authors && authors.length > 0) {
    metadata.authors = authors.map((name) => ({ name }))
    metadata.twitter = {
      ...metadata.twitter,
      creator: authors[0],
    }
  }

  const publishedTime = toIsoDate(input.publishedTime)
  const modifiedTime = toIsoDate(input.modifiedTime ?? input.publishedTime)

  if (resolvedOgType === "article") {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors && authors.length > 0 ? { authors } : {}),
    }
  }

  if (input.robots) {
    metadata.robots = input.robots
  }

  return metadata
}
