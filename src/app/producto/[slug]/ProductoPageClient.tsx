'use client';

import Link from 'next/link';
import type { Product } from '@/data/products';
import { useCart } from '@/lib/CartContext';
import ProductDetail from '@/components/ProductDetail';

export default function ProductoPageClient({ product }: { product: Product }) {
  const { totalItems, toggleCart } = useCart();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#fff', color: '#111', minHeight: '100vh' }}>
      {/* Header simple con logo y carrito */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0 1.5rem', height: '64px', maxWidth: '1400px', margin: '0 auto' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.03em', color: '#111', lineHeight: 1 }}>
              PATRÓN<span style={{ color: '#e53935' }}>.</span>CL
            </div>
          </Link>
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={toggleCart}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#111', fontSize: '12px', fontWeight: 600, background: 'none', border: '1px solid #e0e0e0', borderRadius: '3px', padding: '8px 14px', fontFamily: 'inherit', position: 'relative' }}
            >
              🛒 Carrito {totalItems > 0 && `(${totalItems})`}
            </button>
          </div>
        </div>
      </header>

      <ProductDetail product={product} />
    </div>
  );
}
