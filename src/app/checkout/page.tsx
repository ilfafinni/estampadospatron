'use client';
// src/app/checkout/page.tsx
// Página de checkout — resume el carrito y lanza el pago con Webpay

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, formatPrice } from '@/lib/CartContext';
import { parsePrecio, tieneRecargoEstampado } from '@/data/products';

export default function CheckoutPage() {
  const { state, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si el carrito está vacío, volver al inicio
  useEffect(() => {
    if (state.items.length === 0) {
      router.replace('/');
    }
  }, [state.items, router]);

  const handlePagar = async () => {
    setLoading(true);
    setError('');

    try {
      const buyOrder = `ORD-${Date.now()}`;
      const sessionId = `SES-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      const returnUrl = `${window.location.origin}/checkout/resultado`;

      const res = await fetch('/api/webpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          buyOrder,
          sessionId,
          returnUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || `Error ${res.status}`);
      }

      // Redirigir a Webpay — POST con form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.url;
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'token_ws';
      input.value = data.token;
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar el pago';
      setError(msg);
      setLoading(false);
    }
  };

  if (state.items.length === 0) return null;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: '#f5f5f5' }}>

      {/* Header */}
      <header style={{ background: '#111', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => router.push('/')}
          style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
        >
          ←
        </button>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
          PATRÓN<span style={{ color: '#e53935' }}>.</span>CL
        </div>
      </header>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: '1.5rem', color: '#111' }}>
          Resumen de tu pedido
        </h1>

        {/* Items */}
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e0e0e0', overflow: 'hidden', marginBottom: 16 }}>
          {state.items.map((item, idx) => {
            const base = parsePrecio(item.product.precio);
            const estampado = (item.estampados || []).reduce((s, e) => s + e.precio, 0);
            const unitTotal = base + estampado;

            return (
              <div key={idx} style={{
                padding: '1rem 1.25rem',
                borderBottom: idx < state.items.length - 1 ? '1px solid #f0f0f0' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>
                    {item.product.n}
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>
                    {[item.talla, item.color, item.tipo].filter(Boolean).join(' · ')}
                    {item.qty > 1 && ` · x${item.qty}`}
                  </div>
                  {(item.estampados || []).length > 0 && (
                    <div style={{ fontSize: 11, color: '#6366f1', marginTop: 3 }}>
                      {item.estampados!.map(e => e.label).join(' + ')}
                    </div>
                  )}
                  {item.nota && (
                    <div style={{ fontSize: 11, color: '#888', marginTop: 3, fontStyle: 'italic' }}>
                      &ldquo;{item.nota}&rdquo;
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111', whiteSpace: 'nowrap' }}>
                  {formatPrice(unitTotal * item.qty)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div style={{
          background: '#fff', borderRadius: 8, border: '1px solid #e0e0e0',
          padding: '1.25rem', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 8 }}>
            <span>Subtotal productos</span>
            <span>{formatPrice(state.items.reduce((s, i) => s + parsePrecio(i.product.precio) * i.qty, 0))}</span>
          </div>
          {state.items.some(i => (i.estampados || []).length > 0) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6366f1', marginBottom: 8 }}>
              <span>Estampados</span>
              <span>{formatPrice(state.items.reduce((s, i) => s + (i.estampados || []).reduce((ss, e) => ss + e.precio, 0) * i.qty, 0))}</span>
            </div>
          )}
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, color: '#111' }}>
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>

        {/* Nota importante */}
        <div style={{
          background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 8,
          padding: '12px 16px', marginBottom: 20, fontSize: 12, color: '#795548', lineHeight: 1.6,
          display: 'flex', alignItems: 'flex-start', gap: '8px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" x2="21" y1="6" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <div>
            <strong>¿Cómo funciona?</strong> Pagas ahora con tarjeta y nosotros te contactamos en menos de 1 hora para coordinar el diseño, estampado y entrega.
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
            padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#dc2626',
            display: 'flex', alignItems: 'flex-start', gap: '8px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Botón pagar */}
        <button
          onClick={handlePagar}
          disabled={loading}
          style={{
            width: '100%', background: loading ? '#ccc' : '#e53935',
            color: '#fff', border: 'none', padding: '16px',
            fontSize: 15, fontWeight: 800, letterSpacing: '0.06em',
            textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
            borderRadius: 6, transition: 'background .15s',
          }}
        >
          {loading ? 'Conectando con Webpay…' : `Pagar ${formatPrice(totalPrice)} con Webpay →`}
        </button>

        <div style={{ textAlign: 'center', fontSize: 11, color: '#999', marginTop: 12 }}>
          🔒 Pago 100% seguro con Transbank · Crédito, débito y prepago
        </div>
      </div>
    </div>
  );
}
