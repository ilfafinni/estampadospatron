// src/app/layout.tsx

import type { Metadata } from 'next';
import { CartProvider } from '@/lib/CartContext';
import CartDrawer from '@/components/CartDrawer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://estampadospatron.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Estampados Patrón — Estampados Personalizados',
  description: 'Tienda de estampados personalizados en Curicó. Poleras, polerones, tazas y más. Desde 1 unidad. Pago con Webpay.',
  keywords: ['estampados', 'personalizados', 'poleras', 'curicó', 'chile'],
  openGraph: {
    title: 'Estampados Patrón',
    description: 'Estampados personalizados en Curicó. Desde 1 unidad.',
    url: siteUrl,
    siteName: 'Estampados Patrón',
    locale: 'es_CL',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
          ::selection { background: #dc2626; color: #fff; }
          a { color: inherit; }
          button { font-family: inherit; }
          input, select, textarea { font-family: inherit; }
          :focus-visible { outline: 2px solid #dc2626; outline-offset: 2px; }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
