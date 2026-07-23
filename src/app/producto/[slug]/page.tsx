// src/app/producto/[slug]/page.tsx
// Página individual de producto: cada producto tiene su propio link
// (ej: /producto/polera-premium-cuello-v-2) que se puede copiar y compartir.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findBySlug } from '@/data/products';
import ProductoPageClient from './ProductoPageClient';

export const dynamic = 'force-dynamic';

type ProductoPageProps = {
  params: { slug: string };
};

export function generateMetadata({ params }: ProductoPageProps): Metadata {
  const product = findBySlug(params.slug);

  if (!product) {
    return {
      title: 'Producto no encontrado | estampadospatron.com',
    };
  }

  return {
    title: `${product.n} | estampadospatron.com`,
    description: product.desc,
  };
}

export default function ProductoPage({ params }: ProductoPageProps) {
  const product = findBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductoPageClient product={product} />;
}
