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
    ctaParam: 'poleras',
    img: 'https://res.cloudinary.com/dguwdbts9/image/upload/v1785037868/patronestampados/banners/ok9i2j8nyhz7pnc8abya.jpg',
    bg: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 50%, var(--bg-secondary) 100%)',
  },
  {
    id: 2,
    tag: 'Personalización profesional',
    h1Line1: 'Tu marca en',
    h1Line2: 'cada prenda',
    p: 'Serigrafía, sublimación y bordado. El mejor acabado para tu empresa o evento corporativo.',
    cta: 'Cotizar ahora',
    ctaType: 'contacto',
    bg: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 50%, var(--bg-primary) 100%)',
  },
  {
    id: 3,
    tag: 'Entrega Express',
    h1Line1: 'Retira en',
    h1Line2: '4 horas',
    p: '¿Necesitas urgente? Contáctanos y coordinamos entrega express el mismo día en Curicó.',
    cta: 'WhatsApp',
    ctaType: 'whatsapp',
    bg: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)',
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
    bg: 'linear-gradient(135deg, var(--bg-primary) 0%, #166534 100%)',
  },
  {
    id: 2,
    label: 'Descuento por volumen',
    titleLine1: 'Venta',
    titleLine2: 'Corporativa',
    cta: 'Cotizar empresa',
    ctaType: 'contacto',
    bg: 'linear-gradient(135deg, var(--color-primary) 0%, #1e3a8a 100%)',
  }
  ],
};