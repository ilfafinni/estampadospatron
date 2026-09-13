// src/app/producto/[slug]/page.tsx
// Página individual de producto: cada producto tiene su propio link
// (ej: /producto/polera-premium-cuello-v-2) que se puede copiar y compartir.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findBySlug, PRODUCTS } from '@/data/products';
import ProductoPageClient from './ProductoPageClient';

type ProductoPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + '-' + p.id }));
}

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
