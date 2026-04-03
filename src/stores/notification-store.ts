import { create } from 'zustand'
import type { Notification, NotificationType } from '@/types/os'

interface NotificationStore {
  notifications: Notification[]
  toastQueue: Notification[]

  notify: (opts: { type?: NotificationType; title: string; message?: string; appId?: string }) => void
  dismiss: (id: string) => void
  markRead: (id: string) => void
  clearAll: () => void
  dequeueToast: () => Notification | undefined
  unreadCount: () => number
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  toastQueue: [],

  notify: ({ type = 'info', title, message, appId }) => {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      title,
      message,
      timestamp: Date.now(),
      read: false,
      appId,
    }
    set(state => ({
      notifications: [notification, ...state.notifications].slice(0, 100),
      toastQueue: [...state.toastQueue, notification],
    }))
  },

  dismiss: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),

  markRead: (id) => set(state => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ),
  })),

  clearAll: () => set({ notifications: [] }),

  dequeueToast: () => {
    const toast = get().toastQueue[0]
    if (toast) {
      set(state => ({ toastQueue: state.toastQueue.slice(1) }))
    }
    return toast
  },

  unreadCount: () => get().notifications.filter(n => !n.read).length,
}))
