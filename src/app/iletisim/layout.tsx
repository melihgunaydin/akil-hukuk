import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'İletişim - Akil Hukuk',
  description: 'Akil Hukuk ile iletişime geçin. Hukuki danışmanlık talepleriniz için bizimle iletişime geçin.',
  path: '/iletisim',
})

export default function IletisimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
