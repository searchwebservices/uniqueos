import { useState } from 'react'
import { Plus, Trash2, FileDown, ChevronDown } from 'lucide-react'

interface QuoteItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

const SAMPLE_ITEMS: QuoteItem[] = [
  { id: '1', name: 'Mexican Pink Napkin', quantity: 36, unitPrice: 4.00 },
  { id: '2', name: 'Gold Silverware Set (5pc)', quantity: 36, unitPrice: 5.00 },
  { id: '3', name: 'Green Water Glass', quantity: 36, unitPrice: 4.00 },
]

const INVENTORY_OPTIONS = [
  'Mexican Pink Napkin', 'Gold Silverware Set (5pc)', 'Green Water Glass',
  'Ivory Table Runner', 'Gold Charger Plate', 'Cylinder Candle Holder',
  'White Votive Candle', 'Wooden Fan', 'Champagne Flute Crystal',
  'Blush Napkin', 'Silver Charger Plate', 'Navy Napkin',
]

const PRICES: Record<string, number> = {
  'Mexican Pink Napkin': 4.00, 'Gold Silverware Set (5pc)': 5.00, 'Green Water Glass': 4.00,
  'Ivory Table Runner': 8.00, 'Gold Charger Plate': 6.00, 'Cylinder Candle Holder': 3.50,
  'White Votive Candle': 1.50, 'Wooden Fan': 2.00, 'Champagne Flute Crystal': 5.50,
  'Blush Napkin': 4.00, 'Silver Charger Plate': 6.00, 'Navy Napkin': 4.00,
}

export function QuotesApp() {
  const [coupleName, setCoupleName] = useState('Ally & Mark')
  const [venue, setVenue] = useState("Petunia's")
  const [date, setDate] = useState('February 28th, 2026')
  const [guests, setGuests] = useState('36')
  const [items, setItems] = useState<QuoteItem[]>(SAMPLE_ITEMS)
  const [deliveryWaived, setDeliveryWaived] = useState(true)

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const deliveryFee = deliveryWaived ? 0 : subtotal * 0.1
  const iva = (subtotal + deliveryFee) * 0.16
  const total = subtotal + deliveryFee + iva

  const addItem = () => {
    setItems(prev => [...prev, { id: Date.now().toString(), name: INVENTORY_OPTIONS[0], quantity: 1, unitPrice: PRICES[INVENTORY_OPTIONS[0]] }])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      if (field === 'name') {
        return { ...item, name: value as string, unitPrice: PRICES[value as string] ?? 0 }
      }
      return { ...item, [field]: value }
    }))
  }

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Cotizacion</h1>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-accent)] text-[var(--color-text-inverse)]">
            <FileDown size={14} />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Client Info */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Pareja</label>
            <input
              value={coupleName} onChange={e => setCoupleName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)] transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Venue</label>
            <input
              value={venue} onChange={e => setVenue(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)] transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Fecha</label>
            <input
              value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)] transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Invitados</label>
            <input
              value={guests} onChange={e => setGuests(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)] transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="rounded-xl border overflow-hidden mb-4" style={{ borderColor: 'var(--color-border)' }}>
          {/* Header */}
          <div className="flex items-center px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]" style={{ background: 'var(--color-bg-secondary)' }}>
            <span className="flex-1">Item</span>
            <span className="w-16 text-center">Cant</span>
            <span className="w-20 text-right">Precio U.</span>
            <span className="w-20 text-right">Total</span>
            <span className="w-8" />
          </div>

          {/* Rows */}
          {items.map(item => (
            <div key={item.id} className="flex items-center px-3 py-2 border-t" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}>
              <div className="flex-1 relative">
                <select
                  value={item.name}
                  onChange={e => updateItem(item.id, 'name', e.target.value)}
                  className="w-full text-xs bg-transparent text-[var(--color-text-primary)] outline-none appearance-none pr-4 cursor-pointer"
                >
                  {INVENTORY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={10} className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] pointer-events-none" />
              </div>
              <input
                type="number" value={item.quantity} min={1}
                onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                className="w-16 text-center text-xs bg-transparent text-[var(--color-text-primary)] outline-none"
              />
              <span className="w-20 text-right text-xs text-[var(--color-text-secondary)]">${item.unitPrice.toFixed(2)}</span>
              <span className="w-20 text-right text-xs font-medium text-[var(--color-text-primary)]">${(item.quantity * item.unitPrice).toFixed(2)}</span>
              <button onClick={() => removeItem(item.id)} className="w-8 flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          {/* Add row */}
          <button onClick={addItem} className="w-full flex items-center gap-1.5 px-3 py-2 border-t text-[11px] font-medium text-[var(--color-accent)] hover:bg-[var(--color-bg-secondary)] transition-colors" style={{ borderColor: 'var(--color-border)' }}>
            <Plus size={12} />
            Agregar item del inventario
          </button>
        </div>

        {/* Totals */}
        <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--color-text-secondary)]">Subtotal</span>
              <span className="text-[var(--color-text-primary)] font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-text-secondary)]">Delivery Fee</span>
                <button
                  onClick={() => setDeliveryWaived(!deliveryWaived)}
                  className="text-[10px] px-1.5 py-0.5 rounded text-[var(--color-accent)] bg-[var(--color-bg-secondary)]"
                >
                  {deliveryWaived ? 'WAIVED' : 'Apply'}
                </button>
              </div>
              <span className="text-[var(--color-text-primary)] font-medium">{deliveryWaived ? 'WAIVED' : `$${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--color-text-secondary)]">IVA 16%</span>
              <span className="text-[var(--color-text-primary)] font-medium">${iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <span className="font-semibold text-[var(--color-text-primary)]">Total USD</span>
              <span className="font-bold text-[var(--color-accent)]">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
