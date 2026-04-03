export interface InventoryItem {
  id: string
  name: string
  category: InventoryCategory
  price: number
  quantity: number
  available: number
  image: string
}

export type InventoryCategory =
  | 'Textiles'
  | 'Cutlery'
  | 'Glassware'
  | 'Tableware'
  | 'Decor'
  | 'Accessories'

export interface CategoryInfo {
  id: InventoryCategory
  label: string
  description: string
  color: string
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'Textiles', label: 'Textiles', description: 'Manteles, servilletas, runners', color: '#c4473a' },
  { id: 'Tableware', label: 'Vajilla', description: 'Chargers, platos, platones', color: '#c4841d' },
  { id: 'Glassware', label: 'Cristalería', description: 'Copas, vasos, flautas', color: '#4a6fa5' },
  { id: 'Cutlery', label: 'Cubiertos', description: 'Sets de cubiertos', color: '#8a6d3b' },
  { id: 'Decor', label: 'Decoración', description: 'Velas, centros de mesa, cilindros', color: '#7c5cbf' },
  { id: 'Accessories', label: 'Accesorios', description: 'Abanicos, señalización, marcos', color: '#4a7c59' },
]

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Mexican Pink Napkin', category: 'Textiles', price: 4.00, quantity: 200, available: 164, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=200&h=200&fit=crop' },
  { id: '2', name: 'Gold Silverware Set (5pc)', category: 'Cutlery', price: 5.00, quantity: 150, available: 114, image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=200&h=200&fit=crop' },
  { id: '3', name: 'Green Water Glass', category: 'Glassware', price: 4.00, quantity: 180, available: 144, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed514?w=200&h=200&fit=crop' },
  { id: '4', name: 'Ivory Table Runner', category: 'Textiles', price: 8.00, quantity: 60, available: 52, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&h=200&fit=crop' },
  { id: '5', name: 'Gold Charger Plate', category: 'Tableware', price: 6.00, quantity: 120, available: 61, image: 'https://images.unsplash.com/photo-1507914997-8ed6c0f67a08?w=200&h=200&fit=crop' },
  { id: '6', name: 'Cylinder Candle Holder', category: 'Decor', price: 3.50, quantity: 100, available: 88, image: 'https://images.unsplash.com/photo-1602523961358-f9f03a557d3e?w=200&h=200&fit=crop' },
  { id: '7', name: 'White Votive Candle', category: 'Decor', price: 1.50, quantity: 500, available: 423, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop' },
  { id: '8', name: 'Wooden Fan (Ceremony)', category: 'Accessories', price: 2.00, quantity: 200, available: 141, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=200&h=200&fit=crop' },
  { id: '9', name: 'Champagne Flute Crystal', category: 'Glassware', price: 5.50, quantity: 100, available: 100, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&h=200&fit=crop' },
  { id: '10', name: 'Blush Napkin', category: 'Textiles', price: 4.00, quantity: 150, available: 150, image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&h=200&fit=crop' },
  { id: '11', name: 'Silver Charger Plate', category: 'Tableware', price: 6.00, quantity: 80, available: 80, image: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=200&h=200&fit=crop' },
  { id: '12', name: 'Navy Napkin', category: 'Textiles', price: 4.00, quantity: 120, available: 120, image: 'https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?w=200&h=200&fit=crop' },
]
