'use client';
// src/app/page.tsx

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS, CATEGORIES, catLabel, slugify, type Product, type Categoria } from '@/data/products';
import { BANNERS } from '@/data/banners';
import Header from '@/components/Header';

const WHATSAPP_NUMBER_DISPLAY = '+56 9 6638 9299';
const WHATSAPP_URL = 'https://wa.me/56966389299';
const CONTACT_EMAIL = 'contacto@estampadospatron.com';

export default function HomePage() {
  const [activeCat, setActiveCat] = useState<'todos' | Categoria>('todos');
  const [slideIdx, setSlideIdx] = useState(0);
  const [toast, setToast] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Slider auto
  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const slides = BANNERS.heroSlides.map(s => {
    const imgPos = s.imgPosition || 'center';
    const imgFit = s.imgFit || 'cover';
    const bgImg = s.img ? `url(${s.img}) ${imgPos} / ${imgFit} no-repeat` : '';
    const panX = s.imgPanX ?? 0;
    const panY = s.imgPanY ?? 0;
    const zoom = s.imgZoom ?? 1;
    return {
      bg: s.img ? `${bgImg}, ${s.bg}` : s.bg,
      bgGradient: s.bg,
      bgImg,
      imgTransform: s.img ? `translate(${panX}px, ${panY}px) scale(${zoom})` : '',
      tag: s.tag,
      h1: <><span>{s.h1Line1}</span><br />{s.h1Line2}</>,
      p: s.p,
      cta: s.cta,
      textAlign: s.textAlign || 'left',
      textVertical: s.textVertical || 'top',
      overlayStyle: s.overlayStyle || 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
      onCta: s.ctaType === 'catalogo'
        ? () => { window.location.href = s.ctaParam ? `/catalogo?cat=${s.ctaParam}` : '/catalogo'; }
        : s.ctaType === 'whatsapp'
          ? () => window.open(WHATSAPP_URL, '_blank')
          : () => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }),
    };
  });

  const scrollToCat = () => {
    setTimeout(() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden', minHeight: '100vh' }}>
      <style>{`
        @media (min-width: 769px) {
          .hero-outer { height: calc(100vh - 80px) !important; }
          .hero-slide { height: calc(100vh - 80px) !important; }
        }
        @media (max-width: 768px) {
          .hero-outer { min-height: 480px !important; }
          .hero-slide { min-height: 480px !important; }
        }
        @media (max-width: 640px) {
          .hero-outer { min-height: 420px !important; }
          .hero-slide { min-height: 420px !important; }
        }
        /* Scrollbar hide para filtros */
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        /* Touch targets */
        @media (max-width: 640px) {
          .touch-target { min-height: 44px; min-width: 44px; }
        }
      `}</style>

      <Header showSearch={true} showHamburger={true} />

      {/* ── HERO SLIDER ── */}
      <div className="hero-outer" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-tertiary)', minHeight: '480px' }}>
        {slides.map((slide, i) => {
          const vAlign = slide.textVertical === 'middle' ? 'center' : slide.textVertical === 'bottom' ? 'flex-end' : 'flex-start';
          return (
          <div
            key={i}
            className="hero-slide"
            style={{
              display: i === slideIdx ? 'flex' : 'none',
              alignItems: vAlign, minHeight: '480px', position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: slide.bgGradient }} />
            {slide.bgImg && <div style={{ position: 'absolute', inset: 0, background: slide.bgImg, transform: slide.imgTransform, transformOrigin:'center' }} />}
            <div style={{ position: 'absolute', inset: 0, background: slide.overlayStyle }} />
            <div style={{ position: 'relative', zIndex: 2, padding: '3rem 2rem', maxWidth: '640px', color: '#fff', textAlign: slide.textAlign as React.CSSProperties['textAlign'] }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-primary-light)', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '4px', display: slide.textAlign === 'center' ? 'inline-block' : 'inline-block', marginBottom: '1rem', backdropFilter: 'blur(4px)' }}>
                {slide.tag}
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                {slide.h1}
              </h1>
              <p style={{ fontSize: 'clamp(13px, 2.5vw, 15px)', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.7, maxWidth: slide.textAlign === 'center' ? '500px' : '500px', marginLeft: slide.textAlign === 'center' ? 'auto' : '0', marginRight: slide.textAlign === 'center' ? 'auto' : '0' }}>
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
          );
        })}
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
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, title: 'Retiro Express 4 hrs', sub: 'Disponible en Curicó' },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>, title: 'Despacho a todo Chile', sub: 'Coordinamos envío a tu puerta' },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>, title: 'Desde 1 unidad', sub: 'Sin mínimo de pedido' },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, title: 'Respuesta en 1 hora', sub: 'WhatsApp y correo' },
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

      {/* ── CATEGORÍAS DESTACADAS ── */}
      <div style={{ padding: '2.5rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }} id="categorias">
        <style>{`
          .cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
          .cat-card { position: relative; border-radius: 16px; overflow: hidden; cursor: pointer; min-height: 220px; display: flex; flex-direction: column; justify-content: flex-end; text-decoration: none; box-shadow: var(--shadow-md); transition: transform 0.3s, box-shadow 0.3s; }
          .cat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
          @media (max-width: 900px) { .cat-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 640px) {
            .cat-grid { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; padding-bottom: 12px; scrollbar-width: none; margin: 0 -1.5rem; padding-left: 1.5rem; padding-right: 0.5rem; width: auto; }
            .cat-grid::-webkit-scrollbar { display: none; }
            .cat-card { scroll-snap-align: start; min-width: 200px; width: 200px; min-height: 180px; flex-shrink: 0; }
            .cat-card .cat-card-content { padding: 1.2rem !important; }
            .cat-card .cat-card-icon { font-size: 1.5rem !important; margin-bottom: 4px !important; }
            .cat-card .cat-card-title { font-size: 14px !important; }
            .cat-card .cat-card-count { font-size: 10px !important; }
            .cat-card .cat-card-btn { font-size: 10px !important; padding: 6px 12px !important; }
          }
        `}</style>
        <SectionTitle text="Explorar categorías" />
        <div className="cat-grid">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.c}
              href={`/catalogo?cat=${cat.c}`}
              className="cat-card"
            >
              {cat.img&&<div style={{ position:'absolute', inset:0, background:`url(${cat.img}) center/cover no-repeat` }}/>}
              <div style={{ position: 'absolute', inset: 0, background: cat.bg, opacity: cat.img ? 0.5 : 1 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.85) 100%)' }} />
              <div style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '90px', opacity: 0.12, transform: 'rotate(12deg)', userSelect: 'none', pointerEvents: 'none', lineHeight: 1 }}>
                {cat.icon}
              </div>
              <div className="cat-card-content" style={{ position: 'relative', zIndex: 2, padding: '1.5rem' }}>
                <div className="cat-card-icon" style={{ fontSize: '2rem', marginBottom: '6px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{cat.icon}</div>
                <div className="cat-card-title" style={{ fontSize: '18px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{cat.name}</div>
                <div className="cat-card-count" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>{cat.count}</div>
                <div className="cat-card-btn" style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginTop: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}>
                  Ver productos
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <Link href="/catalogo" style={{ background: 'var(--text-primary)', color: '#fff', padding: '12px 22px', borderRadius: '999px', textDecoration: 'none', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Ver catálogo completo
          </Link>
        </div>
      </div>

      {/* ── PROMO BANNERS (AMPLIADOS) ── */}
      <div style={{ padding: '0 1.5rem 3rem', maxWidth: '1400px', margin: '0 auto' }}>
        <style>{`@media (max-width: 640px) { .promo-grid { grid-template-columns: 1fr !important; gap: 16px !important; } .promo-card { min-height: 220px !important; } .promo-card-content { padding: 1.8rem 1.5rem !important; } .promo-card-title { font-size: 1.4rem !important; } }`}</style>
        <div className="promo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {BANNERS.promoBanners.map(b => {
            const imgPos = b.imgPosition || 'center';
            const imgFit = b.imgFit || 'cover';
            const bgImg = b.img ? `url(${b.img}) ${imgPos} / ${imgFit} no-repeat` : '';
            const panX = b.imgPanX ?? 0;
            const panY = b.imgPanY ?? 0;
            const zoom = b.imgZoom ?? 1;
            const textAlign = b.textAlign || 'left';
            const textVertical = b.textVertical || 'bottom';
            const overlayStyle = b.overlayStyle || 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 70%)';
            const onClick = b.ctaType === 'categoria'
              ? () => { setActiveCat((b.ctaParam || 'polerones') as Categoria); scrollToCat(); }
              : () => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
            return (
              <PromoCard
                key={b.id}
                bgGradient={b.bg}
                bgImg={bgImg}
                imgTransform={bgImg ? `translate(${panX}px, ${panY}px) scale(${zoom})` : ''}
                overlayStyle={overlayStyle}
                label={b.label}
                title={<>{b.titleLine1}<br />{b.titleLine2}</>}
                cta={b.cta}
                textAlign={textAlign}
                textVertical={textVertical}
                onClick={onClick}
                large
              />
            );
          })}
        </div>
      </div>

      {/* ── PROCESO ── */}
      <div style={{ padding: '3rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }} id="proceso">
        <style>{`
          .pasos-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; margin-top: 2rem; }
          @media (max-width: 768px) {
            .pasos-grid { display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; padding-bottom: 16px; scrollbar-width: none; margin: 2rem -1.5rem 0; padding-left: 1.5rem; padding-right: 0.5rem; width: auto; }
            .pasos-grid::-webkit-scrollbar { display: none; }
            .paso-card { scroll-snap-align: start; min-width: 260px; width: 260px; flex-shrink: 0; padding: 1.5rem 1.2rem !important; }
          }
        `}</style>
        <SectionTitle text="Cómo funciona" />
        <div className="pasos-grid">
          {[
            { n: '01', h: 'Elige el producto', p: 'Selecciona de nuestro catálogo. Más de 34 artículos disponibles.' },
            { n: '02', h: 'Sube tu diseño', p: 'Usa el previsualizador para ver cómo queda tu logo en la prenda.' },
            { n: '03', h: 'Confirmamos juntos', p: 'Revisamos tallas, colores y acabado contigo antes de producir.' },
            { n: '04', h: 'Retiro o envío', p: 'Retira en Curicó en 4 hrs o enviamos a todo Chile.' },
          ].map(paso => (
            <div key={paso.n} className="paso-card" style={{ textAlign: 'center', padding: '2rem 1.5rem', border: '1px solid var(--border-light)', borderRadius: '8px', background: 'var(--bg-card)', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--text-primary)', color: 'var(--bg-primary)', borderRadius: '50%', fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>{paso.n}</div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>{paso.h}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{paso.p}</p>
            </div>
          ))}
        </div>
        {/* Mobile hint dots */}
        <div className="pasos-dots" style={{ display: 'none', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)', opacity: 0.3 }} />
          ))}
        </div>
        <style>{`@media (max-width: 768px) { .pasos-dots { display: flex !important; } }`}</style>
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
              { title: 'Productos', links: [['Poleras', () => window.location.href = '/?cat=poleras'], ['Polerones', () => window.location.href = '/?cat=polerones'], ['Tazas', () => window.location.href = '/?cat=tazas'], ['Deportiva', () => window.location.href = '/?cat=deportiva']] },
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
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          background: 'transparent',
          borderRadius: '50%',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.25)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
      >
        <img src="/images/whatsapp.png" alt="WhatsApp" width="56" height="56" style={{ display: 'block', borderRadius: '50%', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
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

function PromoCard({ bgGradient, bgImg, imgTransform, overlayStyle, label, title, cta, onClick, large, textAlign, textVertical }: { bgGradient: string; bgImg?: string; imgTransform?: string; overlayStyle?: string; label: string; title: React.ReactNode; cta: string; onClick: () => void; large?: boolean; textAlign?: string; textVertical?: string }) {
  const vAlign = textVertical === 'top' ? 'flex-start' : textVertical === 'middle' ? 'center' : 'flex-end';
  const hAlign = textAlign || 'left';
  return (
    <div className="promo-card" onClick={onClick} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', minHeight: large ? '280px' : '200px', display: 'flex', alignItems: vAlign, cursor: 'pointer', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ position: 'absolute', inset: 0, background: bgGradient }} />
      {bgImg && <div style={{ position: 'absolute', inset: 0, background: bgImg, transform: imgTransform, transformOrigin:'center' }} />}
      <div style={{ position: 'absolute', inset: 0, background: overlayStyle || 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 70%)' }} />
      <div className="promo-card-content" style={{ position: 'relative', zIndex: 2, padding: large ? '2.5rem 2.5rem' : '1.8rem 2rem', color: '#fff', textAlign: hAlign as React.CSSProperties['textAlign'], width: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '8px' }}>{label}</div>
        <div className="promo-card-title" style={{ fontSize: large ? '1.8rem' : '1.4rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '12px' }}>{title}</div>
        <span style={{ background: 'var(--color-accent)', color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '10px 22px', borderRadius: '6px', display: 'inline-block', boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }}>{cta}</span>
      </div>
    </div>
  );
}