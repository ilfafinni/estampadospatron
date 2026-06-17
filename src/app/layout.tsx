// src/app/layout.tsx

import type { Metadata } from 'next';
import { CartProvider } from '@/lib/CartContext';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'Patronestampados.cl — Estampados Personalizados | Ropa Roly',
  description: 'Tienda de estampados personalizados en Santiago. Poleras, polerones, tazas y más. Catálogo Roly Chile. Desde 1 unidad. Pago con Webpay.',
  keywords: ['estampados', 'personalizados', 'poleras', 'roly', 'santiago', 'chile'],
  openGraph: {
    title: 'Patronestampados.cl',
    description: 'Estampados personalizados en Santiago. Desde 1 unidad.',
    url: 'https://patronestampados.cl',
    siteName: 'Patronestampados.cl',
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
