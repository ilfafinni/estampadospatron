'use client';

import Link from 'next/link';
import type { Product } from '@/data/products';
import { useCart } from '@/lib/CartContext';
import ProductDetail from '@/components/ProductDetail';

const WHATSAPP_URL = 'https://wa.me/56966389299';

export default function ProductoPageClient({ product }: { product: Product }) {
  const { totalItems, toggleCart } = useCart();

  return (
    <div style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#fff', color: '#111', minHeight: '100vh' }}>
      {/* Topbar */}
      <div style={{ background: '#0f172a', color: '#fff', textAlign: 'center', padding: '8px 1rem', fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em' }}>
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
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0 2rem', height: '72px', maxWidth: '1400px', margin: '0 auto' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
            <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', color: '#111', lineHeight: 1 }}>
              ESTAMPADOS <span style={{ color: '#dc2626' }}>PATRÓN</span>
            </div>
            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', color: '#6b7280', textTransform: 'uppercase', marginTop: '1px' }}>
              Estampados Personalizados
            </div>
          </Link>

          <div style={{ flex: 1, maxWidth: '520px', position: 'relative', display: 'none' }}>
            <input
              placeholder="Buscar productos..."
              style={{
                width: '100%', padding: '10px 16px 10px 42px', border: '1px solid #e5e7eb',
                borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', outline: 'none',
                background: '#f9fafb',
              }}
            />
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <button style={{ background: '#dc2626', color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '11px 22px', borderRadius: '6px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }}>
                Cotizar
              </button>
            </a>

            <button
              onClick={toggleCart}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', color: '#111', fontSize: '10px', fontWeight: 500, background: 'none', border: 'none', fontFamily: 'inherit', padding: '4px 8px', borderRadius: '6px', position: 'relative', transition: 'background 0.2s' }}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
{totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: '#dc2626', color: '#fff', borderRadius: '50%',
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
      <nav style={{ background: '#fff', borderBottom: '2px solid #111' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', gap: '0' }}>
          {[
            { label: 'Inicio', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { label: 'Poleras', onClick: () => window.location.href = '/?cat=poleras' },
            { label: 'Polerones', onClick: () => window.location.href = '/?cat=polerones' },
            { label: 'Tazas', onClick: () => window.location.href = '/?cat=tazas' },
            { label: 'Deportiva', onClick: () => window.location.href = '/?cat=deportiva' },
            { label: 'Accesorios', onClick: () => window.location.href = '/?cat=accesorios' },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.onClick}
              style={{
                padding: '14px 20px', fontSize: '13px', fontWeight: 600,
                letterSpacing: '0.02em', textTransform: 'uppercase', color: '#111',
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
