import './globals.css'

export const metadata = {
  title: 'Invoice Details',
  description: 'Invoice management and payment processing',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
