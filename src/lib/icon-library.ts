import type { LucideIcon } from 'lucide-react'
import {
  Calendar, CheckSquare, Bell, HardDrive, QrCode, Image as ImageIcon,
  StickyNote, Mic, MessageSquare, Users, Settings, Folder,
  FileText, Briefcase, DollarSign, Wrench, Share2, Globe,
  Star, Heart, Music, Video, Camera, Book, Bookmark, Clock,
  Mail, Phone, MapPin, Home, Coffee, Zap, Shield, Code,
  Terminal, Palette, Package, Gamepad2, Headphones, Plane,
} from 'lucide-react'

export interface IconOption {
  key: string
  icon: LucideIcon
  label: string
}

export const ICON_LIBRARY: IconOption[] = [
  { key: 'calendar', icon: Calendar, label: 'Calendar' },
  { key: 'check-square', icon: CheckSquare, label: 'Tasks' },
  { key: 'bell', icon: Bell, label: 'Bell' },
  { key: 'hard-drive', icon: HardDrive, label: 'Drive' },
  { key: 'qr-code', icon: QrCode, label: 'QR Code' },
  { key: 'image', icon: ImageIcon, label: 'Image' },
  { key: 'sticky-note', icon: StickyNote, label: 'Note' },
  { key: 'mic', icon: Mic, label: 'Mic' },
  { key: 'message-square', icon: MessageSquare, label: 'Chat' },
  { key: 'users', icon: Users, label: 'People' },
  { key: 'settings', icon: Settings, label: 'Settings' },
  { key: 'folder', icon: Folder, label: 'Folder' },
  { key: 'file-text', icon: FileText, label: 'Document' },
  { key: 'briefcase', icon: Briefcase, label: 'Work' },
  { key: 'dollar-sign', icon: DollarSign, label: 'Finance' },
  { key: 'wrench', icon: Wrench, label: 'Tools' },
  { key: 'share-2', icon: Share2, label: 'Share' },
  { key: 'globe', icon: Globe, label: 'Web' },
  { key: 'star', icon: Star, label: 'Star' },
  { key: 'heart', icon: Heart, label: 'Heart' },
  { key: 'music', icon: Music, label: 'Music' },
  { key: 'video', icon: Video, label: 'Video' },
  { key: 'camera', icon: Camera, label: 'Camera' },
  { key: 'book', icon: Book, label: 'Book' },
  { key: 'bookmark', icon: Bookmark, label: 'Bookmark' },
  { key: 'clock', icon: Clock, label: 'Clock' },
  { key: 'mail', icon: Mail, label: 'Mail' },
  { key: 'phone', icon: Phone, label: 'Phone' },
  { key: 'map-pin', icon: MapPin, label: 'Location' },
  { key: 'home', icon: Home, label: 'Home' },
  { key: 'coffee', icon: Coffee, label: 'Coffee' },
  { key: 'zap', icon: Zap, label: 'Bolt' },
  { key: 'shield', icon: Shield, label: 'Shield' },
  { key: 'code', icon: Code, label: 'Code' },
  { key: 'terminal', icon: Terminal, label: 'Terminal' },
  { key: 'palette', icon: Palette, label: 'Art' },
  { key: 'package', icon: Package, label: 'Package' },
  { key: 'gamepad-2', icon: Gamepad2, label: 'Game' },
  { key: 'headphones', icon: Headphones, label: 'Audio' },
  { key: 'plane', icon: Plane, label: 'Travel' },
]

const iconMap = new Map(ICON_LIBRARY.map((i) => [i.key, i.icon]))
const reverseMap = new Map(ICON_LIBRARY.map((i) => [i.icon, i.key]))

export function resolveIcon(key: string): LucideIcon | undefined {
  return iconMap.get(key)
}

export function getIconKey(icon: LucideIcon): string | undefined {
  return reverseMap.get(icon)
}
