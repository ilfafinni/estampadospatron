'use client';
/* eslint-disable @next/next/no-img-element */
// src/components/ProductModal.tsx

import { useState, useEffect } from 'react';
import { Product, catLabel, ESTAMPADO_SIZES, tieneRecargoEstampado, parsePrecio } from '@/data/products';
import { useCart, formatPrice } from '@/lib/CartContext';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [talla, setTalla] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [tipo, setTipo] = useState<string | undefined>();
  const [estampadoId, setEstampadoId] = useState<string | undefined>();
  const [nota, setNota] = useState('');
  const [added, setAdded] = useState(false);

  // IA preview state
  const [fileB64, setFileB64] = useState<string | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileMime, setFileMime] = useState<string>('image/png');
  const [generating, setGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ headline: string; placement: string; technique: string; note: string } | null>(null);
  const [iaError, setIaError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setQty(1);
      setTalla(undefined);
      setColor(undefined);
      setTipo(undefined);
      setEstampadoId(undefined);
      setNota('');
      setAdded(false);
      setFileB64(null);
      setFileDataUrl(null);
      setAiSuggestion(null);
      setIaError(null);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  if (!product) return null;

  const aplicaEstampado = tieneRecargoEstampado(product.c);
  const estampadoSel = aplicaEstampado ? ESTAMPADO_SIZES.find(s => s.id === estampadoId) : undefined;
  const precioBase = parsePrecio(product.precio);
  const precioUnitTotal = precioBase + (estampadoSel?.precio || 0);

  const handleAddToCart = () => {
    addItem({ product, qty, talla, color, tipo, nota: nota || undefined, estampado: estampadoSel });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileMime(f.type || 'image/png');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setFileDataUrl(result);
      setFileB64(result.split(',')[1]);
      setIaError(null);
      setAiSuggestion(null);
    };
    reader.readAsDataURL(f);
  };

  const handleGenerarPreview = async () => {
    if (!fileB64) return;
    setGenerating(true);
    setIaError(null);

    try {
      const res = await fetch('/api/ai/mockup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: fileB64,
          imageMime: fileMime,
          productName: product.n,
          productCategory: catLabel(product.c),
          selectedColor: color,
          selectedType: tipo,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || `Error ${res.status}`);
      }
      setAiSuggestion(data as { headline: string; placement: string; technique: string; note: string });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Intenta nuevamente';
      setIaError('Error al generar: ' + msg);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 500, backdropFilter: 'blur(2px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}
      />
      {/* Modal */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '880px', maxHeight: '94vh',
        background: '#fff', borderRadius: '4px 4px 0 0',
        overflowY: 'auto', zIndex: 600,
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.2rem 1.5rem', borderBottom: '1px solid #e0e0e0',
          position: 'sticky', top: 0, background: '#fff', zIndex: 2,
        }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e53935' }}>
              {catLabel(product.c)} · {product.ref}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#111', marginTop: '2px' }}>
              {product.n}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px', height: '36px', border: '1px solid #e0e0e0',
              background: '#fff', cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '3px', color: '#666', flexShrink: 0,
            }}
          >✕</button>
        </div>

        {/* Modal Body */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          minHeight: '480px',
        }}>
          {/* LEFT: Variantes y CTA */}
          <div style={{ padding: '1.8rem', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7, borderLeft: '3px solid #e53935', paddingLeft: '12px', marginBottom: '1.5rem' }}>
              {product.desc}
            </p>

            {/* Tallas */}
            {product.v.t && (
              <>
                <Label text="Talla" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '4px' }}>
                  {product.v.t.map(t => (
                    <TallaBtn key={t} label={t} selected={talla === t} onClick={() => setTalla(t)} />
                  ))}
                </div>
              </>
            )}

            {/* Colores */}
            {product.v.col && (
              <>
                <Label text="Color" />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  {product.v.col.map(c => (
                    <div
                      key={c.n}
                      title={c.n}
                      onClick={() => setColor(c.n)}
                      style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: c.h, cursor: 'pointer',
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.15)',
                        outline: color === c.n ? '2px solid #111' : '2px solid transparent',
                        outlineOffset: '3px',
                        transition: 'transform .15s',
                      }}
                    />
                  ))}
                </div>
                {color && <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>Seleccionado: {color}</div>}
              </>
            )}

            {/* Tipo */}
            {product.v.tipo && (
              <>
                <Label text="Tipo / Modelo" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '4px' }}>
                  {product.v.tipo.map(t => (
                    <TallaBtn key={t} label={t} selected={tipo === t} onClick={() => setTipo(t)} small />
                  ))}
                </div>
              </>
            )}

            {/* Tamaño de estampado (solo poleras/polerones) */}
            {aplicaEstampado && (
              <>
                <Label text="Tamaño de estampado" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '4px' }}>
                  {ESTAMPADO_SIZES.map(s => (
                    <TallaBtn
                      key={s.id}
                      label={`${s.label} (+${formatPrice(s.precio)})`}
                      selected={estampadoId === s.id}
                      onClick={() => setEstampadoId(prev => prev === s.id ? undefined : s.id)}
                      small
                    />
                  ))}
                </div>
                <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                  Selecciona el tamaño aproximado de tu diseño. Si no seleccionas ninguno, cotizamos el estampado según tu diseño.
                </div>
              </>
            )}

            {/* Precio */}
            {product.precio && (
              <>
                <Label text="Precio referencial" />
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#111', marginTop: '4px' }}>
                  {formatPrice(precioUnitTotal)}{' '}
                  {!aplicaEstampado ? (
                    <span style={{ fontSize: '11px', fontWeight: 400, color: '#999' }}>+ estampado</span>
                  ) : estampadoSel ? (
                    <span style={{ fontSize: '11px', fontWeight: 400, color: '#999' }}>
                      ({formatPrice(precioBase)} prenda + {formatPrice(estampadoSel.precio)} estampado {estampadoSel.label})
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', fontWeight: 400, color: '#999' }}>+ estampado a elegir</span>
                  )}
                </div>
              </>
            )}

            {/* Nota estampado */}
            <Label text="Instrucciones de estampado (opcional)" />
            <textarea
              value={nota}
              onChange={e => setNota(e.target.value)}
              placeholder="Ej: Logo centrado al pecho, colores pantone 032C..."
              rows={3}
              style={{
                padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '3px',
                fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#333',
                resize: 'vertical', outline: 'none', marginBottom: '8px',
              }}
            />

            {/* Qty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
              <QtyBtn onClick={() => setQty(q => Math.max(1, q - 1))} label="−" />
              <span style={{ fontSize: '16px', fontWeight: 700, minWidth: '28px', textAlign: 'center' }}>{qty}</span>
              <QtyBtn onClick={() => setQty(q => q + 1)} label="+" />
            </div>

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              style={{
                width: '100%', background: added ? '#2e7d32' : '#e53935',
                color: '#fff', border: 'none', padding: '14px',
                fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
                cursor: 'pointer', marginTop: 'auto', borderRadius: '3px',
                transition: 'background .3s', textTransform: 'uppercase',
              }}
            >
              {added ? '✓ Agregado al carrito' : '🛒 Agregar al carrito'}
            </button>
            <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '8px', lineHeight: 1.5 }}>
              Confirmaremos tallas y colores antes de producir
            </p>
          </div>

          {/* RIGHT: IA Preview */}
          <div style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Vista previa IA
              </span>
              <span style={{ background: '#e53935', color: '#fff', fontSize: '9px', padding: '2px 7px', borderRadius: '2px', fontWeight: 700 }}>
                BETA
              </span>
            </div>

            {/* Preview area */}
            <div style={{
              flex: 1, border: '1px solid #e0e0e0', background: '#f5f5f5',
              borderRadius: '3px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', position: 'relative', overflow: 'hidden',
              minHeight: '240px', marginBottom: '1rem',
            }}>
              {generating && (
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(245,245,245,0.95)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: '10px',
                }}>
                  <div style={{
                    width: '32px', height: '32px', border: '2px solid #e0e0e0',
                    borderTopColor: '#e53935', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  <span style={{ fontSize: '12px', color: '#666' }}>Generando mockup...</span>
                </div>
              )}
              {fileDataUrl ? (
                <AiMockup product={product} color={color} imageUrl={fileDataUrl} suggestion={aiSuggestion} />
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.8rem', opacity: 0.3 }}>🎨</div>
                  <p style={{ fontSize: '11px', color: '#999', lineHeight: 1.6 }}>
                    Sube tu logo para ver cómo<br />quedaría en este producto
                  </p>
                </div>
              )}
            </div>

            {/* File upload */}
            <label style={{
              display: 'block', border: '1px dashed #ccc', padding: '10px 14px',
              borderRadius: '3px', cursor: 'pointer', textAlign: 'center',
              fontSize: '12px', color: '#666', marginBottom: '8px',
              transition: 'border-color .2s',
            }}>
              📎 Subir logo o diseño
              <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            </label>

            {iaError && (
              <div style={{ fontSize: '11px', color: '#e53935', marginBottom: '8px', padding: '8px', background: '#fff5f5', borderRadius: '3px' }}>
                {iaError}
              </div>
            )}

            <button
              onClick={handleGenerarPreview}
              disabled={!fileB64 || generating}
              style={{
                width: '100%', background: fileB64 ? '#111' : '#ccc',
                color: '#fff', border: 'none', padding: '11px',
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em',
                cursor: fileB64 ? 'pointer' : 'not-allowed', borderRadius: '3px',
                textTransform: 'uppercase',
              }}
            >
              {generating ? 'Generando...' : 'Generar mockup IA'}
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────
function Label({ text }: { text: string }) {
  return (
    <div style={{
      fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: '#666',
      marginBottom: '8px', marginTop: '14px',
    }}>
      {text}
    </div>
  );
}

function TallaBtn({ label, selected, onClick, small }: { label: string; selected: boolean; onClick: () => void; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        minWidth: small ? 'auto' : '42px',
        padding: small ? '7px 10px' : '8px 10px',
        border: '1px solid ' + (selected ? '#111' : '#e0e0e0'),
        background: selected ? '#111' : '#fff',
        color: selected ? '#fff' : '#333',
        fontSize: small ? '11px' : '12px',
        fontWeight: 600, cursor: 'pointer', borderRadius: '3px',
        transition: 'all .15s', fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

function QtyBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '36px', height: '36px', border: '1px solid #e0e0e0',
        background: '#fff', cursor: 'pointer', borderRadius: '3px',
        fontSize: '20px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontWeight: 300, lineHeight: 1,
      }}
    >
      {label}
    </button>
  );
}

function AiMockup({ product, color, imageUrl, suggestion }: { product: Product; color?: string; imageUrl: string; suggestion: { headline: string; placement: string; technique: string; note: string } | null }) {
  const baseColor = product.v.col?.find(c => c.n === color)?.h || (product.c === 'tazas' ? '#f7f7f7' : '#ffffff');
  const isDark = ['#111', '#1a1a1a', '#0a0a0a'].includes(baseColor.toLowerCase());
  const isMug = product.c === 'tazas';
  const isAccessory = product.c === 'accesorios' || product.c === 'impresion';

  return (
    <div style={{ width: '100%', minHeight: '100%', padding: '18px', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      <div style={{ position: 'relative', width: '210px', height: '190px' }}>
        {isMug ? (
          <>
            <div style={{ position: 'absolute', left: '45px', top: '28px', width: '118px', height: '132px', background: baseColor, border: '2px solid #ddd', borderRadius: '0 0 18px 18px', boxShadow: '0 18px 30px rgba(0,0,0,.12)' }} />
            <div style={{ position: 'absolute', right: '20px', top: '58px', width: '52px', height: '62px', border: '10px solid #ddd', borderLeft: 'none', borderRadius: '0 28px 28px 0' }} />
          </>
        ) : isAccessory ? (
          <div style={{ position: 'absolute', left: '42px', top: '28px', width: '126px', height: '138px', background: baseColor, border: '2px solid #ddd', borderRadius: product.c === 'accesorios' ? '18px' : '6px', boxShadow: '0 18px 30px rgba(0,0,0,.12)' }} />
        ) : (
          <>
            <div style={{ position: 'absolute', left: '34px', top: '42px', width: '40px', height: '88px', background: baseColor, border: '2px solid #ddd', borderRadius: '18px 6px 10px 16px', transform: 'rotate(18deg)' }} />
            <div style={{ position: 'absolute', right: '34px', top: '42px', width: '40px', height: '88px', background: baseColor, border: '2px solid #ddd', borderRadius: '6px 18px 16px 10px', transform: 'rotate(-18deg)' }} />
            <div style={{ position: 'absolute', left: '55px', top: '30px', width: '100px', height: '140px', background: baseColor, border: '2px solid #ddd', borderRadius: product.c === 'polerones' ? '24px 24px 14px 14px' : '18px 18px 10px 10px', boxShadow: '0 18px 30px rgba(0,0,0,.12)' }} />
            <div style={{ position: 'absolute', left: '86px', top: '30px', width: '38px', height: '22px', background: '#fff', border: '2px solid #ddd', borderTop: 0, borderRadius: '0 0 24px 24px' }} />
          </>
        )}
        <div style={{ position: 'absolute', left: isMug ? '75px' : '82px', top: isMug ? '72px' : '78px', width: isMug ? '62px' : '48px', height: isMug ? '46px' : '54px', padding: '4px', background: isDark ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.75)', border: '1px dashed #e53935', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={imageUrl} alt="Diseño subido" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
      </div>
      <div style={{ width: '100%', border: '1px solid #eee', borderRadius: '4px', padding: '10px', background: '#fafafa' }}>
        <strong style={{ display: 'block', fontSize: '12px', color: '#111', marginBottom: '5px' }}>{suggestion?.headline || 'Mockup referencial listo'}</strong>
        <p style={{ margin: 0, fontSize: '11px', color: '#666', lineHeight: 1.5 }}>
          {suggestion ? `${suggestion.placement} · ${suggestion.technique}. ${suggestion.note}` : 'Presiona “Generar mockup IA” para recibir ubicación y técnica recomendada.'}
        </p>
      </div>
    </div>
  );
}
