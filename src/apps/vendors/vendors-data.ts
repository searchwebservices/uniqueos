export type VendorCategory =
  | 'photography'
  | 'music'
  | 'florals'
  | 'hair_makeup'
  | 'rentals'
  | 'catering'
  | 'transport'
  | 'other'

export interface VendorCategoryInfo {
  id: VendorCategory
  label: string
  description: string
  color: string
}

export interface Vendor {
  id: string
  name: string
  category: VendorCategory
  contact: string
  phone?: string
  email?: string
  instagram?: string
  services: string[]
  notes?: string
  rating?: number
}

export const VENDOR_CATEGORIES: VendorCategoryInfo[] = [
  { id: 'photography', label: 'Fotografía & Video', description: 'Fotógrafos, videógrafos, content creators', color: '#6366f1' },
  { id: 'music', label: 'Música & Entretenimiento', description: 'DJs, músicos en vivo, entretenimiento', color: '#c4473a' },
  { id: 'florals', label: 'Florales', description: 'Arreglos florales, bouquets, decoración', color: '#4a7c59' },
  { id: 'hair_makeup', label: 'Hair & Makeup', description: 'Estilistas, maquillaje, beauty', color: '#c4841d' },
  { id: 'rentals', label: 'Renta de Mobiliario', description: 'Mesas, sillas, barras, mobiliario', color: '#8a6d3b' },
  { id: 'catering', label: 'Catering & Bebidas', description: 'Comida, bebidas, bartending', color: '#3a8a8a' },
  { id: 'transport', label: 'Transporte', description: 'Traslados de invitados y logística', color: '#4a6fa5' },
  { id: 'other', label: 'Otros', description: 'Cigar rollers, photobooth, pirotecnia', color: '#7c5cbf' },
]

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Luz Villagomez',
    category: 'photography',
    contact: 'Luz Villagomez',
    instagram: '@evrythinginbetween_',
    services: ['Fotografía de boda', 'Content creation', 'Sesión pre-boda'],
    notes: 'Estilo editorial, muy creativa',
  },
  {
    id: 'v2',
    name: 'Apervision Media',
    category: 'photography',
    contact: 'Apervision',
    instagram: '@apervision',
    services: ['Videografía de boda', 'Highlights reel', 'Drone footage'],
    notes: 'Estilo cinematográfico',
  },
  {
    id: 'v3',
    name: 'DJ Mark / DLT Events',
    category: 'music',
    contact: 'DJ Mark',
    instagram: '@dlt_events',
    services: ['DJ set (5hr)', 'Iluminación básica', 'DJ booth', 'Sonido'],
    notes: 'Paquetes de 5 horas, incluye booth e iluminación',
  },
  {
    id: 'v4',
    name: 'Kary Violin',
    category: 'music',
    contact: 'Kary',
    instagram: '@karyviolin2505',
    services: ['Violín para ceremonia', 'Cocktail hour', 'Recepción'],
  },
  {
    id: 'v5',
    name: 'Mariachi Los Cabos',
    category: 'music',
    contact: 'Mariachi',
    services: ['Mariachi para cocktail hour', 'Serenata'],
  },
  {
    id: 'v6',
    name: 'Velvet Floral Art & Design',
    category: 'florals',
    contact: 'Karla Bastidas',
    phone: '6241252851',
    instagram: '@velvetfloralcabo',
    services: [
      'Bouquets y flores personales',
      'Arreglos de ceremonia (altar, entrada)',
      'Flores de cocktail',
      'Centros de mesa recepción',
      'Mesa de novios',
    ],
    notes: 'Proveedora principal de florales. Muy detallista',
  },
  {
    id: 'v7',
    name: 'Glam by Nao',
    category: 'hair_makeup',
    contact: 'Naomi Alvarez',
    instagram: '@glambynao',
    services: ['Maquillaje novia', 'Peinado novia', 'Equipo completo para damas'],
    notes: 'Llega temprano en la mañana, equipo completo',
  },
  {
    id: 'v8',
    name: 'The Cabo Wedding Co',
    category: 'rentals',
    contact: 'The Cabo Wedding Co',
    instagram: '@the.cabo.wedding.co',
    services: ['Mesas rectangulares de madera', 'Sillas wishbone', 'Barra', 'Contrabarra'],
    notes: 'Mobiliario rústico de alta calidad',
  },
  {
    id: 'v9',
    name: 'Cigar Roller Alonso',
    category: 'other',
    contact: 'Alonso',
    services: ['Rolling station durante recepción', 'Cigarros premium'],
  },
]
