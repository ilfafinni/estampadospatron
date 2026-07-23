'use client';
// src/components/CartDrawer.tsx

import { useCart, formatPrice } from '@/lib/CartContext';
import { parsePrecio } from '@/data/products';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const { state, removeItem, updateQty, closeCart, totalItems, totalPrice, totalEstampado } = useCart();
  const router = useRouter();

  if (!state.isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 800, backdropFilter: 'blur(2px)',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: '420px',
        background: 'var(--bg-card)', zIndex: 900,
        display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        borderLeft: '1px solid var(--border-light)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border-light)',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Tu carrito
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </div>
          </div>
          <button
            onClick={closeCart}
            style={{
              width: '36px', height: '36px', border: '1px solid var(--border-medium)',
              background: 'var(--bg-tertiary)', cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {state.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Tu carrito está vacío
              </div>
              <div style={{ fontSize: '13px' }}>
                Agrega productos para continuar
              </div>
              <button
                onClick={closeCart}
                style={{
                  marginTop: '1.5rem', background: 'var(--text-primary)', color: 'var(--bg-primary)',
                  border: 'none', padding: '12px 24px', borderRadius: 'var(--radius-md)',
                  fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Ver productos
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {state.items.map((item, idx) => (
                <CartItemRow
                  key={idx}
                  item={item}
                  index={idx}
                  onRemove={removeItem}
                  onUpdateQty={updateQty}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div style={{
            borderTop: '1px solid var(--border-light)', padding: '1.2rem 1.5rem',
            flexShrink: 0, background: 'var(--bg-secondary)',
          }}>
            {/* Subtotal */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)',
            }}>
              <span>Subtotal productos</span>
              <span>{formatPrice(totalPrice - totalEstampado)}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)',
            }}>
              <span>Estampado</span>
              {totalEstampado > 0 ? (
                <span style={{ fontWeight: 600 }}>{formatPrice(totalEstampado)}</span>
              ) : (
                <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>A cotizar</span>
              )}
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: '1.2rem', fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)',
              paddingTop: '10px', borderTop: '1px solid var(--border-light)',
            }}>
              <span>Total estimado</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            {/* Botón pagar */}
            <button
              onClick={handleCheckout}
              style={{
                width: '100%', background: 'var(--color-accent)', color: '#fff',
                border: 'none', padding: '14px', fontSize: '14px',
                fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                cursor: 'pointer', borderRadius: 'var(--radius-md)', marginBottom: '10px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-accent)'}
            >
              Pagar con Webpay →
            </button>
            <div style={{
              textAlign: 'center', fontSize: '11px', color: 'var(--text-light)', lineHeight: 1.5,
            }}>
              🔒 Pago seguro con Transbank Webpay · Tarjetas crédito y débito
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── CartItemRow ──────────────────────────────────────
interface CartItemRowProps {
  item: import('@/lib/CartContext').CartItem;
  index: number;
  onRemove: (i: number) => void;
  onUpdateQty: (i: number, qty: number) => void;
}

function CartItemRow({ item, index, onRemove, onUpdateQty }: CartItemRowProps) {
  const precioBase = parsePrecio(item.product.precio);
  const recargoTotal = (item.estampados || []).reduce((s, e) => s + e.precio, 0);
  const precioUnitTotal = precioBase + recargoTotal;

  return (
    <div style={{
      display: 'flex', gap: '12px', padding: '12px',
      border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)',
    }}>
      {/* Imagen/Emoji */}
      <div style={{
        width: '64px', height: '64px', background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0, color: 'var(--text-light)',
      }}>
        ■
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
          {item.product.n}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '2px', letterSpacing: '0.06em' }}>
          Ref: {item.product.ref}
        </div>
        {/* Variantes seleccionadas */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
          {item.talla && <Tag label={`Talla: ${item.talla}`} />}
          {item.color && <Tag label={`Color: ${item.color}`} />}
          {item.tipo && <Tag label={item.tipo} />}
          {(item.estampados || []).map(e => (
            <Tag key={e.ubicacion} label={`${e.ubicacion}: ${e.label}`} />
          ))}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
          {formatPrice(precioUnitTotal)}
          {(!item.estampados || item.estampados.length === 0) && (
            <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>
              + estampado
            </span>
          )}
        </div>
      </div>

      {/* Qty + Remove */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={() => onRemove(index)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '14px', padding: '2px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ✕
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <QtyBtn onClick={() => onUpdateQty(index, item.qty - 1)} label="−" />
          <span style={{ fontSize: '14px', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
            {item.qty}
          </span>
          <QtyBtn onClick={() => onUpdateQty(index, item.qty + 1)} label="+" />
        </div>
      </div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: '10px', padding: '2px 6px', background: 'var(--bg-tertiary)',
      borderRadius: '2px', color: 'var(--text-secondary)', fontWeight: 500,
      border: '1px solid var(--border-light)',
    }}>
      {label}
    </span>
  );
}

function QtyBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '28px', height: '28px', border: '1px solid var(--border-medium)',
        background: 'var(--bg-card)', cursor: 'pointer', borderRadius: 'var(--radius-sm)',
        fontSize: '16px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontWeight: 300, lineHeight: 1,
        color: 'var(--text-primary)',
        transition: 'background 0.2s, border-color 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
    >
      {label}
    </button>
  );
}