'use client';
// src/app/admin/page.tsx
// Panel de administración — protegido por contraseña, sube fotos a Cloudinary

import { useState, useRef, useCallback } from 'react';
import { PRODUCTS, catLabel, type Product, type Categoria } from '@/data/products';

// ── contraseña (cámbiala en producción por una variable de entorno) ───────────
const ADMIN_PASSWORD = 'JasperDante.26';

// ── tipos ─────────────────────────────────────────────────────────────────────
type UploadState = 'idle' | 'uploading' | 'done' | 'error';
interface UploadResult { url: string; publicId: string; productId: number; }

// ── helpers ───────────────────────────────────────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
  });
}

// ── login ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setPass('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#111',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        background: '#1a1a1a', border: '1px solid #333', borderRadius: 16,
        padding: '40px 36px', width: '100%', maxWidth: 360,
        boxShadow: '0 24px 64px rgba(0,0,0,.6)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔒</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#fff' }}>Panel Admin</div>
          <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Estampados Patrón</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'}
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="Contraseña"
              autoFocus
              style={{
                width: '100%', padding: '12px 44px 12px 14px',
                background: error ? '#2a1010' : '#222',
                border: `1px solid ${error ? '#e53935' : '#333'}`,
                borderRadius: 8, color: '#fff', fontSize: 14,
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color .2s',
              }}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 16,
              }}
            >
              {show ? '🙈' : '👁'}
            </button>
          </div>

          {error && (
            <div style={{ color: '#e53935', fontSize: 12, textAlign: 'center' }}>
              Contraseña incorrecta
            </div>
          )}

          <button
            type="submit"
            style={{
              background: '#e53935', color: '#fff', border: 'none',
              borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', marginTop: 4,
            }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

// ── tarjeta de producto ────────────────────────────────────────────────────────
function ProductCard({ product, onUploaded }: { product: Product; onUploaded: (r: UploadResult) => void }) {
  const [state, setState] = useState<UploadState>('idle');
  const [preview, setPreview] = useState<string>(product.img || '');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Solo imágenes.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Máx 10 MB.'); return; }
    setState('uploading'); setError('');
    try {
      const data = await fileToBase64(file);
      const res = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, productId: product.id, folder: 'patronestampados/productos' }),
      });
      if (!res.ok) { const b = await res.json(); throw new Error(b.error || `HTTP ${res.status}`); }
      const result = await res.json();
      setPreview(result.url); setState('done');
      onUploaded({ url: result.url, publicId: result.publicId, productId: product.id });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error'); setState('error');
    }
  }, [product.id, onUploaded]);

  const handleCopy = (text: string) => {
    copyToClipboard(text); setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* zona drop */}
      <div
        style={{
          position: 'relative', height: 170, cursor: 'pointer',
          background: dragOver ? '#f0f4ff' : preview ? '#000' : '#fafafa',
          borderBottom: '1px solid #e8e8e8',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8,
          transition: 'background .15s',
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) uploadFile(e.dataTransfer.files[0]); }}
      >
        {preview
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={preview} alt={product.n} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
          : <>
              <span style={{ fontSize: 38 }}>{product.e}</span>
              <span style={{ fontSize: 11, color: '#bbb', textAlign: 'center', padding: '0 12px' }}>
                {dragOver ? 'Suelta aquí' : 'Arrastra o haz clic'}
              </span>
            </>
        }
        {state === 'uploading' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <circle cx="13" cy="13" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="2.5" />
              <path d="M13 3a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span style={{ color: '#fff', fontSize: 12 }}>Subiendo…</span>
          </div>
        )}
        {state === 'done' && (
          <div style={{ position: 'absolute', top: 7, right: 7, background: '#16a34a', color: '#fff', borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 700 }}>✓ Lista</div>
        )}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) uploadFile(e.target.files[0]); }} />
      </div>

      {/* info */}
      <div style={{ padding: '11px 13px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 12, color: '#111', lineHeight: 1.3 }}>{product.n}</div>
            <div style={{ fontSize: 10, color: '#aaa', marginTop: 1 }}>ID {product.id} · {product.ref}</div>
          </div>
          <span style={{ background: '#f3f4f6', color: '#666', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, whiteSpace: 'nowrap', marginLeft: 6 }}>
            {catLabel(product.c)}
          </span>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', fontSize: 11, padding: '5px 8px', borderRadius: 6, border: '1px solid #fecaca' }}>⚠ {error}</div>}

        {preview && state === 'done' && (
          <div style={{ background: '#f8f9fa', border: '1px solid #e8e8e8', borderRadius: 6, padding: '5px 7px', fontSize: 10, color: '#444', wordBreak: 'break-all', fontFamily: 'monospace', display: 'flex', gap: 5 }}>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preview}</span>
            <button onClick={e => { e.stopPropagation(); handleCopy(preview); }}
              style={{ background: copied ? '#16a34a' : '#6366f1', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 7px', fontSize: 9, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'sans-serif' }}>
              {copied ? '✓' : 'Copiar'}
            </button>
          </div>
        )}

        <button
          onClick={() => inputRef.current?.click()}
          disabled={state === 'uploading'}
          style={{
            marginTop: 'auto', background: state === 'uploading' ? '#e5e7eb' : '#111',
            color: state === 'uploading' ? '#999' : '#fff',
            border: 'none', borderRadius: 7, padding: '7px 0',
            fontSize: 11, fontWeight: 700, cursor: state === 'uploading' ? 'not-allowed' : 'pointer', width: '100%',
          }}
        >
          {state === 'uploading' ? 'Subiendo…' : preview ? 'Cambiar foto' : 'Subir foto'}
        </button>
      </div>
    </div>
  );
}

// ── página principal ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [filterCat, setFilterCat] = useState<'todos' | Categoria>('todos');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'con-foto' | 'sin-foto'>('todos');
  const [uploads, setUploads] = useState<UploadResult[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleUploaded = useCallback((result: UploadResult) => {
    setUploads(prev => {
      const idx = prev.findIndex(u => u.productId === result.productId);
      if (idx >= 0) { const u = [...prev]; u[idx] = result; return u; }
      return [...prev, result];
    });
  }, []);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const cats: Array<{ value: 'todos' | Categoria; label: string }> = [
    { value: 'todos', label: 'Todos' },
    { value: 'poleras', label: 'Poleras' },
    { value: 'polerones', label: 'Polerones' },
    { value: 'tazas', label: 'Tazas' },
    { value: 'accesorios', label: 'Accesorios' },
    { value: 'deportiva', label: 'Deportiva' },
    { value: 'impresion', label: 'Impresión' },
  ];

  const filtered = PRODUCTS.filter(p => {
    const catOk = filterCat === 'todos' || p.c === filterCat;
    const statusOk = filterStatus === 'todos' || (filterStatus === 'con-foto' && !!p.img) || (filterStatus === 'sin-foto' && !p.img);
    return catOk && statusOk;
  });

  const totalConFoto = PRODUCTS.filter(p => p.img).length;

  const handleCopyCode = () => {
    const snippet = uploads.map(u => {
      const p = PRODUCTS.find(pp => pp.id === u.productId);
      return p ? `// ID ${u.productId}: ${p.n}\nimg: '${u.url}',` : null;
    }).filter(Boolean).join('\n\n');
    copyToClipboard(snippet);
    setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Inter', sans-serif" }}>
      {/* header */}
      <div style={{ background: '#111', color: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 54, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 15 }}>Estampados Patrón</span>
          <span style={{ background: '#333', color: '#aaa', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#888' }}>
          <span>📦 {PRODUCTS.length} productos</span>
          <span style={{ color: '#4ade80' }}>✓ {totalConFoto + uploads.length} con foto</span>
          <span style={{ color: '#f87171' }}>○ {PRODUCTS.length - totalConFoto - uploads.length} sin foto</span>
          <button onClick={() => setAuthed(false)} style={{ background: 'none', border: '1px solid #333', color: '#888', borderRadius: 6, padding: '2px 10px', fontSize: 11, cursor: 'pointer' }}>
            Salir
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
        {/* instrucciones */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 14 }}>
          <span style={{ fontSize: 26 }}>☁️</span>
          <ol style={{ margin: 0, padding: '0 0 0 14px', fontSize: 13, color: '#555', lineHeight: 1.8 }}>
            <li>Arrastra o haz clic en cada producto para subir su foto a Cloudinary.</li>
            <li>Copia la URL generada y pégala en el campo <code>img</code> de <code>src/data/products.ts</code>.</li>
            <li>Usa <strong>&ldquo;Copiar todo&rdquo;</strong> al final para obtener todos los cambios juntos.</li>
          </ol>
        </div>

        {/* filtros */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#aaa', marginRight: 2 }}>Categoría:</span>
          {cats.map(c => (
            <button key={c.value} onClick={() => setFilterCat(c.value)}
              style={{ background: filterCat === c.value ? '#111' : '#fff', color: filterCat === c.value ? '#fff' : '#555', border: '1px solid', borderColor: filterCat === c.value ? '#111' : '#ddd', borderRadius: 20, padding: '3px 13px', fontSize: 11, cursor: 'pointer' }}>
              {c.label}
            </button>
          ))}
          <div style={{ width: 1, height: 18, background: '#ddd', margin: '0 3px' }} />
          {(['todos', 'sin-foto', 'con-foto'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ background: filterStatus === s ? '#6366f1' : '#fff', color: filterStatus === s ? '#fff' : '#555', border: '1px solid', borderColor: filterStatus === s ? '#6366f1' : '#ddd', borderRadius: 20, padding: '3px 13px', fontSize: 11, cursor: 'pointer' }}>
              {s === 'todos' ? 'Todos' : s === 'sin-foto' ? '○ Sin foto' : '✓ Con foto'}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#bbb' }}>{filtered.length} de {PRODUCTS.length}</span>
        </div>

        {/* grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onUploaded={handleUploaded} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#ccc', fontSize: 14 }}>
            Sin productos con este filtro.
          </div>
        )}

        {/* código generado */}
        {uploads.length > 0 && (
          <div style={{ marginTop: 28, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                {uploads.length} imagen{uploads.length > 1 ? 'es' : ''} subida{uploads.length > 1 ? 's' : ''} — copia en products.ts
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowCode(!showCode)}
                  style={{ background: '#f3f4f6', color: '#333', border: '1px solid #ddd', borderRadius: 7, padding: '5px 13px', fontSize: 12, cursor: 'pointer' }}>
                  {showCode ? 'Ocultar' : 'Ver código'}
                </button>
                <button onClick={handleCopyCode}
                  style={{ background: codeCopied ? '#16a34a' : '#111', color: '#fff', border: 'none', borderRadius: 7, padding: '5px 13px', fontSize: 12, cursor: 'pointer' }}>
                  {codeCopied ? '✓ Copiado' : 'Copiar todo'}
                </button>
              </div>
            </div>
            {showCode && (
              <pre style={{ margin: 0, padding: '14px 18px', background: '#0f1117', color: '#a3e635', fontSize: 12, lineHeight: 1.7, overflowX: 'auto', fontFamily: 'monospace' }}>
                {uploads.map(u => {
                  const p = PRODUCTS.find(pp => pp.id === u.productId);
                  return p ? `// ID ${u.productId}: ${p.n}\nimg: '${u.url}',\n` : null;
                }).join('\n')}
              </pre>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 36, fontSize: 10, color: '#ddd' }}>
          Panel privado — solo uso interno
        </div>
      </div>
    </div>
  );
}
