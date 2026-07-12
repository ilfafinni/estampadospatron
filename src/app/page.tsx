'use client';
// src/app/page.tsx

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS, CATEGORIES, catLabel, slugify, type Product, type Categoria } from '@/data/products';
import { useCart } from '@/lib/CartContext';

const WHATSAPP_NUMBER_DISPLAY = '+56 9 6638 9299';
const WHATSAPP_URL = 'https://wa.me/56966389299';
const CONTACT_EMAIL = 'contacto@estampadospatron.com';

export default function HomePage() {
  const { totalItems, toggleCart } = useCart();
  const [activeCat, setActiveCat] = useState<'todos' | Categoria>('todos');
  const [slideIdx, setSlideIdx] = useState(0);
  const [toast, setToast] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Slider auto
  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  // Si llegamos desde /producto/[slug] con ?cat=, filtramos esa categoría
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat') as Categoria | null;
    if (cat && CATEGORIES.some(cc => cc.c === cat)) {
      setActiveCat(cat);
      setTimeout(() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, []);

  const filteredProducts = (() => {
    let products = activeCat === 'todos'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.c === activeCat);
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      products = products.filter(p => 
        p.n.toLowerCase().includes(term) || 
        p.desc.toLowerCase().includes(term) ||
        p.ref.toLowerCase().includes(term)
      );
    }
    return products;
  })();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const slides = [
    {
      bg: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',
      tag: 'Nueva colección',
      h1: <><span>Patrón</span><br />con tu diseño</>,
      p: 'Personaliza tus prendas y productos favoritos con tu logo o diseño. Desde 1 unidad.',
      cta: 'Ver poleras',
      onCta: () => { setActiveCat('poleras'); scrollToCat(); },
    },
    {
      bg: 'linear-gradient(135deg,#1a0a00 0%,#3d1a00 50%,#7a3500 100%)',
      tag: 'Personalización',
      h1: <>Tu marca en<br />cada prenda</>,
      p: 'Serigrafía, sublimación y bordado. El mejor acabado para tu empresa o evento corporativo.',
      cta: 'Cotizar ahora',
      onCta: () => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      bg: 'linear-gradient(135deg,#0a1a0a 0%,#1a3a1a 50%,#2d5016 100%)',
      tag: 'Express',
      h1: <>Retira en<br />4 horas</>,
      p: '¿Necesitas urgente? Contáctanos y coordinamos entrega express el mismo día en Curicó.',
      cta: 'WhatsApp',
      onCta: () => window.open(WHATSAPP_URL, '_blank'),
    },
  ];

  const scrollToCat = () => {
    setTimeout(() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#fff', color: '#111', overflowX: 'hidden' }}>

      {/* ── TOPBAR ── */}
      <div style={{ background: '#111', color: '#fff', textAlign: 'center', padding: '8px 1rem', fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em' }}>
        Retiro Express en 4 horas
        <span style={{ opacity: 0.7, margin: '0 12px' }}>·</span>
        Desde 1 unidad
        <span style={{ opacity: 0.7, margin: '0 12px' }}>·</span>
        Despacho a todo Chile
      </div>

      {/* ── HEADER ── */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0 2rem', height: '68px', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em', color: '#111', lineHeight: 1 }}>
              PATRÓN<span style={{ color: '#e53935' }}>.</span>CL
            </div>
            <div style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', color: '#666', textTransform: 'uppercase', marginTop: '1px' }}>
              Estampados Personalizados
            </div>
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
            <input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '10px 16px 10px 42px', border: '1px solid #e0e0e0',
                borderRadius: '4px', fontSize: '13px', fontFamily: 'inherit', outline: 'none',
                background: '#f5f5f5',
              }}
            />
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginLeft: 'auto' }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <button style={{ background: '#e53935', color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '10px 20px', borderRadius: '3px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Cotizar
              </button>
            </a>

            {/* Carrito */}
            <button
              onClick={toggleCart}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', color: '#111', fontSize: '10px', fontWeight: 500, background: 'none', border: 'none', fontFamily: 'inherit', padding: '4px 8px', borderRadius: '3px', position: 'relative' }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '-2px', right: '-2px',
                  background: '#e53935', color: '#fff', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '10px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {totalItems}
                </span>
              )}
              Carrito
            </button>
          </div>
        </div>
      </header>

      {/* ── NAV ── */}
      <nav style={{ background: '#fff', borderBottom: '2px solid #111' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', gap: '0' }}>
          {[
            { label: 'Inicio', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { label: 'Poleras', onClick: () => { setActiveCat('poleras'); scrollToCat(); } },
            { label: 'Polerones', onClick: () => { setActiveCat('polerones'); scrollToCat(); } },
            { label: 'Tazas', onClick: () => { setActiveCat('tazas'); scrollToCat(); } },
            { label: 'Deportiva', onClick: () => { setActiveCat('deportiva'); scrollToCat(); } },
            { label: 'Accesorios', onClick: () => { setActiveCat('accesorios'); scrollToCat(); } },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.onClick}
              style={{
                padding: '13px 18px', fontSize: '13px', fontWeight: 600,
                letterSpacing: '0.02em', textTransform: 'uppercase', color: '#111',
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ marginLeft: '8px', background: '#e53935', color: '#fff', padding: '4px 10px', border: 'none', borderRadius: '3px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            COTIZAR
          </button>
        </div>
      </nav>

      {/* ── HERO SLIDER ── */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#f5f5f5', minHeight: '420px' }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              display: i === slideIdx ? 'flex' : 'none',
              alignItems: 'center', minHeight: '420px', position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: slide.bg }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.1) 60%,transparent 100%)' }} />
            <div style={{ position: 'relative', zIndex: 2, padding: '4rem 5rem', maxWidth: '600px', color: '#fff' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#e53935', background: '#fff', padding: '4px 10px', borderRadius: '2px', display: 'inline-block', marginBottom: '1rem' }}>
                {slide.tag}
              </div>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                {slide.h1}
              </h1>
              <p style={{ fontSize: '14px', opacity: 0.85, marginBottom: '1.8rem', lineHeight: 1.6 }}>
                {slide.p}
              </p>
              <button
                onClick={slide.onCta}
                style={{ background: '#e53935', color: '#fff', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '13px 28px', borderRadius: '3px', border: 'none', cursor: 'pointer' }}
              >
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
        {/* Arrows */}
        <button onClick={() => setSlideIdx(i => (i - 1 + 3) % 3)} style={arrowStyle('left')}>‹</button>
        <button onClick={() => setSlideIdx(i => (i + 1) % 3)} style={arrowStyle('right')}>›</button>
        {/* Dots */}
        <div style={{ position: 'absolute', bottom: '1.2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '7px', zIndex: 10 }}>
          {[0, 1, 2].map(i => (
            <div key={i} onClick={() => setSlideIdx(i)} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === slideIdx ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }} />
          ))}
        </div>
      </div>

      {/* ── INFO STRIP ── */}
      <div style={{ background: '#f5f5f5', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '1.5rem 2rem', gap: '1rem' }}>
          {[
            { icon: '🚀', title: 'Retiro Express 4 horas', sub: 'Disponible en Curicó' },
            { icon: '📦', title: 'Despacho a todo Chile', sub: 'Coordinamos envío a tu puerta' },
            { icon: '🎨', title: 'Desde 1 unidad', sub: 'Sin mínimo de pedido' },
            { icon: '💬', title: 'Respuesta en 1 hora', sub: 'WhatsApp y correo' },
          ].map(item => (
            <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
              <div>
                <strong style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#111' }}>{item.title}</strong>
                <span style={{ fontSize: '11px', color: '#666' }}>{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div style={{ padding: '2.5rem 2rem', maxWidth: '1400px', margin: '0 auto' }} id="categorias">
        <SectionTitle text="Explorar categorías" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '12px' }}>
          {CATEGORIES.map(cat => (
            <div
              key={cat.c}
              onClick={() => { setActiveCat(cat.c); scrollToCat(); }}
              style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
            >
              <div style={{ position: 'absolute', inset: 0, background: cat.bg }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.1) 60%)' }} />
              <div style={{ position: 'relative', zIndex: 2, padding: '1rem 0.9rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{cat.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{cat.name}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '3px' }}>{cat.count}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '6px' }}>Ver →</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATALOGUE ── */}
      <div style={{ padding: '0 2rem 3rem', maxWidth: '1400px', margin: '0 auto' }} id="catalogo">
        <SectionTitle text="Catálogo de productos" />

        {/* Filtros */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {([['todos', 'Todos'], ['poleras', 'Poleras'], ['polerones', 'Polerones'], ['tazas', 'Tazas'], ['accesorios', 'Accesorios'], ['deportiva', 'Deportiva'], ['impresion', 'Impresión']] as const).map(([c, label]) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              style={{
                fontSize: '12px', fontWeight: 500, padding: '8px 16px',
                border: '1px solid ' + (activeCat === c ? '#111' : '#e0e0e0'),
                background: activeCat === c ? '#111' : '#fff',
                color: activeCat === c ? '#fff' : '#333',
                cursor: 'pointer', borderRadius: '3px', fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '16px' }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* ── PROMO BANNERS ── */}
      <div style={{ padding: '0 2rem 2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <PromoCard
            bg="linear-gradient(135deg,#111 0%,#2d5016 100%)"
            label="Ideal para equipos"
            title={<>Polerones<br />Personalizados</>}
            cta="Ver polerones"
            onClick={() => { setActiveCat('polerones'); scrollToCat(); }}
          />
          <PromoCard
            bg="linear-gradient(135deg,#1a0a2e 0%,#4a1a6b 100%)"
            label="Descuento por volumen"
            title={<>Venta<br />Corporativa</>}
            cta="Cotizar empresa"
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
          />
        </div>
      </div>

      {/* ── PROCESO ── */}
      <div style={{ padding: '3rem 2rem', maxWidth: '1400px', margin: '0 auto' }} id="proceso">
        <SectionTitle text="Cómo funciona" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px', marginTop: '1.5rem' }}>
          {[
            { n: '01', h: 'Elige el producto', p: 'Selecciona de nuestro catálogo. Más de 34 artículos disponibles.' },
            { n: '02', h: 'Sube tu diseño', p: 'Usa el previsualizador IA para ver cómo queda tu logo.' },
            { n: '03', h: 'Confirmamos juntos', p: 'Revisamos tallas, colores y acabado contigo antes de producir.' },
            { n: '04', h: 'Retiro o envío', p: 'Retira en Curicó en 4 horas o enviamos a todo Chile.' },
          ].map(paso => (
            <div key={paso.n} style={{ textAlign: 'center', padding: '2rem 1.5rem', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
              <div style={{ width: '44px', height: '44px', background: '#111', color: '#fff', borderRadius: '50%', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>{paso.n}</div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>{paso.h}</h3>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>{paso.p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTACTO ── */}
      <div style={{ background: '#f5f5f5', padding: '3rem 2rem' }} id="contacto">
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>Cotiza tu pedido</h2>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '1.5rem' }}>Cuéntanos tu proyecto y te respondemos en menos de una hora.</p>
            <form onSubmit={e => { e.preventDefault(); showToast('¡Cotización enviada! Te respondemos pronto.'); (e.target as HTMLFormElement).reset(); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <FormField label="Nombre" type="text" placeholder="Tu nombre" />
                <FormField label="Contacto" type="text" placeholder="Correo o WhatsApp" />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#333', display: 'block', marginBottom: '5px' }}>Producto</label>
                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px', color: '#111', background: '#fff', outline: 'none' }}>
                  <option>Selecciona...</option>
                  <option>Poleras</option><option>Polerones</option><option>Tazas</option>
                  <option>Carcasas</option><option>Ropa deportiva</option><option>Otro</option>
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#333', display: 'block', marginBottom: '5px' }}>Mensaje</label>
                <textarea placeholder="Describe tu proyecto, cantidad, colores, tallas..." rows={4} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px', color: '#111', background: '#fff', outline: 'none', resize: 'vertical' }} />
              </div>
              <button type="submit" style={{ width: '100%', background: '#e53935', color: '#fff', border: 'none', padding: '13px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', borderRadius: '3px' }}>
                Enviar cotización
              </button>
            </form>
          </div>
          <div style={{ paddingTop: '1rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>Información de contacto</h2>
            {[
              { title: 'Ubicación', content: 'Curicó' },
              { title: 'WhatsApp', content: `${WHATSAPP_NUMBER_DISPLAY}\nRespuesta inmediata en horario hábil` },
              { title: 'Correo', content: CONTACT_EMAIL },
            ].map(block => (
              <div key={block.title} style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e53935', marginBottom: '6px' }}>{block.title}</h4>
                <p style={{ fontSize: '13px', color: '#333', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{block.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#111', color: '#fff', padding: '3rem 2rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                PATRÓN<span style={{ color: '#e53935' }}>.</span>CL
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginTop: '0.8rem' }}>
                Tienda de estampados personalizados en Curicó. Personaliza prendas y productos con tu logo o diseño. Desde 1 unidad, sin mínimo.
              </p>
            </div>
            {[
              { title: 'Productos', links: [['Poleras', () => { setActiveCat('poleras'); scrollToCat(); }], ['Polerones', () => { setActiveCat('polerones'); scrollToCat(); }], ['Tazas', () => { setActiveCat('tazas'); scrollToCat(); }], ['Deportiva', () => { setActiveCat('deportiva'); scrollToCat(); }]] },
              { title: 'Tienda', links: [['Cómo funciona', () => document.getElementById('proceso')?.scrollIntoView({ behavior: 'smooth' })], ['Cotizar', () => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })]] },
              { title: 'Contacto', links: [['WhatsApp', () => window.open(WHATSAPP_URL)], ['Email', () => window.open(`mailto:${CONTACT_EMAIL}`)]] },
            ].map(col => (
              <div key={col.title}>
                <h5 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>{col.title}</h5>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {col.links.map(([label, fn]) => (
                    <li key={label as string}><button onClick={fn as () => void} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>{label as string}</button></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', fontSize: '11px', color: 'rgba(255,255,255,0.4)', flexWrap: 'wrap', gap: '1rem' }}>
            <span>© 2025 Patronestampados.cl · Curicó, Chile</span>
            <span>Pagos seguros con Transbank Webpay</span>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP FLOATING BUTTON ── */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label={`Contactar por WhatsApp al ${WHATSAPP_NUMBER_DISPLAY}`}
        style={{
          position: 'fixed',
          right: '1.5rem',
          bottom: '1.5rem',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#25D366',
          color: '#fff',
          textDecoration: 'none',
          padding: '12px 16px',
          borderRadius: '999px',
          boxShadow: '0 10px 28px rgba(0,0,0,0.25)',
          fontSize: '13px',
          fontWeight: 800,
          letterSpacing: '0.01em',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-2.848 0-5.143-2.295-5.143-5.143 0-2.848 2.295-5.143 5.143-5.143 2.848 0 5.143 2.295 5.143 5.143 0 2.848-2.295 5.143-5.143 5.143m5.143-9.364c-2.309-2.309-6.045-2.309-8.354 0-2.309 2.31-2.309 6.045 0 8.354 2.31 2.31 6.045 2.31 8.354 0 .226-.226.423-.47.605-.722.182-.252.35-.517.496-.8.147-.283.268-.58.363-.889.095-.309.165-.632.206-.962.041-.33.041-.67 0-1 .041-.33.111-.652.206-.962.095-.309.216-.606.363-.889.146-.283.314-.548.496-.8.182-.252.379-.496.605-.722z"/>
        </svg>
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span>WhatsApp</span>
          <span style={{ fontSize: '11px', fontWeight: 600 }}>{WHATSAPP_NUMBER_DISPLAY}</span>
        </span>
      </a>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          background: '#111', color: '#fff', padding: '12px 24px', borderRadius: '4px',
          fontSize: '13px', fontWeight: 500, zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────
function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [side]: '1.5rem',
    background: 'rgba(255,255,255,0.9)', border: 'none', width: '42px', height: '42px',
    borderRadius: '50%', cursor: 'pointer', fontSize: '24px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  };
}

function SectionTitle({ text }: { text: string }) {
  return (
    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#666', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '2px solid #111', display: 'flex', alignItems: 'center', gap: '10px' }}>
      {text}
    </div>
  );
}

function FormField({ label, type, placeholder }: { label: string; type: string; placeholder: string }) {
  return (
    <div>
      <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#333', display: 'block', marginBottom: '5px' }}>{label}</label>
      <input type={type} placeholder={placeholder} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px', color: '#111', background: '#fff', outline: 'none' }} />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const badgeColors: Record<string, string> = {
    popular: '#e53935', eco: '#2e7d32', pack: '#1565c0', nuevo: '#111',
  };
  return (
    <Link href={`/producto/${slugify(product)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', position: 'relative', transition: 'box-shadow .2s' }}>
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
            {product.v.col.map(c => (
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

function PromoCard({ bg, label, title, cta, onClick }: { bg: string; label: string; title: React.ReactNode; cta: string; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', minHeight: '200px', display: 'flex', alignItems: 'flex-end', cursor: 'pointer' }}>
      <div style={{ position: 'absolute', inset: 0, background: bg }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(0,0,0,0.7) 0%,transparent 70%)' }} />
      <div style={{ position: 'relative', zIndex: 2, padding: '1.8rem 2rem', color: '#fff' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#e53935', marginBottom: '6px' }}>{label}</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '10px' }}>{title}</div>
        <span style={{ background: '#e53935', color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '9px 18px', borderRadius: '3px', display: 'inline-block' }}>{cta}</span>
      </div>
    </div>
  );
}
