'use client';
// src/app/admin/page.tsx — Panel admin completo

import { useState, useRef, useCallback } from 'react';
import { PRODUCTS, CATEGORIES, catLabel, type Product, type Categoria } from '@/data/products';

const ADMIN_PASSWORD = 'JasperDante.26';

// ── tipos ─────────────────────────────────────────────────────────────────────
type Tab = 'fotos' | 'productos' | 'categorias';
type UploadState = 'idle' | 'uploading' | 'done' | 'error';
interface UploadResult { url: string; publicId: string; productId: number; }
interface EditableProduct extends Product { _dirty?: boolean; _new?: boolean; _deleted?: boolean; }

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

function generateProductsTs(products: EditableProduct[]): string {
  const rows = products.filter(p => !p._deleted).map(p => {
    const t    = p.v.t?.length    ? `t:[${p.v.t.map((s:string) => `'${s}'`).join(',')}]` : '';
    const col  = p.v.col?.length  ? `col:[${p.v.col.map((c:{n:string;h:string}) => `{n:'${c.n}',h:'${c.h}'}`).join(',')}]` : '';
    const tipo = p.v.tipo?.length ? `tipo:[${p.v.tipo.map((s:string) => `'${s}'`).join(',')}]` : '';
    const v    = [t, col, tipo].filter(Boolean).join(',');
    const img  = p.img   ? `  img: '${p.img}',\n` : '';
    const bdg  = p.badge ? `  badge: '${p.badge}',\n` : '';
    return `  {\n  id: ${p.id}, c: '${p.c}', n: '${p.n.replace(/'/g,"\\'")}', ref: '${p.ref}',\n${img}  desc: '${p.desc.replace(/'/g,"\\'")}', v: {${v}}, precio: '${p.precio}',\n${bdg}  }`;
  });

  const polCount  = products.filter(p=>!p._deleted&&p.c==='poleras').length;
  const polrCount = products.filter(p=>!p._deleted&&p.c==='polerones').length;
  const tazCount  = products.filter(p=>!p._deleted&&p.c==='tazas').length;
  const accCount  = products.filter(p=>!p._deleted&&p.c==='accesorios').length;
  const depCount  = products.filter(p=>!p._deleted&&p.c==='deportiva').length;
  const impCount  = products.filter(p=>!p._deleted&&p.c==='impresion').length;

  return `// src/data/products.ts
export type Categoria = 'poleras' | 'polerones' | 'tazas' | 'accesorios' | 'deportiva' | 'impresion';
export type Badge = 'popular' | 'eco' | 'pack' | 'nuevo';
export interface ColorVariant { n: string; h: string; }
export interface ProductVariants { t?: string[]; col?: ColorVariant[]; tipo?: string[]; }
export interface Product {
  id: number; c: Categoria; n: string; ref: string; e: string;
  img?: string; desc: string; v: ProductVariants; precio: string; badge?: Badge;
}
export const PRODUCTS: Product[] = [
${rows.join(',\n')}
];
export const CATEGORIES = [
  {c:'poleras' as Categoria,   name:'Poleras',    count:'${polCount} productos',    icon:'👕', bg:'linear-gradient(160deg,#0d1b2a 0%,#1b4f72 60%,#2980b9 100%)'},
  {c:'polerones' as Categoria, name:'Polerones',  count:'${polrCount} productos',   icon:'🧥', bg:'linear-gradient(160deg,#0a0a0a 0%,#1a3a1a 60%,#2d5016 100%)'},
  {c:'tazas' as Categoria,     name:'Tazas',      count:'${tazCount} modelos',      icon:'☕', bg:'linear-gradient(160deg,#3e1a00 0%,#7d3c02 60%,#b7561a 100%)'},
  {c:'accesorios' as Categoria,name:'Accesorios', count:'${accCount} productos',    icon:'📱', bg:'linear-gradient(160deg,#1a0a3e 0%,#4a1a8b 60%,#7b4fc0 100%)'},
  {c:'deportiva' as Categoria, name:'Deportiva',  count:'${depCount} productos',    icon:'🩳', bg:'linear-gradient(160deg,#1a0000 0%,#6b0000 60%,#b71c1c 100%)'},
  {c:'impresion' as Categoria, name:'Impresión',  count:'${impCount} productos',    icon:'🏷️', bg:'linear-gradient(160deg,#00141a 0%,#005c6b 60%,#00acc1 100%)'},
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
  const base = p.n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  return \`\${base}-\${p.id}\`;
}
export function findBySlug(slug: string): Product | undefined {
  const id = Number(slug.split('-').pop());
  return PRODUCTS.find(p => p.id === id);
}
export function tieneRecargoEstampado(c: Categoria): boolean { return c === 'poleras' || c === 'polerones'; }
export function parsePrecio(precio: string): number {
  const match = precio.match(/[\d.]+/);
  if (!match) return 0;
  return parseInt(match[0].replace(/\./g, ''), 10);
}
export function catLabel(c: Categoria): string {
  const map: Record<Categoria,string> = { poleras:'Poleras', polerones:'Polerones', tazas:'Tazas', accesorios:'Accesorios', deportiva:'Deportiva', impresion:'Impresión' };
  return map[c] || c;
}`;
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
function PhotoCard({ product, uploadedUrl, onUploaded }: { product: Product; uploadedUrl?: string; onUploaded: (r: UploadResult) => void }) {
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
        <div style={{ fontSize:10, color:'#aaa' }}>ID {product.id} · {catLabel(product.c)}</div>
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

function ProductModal({ product, onSave, onClose }: { product: EditableProduct | null; onSave:(p:EditableProduct)=>void; onClose:()=>void }) {
  const cats: Categoria[] = ['poleras','polerones','tazas','accesorios','deportiva','impresion'];
  const blank: EditableProduct = { id:Date.now(), c:'poleras', n:'', ref:'', desc:'', v:{}, precio:'$0', _new:true };
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
              <select value={form.c} onChange={e=>set('c',e.target.value as Categoria)} style={inp}>
                {cats.map(c=><option key={c} value={c}>{catLabel(c)}</option>)}
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

// ── Página principal ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed]   = useState(false);
  const [tab, setTab]         = useState<Tab>('fotos');

  // Tab fotos
  const [filterCat,    setFilterCat]    = useState<'todos'|Categoria>('todos');
  const [filterStatus, setFilterStatus] = useState<'todos'|'con-foto'|'sin-foto'>('todos');
  const [uploads, setUploads]           = useState<UploadResult[]>([]);

  // Tab productos
  const [products, setProducts]         = useState<EditableProduct[]>(()=>PRODUCTS.map(p=>({...p})));
  const [editingProd, setEditingProd]   = useState<EditableProduct|null>(null);
  const [showModal, setShowModal]       = useState(false);
  const [searchQ, setSearchQ]           = useState('');
  const [prodFilter, setProdFilter]     = useState<'todos'|Categoria>('todos');
  const [saving, setSaving]             = useState(false);
  const [saveMsg, setSaveMsg]           = useState('');

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
      const content = generateProductsTs(products);
      const res = await fetch('/api/github/save-products',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({content}),
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error||'Error al guardar');
      setSaveMsg('✓ Guardado en GitHub — Vercel está redesplegando (1-2 min)');
      setUploads([]);
      setProducts(prev=>prev.filter(p=>!p._deleted).map(p=>({...p,_dirty:false,_new:false})));
    } catch(err: unknown){
      setSaveMsg('⚠ '+(err instanceof Error?err.message:'Error desconocido'));
    } finally { setSaving(false); }
  };

  if(!authed) return <LoginScreen onLogin={()=>setAuthed(true)}/>;

  const cats: Array<{value:'todos'|Categoria;label:string}> = [
    {value:'todos',label:'Todos'},{value:'poleras',label:'Poleras'},{value:'polerones',label:'Polerones'},
    {value:'tazas',label:'Tazas'},{value:'accesorios',label:'Accesorios'},{value:'deportiva',label:'Deportiva'},{value:'impresion',label:'Impresión'},
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

  const dirtyCount = products.filter(p=>p._dirty||p._new||p._deleted).length;
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
                      <td style={td}><span style={{ background:'#f3f4f6', padding:'2px 8px', borderRadius:12, fontSize:11 }}>{catLabel(p.c)}</span></td>
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
            <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, overflow:'hidden', marginBottom:20 }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ background:'#f8f9fa', borderBottom:'1px solid #e8e8e8' }}>
                    <th style={th}>Categoría</th><th style={th}>Código</th><th style={th}>Productos activos</th><th style={th}>Con foto</th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((cat,idx)=>{
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:'14px 18px', fontSize:13, color:'#166534' }}>
              💡 Para agregar o renombrar categorías, edita el tipo <code>Categoria</code> y el array <code>CATEGORIES</code> en <code>src/data/products.ts</code> — usa la tab <strong>Productos</strong> para guardar los cambios automáticamente en GitHub.
            </div>
          </>
        )}
      </div>

      {showModal&&<ProductModal product={editingProd} onSave={handleSaveProd} onClose={()=>{setShowModal(false);setEditingProd(null);}}/>}
    </div>
  );
}
