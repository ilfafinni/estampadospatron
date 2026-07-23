'use client';
// src/app/producto/[slug]/ProductoPageClient.tsx

import Link from 'next/link';
import type { Product } from '@/data/products';
import { useCart } from '@/lib/CartContext';
import ProductDetail from '@/components/ProductDetail';
import Header from '@/components/Header';

const WHATSAPP_URL = 'https://wa.me/56966389299';

export default function ProductoPageClient({ product }: { product: Product }) {
  const { totalItems, toggleCart } = useCart();

  return (
    <div style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <Header showSearch={false} showHamburger={true} />
      
      <ProductDetail product={product} />
    </div>
  );
}