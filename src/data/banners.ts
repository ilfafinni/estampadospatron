export interface HeroSlideData {
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
    imgMob?: string;
    imgPanXMob?: number;
    imgPanYMob?: number;
    imgZoomMob?: number;
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
    imgMob?: string;
    imgPanXMob?: number;
    imgPanYMob?: number;
    imgZoomMob?: number;
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
  heroSlides: [
  {
    id: 1,
    tag: 'Nueva colección 2025',
    h1Line1: 'Estampados',
    h1Line2: 'con tu diseño',
    p: 'Personaliza tus prendas y productos favoritos con tu logo o diseño. Desde 1 unidad, sin mínimos.',
    cta: 'Ver poleras',
    ctaType: 'catalogo',
    img: '/images/productos/producto-1.jpg',
    imgMob: '/images/productos/producto-1.jpg',
    imgFit: 'cover',
    imgPosition: 'center',
    imgPanX: 0,
    imgPanY: 0,
    imgZoom: 1,
    imgPanXMob: 0,
    imgPanYMob: 0,
    imgZoomMob: 1,
    ctaParam: 'poleras',
    bg: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
  },
  {
    id: 2,
    tag: 'Personalización profesional',
    h1Line1: 'Tu marca en',
    h1Line2: 'cada prenda',
    p: 'Sublimación, vinilo y DTF. El mejor acabado para tu empresa o evento corporativo.',
    cta: 'Cotizar ahora',
    ctaType: 'whatsapp',
    img: '/images/productos/producto-11.jpg',
    imgMob: '/images/productos/producto-11.jpg',
    imgFit: 'cover',
    imgPosition: 'center',
    imgPanX: 0,
    imgPanY: 0,
    imgZoom: 1,
    imgPanXMob: 0,
    imgPanYMob: 0,
    imgZoomMob: 1,
    bg: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
  },
  {
    id: 3,
    tag: 'Entrega Express',
    h1Line1: 'Retira en',
    h1Line2: '4 horas',
    p: '¿Necesitas urgente? Contáctanos y coordinamos entrega express el mismo día en Curicó.',
    cta: 'WhatsApp',
    ctaType: 'whatsapp',
    img: '/images/productos/producto-19.jpg',
    imgMob: '/images/productos/producto-19.jpg',
    imgFit: 'cover',
    imgPosition: 'center',
    imgPanX: 0,
    imgPanY: 0,
    imgZoom: 1,
    imgPanXMob: 0,
    imgPanYMob: 0,
    imgZoomMob: 1,
    bg: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
  }
  ],
  promoBanners: [
  {
    id: 1,
    label: 'Ideal para equipos',
    titleLine1: 'Polerones',
    titleLine2: 'Personalizados',
    cta: 'Ver polerones',
    ctaType: 'categoria',
    ctaParam: 'polerones',
    img: '/images/productos/producto-12.jpg',
    imgMob: '/images/productos/producto-12.jpg',
    imgFit: 'cover',
    imgPosition: 'center',
    imgPanX: 0,
    imgPanY: 0,
    imgZoom: 1,
    imgPanXMob: 0,
    imgPanYMob: 0,
    imgZoomMob: 1,
    bg: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
  },
  {
    id: 2,
    label: 'Descuento por volumen',
    titleLine1: 'Venta',
    titleLine2: 'Corporativa',
    cta: 'Cotizar empresa',
    ctaType: 'contacto',
    img: '/images/productos/producto-7.jpg',
    imgMob: '/images/productos/producto-7.jpg',
    imgFit: 'cover',
    imgPosition: 'center',
    imgPanX: 0,
    imgPanY: 0,
    imgZoom: 1,
    imgPanXMob: 0,
    imgPanYMob: 0,
    imgZoomMob: 1,
    bg: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
  }
  ],
};