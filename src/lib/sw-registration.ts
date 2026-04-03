import { toast } from 'sonner'

/**
 * Register service worker and handle updates.
 * Uses vite-plugin-pwa's virtual module for registration.
 */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  try {
    const { registerSW } = await import('virtual:pwa-register')

    const updateSW = registerSW({
      onNeedRefresh() {
        toast('Update available', {
          description: 'Click to refresh and get the latest version.',
          duration: Infinity,
          action: {
            label: 'Refresh',
            onClick: () => {
              updateSW(true)
            },
          },
        })
      },
      onOfflineReady() {
        toast.success('TabletopOS is ready for offline use')
      },
    })
  } catch {
    // SW registration failed silently — non-critical
  }
}
