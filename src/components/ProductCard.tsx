'use client';
// src/components/ProductCard.tsx

import Link from 'next/link';
import { Product, catLabel, slugify } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

const badgeColors: Record<string, string> = {
  popular: '#ef4444', eco: '#22c55e', pack: '#3b82f6', nuevo: '#111',
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/producto/${slugify(product)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div style={{ 
      background: 'var(--bg-card)', 
      border: '1px solid var(--border-light)', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      cursor: 'pointer', 
      position: 'relative', 
      transition: 'box-shadow 0.3s, transform 0.3s, border-color 0.3s', 
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
    }}
    onMouseEnter={(e) => { 
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; 
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.borderColor = 'var(--border-medium)';
    }}
    onMouseLeave={(e) => { 
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; 
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'var(--border-light)';
    }}>
      <div style={{ 
        aspectRatio: '1', 
        background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative', 
        overflow: 'hidden',
        backgroundColor: 'var(--bg-tertiary)',
      }}>
        {product.img ? (
          <img 
            src={product.img} 
            alt={product.n} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              transition: 'transform 0.4s ease',
              transform: 'scale(1)',
            }} 
            loading="lazy"
          />
        ) : (
          <span style={{ fontSize: '3rem', opacity: 0.4, color: 'var(--text-light)' }}>■</span>
        )}
        {product.badge && (
          <div style={{ 
            position: 'absolute', 
            top: '10px', 
            left: '10px', 
            fontSize: '9px', 
            fontWeight: 700, 
            letterSpacing: '0.08em', 
            textTransform: 'uppercase', 
            padding: '4px 10px', 
            borderRadius: '4px', 
            background: badgeColors[product.badge] || '#111', 
            color: '#fff', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)' 
          }}>
            {product.badge}
          </div>
        )}
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: 'linear-gradient(to top, rgba(17,17,17,0.95) 0%, transparent 100%)', 
          color: '#fff', 
          fontSize: '11px', 
          fontWeight: 600, 
          letterSpacing: '0.06em', 
          textTransform: 'uppercase', 
          padding: '12px', 
          textAlign: 'center', 
          opacity: 0, 
          transition: 'opacity 0.3s',
        }}>
          Ver producto
        </div>
      </div>
      <div style={{ 
        padding: '14px 16px 16px', 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1,
      }}>
        <div style={{ 
          fontSize: '10px', 
          fontWeight: 600, 
          letterSpacing: '0.1em', 
          textTransform: 'uppercase', 
          color: 'var(--text-muted)', 
          marginBottom: '6px' 
        }}>
          {catLabel(product.c)}
        </div>
        <div style={{ 
          fontSize: '14px', 
          fontWeight: 600, 
          lineHeight: 1.3, 
          color: 'var(--text-primary)', 
          marginBottom: '8px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.n}
        </div>
        <div style={{ 
          fontSize: '10px', 
          color: 'var(--text-light)', 
          fontWeight: 500, 
          letterSpacing: '0.06em', 
          marginBottom: '10px' 
        }}>
          Ref: {product.ref}
        </div>
        {product.v.col && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {product.v.col.map(c => (
              <div 
                key={c.n} 
                title={c.n} 
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  background: c.h, 
                  border: '2px solid var(--bg-card)', 
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  flexShrink: 0,
                }} 
              />
            ))}
          </div>
        )}
        <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
          {product.precio && (
            <span style={{ 
              fontSize: '16px', 
              fontWeight: 700, 
              color: 'var(--text-primary)',
              display: 'inline-block',
            }}>
              {product.precio}
            </span>
          )}
        </div>
      </div>
    </div>
    </Link>
  );
}