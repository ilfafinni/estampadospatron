'use client';
// src/app/page.tsx

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS, CATEGORIES, catLabel, slugify, type Product, type Categoria } from '@/data/products';
import { useCart } from '@/lib/CartContext';
import { useTheme } from '@/components/ThemeProvider';
import Header from '@/components/Header';

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
  const [scrolled, setScrolled] = useState(false);

  // Slider auto
  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  // Scroll detection for header shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      onCta: () => { window.location.href = '/catalogo?cat=poleras'; },
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
      `}</style>

      <Header showSearch={true} showHamburger={true} />