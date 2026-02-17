import './globals.css'
import Providers from '@/components/Providers'

export const metadata = {
  title: 'Invoice Manager - Meru Technosoft',
  description: 'Invoice management and payment processing powered by Meru Technosoft',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
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
