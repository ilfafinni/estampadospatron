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
        <meta name="theme-color" content="#000000" />
        <style>{`
          * { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; width: 100%; max-width: 100vw; }
          ::selection { background: var(--text-primary); color: var(--bg-primary); }
          a { color: inherit; }
          button { font-family: inherit; }
          input, select, textarea { font-family: inherit; max-width: 100%; }
          :focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
          img, video { max-width: 100%; height: auto; }

          /* CSS Variables for theming */
          :root {
            --color-primary: #ffffff;
            --color-primary-hover: #e4e4e7;
            --color-primary-light: #d4d4d8;
            --color-accent: #ffffff;
            --color-accent-hover: #d4d4d8;
            --color-success: #22c55e;
            --color-whatsapp: #25D366;
            --bg-primary: #000000;
            --bg-secondary: #0a0a0a;
            --bg-tertiary: #111111;
            --bg-card: #171717;
            --text-primary: #ffffff;
            --text-secondary: #e5e7eb;
            --text-muted: #a1a1aa;
            --text-light: #71717a;
            --border-light: #27272a;
            --border-medium: #3f3f46;
            --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
            --shadow-md: 0 4px 12px rgba(0,0,0,0.55);
            --shadow-lg: 0 10px 30px rgba(0,0,0,0.7);
            --radius-sm: 4px;
            --radius-md: 6px;
            --radius-lg: 8px;
            --radius-full: 999px;
            --transition: 0.2s ease;
          }

          .dark {
            --color-primary: #ffffff;
            --color-primary-hover: #e4e4e7;
            --color-primary-light: #d4d4d8;
            --color-accent: #ffffff;
            --color-accent-hover: #d4d4d8;
            --color-success: #22c55e;
            --color-whatsapp: #25D366;
            --bg-primary: #000000;
            --bg-secondary: #0a0a0a;
            --bg-tertiary: #111111;
            --bg-card: #171717;
            --text-primary: #ffffff;
            --text-secondary: #e5e7eb;
            --text-muted: #a1a1aa;
            --text-light: #71717a;
            --border-light: #27272a;
            --border-medium: #3f3f46;
            --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
            --shadow-md: 0 4px 12px rgba(0,0,0,0.55);
            --shadow-lg: 0 10px 30px rgba(0,0,0,0.7);
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