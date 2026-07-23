'use client';
// src/app/producto/[slug]/ProductoPageClient.tsx

import Link from 'next/link';
import type { Product } from '@/data/products';
import { useCart } from '@/lib/CartContext';
import ProductDetail from '@/components/ProductDetail';
import { useTheme } from '@/components/ThemeProvider';

const WHATSAPP_URL = 'https://wa.me/56966389299';

export default function ProductoPageClient({ product }: { product: Product }) {
  const { totalItems, toggleCart } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Topbar */}
      <div style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', textAlign: 'center', padding: '8px 1rem', fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', borderBottom: '1px solid var(--border-light)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          Retiro Express en 4 hrs · Curicó
        </span>
        <span style={{ opacity: 0.5, margin: '0 16px' }}>·</span>
        <span>Desde 1 unidad</span>
        <span style={{ opacity: 0.5, margin: '0 16px' }}>·</span>
        <span>Despacho a todo Chile</span>
      </div>

      {/* Header */}
      <header style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0 2rem', height: '72px', maxWidth: '1400px', margin: '0 auto' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/images/logo.png" alt="Estampados Patrón" width="36" height="36" style={{ borderRadius: '8px', objectFit: 'cover' }} onError={(e) => { const img = e.currentTarget; img.style.display = 'none'; const next = img.nextElementSibling as HTMLElement; if (next) next.style.display = 'block'; }} />
            <div style={{ display: 'none', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>
              ESTAMPADOS <span style={{ color: 'var(--color-accent)' }}>PATRÓN</span>
            </div>
            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '1px' }}>
              Estampados Personalizados
            </div>
          </Link>

          <div style={{ flex: 1, maxWidth: '520px', position: 'relative', display: 'none' }}>
            <input
              placeholder="Buscar productos..."
              style={{
                width: '100%', padding: '10px 16px 10px 42px', border: '1px solid var(--border-medium)',
                borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', outline: 'none',
                background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
              }}
            />
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-primary)', transition: 'all var(--transition)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
            >
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'block' }}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'block' }}>
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>

            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <button style={{ background: 'var(--color-accent)', color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '11px 22px', borderRadius: '6px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }}>
                Cotizar
              </button>
            </a>

            <button
              onClick={toggleCart}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '10px', fontWeight: 500, background: 'none', border: 'none', fontFamily: 'inherit', padding: '4px 8px', borderRadius: '6px', position: 'relative', transition: 'background 0.2s' }}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: 'var(--color-accent)', color: '#fff', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '10px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
              Carrito
            </button>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav style={{ background: 'var(--bg-card)', borderBottom: '2px solid var(--text-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', gap: '0' }}>
          {[
            { label: 'Inicio', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { label: 'Poleras', onClick: () => { window.location.href = '/?cat=poleras'; } },
            { label: 'Polerones', onClick: () => { window.location.href = '/?cat=polerones'; } },
            { label: 'Tazas', onClick: () => { window.location.href = '/?cat=tazas'; } },
            { label: 'Deportiva', onClick: () => { window.location.href = '/?cat=deportiva'; } },
            { label: 'Accesorios', onClick: () => { window.location.href = '/?cat=accesorios'; } },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.onClick}
              style={{
                padding: '14px 20px', fontSize: '13px', fontWeight: 600,
                letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--text-primary)',
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                whiteSpace: 'nowrap', position: 'relative',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <ProductDetail product={product} />
    </div>
  );
}