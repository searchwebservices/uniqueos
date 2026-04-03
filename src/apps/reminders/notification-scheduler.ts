import type { DbReminder } from '@/types/database'

const scheduledTimers = new Map<string, ReturnType<typeof setTimeout>>()

export function requestNotificationPermission(): void {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

export function scheduleUpcomingReminders(reminders: DbReminder[]): void {
  // Clear previous timers
  for (const timer of scheduledTimers.values()) {
    clearTimeout(timer)
  }
  scheduledTimers.clear()

  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return
  }

  const now = Date.now()
  const oneHour = 60 * 60 * 1000

  for (const reminder of reminders) {
    if (reminder.completed) continue

    const remindAt = new Date(reminder.remind_at).getTime()
    const delay = remindAt - now

    // Only schedule if within the next hour and in the future
    if (delay > 0 && delay <= oneHour) {
      const timer = setTimeout(() => {
        new Notification('Reminder', {
          body: reminder.title,
          icon: '/favicon.svg',
          tag: `reminder-${reminder.id}`,
        })
        scheduledTimers.delete(reminder.id)
      }, delay)

      scheduledTimers.set(reminder.id, timer)
    }
  }
}

export function clearScheduledReminders(): void {
  for (const timer of scheduledTimers.values()) {
    clearTimeout(timer)
  }
  scheduledTimers.clear()
}
