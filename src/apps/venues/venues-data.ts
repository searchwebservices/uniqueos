export interface VenueSpace {
  name: string
  use: string
  capacity?: number
}

export interface Venue {
  id: string
  name: string
  location: string
  maxCapacity: number
  spaces: VenueSpace[]
  provides: string[]
  curfew?: string
  parking?: string
  contact?: string
  phone?: string
  notes?: string
  color: string
}

export const MOCK_VENUES: Venue[] = [
  {
    id: 'corazon',
    name: 'Corazón Cabo',
    location: 'Cabo San Lucas',
    maxCapacity: 150,
    spaces: [
      { name: 'Infinity Terrace', use: 'Ceremonia / Cocktail', capacity: 100 },
      { name: 'Terrace 360', use: 'Recepción', capacity: 150 },
      { name: 'Pool Grill', use: 'After party', capacity: 80 },
    ],
    provides: ['Sillas', 'Mesas de cocktail', 'Barra', 'Cubiertos', 'Cristalería'],
    curfew: '1:00 AM',
    parking: 'Valet incluido',
    notes: 'Venue principal de UCW. Vista espectacular al océano.',
    color: '#4a6fa5',
  },
  {
    id: 'petunias',
    name: "Petunia's",
    location: 'San José del Cabo',
    maxCapacity: 80,
    spaces: [
      { name: 'Jardín Principal', use: 'Ceremonia', capacity: 80 },
      { name: 'Terraza Interior', use: 'Recepción', capacity: 60 },
    ],
    provides: ['Sillas', 'Mesas redondas', 'Iluminación básica'],
    curfew: '12:00 AM',
    parking: 'Estacionamiento limitado',
    notes: 'Ambiente íntimo, ideal para bodas pequeñas.',
    color: '#4a7c59',
  },
  {
    id: 'esperanza',
    name: 'Esperanza',
    location: 'Punta Ballena, Los Cabos',
    maxCapacity: 200,
    spaces: [
      { name: 'Ocean Lawn', use: 'Ceremonia', capacity: 200 },
      { name: 'Ballroom', use: 'Recepción', capacity: 180 },
      { name: 'Beach Club', use: 'After party / Welcome dinner', capacity: 100 },
    ],
    provides: ['Sillas', 'Mesas', 'Cubiertos', 'Cristalería', 'Servicio de catering in-house', 'Valet'],
    curfew: '12:00 AM',
    parking: 'Valet incluido',
    notes: 'Resort de lujo. Requiere catering exclusivo del resort.',
    color: '#c4841d',
  },
  {
    id: 'waldorf',
    name: 'Waldorf Astoria',
    location: 'San José del Cabo',
    maxCapacity: 250,
    spaces: [
      { name: 'Grand Terrace', use: 'Ceremonia', capacity: 250 },
      { name: 'Grand Ballroom', use: 'Recepción', capacity: 250 },
      { name: 'Sunset Terrace', use: 'Cocktail', capacity: 120 },
    ],
    provides: ['Todo incluido — sillas, mesas, cubiertos, cristalería, mantelería', 'Catering in-house', 'Coordinador de eventos'],
    curfew: '1:00 AM',
    parking: 'Valet incluido',
    notes: 'Ultra premium. Pricing elevado pero todo-incluido.',
    color: '#7c5cbf',
  },
  {
    id: 'pueblo',
    name: 'Pueblo Bonito',
    location: 'Cabo San Lucas',
    maxCapacity: 180,
    spaces: [
      { name: 'Beachfront Terrace', use: 'Ceremonia', capacity: 150 },
      { name: 'Quivira Pavilion', use: 'Recepción', capacity: 180 },
    ],
    provides: ['Sillas', 'Mesas', 'Iluminación básica', 'Catering opciones'],
    curfew: '12:00 AM',
    parking: 'Estacionamiento del resort',
    notes: 'Buena opción mid-range. Varias propiedades disponibles.',
    color: '#c4473a',
  },
]
