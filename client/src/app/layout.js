import './globals.css'
import Providers from '@/components/Providers'

export const metadata = {
  title: 'Invoices - Meru Technosoft',
  description: 'Invoice management and payment processing with Google authentication',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.svg',
  },
  manifest: '/site.webmanifest',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3B82F6',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
