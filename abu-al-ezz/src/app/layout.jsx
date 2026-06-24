import './globals.css'
import { Playfair_Display, Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { LanguageProvider } from '@/context/LanguageContext'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { CatalogProvider } from '@/context/CatalogContext'
import CookieConsent from '@/components/ui/CookieConsent'
import MobileBottomNav from '@/components/ui/MobileBottomNav'
import BackToTop from '@/components/ui/BackToTop'
import { ToastProvider } from '@/context/ToastContext'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const title = 'Abu Al-Ezz Institution | مؤسسة أبو العز و أولاده';
const description = 'Quality Household Items, Heaters & Hookah Products in Lebanon';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  icons: { icon: '/logo.png' },
  alternates: { canonical: siteUrl },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Abu Al-Ezz Institution',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Abu Al-Ezz Institution — Household Items, Heaters & Hookah, Lebanon' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Abu Al-Ezz Institution',
  alternateName: 'مؤسسة أبو العز و أولاده',
  description: 'Family-run store in Borjein, Iqlim Al-Kharoub, Lebanon — household items, heaters and hookah products. Bulk orders shipped outside Lebanon.',
  telephone: '+961 78 885 719',
  url: siteUrl,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Borjein',
    addressRegion: 'Iqlim Al-Kharoub',
    addressCountry: 'LB',
  },
  areaServed: ['Lebanon', 'Outside Lebanon'],
  priceRange: '$$',
}

export default function RootLayout({ children }) {
  const fontVars = `${playfair.variable} ${cormorant.variable} ${dmSans.variable}`

  return (
    <html lang="en" className={fontVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C9A84C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Abu Al-Ezz" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <LanguageProvider>
              <CatalogProvider>
                <ToastProvider>
                  <div className="pb-16 md:pb-0">
                    {children}
                  </div>
                  <MobileBottomNav />
                  <BackToTop />
                  <CookieConsent />
                </ToastProvider>
              </CatalogProvider>
            </LanguageProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
