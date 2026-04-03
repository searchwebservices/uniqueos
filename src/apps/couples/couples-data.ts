export interface Couple {
  id: string
  names: string
  date: string
  venue: string
  guests: number
  phase: number
  phaseLabel: string
  progress: number
  status: 'active' | 'completed' | 'upcoming'
  colors: string
  email: string
}

export const MOCK_COUPLES: Couple[] = [
  {
    id: '1', names: 'Maggie & Carson', date: 'Mar 26, 2026',
    venue: 'Corazon Cabo', guests: 59, phase: 5, phaseLabel: 'Final Prep',
    progress: 92, status: 'active', colors: 'White, ivory & greenery',
    email: 'maggie@email.com',
  },
  {
    id: '2', names: 'Ally & Mark', date: 'Feb 28, 2026',
    venue: "Petunia's", guests: 36, phase: 5, phaseLabel: 'Final Prep',
    progress: 100, status: 'completed', colors: 'Pink & gold',
    email: 'aliebava@yahoo.com',
  },
  {
    id: '3', names: 'Sofia & James', date: 'Jun 14, 2026',
    venue: 'Corazon Cabo', guests: 85, phase: 3, phaseLabel: 'Design & Decor',
    progress: 55, status: 'active', colors: 'Dusty rose & sage',
    email: 'sofia@email.com',
  },
  {
    id: '4', names: 'Emma & Diego', date: 'Aug 22, 2026',
    venue: 'Esperanza', guests: 120, phase: 2, phaseLabel: 'Vendor Booking',
    progress: 30, status: 'active', colors: 'Navy & gold',
    email: 'emma@email.com',
  },
  {
    id: '5', names: 'Rachel & Thomas', date: 'Oct 10, 2026',
    venue: 'Waldorf Astoria', guests: 75, phase: 1, phaseLabel: 'Onboarding',
    progress: 12, status: 'upcoming', colors: 'Terracotta & cream',
    email: 'rachel@email.com',
  },
  {
    id: '6', names: 'Lauren & Chris', date: 'Nov 7, 2026',
    venue: 'Pueblo Bonito', guests: 95, phase: 1, phaseLabel: 'Onboarding',
    progress: 8, status: 'upcoming', colors: 'Burgundy & blush',
    email: 'lauren@email.com',
  },
  {
    id: '7', names: 'Ashley & Ryan', date: 'Dec 20, 2026',
    venue: "Petunia's", guests: 45, phase: 1, phaseLabel: 'Onboarding',
    progress: 5, status: 'upcoming', colors: 'All white',
    email: 'ashley@email.com',
  },
]
