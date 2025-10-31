import './globals.css'

export const metadata = {
  title: 'Campus Connect - Student Community',
  description: 'Connect with students across Kenyan universities',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
