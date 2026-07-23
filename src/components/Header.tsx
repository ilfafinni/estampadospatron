'use client';
// src/components/Header.tsx

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/lib/CartContext';
import { useTheme } from '@/components/ThemeProvider';
import { CATEGORIES, type Categoria } from '@/data/products';

const WHATSAPP_URL = 'https://wa.me/56966389299';

interface HeaderProps {
  showSearch?: boolean;
  showHamburger?: boolean;
  onNavClick?: () => void;
}

export default function Header({ 
  showSearch = true, 
  showHamburger = true,
  onNavClick 
}: HeaderProps) {
  const { totalItems, toggleCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [navOpen, setNavOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navCategories = [
    { label: 'Poleras', cat: 'poleras' as Categoria },
    { label: 'Polerones', cat: 'polerones' as Categoria },
    { label: 'Tazas', cat: 'tazas' as Categoria },
    { label: 'Deportiva', cat: 'deportiva' as Categoria },
    { label: 'Accesorios', cat: 'accesorios' as Categoria },
  ];

  return (
    <>
      {/* ── HEADER FIJO ── */}
      <header style={{ 
        position: 'sticky', top: 0, zIndex: 500,
        background: scrolled ? 'rgba(var(--bg-card-rgb, 255,255,255), 0.95)' : 'var(--bg-card)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-light)' : 'none',
        transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', height: '64px', maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* LEFT: Hamburger + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {showHamburger && (
              <button
                onClick={() => setMobileCatOpen(true)}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  width: '44px', height: '44px', 
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', 
                  borderRadius: 'var(--radius-md)', cursor: 'pointer', 
                  color: 'var(--text-primary)', transition: 'background 0.2s, border-color 0.2s' 
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-light)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                aria-label="Abrir categorías"
                className="touch-target"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}

            <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/images/logo.png" alt="Estampados Patrón" style={{ height: '36px', width: 'auto', borderRadius: '8px', objectFit: 'contain' }} onError={(e) => { const img = e.currentTarget; img.style.display = 'none'; }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  ESTAMPADOS <span style={{ color: 'var(--color-accent)' }}>PATRÓN</span>
                </span>
                <span style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Estampados Personalizados
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: Search (desktop) */}
          {showSearch && (
            <div style={{ flex: 1, maxWidth: '520px', position: 'relative', display: 'none' }}>
              <input
                placeholder="Buscar productos, referencias..."
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
          )}

          {/* RIGHT: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <button style={{ background: 'var(--color-accent)', color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '10px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }}>
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
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '9px', fontWeight: 500, background: 'none', border: 'none', fontFamily: 'inherit', padding: '4px 6px', borderRadius: '6px', position: 'relative', transition: 'background 0.2s' }}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: 'var(--color-accent)', color: '#fff', borderRadius: '50%',
                  width: '16px', height: '16px', fontSize: '9px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
              <span style={{ display: 'none' }}>Carrito</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE CATEGORIES SIDE PANEL (Right side slide) ── */}
      {showHamburger && (
        <>
          <div
            className={`cat-overlay ${mobileCatOpen ? 'open' : ''}`}
            onClick={() => setMobileCatOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
              zIndex: 999, opacity: 0, pointerEvents: 'none', transition: 'opacity 0.2s',
            }}
          />
          <div
            className={`cat-panel ${mobileCatOpen ? 'open' : ''}`}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '320px',
              background: 'var(--bg-card)', zIndex: 1000,
              display: 'flex', flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
              transform: 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>Categorías</div>
              <button
                onClick={() => setMobileCatOpen(false)}
                style={{ width: '36px', height: '36px', border: '1px solid var(--border-medium)', background: 'var(--bg-tertiary)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', transition: 'background 0.2s, border-color 0.2s' }}
                aria-label="Cerrar categorías"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <button
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileCatOpen(false); }}
                  style={{ padding: '14px 16px', fontSize: '15px', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  Inicio
                </button>
                
                <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                  {navCategories.map(item => (
                    <button
                      key={item.label}
                      onClick={() => { window.location.href = `/catalogo?cat=${item.cat}`; setMobileCatOpen(false); }}
                      style={{ padding: '14px 16px', fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', borderRadius: 'var(--radius-sm)', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => { document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }); setMobileCatOpen(false); }}
                  style={{ marginTop: '1rem', background: 'var(--color-accent)', color: '#fff', padding: '14px 16px', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                >
                  COTIZAR
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── DESKTOP NAV ── */}
      <nav style={{ background: 'var(--bg-card)', borderBottom: '2px solid var(--text-primary)', position: 'relative', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', gap: '0', justifyContent: 'center', minHeight: '56px' }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
          >
            Inicio
          </button>
          
          {/* Categorías dropdown en desktop */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCatMenuOpen(!catMenuOpen)}
              onMouseEnter={() => setCatMenuOpen(true)}
              onMouseLeave={() => setCatMenuOpen(false)}
              style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Categorías
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transition: 'transform 0.2s', transform: catMenuOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            
            {catMenuOpen && (
              <div 
                onMouseEnter={() => setCatMenuOpen(true)}
                onMouseLeave={() => setCatMenuOpen(false)}
                style={{ position: 'absolute', top: '100%', left: 0, minWidth: '220px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 1000, padding: '8px 0' }}
              >
                {navCategories.map(item => (
                  <button
                    key={item.label}
                    onClick={() => { window.location.href = `/catalogo?cat=${item.cat}`; setCatMenuOpen(false); }}
                    style={{ width: '100%', padding: '12px 16px', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ marginLeft: '8px', background: 'var(--color-accent)', color: '#fff', padding: '6px 14px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'background 0.2s' }}
          >
            COTIZAR
          </button>
        </div>
      </nav>
    </>
  );
}