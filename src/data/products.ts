// src/data/products.ts

export type Categoria = 'poleras' | 'polerones' | 'tazas' | 'accesorios' | 'deportiva' | 'impresion';
export type Badge = 'popular' | 'eco' | 'pack' | 'nuevo';

export interface ColorVariant {
  n: string; // nombre
  h: string; // hex color
}

export interface ProductVariants {
  t?: string[];           // tallas
  col?: ColorVariant[];   // colores
  tipo?: string[];        // tipo/modelo
}

export interface Product {
  id: number;
  c: Categoria;
  n: string;             // nombre
  ref: string;           // referencia
  e: string;             // emoji (temporal hasta tener fotos Cloudinary)
  img?: string;          // URL Cloudinary (se agrega después)
  desc: string;
  v: ProductVariants;
  precio: string;
  badge?: Badge;
}

export const PRODUCTS: Product[] = [
  /* POLERAS */
  {id:1,c:'poleras',n:'Polera Básica Algodón MC',ref:'ROLY-6630',e:'👕',desc:'Algodón 180 g peinado. Base ideal para serigrafía o sublimación. La más vendida.',v:{t:['XS','S','M','L','XL','XXL','3XL'],col:[{n:'Blanco',h:'#f0f0f0'},{n:'Negro',h:'#111'},{n:'Gris',h:'#888'},{n:'Azul Marino',h:'#1a2980'},{n:'Rojo',h:'#c0392b'}]},precio:'$6.000'},
  {id:2,c:'poleras',n:'Polera Premium Cuello V',ref:'ROLY-6635',e:'👕',desc:'Corte slim fit. Cuello V reforzado. Ideal para impresión de alta definición.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Blanco',h:'#f0f0f0'},{n:'Negro',h:'#111'},{n:'Gris Jaspe',h:'#95a5a6'}]},precio:'$7.000',badge:'popular'},
  {id:3,c:'poleras',n:'Polera Técnica Dry-Fit',ref:'ROLY-0420',e:'🏃',desc:'Poliéster 100% con tratamiento humedad. Para uniformes deportivos y eventos.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Blanco',h:'#f0f0f0'},{n:'Negro',h:'#111'},{n:'Amarillo',h:'#f1c40f'},{n:'Rojo',h:'#c0392b'},{n:'Verde',h:'#27ae60'}]},precio:'$6.000'},
  {id:4,c:'poleras',n:'Polera Manga Larga',ref:'ROLY-6641',e:'🧣',desc:'Algodón 100% manga larga. Perfecta para otoño y uniforme corporativo.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Blanco',h:'#f0f0f0'},{n:'Negro',h:'#111'},{n:'Gris',h:'#888'},{n:'Azul',h:'#1a5276'}]},precio:'$7.000'},
  {id:5,c:'poleras',n:'Deportiva Jaspeada MC',ref:'ROLY-6643J',e:'🎽',desc:'Tejido jaspeado con textura única. Estilo urbano cómodo y versátil.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Gris Jaspe',h:'#95a5a6'},{n:'Negro',h:'#1a1a1a'}]},precio:'$7.000'},
  {id:6,c:'poleras',n:'Deportiva Brahain MC',ref:'ROLY-0523',e:'💪',desc:'Corte moderno y recto. Ideal para equipos y uniformes. Poliéster 100% transpirable.',v:{t:['XS','S','M','L','XL','XXL','3XL'],col:[{n:'Blanco',h:'#f0f0f0'},{n:'Negro',h:'#111'},{n:'Gris',h:'#888'}]},precio:'$6.000'},
  {id:7,c:'poleras',n:'Piqué Sport MC',ref:'ROLY-0522',e:'🎯',desc:'Tela piqué de algodón premium. Para regalo corporativo o uniforme de empresa.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Blanco',h:'#f0f0f0'},{n:'Negro',h:'#111'},{n:'Rojo',h:'#c0392b'},{n:'Azul',h:'#1a5276'}]},precio:'$8.000'},
  {id:8,c:'poleras',n:'Estilo Jeans MC',ref:'ROLY-6645',e:'👗',desc:'Textura denim con comodidad de tejido deportivo. Muy solicitada para regalos.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Azul Jean',h:'#2471a3'},{n:'Negro',h:'#111'}]},precio:'$8.000'},
  {id:9,c:'poleras',n:'Ecológica Algodón MC',ref:'ROLY-6680',e:'🌿',desc:'100% algodón orgánico certificado GOTS. La opción sostenible para empresas responsables.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Natural',h:'#d4b896'},{n:'Blanco',h:'#f0f0f0'},{n:'Verde',h:'#27ae60'}]},precio:'$7.000',badge:'eco'},
  /* POLERONES */
  {id:10,c:'polerones',n:'Polerón Simple Clásico',ref:'ROLY-6950',e:'🧥',desc:'El básico imprescindible. Cuello redondo, tela gruesa. Estampado frontal y espalda.',v:{t:['XS','S','M','L','XL','XXL'],col:[{n:'Negro',h:'#111'},{n:'Gris',h:'#888'},{n:'Blanco',h:'#f0f0f0'},{n:'Azul',h:'#1a5276'}]},precio:'$15.000'},
  {id:11,c:'polerones',n:'Polerón Canguro',ref:'ROLY-6960',e:'🦘',desc:'Con bolsillo frontal canguro. Diseño urbano y funcional. Tela premium 300 g.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Negro',h:'#111'},{n:'Gris',h:'#888'},{n:'Blanco',h:'#f0f0f0'},{n:'Verde Oscuro',h:'#145a32'}]},precio:'$15.000',badge:'popular'},
  {id:12,c:'polerones',n:'Canguro con Cierre',ref:'ROLY-6965',e:'🤐',desc:'Cremallera frontal. Versátil, ideal para uniformes y conjuntos corporativos.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Negro',h:'#111'},{n:'Gris',h:'#888'},{n:'Azul Marino',h:'#1a2980'}]},precio:'$15.000'},
  {id:13,c:'polerones',n:'Cortavientos Glasgow',ref:'ROLY-7630',e:'💨',desc:'Chaqueta ligera con capucha, resistente al viento y agua. Muy popular para eventos.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Negro',h:'#111'},{n:'Azul',h:'#1a5276'},{n:'Rojo',h:'#c0392b'},{n:'Verde',h:'#145a32'}]},precio:'$15.000'},
  /* TAZAS */
  {id:14,c:'tazas',n:'Taza Blanca 11 oz',ref:'TZ-001',e:'☕',desc:'La clásica. Superficie lisa ideal para sublimación. Máxima calidad de imagen.',v:{tipo:['11 oz estándar']},precio:'$5.000'},
  {id:15,c:'tazas',n:'Taza Blanca 15 oz',ref:'TZ-002',e:'☕',desc:'Versión grande. Para los que necesitan más café o un regalo impactante.',v:{tipo:['15 oz grande']},precio:'$6.000'},
  {id:16,c:'tazas',n:'Taza Cónica 16 oz',ref:'TZ-003',e:'🫖',desc:'Diseño cónico moderno y llamativo. Diferénciate con esta taza única.',v:{tipo:['Cónica 16 oz']},precio:'$7.000'},
  {id:17,c:'tazas',n:'Taza Negra 11 oz',ref:'TZ-004',e:'🖤',desc:'El contraste negro realza diseños vibrantes, neón y pastel.',v:{tipo:['11 oz negra']},precio:'$5.000'},
  {id:18,c:'tazas',n:'Taza Negra 15 oz',ref:'TZ-005',e:'🖤',desc:'Versión grande en negro. Para diseños neón o pastel con máximo impacto.',v:{tipo:['15 oz negra']},precio:'$6.000'},
  {id:19,c:'tazas',n:'Taza Mágica',ref:'TZ-006',e:'✨',desc:'Cambia de color con agua caliente. El regalo perfecto y más solicitado.',v:{tipo:['Mágica estándar']},precio:'$6.000',badge:'popular'},
  {id:20,c:'tazas',n:'Taza Mágica con Brillo',ref:'TZ-007',e:'🌟',desc:'Versión deluxe con efecto brillante adicional. Impresionante como regalo.',v:{tipo:['Mágica con brillo']},precio:'$6.000',badge:'nuevo'},
  {id:21,c:'tazas',n:'Taza Borde de Color',ref:'TZ-008',e:'🎨',desc:'Taza blanca con borde interior de color. Elegante y diferente.',v:{col:[{n:'Rojo',h:'#e74c3c'},{n:'Azul',h:'#2980b9'},{n:'Verde',h:'#27ae60'},{n:'Rosa',h:'#f06292'}]},precio:'$5.000'},
  {id:22,c:'tazas',n:'Taza Interior de Color',ref:'TZ-009',e:'🌈',desc:'Interior de color con exterior blanco personalizable. Combinación única.',v:{col:[{n:'Rojo',h:'#e74c3c'},{n:'Azul',h:'#2980b9'},{n:'Verde',h:'#27ae60'},{n:'Negro',h:'#111'}]},precio:'$5.000'},
  /* ACCESORIOS */
  {id:23,c:'accesorios',n:'Carcasa Personalizada',ref:'ACC-001',e:'📱',desc:'Para iPhone, Samsung, Xiaomi, Motorola y más. Impresión de alta resolución.',v:{tipo:['iPhone','Samsung Galaxy','Xiaomi','Motorola']},precio:'$4.900'},
  {id:24,c:'accesorios',n:'Posavasos',ref:'ACC-002',e:'🥂',desc:'Material resistente. Para bares, hogares y empresas. Pack ideal para regalo.',v:{tipo:['Individual','Pack x4','Pack x6']},precio:'$1.800'},
  {id:25,c:'accesorios',n:'Placa Mascota',ref:'ACC-003',e:'🐾',desc:'Placa metálica para collar. Con nombre y teléfono. Gran regalo personalizado.',v:{col:[{n:'Azul',h:'#2980b9'},{n:'Rosado',h:'#f48fb1'},{n:'Negro',h:'#111'}],tipo:['Redonda','Hueso','Corazón']},precio:'$2.500'},
  /* DEPORTIVA */
  {id:26,c:'deportiva',n:'Short Traje de Baño',ref:'ROLY-0945',e:'🏖️',desc:'Sublimación total. Resistente al cloro y agua salada. Para equipos de natación.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Negro',h:'#111'},{n:'Azul',h:'#1a5276'}]},precio:'$5.500'},
  {id:27,c:'deportiva',n:'Short Deportivo',ref:'ROLY-0940',e:'🩳',desc:'Unisex, transpirable. Para entrenamiento o uso casual. Sublimación full print.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Negro',h:'#111'},{n:'Gris',h:'#888'},{n:'Azul',h:'#1a5276'}]},precio:'$4.800'},
  {id:28,c:'deportiva',n:'Short Deportivo Fútbol',ref:'ROLY-0941',e:'⚽',desc:'Con número y nombre. Descuento por equipos completos. Ideal para ligas y colegios.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Negro',h:'#111'},{n:'Blanco',h:'#f0f0f0'},{n:'Azul',h:'#1a5276'},{n:'Rojo',h:'#c0392b'}]},precio:'$5.200',badge:'pack'},
  {id:29,c:'deportiva',n:'Conjunto Deportivo',ref:'ROLY-CONJ',e:'🏋️',desc:'Polera + short con diseño unificado para equipos. Precio especial por conjunto.',v:{t:['S','M','L','XL','XXL'],col:[{n:'Negro',h:'#111'},{n:'Azul',h:'#1a5276'},{n:'Rojo',h:'#c0392b'}]},precio:'$7.500',badge:'pack'},
  /* IMPRESION */
  {id:30,c:'impresion',n:'Adhesivos por Mayor',ref:'IMP-001',e:'🏷️',desc:'Papel o vinil de alta calidad. Corte en cualquier forma. Precio por lámina.',v:{tipo:['Papel','Vinil','Transparente','Holográfico']},precio:'$800/ud'},
  {id:31,c:'impresion',n:'Fotografía 10×15 cm',ref:'IMP-002',e:'🖼️',desc:'Papel fotográfico profesional de alta resolución. Ideal para recuerdos.',v:{tipo:['Mate','Brillante']},precio:'$900'},
  {id:32,c:'impresion',n:'Fotografía 10×10 cm',ref:'IMP-003',e:'📸',desc:'Formato cuadrado para redes sociales. Muy solicitado para eventos.',v:{tipo:['Mate','Brillante']},precio:'$800'},
  {id:33,c:'impresion',n:'Fotografía 20×27 cm',ref:'IMP-004',e:'🖼️',desc:'Formato cuadro para enmarcar. Retratos y recordatorios de primera calidad.',v:{tipo:['Mate','Brillante']},precio:'$1.900'},
  {id:34,c:'impresion',n:'Stickers 5×5 cm',ref:'IMP-005',e:'⭐',desc:'Vinil resistente al agua. Para personalizar todo. Mínimo 10 unidades.',v:{tipo:['Vinil blanco','Transparente','Holográfico']},precio:'$350/ud'},
];

export const CATEGORIES = [
  {c:'poleras' as Categoria, name:'Poleras', count:'9 productos', icon:'👕', bg:'linear-gradient(160deg,#0d1b2a 0%,#1b4f72 60%,#2980b9 100%)'},
  {c:'polerones' as Categoria, name:'Polerones', count:'4 productos', icon:'🧥', bg:'linear-gradient(160deg,#0a0a0a 0%,#1a3a1a 60%,#2d5016 100%)'},
  {c:'tazas' as Categoria, name:'Tazas', count:'9 modelos', icon:'☕', bg:'linear-gradient(160deg,#3e1a00 0%,#7d3c02 60%,#b7561a 100%)'},
  {c:'accesorios' as Categoria, name:'Accesorios', count:'3 productos', icon:'📱', bg:'linear-gradient(160deg,#1a0a3e 0%,#4a1a8b 60%,#7b4fc0 100%)'},
  {c:'deportiva' as Categoria, name:'Deportiva', count:'4 productos', icon:'🩳', bg:'linear-gradient(160deg,#1a0000 0%,#6b0000 60%,#b71c1c 100%)'},
  {c:'impresion' as Categoria, name:'Impresión', count:'5 productos', icon:'🏷️', bg:'linear-gradient(160deg,#00141a 0%,#005c6b 60%,#00acc1 100%)'},
];

// ─── Recargo por tamaño de estampado (solo poleras y polerones) ───
export interface EstampadoSize {
  id: string;
  label: string;
  precio: number; // recargo en CLP
}

export const ESTAMPADO_SIZES: EstampadoSize[] = [
  { id: '30x30', label: '30 × 30 cm aprox', precio: 7000 },
  { id: '20x20', label: '20 × 20 cm aprox', precio: 5000 },
  { id: '10x30', label: '10 × 30 cm', precio: 2000 },
  { id: '10x10', label: '10 × 10 cm', precio: 1000 },
];

export function tieneRecargoEstampado(c: Categoria): boolean {
  return c === 'poleras' || c === 'polerones';
}

export function parsePrecio(precio: string): number {
  // Extrae el número del string de precio ej: "$2.900" → 2900
  const match = precio.match(/[\d.]+/);
  if (!match) return 0;
  return parseInt(match[0].replace(/\./g, ''), 10);
}

export function catLabel(c: Categoria): string {
  const map: Record<Categoria, string> = {
    poleras: 'Poleras', polerones: 'Polerones', tazas: 'Tazas',
    accesorios: 'Accesorios', deportiva: 'Deportiva', impresion: 'Impresión',
  };
  return map[c] || c;
}
