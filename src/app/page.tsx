'use client';
// src/app/page.tsx

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS, CATEGORIES, catLabel, slugify, type Product, type Categoria } from '@/data/products';
import { useCart } from '@/lib/CartContext';
import { useTheme } from '@/components/ThemeProvider';

const WHATSAPP_NUMBER_DISPLAY = '+56 9 6638 9299';
const WHATSAPP_URL = 'https://wa.me/56966389299';
const CONTACT_EMAIL = 'contacto@estampadospatron.com';

export default function HomePage() {
  const { totalItems, toggleCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [activeCat, setActiveCat] = useState<'todos' | Categoria>('todos');
  const [slideIdx, setSlideIdx] = useState(0);
  const [toast, setToast] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [navOpen, setNavOpen] = useState(false);

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
      bg: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 50%, var(--bg-secondary) 100%)',
      tag: 'Nueva colección 2025',
      h1: <><span>Estampados</span><br />con tu diseño</>,
      p: 'Personaliza tus prendas y productos favoritos con tu logo o diseño. Desde 1 unidad, sin mínimos.',
      cta: 'Ver poleras',
      onCta: () => { setActiveCat('poleras'); scrollToCat(); },
    },
    {
      bg: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 50%, var(--bg-primary) 100%)',
      tag: 'Personalización profesional',
      h1: <>Tu marca en<br />cada prenda</>,
      p: 'Serigrafía, sublimación y bordado. El mejor acabado para tu empresa o evento corporativo.',
      cta: 'Cotizar ahora',
      onCta: () => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      bg: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)',
      tag: 'Entrega Express',
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
    <div style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden', minHeight: '100vh' }}>
      <style>{`
        @media (min-width: 769px) {
          .hero-outer { height: calc(100vh - 168px) !important; }
          .hero-slide { height: calc(100vh - 168px) !important; }
        }
        @media (max-width: 768px) {
          .hero-outer { min-height: 480px !important; }
          .hero-slide { min-height: 480px !important; }
        }
        @media (max-width: 640px) {
          .hero-outer { min-height: 420px !important; }
          .hero-slide { min-height: 420px !important; }
        }
        /* Nav drawer */
        @media (max-width: 900px) {
          .nav-drawer.open { transform: translateX(0) !important; }
          .nav-overlay.open { opacity: 1 !important; pointer-events: auto !important; }
        }
        /* Scrollbar hide para categorías en mobile */
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        /* Touch targets */
        @media (max-width: 640px) {
          .touch-target { min-height: 44px; min-width: 44px; }
        }
      `}</style>

      {/* ── TOPBAR ── */}
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

      {/* ── HEADER ── */}
      <header style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0 1.5rem', height: '72px', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/images/logo.png" alt="Estampados Patrón" style={{ height: '40px', width: 'auto', borderRadius: '8px' }} onError={(e) => { const img = e.currentTarget; img.style.display = 'none'; const next = img.nextElementSibling as HTMLElement; if (next) next.style.display = 'block'; }} />
            <div style={{ display: 'none', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>
              ESTAMPADOS <span style={{ color: 'var(--color-accent)' }}>PATRÓN</span>
            </div>
            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '1px' }}>
              Estampados Personalizados
            </div>
          </Link>

          {/* Search - hidden on mobile, shown on desktop */}
          <div style={{ flex: 1, maxWidth: '520px', position: 'relative', display: 'none' }}>
            <input
              placeholder="Buscar productos, referencias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '10px 16px 10px 42px', border: '1px solid var(--border-medium)',
                borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', outline: 'none',
                background: 'var(--bg-tertiary)', transition: 'border-color 0.2s, box-shadow 0.2s',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--color-primary-light)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-medium)'; e.target.style.boxShadow = 'none'; }}
            />
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <button style={{ background: 'var(--color-accent)', color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '11px 22px', borderRadius: '6px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }}>
                Cotizar
              </button>
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-primary)', transition: 'background 0.2s, border-color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
            >
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

            {/* Carrito */}
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

            {/* Mobile menu button */}
            <button
              onClick={() => setNavOpen(true)}
              style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-primary)' }}
              aria-label="Abrir menú"
              className="touch-target"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── NAV ── */}
      <nav style={{ background: 'var(--bg-card)', borderBottom: '2px solid var(--text-primary)', position: 'relative', zIndex: 100 }}>
        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', gap: '0', minHeight: '56px' }}>
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
                padding: '14px 20px', fontSize: '13px', fontWeight: 600,
                letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--text-primary)',
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                whiteSpace: 'nowrap', position: 'relative',
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ marginLeft: '8px', background: 'var(--color-accent)', color: '#fff', padding: '6px 14px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'background 0.2s' }}
          >
            COTIZAR
          </button>
        </div>

        {/* Mobile nav drawer */}
        <div
          className={`nav-overlay ${navOpen ? 'open' : ''}`}
          onClick={() => setNavOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 999, opacity: 0, pointerEvents: 'none', transition: 'opacity 0.2s',
          }}
        />
<div
          className={`nav-drawer ${navOpen ? 'open' : ''}`}
          style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '320px',
            background: 'var(--bg-card)', zIndex: 1000,
            display: 'flex', flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)',
            transform: 'translateX(100%)', transition: 'transform 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>Menú</div>
            <button
              onClick={() => setNavOpen(false)}
              style={{ width: '36px', height: '36px', border: '1px solid var(--border-medium)', background: 'var(--bg-tertiary)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', transition: 'background 0.2s, border-color 0.2s' }}
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Inicio', onClick: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setNavOpen(false); } },
                { label: 'Poleras', onClick: () => { setActiveCat('poleras'); scrollToCat(); setNavOpen(false); } },
                { label: 'Polerones', onClick: () => { setActiveCat('polerones'); scrollToCat(); setNavOpen(false); } },
                { label: 'Tazas', onClick: () => { setActiveCat('tazas'); scrollToCat(); setNavOpen(false); } },
                { label: 'Deportiva', onClick: () => { setActiveCat('deportiva'); scrollToCat(); setNavOpen(false); } },
                { label: 'Accesorios', onClick: () => { setActiveCat('accesorios'); scrollToCat(); setNavOpen(false); } },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  style={{
                    padding: '14px 16px', fontSize: '15px', fontWeight: 600,
                    letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--text-primary)',
                    background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    textAlign: 'left', borderRadius: 'var(--radius-sm)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }); setNavOpen(false); }}
                style={{ marginTop: '8px', background: 'var(--color-accent)', color: '#fff', padding: '12px 16px', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                COTIZAR
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO SLIDER ── */}
      <div className="hero-outer" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-tertiary)', minHeight: '480px' }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            className="hero-slide"
            style={{
              display: i === slideIdx ? 'flex' : 'none',
              alignItems: 'center', minHeight: '480px', position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: slide.bg }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
            <div style={{ position: 'relative', zIndex: 2, padding: '3rem 2rem', maxWidth: '640px', color: '#fff' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fca5a5', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '4px', display: 'inline-block', marginBottom: '1rem', backdropFilter: 'blur(4px)' }}>
                {slide.tag}
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                {slide.h1}
              </h1>
              <p style={{ fontSize: 'clamp(13px, 2.5vw, 15px)', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.7, maxWidth: '500px' }}>
                {slide.p}
              </p>
              <button
                onClick={slide.onCta}
                style={{ background: '#fff', color: '#111', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '14px 32px', borderRadius: '6px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
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
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
          {[0, 1, 2].map(i => (
            <div key={i} onClick={() => setSlideIdx(i)} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i === slideIdx ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.2s' }} />
          ))}
        </div>
      </div>

      {/* ── INFO STRIP ── */}
      <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '1.5rem 1.5rem', gap: '1rem' }}>
          {[
            { icon: '🚀', title: 'Retiro Express 4 hrs', sub: 'Disponible en Curicó' },
            { icon: '📦', title: 'Despacho a todo Chile', sub: 'Coordinamos envío a tu puerta' },
            { icon: '🎨', title: 'Desde 1 unidad', sub: 'Sin mínimo de pedido' },
            { icon: '💬', title: 'Respuesta en 1 hora', sub: 'WhatsApp y correo' },
          ].map(item => (
            <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
              <div>
                <strong style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div style={{ padding: '2.5rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }} id="categorias">
        <SectionTitle text="Explorar categorías" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '16px' }}>
          {CATEGORIES.map(cat => (
            <div
              key={cat.c}
              onClick={() => { setActiveCat(cat.c); scrollToCat(); }}
              style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            >
              <div style={{ position: 'absolute', inset: 0, background: cat.bg }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)' }} />
              <div style={{ position: 'relative', zIndex: 2, padding: '1.2rem 1rem' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{cat.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{cat.name}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>{cat.count}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>Ver productos →</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATALOGUE ── */}
      <div style={{ padding: '0 1.5rem 3rem', maxWidth: '1400px', margin: '0 auto' }} id="catalogo">
        <SectionTitle text="Catálogo de productos" />
        
        {/* Filtros */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {([['todos', 'Todos'], ['poleras', 'Poleras'], ['polerones', 'Polerones'], ['tazas', 'Tazas'], ['accesorios', 'Accesorios'], ['deportiva', 'Deportiva'], ['impresion', 'Impresión']] as const).map(([c, label]) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              style={{
                fontSize: '12px', fontWeight: 500, padding: '8px 16px',
                border: '1px solid ' + (activeCat === c ? 'var(--text-primary)' : 'var(--border-medium)'),
                background: activeCat === c ? 'var(--text-primary)' : 'var(--bg-card)',
                color: activeCat === c ? (theme === 'dark' ? '#fff' : '#fff') : 'var(--text-secondary)',
                cursor: 'pointer', borderRadius: '6px', fontFamily: 'inherit', whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '20px' }}>
          {filteredProducts.map(product => (
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
      </div>

      {/* ── PROMO BANNERS ── */}
      <div style={{ padding: '0 1.5rem 2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <PromoCard
            bg="linear-gradient(135deg, var(--bg-primary) 0%, #166534 100%)"
            label="Ideal para equipos"
            title={<>Polerones<br />Personalizados</>}
            cta="Ver polerones"
            onClick={() => { setActiveCat('polerones'); scrollToCat(); }}
          />
          <PromoCard
            bg="linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)"
            label="Descuento por volumen"
            title={<>Venta<br />Corporativa</>}
            cta="Cotizar empresa"
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
          />
        </div>
      </div>

      {/* ── PROCESO ── */}
      <div style={{ padding: '3rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }} id="proceso">
        <SectionTitle text="Cómo funciona" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px', marginTop: '2rem' }}>
          {[
            { n: '01', h: 'Elige el producto', p: 'Selecciona de nuestro catálogo. Más de 34 artículos disponibles.' },
            { n: '02', h: 'Sube tu diseño', p: 'Usa el previsualizador para ver cómo queda tu logo en la prenda.' },
            { n: '03', h: 'Confirmamos juntos', p: 'Revisamos tallas, colores y acabado contigo antes de producir.' },
            { n: '04', h: 'Retiro o envío', p: 'Retira en Curicó en 4 hrs o enviamos a todo Chile.' },
          ].map(paso => (
            <div key={paso.n} style={{ textAlign: 'center', padding: '2rem 1.5rem', border: '1px solid var(--border-light)', borderRadius: '8px', background: 'var(--bg-card)', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--text-primary)', color: 'var(--bg-primary)', borderRadius: '50%', fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>{paso.n}</div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>{paso.h}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{paso.p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTACTO ── */}
      <div style={{ background: 'var(--bg-secondary)', padding: '3rem 1.5rem' }} id="contacto">
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Cotiza tu pedido</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '2rem' }}>Cuéntanos tu proyecto y te respondemos en menos de una hora.</p>
            <form onSubmit={e => { e.preventDefault(); showToast('¡Cotización enviada! Te respondemos pronto.'); (e.target as HTMLFormElement).reset(); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <FormField label="Nombre" type="text" placeholder="Tu nombre" />
                <FormField label="Contacto" type="text" placeholder="Correo o WhatsApp" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Producto</label>
                <select style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--border-medium)', borderRadius: '6px', fontFamily: 'inherit', fontSize: '13px', color: 'var(--text-primary)', background: 'var(--bg-card)', outline: 'none', cursor: 'pointer' }}>
                  <option>Selecciona...</option>
                  <option>Poleras</option><option>Polerones</option><option>Tazas</option>
                  <option>Carcasas</option><option>Ropa deportiva</option><option>Otro</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Mensaje</label>
                <textarea placeholder="Describe tu proyecto, cantidad, colores, tallas..." rows={4} style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--border-medium)', borderRadius: '6px', fontFamily: 'inherit', fontSize: '13px', color: 'var(--text-primary)', background: 'var(--bg-card)', outline: 'none', resize: 'vertical' }} />
              </div>
              <button type="submit" style={{ width: '100%', background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '14px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', borderRadius: '6px', transition: 'background 0.2s' }}>
                Enviar cotización
              </button>
            </form>
          </div>
          <div style={{ paddingTop: '1rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-primary)' }}>Información de contacto</h2>
            {[
              { title: 'Ubicación', content: 'Curicó, Región del Maule' },
              { title: 'WhatsApp', content: `${WHATSAPP_NUMBER_DISPLAY}\nRespuesta inmediata en horario hábil` },
              { title: 'Correo', content: CONTACT_EMAIL },
            ].map(block => (
              <div key={block.title} style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '8px' }}>{block.title}</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{block.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '3rem 1.5rem 1.5rem', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/images/logo.png" alt="Estampados Patrón" style={{ height: '32px', borderRadius: '8px' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span>ESTAMPADOS <span style={{ color: 'var(--color-accent)' }}>PATRÓN</span></span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, marginTop: '1rem', maxWidth: '300px' }}>
                Tienda de estampados personalizados en Curicó. Personaliza prendas y productos con tu logo o diseño. Desde 1 unidad, sin mínimo.
              </p>
            </div>
            {[
              { title: 'Productos', links: [['Poleras', () => { setActiveCat('poleras'); scrollToCat(); }], ['Polerones', () => { setActiveCat('polerones'); scrollToCat(); }], ['Tazas', () => { setActiveCat('tazas'); scrollToCat(); }], ['Deportiva', () => { setActiveCat('deportiva'); scrollToCat(); }]] },
              { title: 'Tienda', links: [['Cómo funciona', () => document.getElementById('proceso')?.scrollIntoView({ behavior: 'smooth' })], ['Cotizar', () => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })]] },
              { title: 'Contacto', links: [['WhatsApp', () => window.open(WHATSAPP_URL)], ['Email', () => window.open(`mailto:${CONTACT_EMAIL}`)]] },
            ].map(col => (
              <div key={col.title}>
                <h5 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--text-secondary)' }}>{col.title}</h5>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.links.map(([label, fn]) => (
                    <li key={label as string}><button onClick={fn as () => void} style={{ fontSize: '13px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{label as string}</button></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', fontSize: '12px', color: 'var(--text-light)', flexWrap: 'wrap', gap: '1rem' }}>
            <span>© 2025 estampadospatron.com · Curicó, Chile</span>
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
          background: '#22c55e',
          color: '#fff',
          textDecoration: 'none',
          padding: '12px 16px',
          borderRadius: '999px',
          boxShadow: '0 10px 28px rgba(0,0,0,0.25)',
          fontSize: '13px',
          fontWeight: 800,
          letterSpacing: '0.01em',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 14px 35px rgba(34,197,94,0.4)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.25)'; }}
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
          background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '12px 24px', borderRadius: '4px',
          fontSize: '13px', fontWeight: 500, zIndex: 9999, boxShadow: 'var(--shadow-lg)',
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
    color: '#111',
  };
}

function SectionTitle({ text }: { text: string }) {
  return (
    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '2px solid var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
      {text}
    </div>
  );
}

function FormField({ label, type, placeholder }: { label: string; type: string; placeholder: string }) {
  return (
    <div>
      <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>{label}</label>
      <input type={type} placeholder={placeholder} required style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-medium)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px', color: 'var(--text-primary)', background: 'var(--bg-card)', outline: 'none' }} />
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
            {product.v.col.map(c => (
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

function PromoCard({ bg, label, title, cta, onClick }: { bg: string; label: string; title: React.ReactNode; cta: string; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', minHeight: '200px', display: 'flex', alignItems: 'flex-end', cursor: 'pointer' }}>
      <div style={{ position: 'absolute', inset: 0, background: bg }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(0,0,0,0.7) 0%,transparent 70%)' }} />
      <div style={{ position: 'relative', zIndex: 2, padding: '1.8rem 2rem', color: '#fff' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '6px' }}>{label}</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '10px' }}>{title}</div>
        <span style={{ background: 'var(--color-accent)', color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '9px 18px', borderRadius: '3px', display: 'inline-block' }}>{cta}</span>
      </div>
    </div>
  );
}