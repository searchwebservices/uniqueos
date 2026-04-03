import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'

export interface UserDevice {
  id: string
  user_id: string
  fingerprint: string
  name: string
  screen_width: number
  screen_height: number
  device_type: 'desktop' | 'tablet' | 'mobile'
  user_agent: string | null
  last_seen_at: string
  created_at: string
}

function getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
  const w = window.screen.width
  if (w <= 768) return 'mobile'
  if (w <= 1024) return 'tablet'
  return 'desktop'
}

function getDefaultDeviceName(): string {
  const ua = navigator.userAgent
  const type = getDeviceType()

  if (/iPhone/.test(ua)) return 'iPhone'
  if (/iPad/.test(ua)) return 'iPad'
  if (/Android/.test(ua) && type === 'mobile') return 'Android Phone'
  if (/Android/.test(ua)) return 'Android Tablet'
  if (/Macintosh/.test(ua)) return 'Mac'
  if (/Windows/.test(ua)) return 'Windows PC'
  if (/Linux/.test(ua)) return 'Linux'

  return type === 'mobile' ? 'Mobile' : type === 'tablet' ? 'Tablet' : 'Desktop'
}

/**
 * Generate a stable device fingerprint from screen + UA characteristics.
 * Not crypto-secure — just needs to be stable across sessions on the same device.
 */
function generateFingerprint(): string {
  const parts = [
    window.screen.width,
    window.screen.height,
    window.screen.colorDepth,
    window.devicePixelRatio,
    navigator.hardwareConcurrency ?? 0,
    navigator.platform,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ]
  // Simple hash
  const str = parts.join('|')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0
  }
  return `dev_${Math.abs(hash).toString(36)}_${window.screen.width}x${window.screen.height}`
}

/**
 * Hook to register and identify the current device.
 * Returns the current device record and a list of all user devices.
 */
export function useDevice() {
  const { user } = useAuth()
  const [currentDevice, setCurrentDevice] = useState<UserDevice | null>(null)
  const [allDevices, setAllDevices] = useState<UserDevice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const register = async () => {
      const fingerprint = generateFingerprint()
      const deviceType = getDeviceType()
      const defaultName = getDefaultDeviceName()

      // Upsert device (don't overwrite user-set name)
      const { data: existing } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_id', user.id)
        .eq('fingerprint', fingerprint)
        .single()

      let device: UserDevice

      if (existing) {
        // Update screen dimensions + last_seen
        const { data } = await supabase
          .from('user_devices')
          .update({
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            device_type: deviceType,
            user_agent: navigator.userAgent,
            last_seen_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single()

        device = data ?? existing
      } else {
        // Create new device
        const { data, error } = await supabase
          .from('user_devices')
          .insert({
            user_id: user.id,
            fingerprint,
            name: defaultName,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            device_type: deviceType,
            user_agent: navigator.userAgent,
          })
          .select()
          .single()

        if (error) {
          console.warn('[Device] Registration failed:', error.message)
          setIsLoading(false)
          return
        }
        device = data
      }

      setCurrentDevice(device)

      // Fetch all devices
      const { data: devices } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_id', user.id)
        .order('last_seen_at', { ascending: false })

      if (devices) setAllDevices(devices)
      setIsLoading(false)
    }

    register()
  }, [user?.id])

  const renameDevice = useCallback(
    async (deviceId: string, name: string) => {
      const { error } = await supabase
        .from('user_devices')
        .update({ name })
        .eq('id', deviceId)

      if (!error) {
        setAllDevices((prev) =>
          prev.map((d) => (d.id === deviceId ? { ...d, name } : d)),
        )
        if (currentDevice?.id === deviceId) {
          setCurrentDevice((prev) => (prev ? { ...prev, name } : prev))
        }
      }
    },
    [currentDevice?.id],
  )

  return { currentDevice, allDevices, isLoading, renameDevice }
}
