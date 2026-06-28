// src/app/layout.tsx

import type { Metadata } from 'next';
import { CartProvider } from '@/lib/CartContext';
import CartDrawer from '@/components/CartDrawer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://estampadospatron.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Estampados Patrón — Estampados Personalizados',
  description: 'Tienda de estampados personalizados en Santiago. Poleras, polerones, tazas y más. Desde 1 unidad. Pago con Webpay.',
  keywords: ['estampados', 'personalizados', 'poleras', 'santiago', 'chile'],
  openGraph: {
    title: 'Estampados Patrón',
    description: 'Estampados personalizados en Santiago. Desde 1 unidad.',
    url: siteUrl,
    siteName: 'Estampados Patrón',
    locale: 'es_CL',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Inter, Arial, sans-serif' }}>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
