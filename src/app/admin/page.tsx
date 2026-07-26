'use client';
// src/app/admin/page.tsx — Panel admin completo

import { useState, useRef, useCallback } from 'react';
import { PRODUCTS, CATEGORIES, catLabel, type Product, type Categoria } from '@/data/products';

interface CategoryDef {
  c: string;
  name: string;
  count: string;
  icon: string;
  img?: string;
  bg: string;
}

const ADMIN_PASSWORD = 'JasperDante.26';

// ── tipos ─────────────────────────────────────────────────────────────────────
type Tab = 'fotos' | 'productos' | 'categorias' | 'banners';
type UploadState = 'idle' | 'uploading' | 'done' | 'error';
interface UploadResult { url: string; publicId: string; productId: number; }
interface EditableProduct extends Omit<Product,'c'> { c: string; _dirty?: boolean; _new?: boolean; _deleted?: boolean; }

// ── helpers ───────────────────────────────────────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
  });
}

function generateProductsTs(products: EditableProduct[], cats: CategoryDef[]): string {
  const rows = products.filter(p => !p._deleted).map(p => {
    const t    = p.v.t?.length    ? `t:[${p.v.t.map((s:string) => `'${s}'`).join(',')}]` : '';
    const col  = p.v.col?.length  ? `col:[${p.v.col.map((c:{n:string;h:string}) => `{n:'${c.n}',h:'${c.h}'}`).join(',')}]` : '';
    const tipo = p.v.tipo?.length ? `tipo:[${p.v.tipo.map((s:string) => `'${s}'`).join(',')}]` : '';
    const v    = [t, col, tipo].filter(Boolean).join(',');
    const img  = p.img   ? `  img: '${p.img}',\n` : '';
    const bdg  = p.badge ? `  badge: '${p.badge}',\n` : '';
    return `  {\n  id: ${p.id}, c: '${p.c}', n: '${p.n.replace(/'/g,"\\'")}', ref: '${p.ref}',\n${img}  desc: '${p.desc.replace(/'/g,"\\'")}', v: {${v}}, precio: '${p.precio}',\n${bdg}  }`;
  });

  const catCodes = cats.map(c => c.c);
  const catUnion = catCodes.map(c => `'${c}'`).join(' | ');

  const catsArr = cats.map(c => {
    const count = products.filter(p => !p._deleted && p.c === c.c).length;
    const label = count === 1 ? 'producto' : 'productos';
    const img = c.img ? `, img:'${c.img}'` : '';
    return `  {c:'${c.c}' as Categoria, name:'${c.name.replace(/'/g,"\\'")}', count:'${count} ${label}', icon:'${c.icon}'${img}, bg:'${c.bg}'}`;
  }).join(',\n');

  const recargoConds = catCodes.filter(c => c === 'poleras' || c === 'polerones');
  const tieneRecargoBody = recargoConds.length > 0
    ? `return c === '${recargoConds.join(`' || c === '`)}';`
    : 'return false;';

  const labelMap = cats.map(c => `  '${c.c}':'${c.name.replace(/'/g,"\\'")}'`).join(',\n');

  return `// src/data/products.ts
export type Categoria = ${catUnion};
export type Badge = 'popular' | 'eco' | 'pack' | 'nuevo';
export interface ColorVariant { n: string; h: string; }
export interface ProductVariants { t?: string[]; col?: ColorVariant[]; tipo?: string[]; }
export interface Product {
  id: number; c: Categoria; n: string; ref: string; e?: string;
  img?: string; desc: string; v: ProductVariants; precio: string; badge?: Badge;
}
export const PRODUCTS: Product[] = [
${rows.join(',\n')}
];
export const CATEGORIES = [
${catsArr}
];
export interface EstampadoSize { id: string; label: string; precio: number; }
export const ESTAMPADO_SIZES: EstampadoSize[] = [
  { id: '30x30', label: '30 × 30 cm aprox', precio: 7000 },
  { id: '20x20', label: '20 × 20 cm aprox', precio: 5000 },
  { id: '10x30', label: '10 × 30 cm', precio: 2000 },
  { id: '10x10', label: '10 × 10 cm', precio: 1000 },
];
export type Ubicacion = 'Frente' | 'Espalda';
export interface EstampadoSeleccion { ubicacion: Ubicacion; id: string; label: string; precio: number; }
export function slugify(p: Product): string {
  const base = p.n.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  return \`\${base}-\${p.id}\`;
}
export function findBySlug(slug: string): Product | undefined {
  const id = Number(slug.split('-').pop());
  return PRODUCTS.find(p => p.id === id);
}
export function tieneRecargoEstampado(c: Categoria): boolean { ${tieneRecargoBody} }
export function parsePrecio(precio: string): number {
  const match = precio.match(/[\\d.]+/);
  if (!match) return 0;
  return parseInt(match[0].replace(/\\./g, ''), 10);
}
export function catLabel(c: Categoria): string {
  const map: Record<Categoria,string> = {\n${labelMap}\n};
  return map[c] || c;
}`;
}

function generateBannersTs(banners: import('@/data/banners').BannerConfig): string {
  const opt = (val: unknown, key: string) => val ? `\n    ${key}: '${String(val).replace(/'/g,"\\'")}',` : '';
  const heroSlides = banners.heroSlides.map(s => {
    const panZoom = s.img ? `\n    imgPanX: ${s.imgPanX??0},\n    imgPanY: ${s.imgPanY??0},\n    imgZoom: ${s.imgZoom??1},` : '';
    const extra = [s.img&&opt(s.img,'img'), s.imgFit&&opt(s.imgFit,'imgFit'), s.imgPosition&&opt(s.imgPosition,'imgPosition'), panZoom, s.textAlign&&opt(s.textAlign,'textAlign'), s.textVertical&&opt(s.textVertical,'textVertical'), s.overlayStyle&&opt(s.overlayStyle,'overlayStyle'), s.ctaParam&&opt(s.ctaParam,'ctaParam')].filter(Boolean).join('');
    return `  {\n    id: ${s.id},\n    tag: '${s.tag.replace(/'/g,"\\'")}',\n    h1Line1: '${s.h1Line1.replace(/'/g,"\\'")}',\n    h1Line2: '${s.h1Line2.replace(/'/g,"\\'")}',\n    p: '${s.p.replace(/'/g,"\\'")}',\n    cta: '${s.cta.replace(/'/g,"\\'")}',\n    ctaType: '${s.ctaType}',${extra}\n    bg: '${s.bg.replace(/'/g,"\\'")}',\n  }`;
  }).join(',\n');
  const promoBanners = banners.promoBanners.map(b => {
    const panZoom = b.img ? `\n    imgPanX: ${b.imgPanX??0},\n    imgPanY: ${b.imgPanY??0},\n    imgZoom: ${b.imgZoom??1},` : '';
    const extra = [b.img&&opt(b.img,'img'), b.imgFit&&opt(b.imgFit,'imgFit'), b.imgPosition&&opt(b.imgPosition,'imgPosition'), panZoom, b.textAlign&&opt(b.textAlign,'textAlign'), b.textVertical&&opt(b.textVertical,'textVertical'), b.overlayStyle&&opt(b.overlayStyle,'overlayStyle'), b.ctaParam&&opt(b.ctaParam,'ctaParam')].filter(Boolean).join('');
    return `  {\n    id: ${b.id},\n    label: '${b.label.replace(/'/g,"\\'")}',\n    titleLine1: '${b.titleLine1.replace(/'/g,"\\'")}',\n    titleLine2: '${b.titleLine2.replace(/'/g,"\\'")}',\n    cta: '${b.cta.replace(/'/g,"\\'")}',\n    ctaType: '${b.ctaType}',${extra}\n    bg: '${b.bg.replace(/'/g,"\\'")}',\n  }`;
  }).join(',\n');
  return `export interface HeroSlideData {
  id: number;
  tag: string;
  h1Line1: string;
  h1Line2: string;
  p: string;
  cta: string;
  ctaType: 'catalogo' | 'contacto' | 'whatsapp';
  ctaParam?: string;
  img?: string;
  imgFit?: 'cover' | 'contain' | 'fill';
   imgPosition?: string;
   imgPanX?: number;
   imgPanY?: number;
   imgZoom?: number;
   textAlign?: 'left' | 'center' | 'right';
   textVertical?: 'top' | 'middle' | 'bottom';
   overlayStyle?: string;
   bg: string;
 }

 export interface PromoBannerData {
   id: number;
   label: string;
   titleLine1: string;
   titleLine2: string;
   cta: string;
   ctaType: 'categoria' | 'contacto';
   ctaParam?: string;
   img?: string;
   imgFit?: 'cover' | 'contain' | 'fill';
   imgPosition?: string;
   imgPanX?: number;
   imgPanY?: number;
   imgZoom?: number;
   textAlign?: 'left' | 'center' | 'right';
   textVertical?: 'top' | 'middle' | 'bottom';
   overlayStyle?: string;
   bg: string;
 }

export interface BannerConfig {
  heroSlides: HeroSlideData[];
  promoBanners: PromoBannerData[];
}

export const BANNERS: BannerConfig = {
  heroSlides: [\n${heroSlides}\n  ],
  promoBanners: [\n${promoBanners}\n  ],
};`;
}

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) onLogin();
    else { setError(true); setPass(''); setTimeout(() => setError(false), 2000); }
  };
  return (
    <div style={{ minHeight:'100vh', background:'#111', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter',sans-serif" }}>
      <div style={{ background:'#1a1a1a', border:'1px solid #333', borderRadius:16, padding:'40px 36px', width:'100%', maxWidth:360, boxShadow:'0 24px 64px rgba(0,0,0,.6)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🔒</div>
          <div style={{ fontWeight:800, fontSize:18, color:'#fff' }}>Panel Admin</div>
          <div style={{ fontSize:13, color:'#666', marginTop:4 }}>Estampados Patrón</div>
        </div>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ position:'relative' }}>
            <input type={show?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="Contraseña" autoFocus
              style={{ width:'100%', padding:'12px 44px 12px 14px', background:error?'#2a1010':'#222', border:`1px solid ${error?'#e53935':'#333'}`, borderRadius:8, color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            <button type="button" onClick={()=>setShow(!show)}
              style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:16 }}>
              {show?'🙈':'👁'}
            </button>
          </div>
          {error && <div style={{ color:'#e53935', fontSize:12, textAlign:'center' }}>Contraseña incorrecta</div>}
          <button type="submit" style={{ background:'#e53935', color:'#fff', border:'none', borderRadius:8, padding:'12px', fontSize:14, fontWeight:700, cursor:'pointer', marginTop:4 }}>Entrar</button>
        </form>
      </div>
    </div>
  );
}

// ── Tarjeta foto ──────────────────────────────────────────────────────────────
function PhotoCard({ product, uploadedUrl, onUploaded }: { product: EditableProduct; uploadedUrl?: string; onUploaded: (r: UploadResult) => void }) {
  const [state, setState] = useState<UploadState>('idle');
  const [preview, setPreview] = useState(uploadedUrl || product.img || '');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Solo imágenes.'); return; }
    if (file.size > 10*1024*1024) { setError('Máx 10 MB.'); return; }
    setState('uploading'); setError('');
    try {
      const data = await fileToBase64(file);
      const res = await fetch('/api/cloudinary/upload', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ data, productId:product.id, folder:'patronestampados/productos' }),
      });
      if (!res.ok) { const b = await res.json(); throw new Error(b.error||`HTTP ${res.status}`); }
      const result = await res.json();
      setPreview(result.url); setState('done');
      onUploaded({ url:result.url, publicId:result.publicId, productId:product.id });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error'); setState('error');
    }
  }, [product.id, onUploaded]);

  return (
    <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'relative', height:160, cursor:'pointer', background:dragOver?'#f0f4ff':preview?'#000':'#fafafa', borderBottom:'1px solid #e8e8e8', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}
        onClick={()=>inputRef.current?.click()}
        onDragOver={e=>{e.preventDefault();setDragOver(true);}}
        onDragLeave={()=>setDragOver(false)}
        onDrop={e=>{e.preventDefault();setDragOver(false);if(e.dataTransfer.files[0])upload(e.dataTransfer.files[0]);}}>
        {preview
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={preview} alt={product.n} style={{ width:'100%', height:'100%', objectFit:'contain', padding:6 }} />
          : <span style={{ fontSize:11, color:'#bbb' }}>{dragOver?'Suelta aquí':'Arrastra imagen o clic'}</span>}
        {state==='uploading' && (
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.6)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ animation:'spin 1s linear infinite' }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <circle cx="13" cy="13" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="2.5"/>
              <path d="M13 3a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span style={{ color:'#fff', fontSize:12 }}>Subiendo…</span>
          </div>
        )}
        {state==='done' && <div style={{ position:'absolute', top:7, right:7, background:'#16a34a', color:'#fff', borderRadius:20, padding:'2px 9px', fontSize:10, fontWeight:700 }}>✓ Lista</div>}
        <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>{if(e.target.files?.[0])upload(e.target.files[0]);}} />
      </div>
      <div style={{ padding:'10px 12px', flex:1, display:'flex', flexDirection:'column', gap:5 }}>
        <div style={{ fontWeight:600, fontSize:12, color:'#111' }}>{product.n}</div>
        <div style={{ fontSize:10, color:'#aaa' }}>ID {product.id} · {catLabel(product.c as Categoria)}</div>
        {error && <div style={{ background:'#fef2f2', color:'#dc2626', fontSize:11, padding:'4px 8px', borderRadius:5, border:'1px solid #fecaca' }}>⚠ {error}</div>}
        {preview && state==='done' && (
          <div style={{ background:'#f8f9fa', border:'1px solid #e8e8e8', borderRadius:5, padding:'4px 7px', fontSize:10, display:'flex', gap:5, alignItems:'center' }}>
            <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:'monospace', color:'#444' }}>{preview}</span>
            <button onClick={e=>{e.stopPropagation();copyToClipboard(preview);setCopied(true);setTimeout(()=>setCopied(false),1500);}}
              style={{ background:copied?'#16a34a':'#6366f1', color:'#fff', border:'none', borderRadius:4, padding:'2px 7px', fontSize:9, cursor:'pointer', whiteSpace:'nowrap' }}>
              {copied?'✓':'Copiar'}
            </button>
          </div>
        )}
        <button onClick={()=>inputRef.current?.click()} disabled={state==='uploading'}
          style={{ marginTop:'auto', background:state==='uploading'?'#e5e7eb':'#111', color:state==='uploading'?'#999':'#fff', border:'none', borderRadius:7, padding:'7px 0', fontSize:11, fontWeight:700, cursor:state==='uploading'?'not-allowed':'pointer', width:'100%' }}>
          {state==='uploading'?'Subiendo…':preview?'Cambiar foto':'Subir foto'}
        </button>
      </div>
    </div>
  );
}

// ── Modal producto ─────────────────────────────────────────────────────────────
const lbl: React.CSSProperties = { display:'flex', flexDirection:'column', gap:5, fontSize:12, fontWeight:600, color:'#555' };
const inp: React.CSSProperties = { padding:'8px 10px', border:'1px solid #e0e0e0', borderRadius:7, fontSize:13, fontFamily:'inherit', outline:'none', width:'100%', boxSizing:'border-box' };

function ProductModal({ product, onSave, onClose, catList }: { product: EditableProduct | null; onSave:(p:EditableProduct)=>void; onClose:()=>void; catList: CategoryDef[] }) {
  const cats = catList;
  const blank: EditableProduct = { id:Date.now(), c:catList[0]?.c||'', n:'', ref:'', desc:'', v:{}, precio:'$0', _new:true };
  const [form, setForm] = useState<EditableProduct>(product || blank);
  const set = (k: keyof EditableProduct, v: unknown) => setForm(f=>({...f,[k]:v,_dirty:true}));

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h2 style={{ margin:0, fontSize:18, fontWeight:800 }}>{form._new?'Nuevo producto':'Editar producto'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#999' }}>×</button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <label style={lbl}>Nombre<input value={form.n} onChange={e=>set('n',e.target.value)} style={inp} placeholder="Ej: Polera Básica Algodón"/></label>
          <label style={lbl}>Referencia<input value={form.ref} onChange={e=>set('ref',e.target.value)} style={inp} placeholder="PAT-0001"/></label>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <label style={lbl}>Categoría
              <select value={form.c} onChange={e=>set('c',e.target.value)} style={inp}>
                {cats.map(c=><option key={c.c} value={c.c}>{c.name}</option>)}
              </select>
            </label>
            <label style={lbl}>Precio<input value={form.precio} onChange={e=>set('precio',e.target.value)} style={inp} placeholder="$6.000"/></label>
          </div>
          <label style={lbl}>Descripción<textarea value={form.desc} onChange={e=>set('desc',e.target.value)} style={{...inp,height:72,resize:'vertical'}} placeholder="Descripción breve…"/></label>
          <label style={lbl}>Tallas (separadas por coma)<input value={(form.v.t||[]).join(',')} onChange={e=>set('v',{...form.v,t:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} style={inp} placeholder="XS,S,M,L,XL,XXL"/></label>
          <label style={lbl}>Colores (nombre:hex, separados por coma)<input value={(form.v.col||[]).map(c=>`${c.n}:${c.h}`).join(', ')} onChange={e=>{
            const cols=e.target.value.split(',').map(s=>s.trim()).filter(Boolean).map(s=>{const[n,h]=s.split(':');return{n:(n||'').trim(),h:(h||'#000').trim()};});
            set('v',{...form.v,col:cols});
          }} style={inp} placeholder="Negro:#111, Blanco:#fff"/></label>
          <label style={lbl}>Badge (opcional)
            <select value={form.badge||''} onChange={e=>set('badge',e.target.value||undefined)} style={inp}>
              <option value="">Sin badge</option>
              <option value="popular">⭐ Popular</option>
              <option value="nuevo">🆕 Nuevo</option>
              <option value="eco">🌿 Eco</option>
              <option value="pack">📦 Pack</option>
            </select>
          </label>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:22 }}>
          <button onClick={onClose} style={{ flex:1, background:'#f3f4f6', color:'#555', border:'1px solid #ddd', borderRadius:8, padding:'10px', fontSize:13, cursor:'pointer' }}>Cancelar</button>
          <button onClick={()=>{onSave(form);onClose();}} style={{ flex:2, background:'#111', color:'#fff', border:'none', borderRadius:8, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Guardar producto</button>
        </div>
      </div>
    </div>
  );
}

// ── Modal categoría ────────────────────────────────────────────────────────────
const catInp: React.CSSProperties = { padding:'8px 10px', border:'1px solid #e0e0e0', borderRadius:7, fontSize:13, fontFamily:'inherit', outline:'none', width:'100%', boxSizing:'border-box' };
const catLbl: React.CSSProperties = { display:'flex', flexDirection:'column', gap:5, fontSize:12, fontWeight:600, color:'#555' };

function CategoryModal({ cat, existingCodes, onSave, onClose }: { cat: CategoryDef | null; existingCodes: string[]; onSave:(c:CategoryDef)=>void; onClose:()=>void }) {
  const blank: CategoryDef = { c:'', name:'', count:'', icon:'', bg:'linear-gradient(160deg,#111 0%,#333 60%,#555 100%)' };
  const [form, setForm] = useState<CategoryDef>(cat || blank);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadError, setUploadError] = useState('');
  const [codeError, setCodeError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof CategoryDef, v: string) => setForm(f=>({...f,[k]:v}));

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Solo imágenes.'); return; }
    if (file.size > 10*1024*1024) { setUploadError('Máx 10 MB.'); return; }
    setUploadState('uploading'); setUploadError('');
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch('/api/cloudinary/upload', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ data:base64, productId:0, folder:'patronestampados/categorias' }),
      });
      if (!res.ok) { const b = await res.json(); throw new Error(b.error||`HTTP ${res.status}`); }
      const result = await res.json();
      set('img', result.url);
      setUploadState('done');
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Error');
      setUploadState('error');
    }
  };

  const handleSave = () => {
    if(!form.c.trim()||!form.name.trim()){ alert('Código y nombre son obligatorios.'); return; }
    const code = form.c.trim().toLowerCase().replace(/[^a-z0-9]/g,'');
    if(!code){ alert('El código debe contener al menos una letra o número.'); return; }
    if(code!==cat?.c&&existingCodes.includes(code)){ setCodeError('Ya existe una categoría con este código.'); return; }
    setCodeError('');
    onSave({...form,c:code});
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, width:'100%', maxWidth:460, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h2 style={{ margin:0, fontSize:18, fontWeight:800 }}>{cat?'Editar categoría':'Nueva categoría'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#999' }}>×</button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <label style={catLbl}>Código interno
            <input value={form.c} onChange={e=>{setCodeError('');set('c',e.target.value);}} style={{...catInp,borderColor:codeError?'#dc2626':'#e0e0e0'}} placeholder="ej: poleras, tazas, accesorios"/>
            {codeError&&<span style={{ color:'#dc2626', fontSize:11 }}>{codeError}</span>}
            <span style={{ color:'#999', fontSize:10 }}>Solo minúsculas, sin espacios ni caracteres especiales. Se normalizará automáticamente.</span>
          </label>
          <label style={catLbl}>Nombre visible
            <input value={form.name} onChange={e=>set('name',e.target.value)} style={catInp} placeholder="Ej: Poleras, Tazas, Accesorios"/>
          </label>
          <label style={catLbl}>Icono (emoji)
            <input value={form.icon} onChange={e=>set('icon',e.target.value)} style={catInp} placeholder="Ej: 👕, ☕, 🧥"/>
          </label>
          <label style={catLbl}>Imagen de fondo
            <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);}} />
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <button onClick={()=>inputRef.current?.click()} style={{ background:'#f3f4f6', border:'1px solid #ddd', borderRadius:6, padding:'7px 14px', fontSize:12, cursor:'pointer' }}>
                {uploadState==='uploading'?'Subiendo...':'Subir imagen'}
              </button>
              {form.img&&<button onClick={()=>set('img','')} style={{ background:'none', border:'none', color:'#dc2626', fontSize:11, cursor:'pointer', textDecoration:'underline' }}>Eliminar</button>}
              {uploadError&&<span style={{ color:'#dc2626', fontSize:11 }}>{uploadError}</span>}
              {uploadState==='done'&&<span style={{ color:'#16a34a', fontSize:11 }}>✓ Imagen subida</span>}
            </div>
          </label>
          <label style={catLbl}>Gradiente de fondo
            <input value={form.bg} onChange={e=>set('bg',e.target.value)} style={catInp} placeholder="linear-gradient(...)"/>
          </label>
          <div style={{ borderRadius:8, overflow:'hidden', minHeight:160, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', background:form.bg||'#eee', fontSize:28 }}>
            {form.img&&<div style={{ position:'absolute', inset:0, background:`url(${form.img}) center/cover no-repeat` }} />}
            <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <span style={{ fontSize:32 }}>{form.icon||'📁'}</span>
              <span style={{ color:'#fff', fontWeight:700, fontSize:14, textShadow:'0 2px 8px rgba(0,0,0,.5)' }}>{form.name||'Vista previa'}</span>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:22 }}>
          <button onClick={onClose} style={{ flex:1, background:'#f3f4f6', color:'#555', border:'1px solid #ddd', borderRadius:8, padding:'10px', fontSize:13, cursor:'pointer' }}>Cancelar</button>
          <button onClick={handleSave} style={{ flex:2, background:'#111', color:'#fff', border:'none', borderRadius:8, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Guardar categoría</button>
        </div>
      </div>
    </div>
  );
}

// ── Editor completo de banners ────────────────────────────────────────────────
const bannerEditorStyles = {
  overlay: {
    position:'fixed' as const, inset:0, background:'rgba(0,0,0,.7)', zIndex:300,
    display:'flex', alignItems:'center', justifyContent:'center', padding:16,
  },
  container: {
    background:'#fff', borderRadius:16, width:'100%', maxWidth:1100,
    maxHeight:'94vh', display:'flex', flexDirection:'column' as const,
    overflow:'hidden', boxShadow:'0 24px 80px rgba(0,0,0,.5)',
  },
  header: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'16px 24px', borderBottom:'1px solid #eee',
  },
  body: {
    display:'flex', flex:1, overflow:'hidden',
    flexDirection:'row' as const, flexWrap:'wrap' as const,
  },
  previewPanel: {
    flex:'1 1 50%' as const, minWidth:320, padding:20,
    display:'flex', alignItems:'center', justifyContent:'center',
    background:'#f5f5f5', position:'relative' as const, overflow:'hidden',
  },
  controlsPanel: {
    flex:'1 1 50%' as const, minWidth:320, padding:'20px 24px',
    overflowY:'auto' as const, maxHeight:'calc(94vh - 60px)',
  },
  sectionTitle: {
    fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase' as const,
    letterSpacing:'0.08em', marginBottom:12, paddingBottom:8,
    borderBottom:'1px solid #eee',
  },
  label: {
    display:'flex', flexDirection:'column' as const, gap:4,
    fontSize:11, fontWeight:600, color:'#555', marginBottom:12,
  },
  input: {
    padding:'7px 10px', border:'1px solid #ddd', borderRadius:6,
    fontSize:13, fontFamily:'inherit' as const, outline:'none',
    width:'100%', boxSizing:'border-box' as const, marginTop:2,
  },
  select: {
    padding:'7px 10px', border:'1px solid #ddd', borderRadius:6,
    fontSize:13, fontFamily:'inherit' as const, outline:'none',
    width:'100%', boxSizing:'border-box' as const, marginTop:2,
    background:'#fff', cursor:'pointer',
  },
  row: {
    display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:4,
  },
};

function BannerEditorModal({
  type, data, onSave, onClose,
}: {
  type: 'hero' | 'promo';
  data: import('@/data/banners').HeroSlideData | import('@/data/banners').PromoBannerData;
  onSave: (updated: import('@/data/banners').HeroSlideData | import('@/data/banners').PromoBannerData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<any>({ ...data, imgPanX: (data as any).imgPanX ?? 0, imgPanY: (data as any).imgPanY ?? 0, imgZoom: (data as any).imgZoom ?? 1 });
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const bgImgCss = form.img
    ? `${form.bg || ''}, url(${form.img}) ${form.imgPosition || 'center'} / ${form.imgFit || 'cover'} no-repeat`
    : form.bg || (type === 'hero'
        ? 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 50%, var(--bg-secondary) 100%)'
        : 'linear-gradient(135deg, #111 0%, #333 100%)');

  const overlayCss = form.overlayStyle || (type === 'hero'
    ? 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
    : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 70%)');

  const vAlign = form.textVertical === 'middle' ? 'center' : form.textVertical === 'bottom' ? 'flex-end' : 'flex-start';
  const hAlign = form.textAlign || 'left';

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Solo imágenes.'); return; }
    if (file.size > 10*1024*1024) { setUploadError('Máx 10 MB.'); return; }
    setUploadState('uploading'); setUploadError('');
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch('/api/cloudinary/upload', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ data:base64, productId:0, folder:'patronestampados/banners' }),
      });
      if (!res.ok) { const b = await res.json(); throw new Error(b.error||`HTTP ${res.status}`); }
      const result = await res.json();
      set('img', result.url);
      setUploadState('done');
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Error');
      setUploadState('error');
    }
  };

  const isHero = type === 'hero';
  const [savedLocally, setSavedLocally] = useState(false);

  const handleSave = () => {
    onSave(form);
    setSavedLocally(true);
    setTimeout(() => onClose(), 600);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!form.img) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: form.imgPanX, panY: form.imgPanY };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      set('imgPanX', Math.round((dragRef.current.panX + dx) * 10) / 10);
      set('imgPanY', Math.round((dragRef.current.panY + dy) * 10) / 10);
    };
    const onUp = () => { dragRef.current = null; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!form.img) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const newZoom = Math.max(0.2, Math.min(5, (form.imgZoom ?? 1) + delta));
    set('imgZoom', Math.round(newZoom * 100) / 100);
  };

  const resetTransform = () => {
    set('imgPanX', 0);
    set('imgPanY', 0);
    set('imgZoom', 1);
  };

  const vAlignFlex = form.textVertical === 'middle' ? 'center' : form.textVertical === 'bottom' ? 'flex-end' : 'flex-start';

  return (
    <div style={bannerEditorStyles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={bannerEditorStyles.container}>
        {/* Header */}
        <div style={bannerEditorStyles.header}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={onClose} style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', color:'#999' }}>←</button>
            <span style={{ fontWeight:700, fontSize:16 }}>
              {isHero ? `🎠 Slide ${form.id}` : `📢 Banner ${form.id}`}
              <span style={{ fontWeight:400, color:'#999', fontSize:13, marginLeft:8 }}>
                {isHero ? 'Hero Slider' : 'Promocional'}
              </span>
            </span>
            {savedLocally && <span style={{ background:'#16a34a', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 10px', borderRadius:10 }}>✓ Guardado</span>}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={onClose} style={{ background:'#f3f4f6', color:'#555', border:'1px solid #ddd', borderRadius:8, padding:'8px 16px', fontSize:12, cursor:'pointer' }}>Cancelar</button>
            <button onClick={handleSave} style={{ background:'#111', color:'#fff', border:'none', borderRadius:8, padding:'8px 20px', fontSize:12, fontWeight:700, cursor:'pointer' }}>💾 Guardar</button>
          </div>
        </div>

        {/* Body */}
        <div style={bannerEditorStyles.body}>
          {/* ── PREVIEW ── */}
          <div style={bannerEditorStyles.previewPanel}>
            {/* Label que indica que es preview */}
            <div style={{ position:'absolute', top:24, left:24, zIndex:10, background:'rgba(0,0,0,0.6)', color:'#fff', fontSize:9, fontWeight:700, padding:'3px 10px', borderRadius:4, letterSpacing:'0.08em' }}>
              VISTA PREVIA
            </div>
            {isHero ? (
              <div style={{
                width:'100%', aspectRatio:'21/9', maxHeight:'100%', borderRadius:12, overflow:'hidden',
                position:'relative', boxShadow:'0 4px 20px rgba(0,0,0,.15)',
                display:'flex', alignItems: vAlignFlex, minHeight:'320px', background:'#000',
              }}>
                {/* Imagen de fondo como img para mejor compatibilidad */}
                {form.img && <img ref={previewRef as any} src={form.img} alt=""
                  onMouseDown={handleMouseDown}
                  onWheel={handleWheel}
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:form.imgFit||'cover', objectPosition:form.imgPosition||'center', transform:`translate(${form.imgPanX??0}px, ${form.imgPanY??0}px) scale(${form.imgZoom??1})`, cursor:'grab', transition:'transform 0.05s', transformOrigin:'center' }} />}
                {/* Fallback gradient cuando no hay imagen */}
                {!form.img && <div style={{ position:'absolute', inset:0, background: form.bg || 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' }} />}
                {/* Overlay oscuro */}
                <div style={{ position:'absolute', inset:0, background: overlayCss }} />
                {/* Contenido */}
                <div style={{
                  position:'relative', zIndex:2, padding:'3rem 2rem', maxWidth:'640px', color:'#fff',
                  textAlign: hAlign as any, width:'100%', boxSizing:'border-box',
                }}>
                  <div style={{
                    fontSize:'11px', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase',
                    color:'#93c5fd', background:'rgba(255,255,255,0.15)',
                    padding:'4px 12px', borderRadius:'4px', display:'inline-block',
                    marginBottom:'1rem', backdropFilter:'blur(4px)',
                  }}>
                    {form.tag || 'Tag del slide'}
                  </div>
                  <h1 style={{
                    fontSize:'clamp(1.8rem, 4vw, 3.2rem)', fontWeight:800, lineHeight:1.1,
                    marginBottom:'1rem', letterSpacing:'-0.02em',
                    marginLeft: hAlign === 'center' ? 'auto' : '0',
                    marginRight: hAlign === 'center' ? 'auto' : '0',
                  }}>
                    <span>{form.h1Line1 || 'Título'}</span><br />{form.h1Line2 || ''}
                  </h1>
                  <p style={{
                    fontSize:'clamp(13px, 2.5vw, 15px)', opacity:0.9, marginBottom:'2rem',
                    lineHeight:1.7, maxWidth:'500px',
                    marginLeft: hAlign === 'center' ? 'auto' : '0',
                    marginRight: hAlign === 'center' ? 'auto' : '0',
                  }}>
                    {form.p || 'Descripción del slide'}
                  </p>
                  <button style={{
                    background:'#fff', color:'#111', fontSize:'13px', fontWeight:700,
                    letterSpacing:'0.06em', textTransform:'uppercase', padding:'14px 32px',
                    borderRadius:'6px', border:'none', cursor:'default',
                    boxShadow:'0 4px 20px rgba(0,0,0,0.15)',
                  }}>
                    {form.cta || 'CTA'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                width:'100%', aspectRatio:'16/9', maxHeight:'100%', borderRadius:12, overflow:'hidden',
                position:'relative', boxShadow:'0 4px 20px rgba(0,0,0,.15)',
                display:'flex', alignItems: vAlignFlex, minHeight:'200px', background:'#000',
              }}>
                {form.img && <img src={form.img} alt=""
                  onMouseDown={handleMouseDown}
                  onWheel={handleWheel}
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:form.imgFit||'cover', objectPosition:form.imgPosition||'center', transform:`translate(${form.imgPanX??0}px, ${form.imgPanY??0}px) scale(${form.imgZoom??1})`, cursor:'grab', transition:'transform 0.05s', transformOrigin:'center' }} />}
                {!form.img && <div style={{ position:'absolute', inset:0, background: form.bg || 'linear-gradient(135deg, #166534 0%, #14532d 100%)' }} />}
                <div style={{ position:'absolute', inset:0, background: overlayCss }} />
                <div style={{
                  position:'relative', zIndex:2, padding:'2.5rem 2.5rem',
                  color:'#fff', textAlign: hAlign as any, width:'100%', boxSizing:'border-box',
                }}>
                  <div style={{
                    fontSize:'10px', fontWeight:700, letterSpacing:'0.14em',
                    textTransform:'uppercase', color:'#93c5fd', marginBottom:'8px',
                  }}>
                    {form.label || 'Label'}
                  </div>
                  <div style={{
                    fontSize:'1.8rem', fontWeight:800, lineHeight:1.15, marginBottom:'12px',
                  }}>
                    {form.titleLine1 || 'Título'}<br />{form.titleLine2 || ''}
                  </div>
                  <span style={{
                    background:'#1e40af', color:'#fff', fontSize:'11px',
                    fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
                    padding:'10px 22px', borderRadius:'6px', display:'inline-block',
                    boxShadow:'0 4px 12px rgba(30,64,175,0.3)',
                  }}>
                    {form.cta || 'CTA'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTROLS ── */}
          <div style={bannerEditorStyles.controlsPanel}>
            {/* IMAGEN */}
            <div style={{ marginBottom:24 }}>
              <div style={bannerEditorStyles.sectionTitle}>📷 Imagen de fondo</div>
              <div
                style={{ border:'2px dashed #ddd', borderRadius:8, padding:16, background:'#fafafa', cursor:'pointer', textAlign:'center', marginBottom:12 }}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
              >
                {form.img
                  ? <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center' }}>
                      <img src={form.img} alt="" style={{ height:48, width:48, borderRadius:6, objectFit:'cover' }} />
                      <span style={{ fontSize:12, color:'#16a34a', fontWeight:600 }}>✓ Imagen asignada</span>
                    </div>
                  : <span style={{ fontSize:12, color:'#aaa' }}>Arrastra una imagen o haz clic para subir</span>}
                {uploadState === 'uploading' && <span style={{ fontSize:11, color:'#6366f1', display:'block', marginTop:4 }}>Subiendo…</span>}
                {uploadError && <span style={{ fontSize:11, color:'#dc2626', display:'block', marginTop:4 }}>{uploadError}</span>}
                <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
              </div>
              {form.img && (
                <button onClick={() => set('img', undefined)} style={{ background:'none', border:'none', color:'#dc2626', fontSize:11, cursor:'pointer', marginBottom:8, textDecoration:'underline' }}>
                  Eliminar imagen
                </button>
              )}
              {form.img && (
                <div style={{ background:'#f3f4f6', borderRadius:8, padding:'10px 12px', marginBottom:12 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'#666', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span>🖱️ Arrastra para mover · Rueda para zoom</span>
                    <button onClick={resetTransform} style={{ background:'none', border:'none', color:'#6366f1', fontSize:10, cursor:'pointer', textDecoration:'underline' }}>Restablecer</button>
                  </div>
                  <div style={bannerEditorStyles.row}>
                    <label style={bannerEditorStyles.label}>
                      Pan X
                      <input type="number" value={form.imgPanX??0} onChange={(e) => set('imgPanX', Number(e.target.value))} style={bannerEditorStyles.input} step={5} />
                    </label>
                    <label style={bannerEditorStyles.label}>
                      Pan Y
                      <input type="number" value={form.imgPanY??0} onChange={(e) => set('imgPanY', Number(e.target.value))} style={bannerEditorStyles.input} step={5} />
                    </label>
                    <label style={bannerEditorStyles.label}>
                      Zoom
                      <input type="number" value={form.imgZoom??1} onChange={(e) => set('imgZoom', Number(e.target.value))} style={bannerEditorStyles.input} step={0.1} min={0.2} max={5} />
                    </label>
                  </div>
                </div>
              )}
              <div style={bannerEditorStyles.row}>
                <label style={bannerEditorStyles.label}>
                  Ajuste
                  <select value={form.imgFit||'cover'} onChange={(e) => set('imgFit', e.target.value)} style={bannerEditorStyles.select}>
                    <option value="cover">Cover (recortar)</option>
                    <option value="contain">Contain (completa)</option>
                    <option value="fill">Fill (estirar)</option>
                  </select>
                </label>
                <label style={bannerEditorStyles.label}>
                  Posición
                  <select value={form.imgPosition||'center'} onChange={(e) => set('imgPosition', e.target.value)} style={bannerEditorStyles.select}>
                    <option value="center">Centro</option>
                    <option value="top">Arriba</option>
                    <option value="bottom">Abajo</option>
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                    <option value="top left">Sup. izq.</option>
                    <option value="top right">Sup. der.</option>
                    <option value="bottom left">Inf. izq.</option>
                    <option value="bottom right">Inf. der.</option>
                  </select>
                </label>
              </div>
            </div>

            {/* TEXTO */}
            <div style={{ marginBottom:24 }}>
              <div style={bannerEditorStyles.sectionTitle}>✏️ Texto</div>
              {isHero ? (
                <>
                  <label style={bannerEditorStyles.label}>
                    Tag
                    <input value={form.tag||''} onChange={(e) => set('tag', e.target.value)} style={bannerEditorStyles.input} placeholder="Nueva colección 2025" />
                  </label>
                  <div style={bannerEditorStyles.row}>
                    <label style={bannerEditorStyles.label}>
                      Título línea 1
                      <input value={form.h1Line1||''} onChange={(e) => set('h1Line1', e.target.value)} style={bannerEditorStyles.input} placeholder="Estampados" />
                    </label>
                    <label style={bannerEditorStyles.label}>
                      Título línea 2
                      <input value={form.h1Line2||''} onChange={(e) => set('h1Line2', e.target.value)} style={bannerEditorStyles.input} placeholder="con tu diseño" />
                    </label>
                  </div>
                  <label style={bannerEditorStyles.label}>
                    Descripción
                    <textarea value={form.p||''} onChange={(e) => set('p', e.target.value)} rows={2} style={bannerEditorStyles.input} placeholder="Describe el slide…" />
                  </label>
                </>
              ) : (
                <>
                  <label style={bannerEditorStyles.label}>
                    Label
                    <input value={form.label||''} onChange={(e) => set('label', e.target.value)} style={bannerEditorStyles.input} placeholder="Ideal para equipos" />
                  </label>
                  <div style={bannerEditorStyles.row}>
                    <label style={bannerEditorStyles.label}>
                      Título línea 1
                      <input value={form.titleLine1||''} onChange={(e) => set('titleLine1', e.target.value)} style={bannerEditorStyles.input} placeholder="Polerones" />
                    </label>
                    <label style={bannerEditorStyles.label}>
                      Título línea 2
                      <input value={form.titleLine2||''} onChange={(e) => set('titleLine2', e.target.value)} style={bannerEditorStyles.input} placeholder="Personalizados" />
                    </label>
                  </div>
                </>
              )}
              <div style={bannerEditorStyles.row}>
                <label style={bannerEditorStyles.label}>
                  Texto CTA
                  <input value={form.cta||''} onChange={(e) => set('cta', e.target.value)} style={bannerEditorStyles.input} placeholder="Ver más" />
                </label>
                <label style={bannerEditorStyles.label}>
                  Acción
                  <select value={form.ctaType||(isHero?'catalogo':'categoria')} onChange={(e) => set('ctaType', e.target.value)} style={bannerEditorStyles.select}>
                    {isHero ? (
                      <>
                        <option value="catalogo">Ir a catálogo</option>
                        <option value="contacto">Ir a contacto</option>
                        <option value="whatsapp">Abrir WhatsApp</option>
                      </>
                    ) : (
                      <>
                        <option value="categoria">Ir a categoría</option>
                        <option value="contacto">Ir a contacto</option>
                      </>
                    )}
                  </select>
                </label>
              </div>
              {((isHero && form.ctaType === 'catalogo') || (!isHero && form.ctaType === 'categoria')) && (
                <label style={bannerEditorStyles.label}>
                  Parámetro (categoría)
                  <input value={form.ctaParam||''} onChange={(e) => set('ctaParam', e.target.value)} style={bannerEditorStyles.input} placeholder={isHero?'poleras':'polerones'} />
                </label>
              )}
              <div style={bannerEditorStyles.row}>
                <label style={bannerEditorStyles.label}>
                  Alineación texto
                  <select value={form.textAlign||'left'} onChange={(e) => set('textAlign', e.target.value)} style={bannerEditorStyles.select}>
                    <option value="left">Izquierda</option>
                    <option value="center">Centrado</option>
                    <option value="right">Derecha</option>
                  </select>
                </label>
                <label style={bannerEditorStyles.label}>
                  Posición vertical
                  <select value={form.textVertical||(isHero?'top':'bottom')} onChange={(e) => set('textVertical', e.target.value)} style={bannerEditorStyles.select}>
                    <option value="top">Arriba</option>
                    <option value="middle">Centro</option>
                    <option value="bottom">Abajo</option>
                  </select>
                </label>
              </div>
            </div>

            {/* OVERLAY */}
            <div style={{ marginBottom:24 }}>
              <div style={bannerEditorStyles.sectionTitle}>🎨 Overlay oscuro</div>
              <label style={bannerEditorStyles.label}>
                Gradiente CSS (capa oscura sobre la imagen)
                <textarea value={form.overlayStyle||''} onChange={(e) => set('overlayStyle', e.target.value)} rows={2} style={{...bannerEditorStyles.input, fontFamily:'monospace', fontSize:11}} placeholder={isHero?'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)':'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 70%)'} />
              </label>
              <div style={{ fontSize:10, color:'#aaa', marginTop:4 }}>
                Deja vacío para usar el valor por defecto. El gradiente se muestra encima de la imagen para mejorar la legibilidad del texto.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Banner image uploader ──────────────────────────────────────────────────────
function BannerImageUpload({ currentUrl, label, bannerKey, onUploaded }: { currentUrl: string; label: string; bannerKey: string; onUploaded: (url: string) => void }) {
  const [state, setState] = useState<UploadState>('idle');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Solo imágenes.'); return; }
    if (file.size > 10*1024*1024) { setError('Máx 10 MB.'); return; }
    setState('uploading'); setError('');
    try {
      const data = await fileToBase64(file);
      const res = await fetch('/api/cloudinary/upload', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ data, productId:0, folder:'patronestampados/banners' }),
      });
      if (!res.ok) { const b = await res.json(); throw new Error(b.error||`HTTP ${res.status}`); }
      const result = await res.json();
      setState('done');
      onUploaded(result.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error'); setState('error');
    }
  }, [onUploaded]);

  return (
    <div style={{ border:'1px dashed #d1d5db', borderRadius:8, padding:'8px', background:'#fafafa', cursor:'pointer' }}
      onClick={()=>inputRef.current?.click()}
      onDragOver={e=>{e.preventDefault();setDragOver(true);}}
      onDragLeave={()=>setDragOver(false)}
      onDrop={e=>{e.preventDefault();setDragOver(false);if(e.dataTransfer.files[0])upload(e.dataTransfer.files[0]);}}>
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <span style={{ fontSize:11, fontWeight:600, color:'#555', minWidth:80 }}>{label}</span>
        {currentUrl
          ? <span style={{ fontSize:10, color:'#16a34a', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>✓ Imagen asignada</span>
          : <span style={{ fontSize:10, color:dragOver?'#6366f1':'#bbb', flex:1 }}>{dragOver?'Suelta aquí':'Arrastra o clic para subir'}</span>}
        {state==='uploading'&&<span style={{ fontSize:10, color:'#6366f1' }}>Subiendo…</span>}
        {error&&<span style={{ fontSize:10, color:'#dc2626' }}>⚠ {error}</span>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>{if(e.target.files?.[0])upload(e.target.files[0]);}} />
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed]   = useState(false);
  const [tab, setTab]         = useState<Tab>('fotos');

  // Tab fotos
  const [filterCat,    setFilterCat]    = useState<'todos'|string>('todos');
  const [filterStatus, setFilterStatus] = useState<'todos'|'con-foto'|'sin-foto'>('todos');
  const [uploads, setUploads]           = useState<UploadResult[]>([]);

  // Tab productos
  const [products, setProducts]         = useState<EditableProduct[]>(()=>PRODUCTS.map(p=>({...p})));
  const [editingProd, setEditingProd]   = useState<EditableProduct|null>(null);
  const [showModal, setShowModal]       = useState(false);
  const [searchQ, setSearchQ]           = useState('');
  const [prodFilter, setProdFilter]     = useState<'todos'|string>('todos');
  const [saving, setSaving]             = useState(false);
  const [saveMsg, setSaveMsg]           = useState('');

  // Tab categorias
  const [categories, setCategories]     = useState<CategoryDef[]>(()=>CATEGORIES.map(c=>({...c})));
  const [editingCat, setEditingCat]     = useState<CategoryDef|null>(null);
  const [showCatModal, setShowCatModal] = useState(false);
  const [catDirty, setCatDirty]         = useState(0);

  // Tab banners
  const [banners, setBanners]           = useState<import('@/data/banners').BannerConfig>(()=>{
    try { return require('@/data/banners').BANNERS; } catch { return { heroSlides:[], promoBanners:[] }; }
  });
  const [bannerSaving, setBannerSaving] = useState(false);
  const [bannerMsg, setBannerMsg]       = useState('');
  const [bannerDirty, setBannerDirty]   = useState(false);
  const [bannerUploads, setBannerUploads] = useState<Record<string,string>>({});
  const [bannerEditor, setBannerEditor] = useState<{
    type: 'hero' | 'promo';
    data: import('@/data/banners').HeroSlideData | import('@/data/banners').PromoBannerData;
    index: number;
  } | null>(null);

  const handleUploaded = useCallback((result: UploadResult) => {
    setUploads(prev=>{
      const idx = prev.findIndex(u=>u.productId===result.productId);
      if (idx>=0){const u=[...prev];u[idx]=result;return u;}
      return [...prev,result];
    });
    // actualizar img en la lista de productos también
    setProducts(prev=>prev.map(p=>p.id===result.productId?{...p,img:result.url,_dirty:true}:p));
  },[]);

  const handleSaveProd = (p: EditableProduct) => {
    setProducts(prev=>{
      const idx=prev.findIndex(pp=>pp.id===p.id);
      if(idx>=0){const u=[...prev];u[idx]={...p,_dirty:true};return u;}
      return [...prev,{...p,_new:true}];
    });
  };

  const handleDelete = (id: number) => {
    if(!confirm('¿Eliminar este producto?'))return;
    setProducts(prev=>prev.map(p=>p.id===id?{...p,_deleted:true}:p));
  };

  const handleSaveToGitHub = async () => {
    setSaving(true); setSaveMsg('');
    try {
      const content = generateProductsTs(products, categories);
      const res = await fetch('/api/github/save-products',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({content}),
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error||'Error al guardar');
      setSaveMsg('✓ Guardado en GitHub — Vercel está redesplegando (1-2 min)');
      setUploads([]);
      setProducts(prev=>prev.filter(p=>!p._deleted).map(p=>({...p,_dirty:false,_new:false})));
      setCatDirty(0);
    } catch(err: unknown){
      setSaveMsg('⚠ '+(err instanceof Error?err.message:'Error desconocido'));
    } finally { setSaving(false); }
  };

  if(!authed) return <LoginScreen onLogin={()=>setAuthed(true)}/>;

  const cats: Array<{value:'todos'|string;label:string}> = [
    {value:'todos',label:'Todos'},
    ...categories.map(c=>({value:c.c,label:c.name})),
  ];

  const filteredPhotos = products.filter(p=>{
    const catOk  = filterCat==='todos'||p.c===filterCat;
    const statOk = filterStatus==='todos'||(filterStatus==='con-foto'&&!!p.img)||(filterStatus==='sin-foto'&&!p.img);
    return catOk&&statOk;
  });

  const filteredProds = products.filter(p=>{
    if(p._deleted)return false;
    const catOk = prodFilter==='todos'||p.c===prodFilter;
    const q = searchQ.toLowerCase();
    return catOk&&(!q||p.n.toLowerCase().includes(q)||p.ref.toLowerCase().includes(q)||p.precio.includes(q));
  });

  const dirtyCount = products.filter(p=>p._dirty||p._new||p._deleted).length + catDirty + (bannerDirty?1:0);
  const totalConFoto = products.filter(p=>!p._deleted&&p.img).length;

  const tabBtn = (t:Tab,label:string):React.CSSProperties => ({
    background:tab===t?'#fff':'transparent', color:tab===t?'#111':'#aaa',
    border:'none', padding:'8px 20px', fontSize:13, fontWeight:700,
    cursor:'pointer', borderRadius:'8px 8px 0 0',
  });
  const th: React.CSSProperties = { padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'0.05em' };
  const td: React.CSSProperties = { padding:'10px 14px', verticalAlign:'middle' };

  const SaveChangesPanel = ({ compact = false }: { compact?: boolean }) => (
    <div style={{ marginTop:compact?0:20, marginBottom:compact?16:0, background:dirtyCount>0?'#fffbeb':'#fff', border:`1px solid ${dirtyCount>0?'#fde68a':'#e8e8e8'}`, borderRadius:12, padding:compact?'12px 16px':'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
      <div>
        <div style={{ fontWeight:700, fontSize:14 }}>
          {dirtyCount>0?`⚠ ${dirtyCount} cambio${dirtyCount>1?'s':''} sin guardar`:'✓ Todo guardado'}
        </div>
        <div style={{ fontSize:12, color:'#888', marginTop:3 }}>
          {dirtyCount>0?'Guarda para que las fotos y cambios se publiquen en la tienda.':'No hay cambios pendientes por publicar.'}
        </div>
        {saveMsg&&<div style={{ fontSize:12, marginTop:6, color:saveMsg.startsWith('✓')?'#16a34a':'#dc2626', fontWeight:600 }}>{saveMsg}</div>}
      </div>
      <button onClick={handleSaveToGitHub} disabled={saving||dirtyCount===0}
        style={{ background:saving?'#ccc':dirtyCount===0?'#e5e7eb':'#111', color:dirtyCount===0?'#999':'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:saving||dirtyCount===0?'not-allowed':'pointer', whiteSpace:'nowrap' }}>
        {saving?'Guardando…':'💾 Guardar cambios'}
      </button>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f5f5f5', fontFamily:"'Inter',sans-serif" }}>
      {/* Header */}
      <div style={{ background:'#111', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:54, position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontWeight:800, fontSize:15, color:'#fff' }}>Estampados Patrón</span>
          <span style={{ background:'#333', color:'#aaa', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>ADMIN</span>
        </div>
        <div style={{ display:'flex', gap:14, fontSize:12, color:'#888', alignItems:'center' }}>
          <span>📦 {products.filter(p=>!p._deleted).length} productos</span>
          <span style={{ color:'#4ade80' }}>✓ {totalConFoto} con foto</span>
          {dirtyCount>0&&<span style={{ color:'#fbbf24' }}>⚠ {dirtyCount} sin guardar</span>}
          <button onClick={()=>setAuthed(false)} style={{ background:'none', border:'1px solid #333', color:'#888', borderRadius:6, padding:'2px 10px', fontSize:11, cursor:'pointer' }}>Salir</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:'#111', padding:'0 24px', display:'flex', gap:2 }}>
        <button style={tabBtn('fotos','📷 Fotos')}   onClick={()=>setTab('fotos')}>📷 Fotos</button>
        <button style={tabBtn('productos','📦')}      onClick={()=>setTab('productos')}>📦 Productos</button>
        <button style={tabBtn('categorias','🏷️')}    onClick={()=>setTab('categorias')}>🏷️ Categorías</button>
        <button style={tabBtn('banners','🖼️')}       onClick={()=>setTab('banners')}>🖼️ Banners</button>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'20px 16px' }}>

        {/* ── TAB FOTOS ── */}
        {tab==='fotos'&&(
          <>
            <SaveChangesPanel compact />
            <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, padding:'14px 18px', marginBottom:20, display:'flex', gap:14 }}>
              <span style={{ fontSize:24 }}>☁️</span>
              <ol style={{ margin:0, padding:'0 0 0 14px', fontSize:13, color:'#555', lineHeight:1.8 }}>
                <li>Arrastra o haz clic para subir la foto a Cloudinary.</li>
                <li>La foto queda lista en el panel, pero para publicarla debes hacer clic en <strong>💾 Guardar cambios</strong>.</li>
              </ol>
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16, alignItems:'center' }}>
              {cats.map(c=>(
                <button key={c.value} onClick={()=>setFilterCat(c.value)}
                  style={{ background:filterCat===c.value?'#111':'#fff', color:filterCat===c.value?'#fff':'#555', border:'1px solid', borderColor:filterCat===c.value?'#111':'#ddd', borderRadius:20, padding:'3px 13px', fontSize:11, cursor:'pointer' }}>
                  {c.label}
                </button>
              ))}
              <div style={{ width:1, height:18, background:'#ddd', margin:'0 3px' }}/>
              {(['todos','sin-foto','con-foto'] as const).map(s=>(
                <button key={s} onClick={()=>setFilterStatus(s)}
                  style={{ background:filterStatus===s?'#6366f1':'#fff', color:filterStatus===s?'#fff':'#555', border:'1px solid', borderColor:filterStatus===s?'#6366f1':'#ddd', borderRadius:20, padding:'3px 13px', fontSize:11, cursor:'pointer' }}>
                  {s==='todos'?'Todos':s==='sin-foto'?'○ Sin foto':'✓ Con foto'}
                </button>
              ))}
              <span style={{ marginLeft:'auto', fontSize:11, color:'#bbb' }}>{filteredPhotos.length} de {products.filter(p=>!p._deleted).length}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
              {filteredPhotos.map(p=>(
                <PhotoCard key={p.id} product={p}
                  uploadedUrl={uploads.find(u=>u.productId===p.id)?.url}
                  onUploaded={handleUploaded}/>
              ))}
            </div>
          </>
        )}

        {/* ── TAB PRODUCTOS ── */}
        {tab==='productos'&&(
          <>
            <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
              <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Buscar por nombre, ref o precio…"
                style={{ flex:1, minWidth:200, padding:'8px 12px', border:'1px solid #ddd', borderRadius:8, fontSize:13, outline:'none' }}/>
              {cats.map(c=>(
                <button key={c.value} onClick={()=>setProdFilter(c.value)}
                  style={{ background:prodFilter===c.value?'#111':'#fff', color:prodFilter===c.value?'#fff':'#555', border:'1px solid', borderColor:prodFilter===c.value?'#111':'#ddd', borderRadius:20, padding:'3px 13px', fontSize:11, cursor:'pointer' }}>
                  {c.label}
                </button>
              ))}
              <button onClick={()=>{setEditingProd(null);setShowModal(true);}}
                style={{ background:'#e53935', color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
                + Nuevo producto
              </button>
            </div>

            <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, overflow:'hidden' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ background:'#f8f9fa', borderBottom:'1px solid #e8e8e8' }}>
                    <th style={th}>ID</th><th style={th}>Producto</th><th style={th}>Ref</th>
                    <th style={th}>Categoría</th><th style={th}>Precio</th><th style={th}>Badge</th><th style={th}>Foto</th><th style={th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProds.map((p,idx)=>(
                    <tr key={p.id} style={{ borderBottom:'1px solid #f0f0f0', background:p._new?'#f0fdf4':p._dirty?'#fffbeb':idx%2===0?'#fff':'#fafafa' }}>
                      <td style={td}><span style={{ color:'#aaa', fontFamily:'monospace', fontSize:11 }}>{p.id}</span></td>
                      <td style={td}>
                        <div style={{ fontWeight:600 }}>{p.n}</div>
                        {p._new&&<span style={{ background:'#dcfce7', color:'#16a34a', fontSize:10, padding:'1px 6px', borderRadius:10, fontWeight:700 }}>Nuevo</span>}
                        {p._dirty&&!p._new&&<span style={{ background:'#fef9c3', color:'#ca8a04', fontSize:10, padding:'1px 6px', borderRadius:10 }}>Modificado</span>}
                      </td>
                      <td style={td}><span style={{ fontFamily:'monospace', fontSize:11, color:'#888' }}>{p.ref}</span></td>
                      <td style={td}><span style={{ background:'#f3f4f6', padding:'2px 8px', borderRadius:12, fontSize:11 }}>{catLabel(p.c as Categoria)}</span></td>
                      <td style={td}><span style={{ fontWeight:700 }}>{p.precio}</span></td>
                      <td style={td}>{p.badge?<span style={{ background:'#e0e7ff', color:'#4338ca', padding:'2px 8px', borderRadius:12, fontSize:11 }}>{p.badge}</span>:<span style={{ color:'#ddd' }}>—</span>}</td>
                      <td style={td}>{p.img?<span style={{ color:'#16a34a', fontSize:12 }}>✓</span>:<span style={{ color:'#ddd', fontSize:12 }}>—</span>}</td>
                      <td style={td}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={()=>{setEditingProd(p);setShowModal(true);}}
                            style={{ background:'#f3f4f6', border:'1px solid #ddd', borderRadius:6, padding:'4px 10px', fontSize:11, cursor:'pointer' }}>✏️</button>
                          <button onClick={()=>handleDelete(p.id)}
                            style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', borderRadius:6, padding:'4px 10px', fontSize:11, cursor:'pointer' }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProds.length===0&&<div style={{ textAlign:'center', padding:'40px 0', color:'#ccc' }}>Sin resultados.</div>}
            </div>

            <SaveChangesPanel />
          </>
        )}

        {/* ── TAB CATEGORÍAS ── */}
        {tab==='categorias'&&(
          <>
            <SaveChangesPanel compact />
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:12 }}>
              <button onClick={()=>{
                setEditingCat({c:'',name:'',count:'',icon:'',bg:'linear-gradient(160deg,#111 0%,#333 60%,#555 100%)'});
                setShowCatModal(true);
              }}
                style={{ background:'#e53935', color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
                + Nueva categoría
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16, marginBottom:24 }}>
              {categories.map(cat=>(
                <div key={cat.c} onClick={()=>{setEditingCat(cat);setShowCatModal(true);}}
                  style={{ borderRadius:12, overflow:'hidden', cursor:'pointer', minHeight:160, display:'flex', flexDirection:'column', justifyContent:'flex-end', position:'relative', boxShadow:'0 4px 12px rgba(0,0,0,.1)', transition:'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={(e)=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.15)';}}
                  onMouseLeave={(e)=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,.1)';}}>
                  {cat.img&&<div style={{ position:'absolute', inset:0, background:`url(${cat.img}) center/cover no-repeat` }}/>}
                  <div style={{ position:'absolute', inset:0, background:cat.bg, opacity:cat.img?0.5:1 }}/>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.85) 100%)' }}/>
                  <div style={{ position:'relative', zIndex:2, padding:'1rem' }}>
                    <div style={{ fontSize:24, marginBottom:4 }}>{cat.icon}</div>
                    <div style={{ fontSize:14, fontWeight:800, color:'#fff', textTransform:'uppercase', letterSpacing:'0.04em' }}>{cat.name}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', marginTop:2 }}>{cat.count}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, overflow:'hidden', marginBottom:20 }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ background:'#f8f9fa', borderBottom:'1px solid #e8e8e8' }}>
                    <th style={th}>Categoría</th><th style={th}>Código</th><th style={th}>Productos activos</th><th style={th}>Con foto</th><th style={th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat,idx)=>{
                    const total   = products.filter(p=>!p._deleted&&p.c===cat.c).length;
                    const conFoto = products.filter(p=>!p._deleted&&p.c===cat.c&&p.img).length;
                    return (
                      <tr key={cat.c} style={{ borderBottom:'1px solid #f0f0f0', background:idx%2===0?'#fff':'#fafafa' }}>
                        <td style={td}><span style={{ fontWeight:600 }}>{cat.icon} {cat.name}</span></td>
                        <td style={td}><span style={{ fontFamily:'monospace', fontSize:11, color:'#888' }}>{cat.c}</span></td>
                        <td style={td}><span style={{ background:'#f3f4f6', padding:'2px 10px', borderRadius:12 }}>{total}</span></td>
                        <td style={td}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{ flex:1, height:6, background:'#f0f0f0', borderRadius:3, overflow:'hidden', maxWidth:120 }}>
                              <div style={{ height:'100%', background:'#16a34a', width:`${total?Math.round(conFoto/total*100):0}%` }}/>
                            </div>
                            <span style={{ fontSize:11, color:'#555' }}>{conFoto}/{total}</span>
                          </div>
                        </td>
                        <td style={td}>
                          <div style={{ display:'flex', gap:6 }}>
                            <button onClick={()=>{setEditingCat(cat);setShowCatModal(true);}}
                              style={{ background:'#f3f4f6', border:'1px solid #ddd', borderRadius:6, padding:'4px 10px', fontSize:11, cursor:'pointer' }}>✏️</button>
                            <button onClick={()=>{
                              if(products.some(p=>!p._deleted&&p.c===cat.c)){
                                alert(`No puedes eliminar "${cat.name}" porque tiene ${total} producto${total>1?'s':''} asociado${total>1?'s':''}. Cambia los productos a otra categoría primero.`);
                                return;
                              }
                              if(!confirm(`¿Eliminar la categoría "${cat.name}"?`))return;
                              setCategories(prev=>prev.filter(c=>c.c!==cat.c));
                              setCatDirty(prev=>prev+1);
                            }}
                              style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', borderRadius:6, padding:'4px 10px', fontSize:11, cursor:'pointer' }}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {showCatModal&&(
              <CategoryModal
                cat={editingCat}
                existingCodes={categories.map(c=>c.c).filter(c=>c!==editingCat?.c)}
                onSave={(c:CategoryDef)=>{
                  setCategories(prev=>{
                    const idx=prev.findIndex(x=>x.c===editingCat?.c);
                    if(idx>=0){const u=[...prev];u[idx]=c;return u;}
                    return [...prev,c];
                  });
                  setCatDirty(prev=>prev+1);
                  setShowCatModal(false);
                  setEditingCat(null);
                }}
                onClose={()=>{setShowCatModal(false);setEditingCat(null);}}
              />
            )}
          </>
        )}

        {/* ── TAB BANNERS ── */}
        {tab==='banners'&&(
          <>
            <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:12, padding:'14px 18px', marginBottom:20, display:'flex', gap:14, alignItems:'flex-start' }}>
              <span style={{ fontSize:20 }}>🖼️</span>
              <div style={{ fontSize:13, color:'#92400e', lineHeight:1.7 }}>
                <strong>Banners del landing page</strong><br />
                Sube imágenes de fondo para los slides del hero y los banners promocionales. Si no hay imagen, se usará el gradiente por defecto.
              </div>
            </div>

            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:20 }}>
              {bannerMsg&&<div style={{ fontSize:12, color:bannerMsg.startsWith('✓')?'#16a34a':'#dc2626', fontWeight:600, width:'100%' }}>{bannerMsg}</div>}
            </div>

            <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:0, color:'#555', letterSpacing:'0.05em', textTransform:'uppercase' }}>🎠 Hero Slider</h3>
              <span style={{ fontSize:11, color:'#bbb' }}>{banners.heroSlides.length} slides</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16, marginBottom:40 }}>
              {banners.heroSlides.map((slide,idx)=>{
                const imgUrl = slide.img || '';
                const bgCss = imgUrl ? `url(${imgUrl}) ${slide.imgPosition||'center'} / ${slide.imgFit||'cover'} no-repeat, ${slide.bg}` : slide.bg;
                return (
                  <div key={`hero-${slide.id}`} style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column' }}>
                    <div style={{ height:140, background:bgCss, backgroundSize:'cover', display:'flex', alignItems:'flex-start', justifyContent:'flex-start', padding:'8px', position:'relative' }}>
                      <div style={{ position:'absolute', inset:0, background:slide.overlayStyle||'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />
                      <span style={{ position:'relative', zIndex:2, background:'rgba(0,0,0,0.6)', color:'#fff', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:4 }}>Slide {idx+1}</span>
                    </div>
                    <div style={{ padding:'10px 12px', flex:1, display:'flex', flexDirection:'column', gap:4 }}>
                      <div style={{ fontSize:12, fontWeight:600 }}>{slide.tag}</div>
                      <div style={{ fontSize:11, color:'#666' }}>{'\u201C'}{slide.h1Line1} {slide.h1Line2}{'\u201D'}</div>
                      <div style={{ fontSize:10, color:'#999', marginTop:'auto' }}>
                        CTA: {slide.cta} · {slide.img ? '📷' : '🎨 gradiente'}
                      </div>
                    </div>
                    <div style={{ borderTop:'1px solid #f0f0f0', padding:'8px 12px', display:'flex', justifyContent:'flex-end' }}>
                      <button onClick={()=>setBannerEditor({type:'hero',data:{...slide},index:idx})}
                        style={{ background:'#111', color:'#fff', border:'none', borderRadius:6, padding:'5px 14px', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                        ✏️ Editar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:0, color:'#555', letterSpacing:'0.05em', textTransform:'uppercase' }}>📢 Banners Promocionales</h3>
              <span style={{ fontSize:11, color:'#bbb' }}>{banners.promoBanners.length} banners</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16, marginBottom:24 }}>
              {banners.promoBanners.map((banner,idx)=>{
                const imgUrl = banner.img || '';
                const bgCss = imgUrl ? `url(${imgUrl}) ${banner.imgPosition||'center'} / ${banner.imgFit||'cover'} no-repeat, ${banner.bg}` : banner.bg;
                return (
                  <div key={`promo-${banner.id}`} style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column' }}>
                    <div style={{ height:120, background:bgCss, backgroundSize:'cover', display:'flex', alignItems:'flex-start', justifyContent:'flex-start', padding:'8px', position:'relative' }}>
                      <div style={{ position:'absolute', inset:0, background:banner.overlayStyle||'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)' }} />
                      <span style={{ position:'relative', zIndex:2, background:'rgba(0,0,0,0.6)', color:'#fff', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:4 }}>Banner {idx+1}</span>
                    </div>
                    <div style={{ padding:'10px 12px', flex:1, display:'flex', flexDirection:'column', gap:4 }}>
                      <div style={{ fontSize:12, fontWeight:600 }}>{banner.label}</div>
                      <div style={{ fontSize:11, color:'#666' }}>{'\u201C'}{banner.titleLine1} {banner.titleLine2}{'\u201D'}</div>
                      <div style={{ fontSize:10, color:'#999', marginTop:'auto' }}>
                        CTA: {banner.cta} · {banner.img ? '📷' : '🎨 gradiente'}
                      </div>
                    </div>
                    <div style={{ borderTop:'1px solid #f0f0f0', padding:'8px 12px', display:'flex', justifyContent:'flex-end' }}>
                      <button onClick={()=>setBannerEditor({type:'promo',data:{...banner},index:idx})}
                        style={{ background:'#111', color:'#fff', border:'none', borderRadius:6, padding:'5px 14px', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                        ✏️ Editar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop:20, marginBottom:20, background:bannerDirty?'#fffbeb':'#fff', border:`1px solid ${bannerDirty?'#fde68a':'#e8e8e8'}`, borderRadius:12, padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{bannerDirty?'⚠ Cambios sin guardar':'✓ Todo guardado'}</div>
                <div style={{ fontSize:12, color:'#888', marginTop:3 }}>Los cambios en banners se publican al guardar.</div>
              </div>
              <button onClick={async()=>{
                setBannerSaving(true);setBannerMsg('');
                try {
                  const content = generateBannersTs(banners);
                  const res = await fetch('/api/github/save-banners',{
                    method:'POST', headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({content}),
                  });
                  const data = await res.json();
                  if(!res.ok) throw new Error(data.error||'Error al guardar');
                  setBannerMsg('✓ Banners guardados — Vercel está redesplegando (1-2 min)');
                  setBannerDirty(false);
                  setBannerUploads({});
                } catch(err:unknown){
                  setBannerMsg('⚠ '+(err instanceof Error?err.message:'Error desconocido'));
                } finally { setBannerSaving(false); }
              }} disabled={bannerSaving||!bannerDirty}
                style={{ background:bannerSaving?'#ccc':!bannerDirty?'#e5e7eb':'#111', color:!bannerDirty?'#999':'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:bannerSaving||!bannerDirty?'not-allowed':'pointer', whiteSpace:'nowrap' }}>
                {bannerSaving?'Guardando…':'💾 Guardar banners'}
              </button>
            </div>
          </>
        )}
      </div>

      {showModal&&<ProductModal product={editingProd} onSave={handleSaveProd} onClose={()=>{setShowModal(false);setEditingProd(null);}} catList={categories}/>}
      {bannerEditor&&(
        <BannerEditorModal
          type={bannerEditor.type}
          data={bannerEditor.data}
          onSave={(updated)=>{
            if (bannerEditor.type==='hero') {
              setBanners(prev=>{const u=[...prev.heroSlides];u[bannerEditor.index]={...updated as import('@/data/banners').HeroSlideData};return{...prev,heroSlides:u};});
            } else {
              setBanners(prev=>{const u=[...prev.promoBanners];u[bannerEditor.index]={...updated as import('@/data/banners').PromoBannerData};return{...prev,promoBanners:u};});
            }
            setBannerDirty(true);
            setBannerEditor(null);
          }}
          onClose={()=>setBannerEditor(null)}
        />
      )}
    </div>
  );
}
