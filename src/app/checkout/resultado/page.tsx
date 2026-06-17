'use client';
// src/app/checkout/resultado/page.tsx

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { formatPrice } from '@/lib/CartContext';

interface PaymentResult {
  status: string;
  authorizationCode?: string;
  amount?: number;
  buyOrder?: string;
  cardNumber?: string;
  transactionDate?: string;
  error?: string;
}

function ResultadoContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = params.get('token_ws');
    const tbkToken = params.get('TBK_TOKEN'); // Cuando el usuario cancela

    if (tbkToken && !token) {
      // Usuario canceló en Webpay
      setResult({ status: 'CANCELLED', error: 'Pago cancelado por el usuario' });
      setLoading(false);
      return;
    }

    if (!token) {
      setResult({ status: 'ERROR', error: 'Token de pago no encontrado' });
      setLoading(false);
      return;
    }

    // Confirmar transacción con Transbank
    fetch('/api/webpay/commit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token_ws: token }),
    })
      .then(res => res.json())
      .then((data: PaymentResult) => {
        setResult(data);
        if (data.status === 'AUTHORIZED') {
          clearCart();
        }
      })
      .catch(() => setResult({ status: 'ERROR', error: 'Error al confirmar el pago' }))
      .finally(() => setLoading(false));
  }, [params, clearCart]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid #e0e0e0', borderTopColor: '#e53935', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#666' }}>Confirmando tu pago con Transbank...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  const isSuccess = result?.status === 'AUTHORIZED';
  const isCancelled = result?.status === 'CANCELLED';

  return (
    <div style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
      {/* Icono */}
      <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>
        {isSuccess ? '✅' : isCancelled ? '🚫' : '❌'}
      </div>

      {/* Título */}
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', color: isSuccess ? '#2e7d32' : '#c62828' }}>
        {isSuccess ? '¡Pago exitoso!' : isCancelled ? 'Pago cancelado' : 'Error en el pago'}
      </h1>

      {/* Mensaje */}
      <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: '2rem' }}>
        {isSuccess
          ? 'Tu pedido ha sido recibido. Te contactaremos en menos de 1 hora para coordinar el estampado y la entrega.'
          : isCancelled
          ? 'Cancelaste el proceso de pago. Tu carrito sigue guardado.'
          : result?.error || 'Ocurrió un error procesando el pago.'}
      </p>

      {/* Detalle del pago */}
      {isSuccess && result && (
        <div style={{ background: '#f5f5f5', borderRadius: '4px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', color: '#666' }}>
            Comprobante de pago
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <DetailRow label="N° de orden" value={result.buyOrder || '-'} />
            <DetailRow label="Autorización" value={result.authorizationCode || '-'} />
            <DetailRow label="Monto" value={result.amount ? formatPrice(result.amount) : '-'} />
            {result.cardNumber && <DetailRow label="Tarjeta" value={`**** **** **** ${result.cardNumber}`} />}
          </div>
        </div>
      )}

      {/* Botones */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={() => router.push('/')}
          style={{ background: '#111', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', letterSpacing: '0.06em' }}
        >
          Volver a la tienda
        </button>
        {!isSuccess && (
          <button
            onClick={() => router.push('/checkout')}
            style={{ background: '#e53935', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', letterSpacing: '0.06em' }}
          >
            Intentar nuevamente
          </button>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
      <span style={{ color: '#666' }}>{label}</span>
      <span style={{ fontWeight: 600, color: '#111' }}>{value}</span>
    </div>
  );
}

export default function ResultadoPage() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#111', padding: '1rem 2rem' }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
          PATRÓN<span style={{ color: '#e53935' }}>.</span>CL
        </div>
      </header>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: '#fff', borderRadius: '8px', padding: '3rem', maxWidth: '560px', width: '100%', border: '1px solid #e0e0e0' }}>
          <Suspense fallback={<div style={{ textAlign: 'center', color: '#666' }}>Cargando...</div>}>
            <ResultadoContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
