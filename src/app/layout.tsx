// src/app/layout.tsx

import type { Metadata } from 'next';
import { CartProvider } from '@/lib/CartContext';
import CartDrawer from '@/components/CartDrawer';
import { ThemeProvider } from '@/components/ThemeProvider';

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
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/images/logo.png" sizes="any" />
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <style>{`
          * { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; width: 100%; max-width: 100vw; }
          ::selection { background: var(--color-primary); color: #fff; }
          a { color: inherit; }
          button { font-family: inherit; }
          input, select, textarea { font-family: inherit; max-width: 100%; }
          :focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
          img, video { max-width: 100%; height: auto; }

          /* CSS Variables for theming */
          :root {
            --color-primary: #1e40af;
            --color-primary-hover: #1e3a8a;
            --color-primary-light: #dbeafe;
            --color-accent: #1e40af;
            --color-accent-hover: #1e3a8a;
            --color-success: #22c55e;
            --color-whatsapp: #25D366;
            --bg-primary: #ffffff;
            --bg-secondary: #fafafa;
            --bg-tertiary: #f3f4f6;
            --bg-card: #ffffff;
            --text-primary: #111827;
            --text-secondary: #374151;
            --text-muted: #6b7280;
            --text-light: #9ca3af;
            --border-light: #e5e7eb;
            --border-medium: #d1d5db;
            --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
            --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
            --shadow-lg: 0 10px 30px rgba(0,0,0,0.12);
            --radius-sm: 4px;
            --radius-md: 6px;
            --radius-lg: 8px;
            --radius-full: 999px;
            --transition: 0.2s ease;
          }

          .dark {
            --color-primary: #3b82f6;
            --color-primary-hover: #2563eb;
            --color-primary-light: #1e3a5f;
            --color-accent: #3b82f6;
            --color-accent-hover: #2563eb;
            --color-success: #22c55e;
            --color-whatsapp: #25D366;
            --bg-primary: #0f172a;
            --bg-secondary: #111827;
            --bg-tertiary: #1f2937;
            --bg-card: #1e293b;
            --text-primary: #f9fafb;
            --text-secondary: #e5e7eb;
            --text-muted: #9ca3af;
            --text-light: #6b7280;
            --border-light: #374151;
            --border-medium: #4b5563;
            --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
            --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
            --shadow-lg: 0 10px 30px rgba(0,0,0,0.5);
          }

          /* Dark mode transition */
          *, *::before, *::after {
            transition: background-color var(--transition), border-color var(--transition), color var(--transition), box-shadow var(--transition);
          }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0, background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <CartProvider>
          <ThemeProvider>
            {children}
            <CartDrawer />
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}