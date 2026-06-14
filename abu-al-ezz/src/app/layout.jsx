import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { CatalogProvider } from '@/context/CatalogContext'

export const metadata = {
  title: 'Abu Al-Ezz Institution | مؤسسة أبو العز و أولاده',
  description: 'Quality Household Items, Heaters & Hookah Products in Lebanon',
  icons: { icon: '/logo.png' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <LanguageProvider>
              <CatalogProvider>
                {children}
              </CatalogProvider>
            </LanguageProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
