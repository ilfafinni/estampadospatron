'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES, PRODUCTS, catLabel, slugify, type Categoria, type Product } from '@/data/products';
import Header from '@/components/Header';

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
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontSize: '16px', fontWeight: 500 }}>No hay productos en esta categoría</p>
            <p style={{ fontSize: '14px', marginTop: '0.5rem' }}>Prueba con otra categoría o busca otro término</p>
          </div>
        )}
      </main>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const badgeColors: Record<string, string> = {
    popular: '#ef4444', eco: '#22c55e', pack: '#3b82f6', nuevo: '#111',
  };

  return (
    <Link href={`/producto/${slugify(product)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', position: 'relative', transition: 'box-shadow 0.2s, transform 0.2s', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ aspectRatio: '1', background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          {product.img ? (
            <img src={product.img} alt={product.n} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
          ) : (
            <span style={{ fontSize: '3rem', opacity: 0.5 }}>■</span>
          )}
          {product.badge && (
            <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '2px', background: badgeColors[product.badge] || '#111', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              {product.badge}
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(17,17,17,0.9)', color: '#fff', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '10px', textAlign: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
            Ver producto
          </div>
        </div>

        <div style={{ padding: '12px 14px 14px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>{catLabel(product.c)}</div>
          <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3, color: 'var(--text-primary)', marginBottom: '6px' }}>{product.n}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-light)', fontWeight: 500, letterSpacing: '0.06em', marginBottom: '8px' }}>Ref: {product.ref}</div>
          {product.v.col && (
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {product.v.col.map((c) => (
                <div key={c.n} title={c.n} style={{ width: '16px', height: '16px', borderRadius: '50%', background: c.h, border: '1.5px solid var(--border-light)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
              ))}
            </div>
          )}
          {product.precio && <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{product.precio}</span>}
        </div>
      </div>
    </Link>
  );
}