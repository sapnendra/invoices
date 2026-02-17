import './globals.css'
import Providers from '@/components/Providers'

export const metadata = {
  title: 'Invoices - Meru Technosoft',
  description: 'Invoice management and payment processing with Google authentication',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.svg',
  },
  themeColor: '#3B82F6',
  manifest: '/site.webmanifest',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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
