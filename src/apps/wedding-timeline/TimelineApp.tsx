import { useState } from 'react'
import { Sun, Clock, Music, Camera, Utensils, Mic2, Wine, PartyPopper } from 'lucide-react'

interface TimelineEvent {
  time: string
  title: string
  detail?: string
  icon: 'sun' | 'clock' | 'music' | 'camera' | 'food' | 'speech' | 'drink' | 'party'
  category: 'prep' | 'ceremony' | 'cocktail' | 'reception' | 'setup'
  highlight?: boolean
}

const ICONS = {
  sun: Sun, clock: Clock, music: Music, camera: Camera,
  food: Utensils, speech: Mic2, drink: Wine, party: PartyPopper,
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  prep: { bg: 'rgba(184,122,75,0.08)', border: '#d4956a', text: '#b87a4b' },
  ceremony: { bg: 'rgba(26,122,154,0.08)', border: '#1a7a9a', text: '#0f5f7a' },
  cocktail: { bg: 'rgba(107,181,207,0.08)', border: '#6BB5CF', text: '#3a97b8' },
  reception: { bg: 'rgba(212,149,106,0.08)', border: '#d4956a', text: '#b87a4b' },
  setup: { bg: 'rgba(156,139,120,0.06)', border: '#9C8B78', text: '#9C8B78' },
}

const TIMELINE: TimelineEvent[] = [
  { time: '8:30 AM', title: 'Breakfast delivered to rooms', icon: 'food', category: 'prep' },
  { time: '9:30 AM', title: "Naomi's team arrives for setup", detail: 'Hair & Makeup', icon: 'clock', category: 'prep' },
  { time: '10:00 AM', title: 'Hair & makeup starts', icon: 'clock', category: 'prep' },
  { time: '10:30 AM', title: 'Groom reads vows (special moment)', icon: 'clock', category: 'prep' },
  { time: '12:00 PM', title: 'Details ready for photographer', detail: 'Dress, shoes, rings, accessories, invitations, perfume', icon: 'camera', category: 'prep' },
  { time: '1:00 PM', title: 'Photography coverage begins', detail: '1:00 PM - 10:00 PM', icon: 'camera', category: 'prep' },
  { time: '2:00 PM', title: 'Videography & content creator begin', detail: '2:00 PM - 10:00 PM', icon: 'camera', category: 'prep' },
  { time: '2:15 PM', title: 'Bride gets dressed', icon: 'clock', category: 'prep' },
  { time: '2:45 PM', title: 'First look with Bruce (father)', icon: 'camera', category: 'prep' },
  { time: '3:00 PM', title: 'First look Bride & Groom + photos', icon: 'camera', category: 'prep', highlight: true },
  { time: '3:30 PM', title: 'Bridal party & family photos', icon: 'camera', category: 'prep' },
  { time: '4:15 PM', title: 'Ceremony setup finalized', icon: 'clock', category: 'setup' },
  { time: '5:00 PM', title: 'Guests arrive — Violinist plays', detail: 'Bar drinks available', icon: 'music', category: 'ceremony' },
  { time: '5:30 PM', title: 'Ceremony begins', detail: 'Infinity Terrace — Rows 1-2 reserved', icon: 'sun', category: 'ceremony', highlight: true },
  { time: '5:42 PM', title: 'Bride walks — Canon in D', detail: 'Bride & Bruce Applegarth', icon: 'music', category: 'ceremony' },
  { time: '6:00 PM', title: 'Recessional — Stand By Me', detail: 'Sunset: 6:33 PM', icon: 'sun', category: 'ceremony', highlight: true },
  { time: '6:00 PM', title: 'Cocktail Hour begins', detail: 'Infinity Terrace — Mariachi plays', icon: 'drink', category: 'cocktail', highlight: true },
  { time: '6:00 PM', title: 'Newlywed photos (20 min)', icon: 'camera', category: 'cocktail' },
  { time: '6:20 PM', title: 'Couple joins cocktail hour', detail: 'His: Old Fashioned / Hers: Spicy Margarita', icon: 'drink', category: 'cocktail' },
  { time: '7:00 PM', title: 'Guests find their seats', detail: 'Reception — Terrace 360', icon: 'clock', category: 'reception', highlight: true },
  { time: '7:01 PM', title: 'Bridal party announced', detail: 'No Broke Boys — Disco Lines', icon: 'party', category: 'reception' },
  { time: '7:05 PM', title: 'Mr & Mrs Beckman introduction', detail: 'Doses & Mimosas (Vintage Culture Remix)', icon: 'party', category: 'reception' },
  { time: '7:08 PM', title: 'First Dance', detail: 'Anything But Mine — Kenny Chesney', icon: 'music', category: 'reception', highlight: true },
  { time: '7:12 PM', title: 'Father-Daughter Dance', detail: 'There Goes My Life — Kenny Chesney', icon: 'music', category: 'reception' },
  { time: '7:16 PM', title: 'Mother-Son Dance', detail: 'Humble and Kind — Tim McGraw', icon: 'music', category: 'reception' },
  { time: '7:25 PM', title: 'Dinner service begins', detail: 'Bibb Salad → Filet of Beef / Sea Bass → Cheesecake / Tres Leches', icon: 'food', category: 'reception' },
  { time: '8:00 PM', title: 'Speeches between courses', detail: 'Jordan, Bennett, Olivia, Lauren, Doreen, Bruce, Maggie & Carson', icon: 'speech', category: 'reception', highlight: true },
  { time: '8:00 PM', title: 'Cigar roller opens', detail: '8:00 - 10:00 PM', icon: 'party', category: 'reception' },
  { time: '8:45 PM', title: 'Dinner ends — Dancing begins', icon: 'party', category: 'reception' },
  { time: '10:00 PM', title: 'Late night snack', detail: 'Baja Brewing pizzas', icon: 'food', category: 'reception' },
  { time: '11:40 PM', title: 'Last call — open bar', icon: 'drink', category: 'reception' },
  { time: '12:15 AM', title: 'Breakdown begins', icon: 'clock', category: 'setup' },
]

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'prep', label: 'Prep' },
  { id: 'ceremony', label: 'Ceremony' },
  { id: 'cocktail', label: 'Cocktail' },
  { id: 'reception', label: 'Reception' },
]

export function TimelineApp() {
  const [categoryFilter, setCategoryFilter] = useState('all')

  const events = categoryFilter === 'all'
    ? TIMELINE
    : TIMELINE.filter(e => e.category === categoryFilter)

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Maggie & Carson</h1>
            <p className="text-xs text-[var(--color-text-tertiary)]">March 26, 2026 &middot; Corazon Cabo &middot; Sunset 6:33 PM &middot; 59 guests</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(26,122,154,0.1)' }}>
            <Sun size={14} className="text-[#1a7a9a]" />
            <span className="text-xs font-semibold text-[#0f5f7a]">6:33 PM</span>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-1.5 mt-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id} onClick={() => setCategoryFilter(cat.id)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
              style={{
                background: categoryFilter === cat.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: categoryFilter === cat.id ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {events.map((event, i) => {
          const IconComp = ICONS[event.icon]
          const cat = CATEGORY_COLORS[event.category]
          return (
            <div key={i} className="flex gap-3 mb-1">
              {/* Time column */}
              <div className="w-16 flex-shrink-0 text-right pt-2.5">
                <span className="text-[11px] font-mono font-medium text-[var(--color-text-tertiary)]">{event.time}</span>
              </div>

              {/* Timeline line */}
              <div className="flex flex-col items-center w-6 flex-shrink-0">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-2"
                  style={{ background: event.highlight ? cat.border : cat.bg, border: `1.5px solid ${cat.border}` }}
                >
                  <IconComp size={12} style={{ color: event.highlight ? 'white' : cat.text }} />
                </div>
                {i < events.length - 1 && (
                  <div className="w-px flex-1 min-h-[8px]" style={{ background: 'var(--color-border)' }} />
                )}
              </div>

              {/* Content */}
              <div
                className="flex-1 rounded-lg px-3 py-2 mb-1"
                style={{ background: event.highlight ? cat.bg : 'transparent' }}
              >
                <p className="text-xs font-medium text-[var(--color-text-primary)]" style={event.highlight ? { color: cat.text } : {}}>
                  {event.title}
                </p>
                {event.detail && (
                  <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">{event.detail}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
