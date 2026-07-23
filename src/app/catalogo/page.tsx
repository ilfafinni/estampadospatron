'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES, PRODUCTS, catLabel, slugify, type Categoria, type Product } from '@/data/products';

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
    <div style={{ minHeight: '100vh', background: '#fff', color: '#111', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ borderBottom: '1px solid #e0e0e0', background: '#fff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em' }}>
              PATRÓN<span style={{ color: '#e53935' }}>.</span>CL
            </div>
            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666' }}>
              Catálogo de productos
            </div>
          </Link>

          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              style={{ width: '100%', padding: '10px 16px 10px 42px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#f5f5f5' }}
            />
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </form>

          <Link href="/" style={{ color: '#111', fontSize: '13px', fontWeight: 700, textDecoration: 'none', padding: '10px 16px', border: '1px solid #e0e0e0', borderRadius: '6px' }}>
            Volver al inicio
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#e53935', marginBottom: '0.8rem' }}>
            Catálogo completo
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 2.4vw, 2.7rem)', fontWeight: 800, margin: '0 0 0.75rem', lineHeight: 1.1 }}>
            Productos personalizados para tu marca o evento
          </h1>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, maxWidth: '760px', margin: 0 }}>
            Elige entre poleras, polerones, tazas, accesorios y más. Desde 1 unidad, con impresión lista para tu empresa o regalo.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {([['todos', 'Todos'], ['poleras', 'Poleras'], ['polerones', 'Polerones'], ['tazas', 'Tazas'], ['accesorios', 'Accesorios'], ['deportiva', 'Deportiva'], ['impresion', 'Impresión']] as const).map(([c, label]) => (
            <button
              key={c}
              onClick={() => goToCat(c as 'todos' | Categoria)}
              style={{
                border: '1px solid ' + (activeCat === c ? '#111' : '#e0e0e0'),
                background: activeCat === c ? '#111' : '#fff',
                color: activeCat === c ? '#fff' : '#333',
                padding: '8px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '16px' }}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#666', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '2px solid #111' }}>
      {text}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const badgeColors: Record<string, string> = {
    popular: '#e53935', eco: '#2e7d32', pack: '#1565c0', nuevo: '#111',
  };

  return (
    <Link href={`/producto/${slugify(product)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
        <div style={{ aspectRatio: '1', background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          {product.img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.img} alt={product.n} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '3rem', opacity: 0.5 }}>■</span>
          )}
          {product.badge && (
            <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '2px', background: badgeColors[product.badge] || '#111', color: '#fff' }}>
              {product.badge}
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(17,17,17,0.9)', color: '#fff', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '10px', textAlign: 'center' }}>
            Ver producto
          </div>
        </div>

        <div style={{ padding: '12px 14px 14px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>{catLabel(product.c)}</div>
          <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3, color: '#111', marginBottom: '6px' }}>{product.n}</div>
          <div style={{ fontSize: '10px', color: '#999', fontWeight: 500, letterSpacing: '0.06em', marginBottom: '8px' }}>Ref: {product.ref}</div>
          {product.v.col && (
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {product.v.col.map((c) => (
                <div key={c.n} title={c.n} style={{ width: '16px', height: '16px', borderRadius: '50%', background: c.h, border: '1.5px solid rgba(0,0,0,0.15)' }} />
              ))}
            </div>
          )}
          {product.precio && <span style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>{product.precio}</span>}
        </div>
      </div>
    </Link>
  );
}
