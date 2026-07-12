'use client';
/* eslint-disable @next/next/no-img-element */
// src/components/ProductDetail.tsx
// Vista de producto en página propia (no modal), con editor visual real:
// el cliente sube su diseño y puede arrastrarlo/escalarlo sobre una plantilla
// de la prenda (frente o espalda) para ver exactamente dónde quedará.

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Product, catLabel, ESTAMPADO_SIZES, tieneRecargoEstampado,
  parsePrecio, Ubicacion, EstampadoSeleccion,
} from '@/data/products';
import { useCart, formatPrice } from '@/lib/CartContext';

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [talla, setTalla] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [tipo, setTipo] = useState<string | undefined>();
  const [frenteId, setFrenteId] = useState<string | undefined>();
  const [espaldaId, setEspaldaId] = useState<string | undefined>();
  const [nota, setNota] = useState('');
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const aplicaEstampado = tieneRecargoEstampado(product.c);
  const frenteSel = aplicaEstampado ? ESTAMPADO_SIZES.find(s => s.id === frenteId) : undefined;
  const espaldaSel = aplicaEstampado ? ESTAMPADO_SIZES.find(s => s.id === espaldaId) : undefined;
  const estampados: EstampadoSeleccion[] = [
    ...(frenteSel ? [{ ubicacion: 'Frente' as Ubicacion, ...frenteSel }] : []),
    ...(espaldaSel ? [{ ubicacion: 'Espalda' as Ubicacion, ...espaldaSel }] : []),
  ];
  const precioBase = parsePrecio(product.precio);
  const recargoTotal = estampados.reduce((s, e) => s + e.precio, 0);
  const precioUnitTotal = precioBase + recargoTotal;

  const handleAddToCart = () => {
    addItem({ product, qty, talla, color, tipo, nota: nota || undefined, estampados: estampados.length ? estampados : undefined });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1.5rem 3rem' }}>
      {/* Breadcrumb + compartir */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>Inicio</Link>
          {' / '}
          <Link href={`/?cat=${product.c}`} style={{ color: '#666', textDecoration: 'none' }}>{catLabel(product.c)}</Link>
          {' / '}
          <span style={{ color: '#111', fontWeight: 600 }}>{product.n}</span>
        </div>
        <button
          onClick={handleCopyLink}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: copied ? '#2e7d32' : '#fff', color: copied ? '#fff' : '#111',
            border: '1px solid ' + (copied ? '#2e7d32' : '#e0e0e0'), padding: '8px 14px',
            fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all .15s',
          }}
        >
          {copied ? '✓ Link copiado' : '🔗 Copiar link de este producto'}
        </button>
      </div>

      {/* Grid principal: foto/editor | info y compra */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>

        {/* ── COLUMNA IZQUIERDA: foto + editor de estampado ── */}
        <div>
          <div style={{
            aspectRatio: '1', background: '#f5f5f5', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', border: '1px solid #e0e0e0', overflow: 'hidden',
          }}>
            {product.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.img} alt={product.n} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            ) : (
              <span style={{ fontSize: '5rem', color: '#ccc' }}>■</span>
            )}
            {product.badge && (
              <div style={{ position: 'absolute', top: '14px', left: '14px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 10px', borderRadius: '2px', background: '#111', color: '#fff' }}>
                {product.badge}
              </div>
            )}
          </div>
          <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '8px' }}>
            Foto referencial — fotos reales del producto próximamente
          </p>

          {/* Editor visual de ubicación del estampado */}
          <EstampadoEditor product={product} color={color} />
        </div>

        {/* ── COLUMNA DERECHA: info + compra ── */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e53935' }}>
            {catLabel(product.c)} · {product.ref}
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111', margin: '4px 0 12px' }}>
            {product.n}
          </h1>
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
                      width: '28px', height: '28px', borderRadius: '50%', background: c.h, cursor: 'pointer',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.15)',
                      outline: color === c.n ? '2px solid #111' : '2px solid transparent',
                      outlineOffset: '3px', transition: 'transform .15s',
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

          {/* Estampado por ubicación (solo poleras/polerones) */}
          {aplicaEstampado && (
            <>
              <Label text="Estampado Frente (opcional)" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '4px' }}>
                {ESTAMPADO_SIZES.map(s => (
                  <TallaBtn
                    key={s.id}
                    label={`${s.label} (+${formatPrice(s.precio)})`}
                    selected={frenteId === s.id}
                    onClick={() => setFrenteId(prev => prev === s.id ? undefined : s.id)}
                    small
                  />
                ))}
              </div>

              <Label text="Estampado Espalda (opcional)" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '4px' }}>
                {ESTAMPADO_SIZES.map(s => (
                  <TallaBtn
                    key={s.id}
                    label={`${s.label} (+${formatPrice(s.precio)})`}
                    selected={espaldaId === s.id}
                    onClick={() => setEspaldaId(prev => prev === s.id ? undefined : s.id)}
                    small
                  />
                ))}
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                Puedes elegir un tamaño para el frente y otro distinto para la espalda; ambos se suman al precio. Si no eliges ninguno, cotizamos el estampado según tu diseño.
              </div>
            </>
          )}

          {/* Precio */}
          {product.precio && (
            <>
              <Label text="Precio referencial" />
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#111', marginTop: '4px' }}>
                {formatPrice(precioUnitTotal)}
              </div>
              {!aplicaEstampado ? (
                <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>+ estampado</div>
              ) : estampados.length > 0 ? (
                <div style={{ fontSize: '11px', color: '#999', marginTop: '2px', lineHeight: 1.5 }}>
                  {formatPrice(precioBase)} prenda
                  {estampados.map(e => (
                    <span key={e.ubicacion}> + {formatPrice(e.precio)} {e.ubicacion.toLowerCase()} ({e.label})</span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>+ estampado a elegir</div>
              )}
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
              width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '3px',
              fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#333',
              resize: 'vertical', outline: 'none', marginBottom: '8px', boxSizing: 'border-box',
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
              width: '100%', background: added ? '#2e7d32' : '#e53935', color: '#fff', border: 'none',
              padding: '14px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
              cursor: 'pointer', marginTop: '16px', borderRadius: '3px',
              transition: 'background .3s', textTransform: 'uppercase',
            }}
          >
            {added ? '✓ Agregado al carrito' : '🛒 Agregar al carrito'}
          </button>
          <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '8px', lineHeight: 1.5 }}>
            Confirmaremos tallas y colores antes de producir
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────
function Label({ text }: { text: string }) {
  return (
    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', marginBottom: '8px', marginTop: '14px' }}>
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
        width: '36px', height: '36px', border: '1px solid #e0e0e0', background: '#fff',
        cursor: 'pointer', borderRadius: '3px', fontSize: '20px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontWeight: 300, lineHeight: 1,
      }}
    >
      {label}
    </button>
  );
}

// ─── Editor visual de estampado ────────────────────────
// Plantilla real de la prenda (silueta) + el logo del cliente, que se puede
// arrastrar y escalar encima para ver y definir exactamente dónde va.

type Vista = 'Frente' | 'Espalda';
interface DesignTransform { x: number; y: number; scale: number; } // x,y en % del lienzo

const DEFAULT_TRANSFORM: DesignTransform = { x: 50, y: 42, scale: 1 };

function EstampadoEditor({ product, color }: { product: Product; color?: string }) {
  const [vista, setVista] = useState<Vista>('Frente');
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [transforms, setTransforms] = useState<Record<Vista, DesignTransform>>({
    Frente: { ...DEFAULT_TRANSFORM },
    Espalda: { ...DEFAULT_TRANSFORM },
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const mostrarTabs = product.c === 'poleras' || product.c === 'polerones';

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFileDataUrl(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const updateTransform = (patch: Partial<DesignTransform>) => {
    setTransforms(prev => ({ ...prev, [vista]: { ...prev[vista], ...patch } }));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
    const t = transforms[vista];
    dragState.current = { startX: e.clientX, startY: e.clientY, origX: t.x, origY: t.y };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragState.current.startX) / rect.width) * 100;
    const dy = ((e.clientY - dragState.current.startY) / rect.height) * 100;
    const newX = Math.min(95, Math.max(5, dragState.current.origX + dx));
    const newY = Math.min(95, Math.max(5, dragState.current.origY + dy));
    updateTransform({ x: newX, y: newY });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vista]);

  const onPointerUp = () => { dragState.current = null; };

  const t = transforms[vista];
  const garmentColor = product.v.col?.find(c => c.n === color)?.h
    || (product.c === 'tazas' ? '#f7f7f7' : '#ffffff');

  return (
    <div style={{ marginTop: '1.8rem', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '1.2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Editor de estampado
        </span>
        {mostrarTabs && (
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['Frente', 'Espalda'] as Vista[]).map(v => (
              <button
                key={v}
                onClick={() => setVista(v)}
                style={{
                  padding: '5px 12px', fontSize: '11px', fontWeight: 700, borderRadius: '3px',
                  border: '1px solid ' + (vista === v ? '#111' : '#e0e0e0'),
                  background: vista === v ? '#111' : '#fff', color: vista === v ? '#fff' : '#333',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lienzo con plantilla + diseño arrastrable */}
      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          position: 'relative', width: '100%', aspectRatio: '1', background: '#fafafa',
          border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden',
          userSelect: 'none', touchAction: 'none',
        }}
      >
        <GarmentTemplate categoria={product.c} vista={vista} color={garmentColor} />

        {fileDataUrl && (
          <div
            onPointerDown={onPointerDown}
            style={{
              position: 'absolute', left: `${t.x}%`, top: `${t.y}%`,
              width: `${28 * t.scale}%`, transform: 'translate(-50%, -50%)',
              cursor: 'grab', border: '1px dashed #e53935', borderRadius: '4px',
              padding: '2px', background: 'rgba(255,255,255,0.35)',
            }}
          >
            <img src={fileDataUrl} alt="Tu diseño" draggable={false} style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
          </div>
        )}

        {!fileDataUrl && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', textAlign: 'center', padding: '2rem',
          }}>
            <p style={{ fontSize: '11px', color: '#999', lineHeight: 1.6, margin: 0 }}>
              Sube tu logo o diseño para<br />ubicarlo sobre la prenda
            </p>
          </div>
        )}
      </div>

      {/* Controles */}
      <label style={{ display: 'block', border: '1px dashed #ccc', padding: '10px 14px', borderRadius: '3px', cursor: 'pointer', textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '12px', marginBottom: '10px' }}>
        📎 {fileDataUrl ? 'Cambiar logo o diseño' : 'Subir logo o diseño'}
        <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </label>

      {fileDataUrl && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: '#666', whiteSpace: 'nowrap' }}>Tamaño</span>
          <input
            type="range" min={0.4} max={2} step={0.05}
            value={t.scale}
            onChange={e => updateTransform({ scale: Number(e.target.value) })}
            style={{ flex: 1 }}
          />
        </div>
      )}

      <p style={{ fontSize: '11px', color: '#999', marginTop: '10px', lineHeight: 1.5 }}>
        Arrastra tu diseño dentro del recuadro para ubicarlo exactamente donde lo quieres
        {mostrarTabs ? ', y cambia entre Frente/Espalda arriba.' : '.'} Esta vista es referencial; confirmamos el detalle final antes de producir.
      </p>
    </div>
  );
}

// Silueta simple de la prenda según categoría, para usar como plantilla de referencia.
function GarmentTemplate({ categoria, vista, color }: { categoria: Product['c']; vista: Vista; color: string }) {
  const isMug = categoria === 'tazas';
  const isFlat = categoria === 'accesorios' || categoria === 'impresion';
  const isHoodie = categoria === 'polerones';

  if (isMug) {
    return (
      <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
        <rect x="55" y="55" width="95" height="105" rx="10" fill={color} stroke="#ddd" strokeWidth="2" />
        <path d="M150 80 q35 0 35 35 t-35 35" fill="none" stroke="#ddd" strokeWidth="8" />
      </svg>
    );
  }

  if (isFlat) {
    return (
      <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
        <rect x="40" y="30" width="120" height="150" rx="16" fill={color} stroke="#ddd" strokeWidth="2" />
      </svg>
    );
  }

  // Polera o polerón: silueta de prenda con mangas, frente o espalda
  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
      {/* Mangas */}
      <path d="M55 35 L18 55 L30 95 L58 80 Z" fill={color} stroke="#ddd" strokeWidth="2" />
      <path d="M145 35 L182 55 L170 95 L142 80 Z" fill={color} stroke="#ddd" strokeWidth="2" />
      {/* Cuerpo */}
      <path
        d="M70 28 Q100 42 130 28 L150 45 L150 185 L50 185 L50 45 Z"
        fill={color} stroke="#ddd" strokeWidth="2"
      />
      {/* Cuello: redondo para espalda, escotado para frente */}
      {vista === 'Frente' ? (
        <path d="M82 30 Q100 50 118 30" fill="none" stroke="#ddd" strokeWidth="2" />
      ) : (
        <path d="M85 28 Q100 38 115 28" fill="none" stroke="#ddd" strokeWidth="2" />
      )}
      {/* Capucha (solo polerón, vista espalda) */}
      {isHoodie && vista === 'Espalda' && (
        <path d="M75 30 Q100 5 125 30" fill="none" stroke="#ddd" strokeWidth="2" />
      )}
      {/* Bolsillo canguro (solo polerón, vista frente) */}
      {isHoodie && vista === 'Frente' && (
        <path d="M65 130 Q100 145 135 130 L135 160 Q100 172 65 160 Z" fill="none" stroke="#ddd" strokeWidth="1.5" />
      )}
    </svg>
  );
}
