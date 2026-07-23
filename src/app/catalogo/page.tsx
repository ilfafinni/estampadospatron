'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES, PRODUCTS, catLabel, slugify, type Categoria, type Product } from '@/data/products';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

export default function CatalogPage() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState<'todos' | Categoria>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat') as Categoria | null;
    if (cat && CATEGORIES.some((cc) => cc.c === cat)) {
      setActiveCat(cat);
    }

    const query = params.get('search') || '';
    if (query) {
      setSearchTerm(query);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    let products = activeCat === 'todos'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.c === activeCat);

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      products = products.filter((p) =>
        p.n.toLowerCase().includes(term) ||
        p.desc.toLowerCase().includes(term) ||
        p.ref.toLowerCase().includes(term)
      );
    }

    return products;
  }, [activeCat, searchTerm]);

  const goToCat = (cat: 'todos' | Categoria) => {
    setActiveCat(cat);
    const params = new URLSearchParams(window.location.search);
    params.delete('search');
    if (cat !== 'todos') {
      params.set('cat', cat);
    } else {
      params.delete('cat');
    }
    const query = params.toString();
    const nextUrl = query ? `/catalogo?${query}` : '/catalogo';
    router.replace(nextUrl);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const query = searchTerm.trim();
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    params.delete('cat');
    setActiveCat('todos');
    const nextUrl = params.toString() ? `/catalogo?${params.toString()}` : '/catalogo';
    router.replace(nextUrl);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <style>{`
        .product-grid { display: grid; gap: 16px; grid-template-columns: repeat(1, minmax(0, 1fr)); }
        @media (min-width: 641px) { .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (min-width: 1025px) { .product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        @media (min-width: 1281px) { .product-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
      `}</style>
      <Header showSearch={true} showHamburger={true} />
      
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.8rem' }}>
            Catálogo completo
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 2.4vw, 2.7rem)', fontWeight: 800, margin: '0 0 0.75rem', lineHeight: 1.1 }}>
            Productos personalizados para tu marca o evento
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '760px', margin: 0 }}>
            Elige entre poleras, polerones, tazas, accesorios y más. Desde 1 unidad, con impresión lista para tu empresa o regalo.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {([['todos', 'Todos'], ['poleras', 'Poleras'], ['polerones', 'Polerones'], ['tazas', 'Tazas'], ['accesorios', 'Accesorios'], ['deportiva', 'Deportiva'], ['impresion', 'Impresión']] as const).map(([c, label]) => (
            <button
              key={c}
              onClick={() => goToCat(c as 'todos' | Categoria)}
              style={{
                border: '1px solid ' + (activeCat === c ? 'var(--text-primary)' : 'var(--border-medium)'),
                background: activeCat === c ? 'var(--text-primary)' : 'var(--bg-card)',
                color: activeCat === c ? (activeCat === 'todos' ? '#fff' : '#fff') : 'var(--text-secondary)',
                padding: '8px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: 'block', margin: '0 auto' }}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <p style={{ fontSize: '16px', fontWeight: 500 }}>No hay productos en esta categoría</p>
            <p style={{ fontSize: '14px', marginTop: '0.5rem' }}>Prueba con otra categoría o busca otro término</p>
          </div>
        )}
      </main>
    </div>
  );
}