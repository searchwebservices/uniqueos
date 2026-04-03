import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { useDesktopLayout } from '@/stores/desktop-layout-store'
import { useDesktopCustomization } from '@/stores/desktop-customization-store'
import type { UserDevice } from './useDevice'

/**
 * Syncs desktop icon positions (per-device) and customizations (shared)
 * to Supabase. Positions are device-specific so each screen size gets
 * its own layout. Customizations (name/icon/color overrides) are shared.
 */
export function useDesktopPersistence(device: UserDevice | null) {
  const { user } = useAuth()
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasPulled = useRef(false)
  const suppressSyncRef = useRef(false)

  // --- Pull positions + customizations from DB ---
  useEffect(() => {
    if (!device || !user?.id || hasPulled.current) return
    hasPulled.current = true

    const pull = async () => {
      suppressSyncRef.current = true

      // Pull positions for this device
      const { data: posRows, error: posError } = await supabase
        .from('desktop_positions')
        .select('item_key, col, row')
        .eq('user_id', user.id)
        .eq('device_id', device.id)

      if (posError) {
        console.warn('[DesktopPersistence] Failed to pull positions:', posError.message)
      }

      if (posRows && posRows.length > 0) {
        const positions = posRows.map((r: { item_key: string; col: number; row: number }) => ({
          key: r.item_key,
          col: r.col,
          row: r.row,
        }))
        useDesktopLayout.getState().loadPositions(positions)
      }

      // Store device ID in layout store
      useDesktopLayout.getState().setDeviceId(device.id)

      // Pull customizations (shared across devices)
      const { data: custRows, error: custError } = await supabase
        .from('desktop_customizations')
        .select('item_key, name, color, icon_key')
        .eq('user_id', user.id)

      if (custError) {
        console.warn('[DesktopPersistence] Failed to pull customizations:', custError.message)
      }

      if (custRows && custRows.length > 0) {
        const store = useDesktopCustomization.getState()
        for (const row of custRows) {
          const override: Record<string, string> = {}
          if (row.name) override.name = row.name
          if (row.color) override.color = row.color
          if (row.icon_key) override.iconKey = row.icon_key
          if (Object.keys(override).length > 0) {
            store.setOverride(row.item_key, override)
          }
        }
      }

      setTimeout(() => {
        suppressSyncRef.current = false
      }, 500)
    }

    pull().catch((err) => {
      console.warn('[DesktopPersistence] Pull failed:', err)
      suppressSyncRef.current = false
    })
  }, [device, user?.id])

  // --- Sync positions to DB ---
  const syncPositions = useCallback(async () => {
    if (suppressSyncRef.current || !device || !user?.id) return

    const { positions } = useDesktopLayout.getState()
    if (positions.length === 0) return

    const rows = positions.map((p) => ({
      user_id: user.id,
      device_id: device.id,
      item_key: p.key,
      col: p.col,
      row: p.row,
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('desktop_positions')
      .upsert(rows, { onConflict: 'user_id,device_id,item_key' })

    if (error) {
      console.warn('[DesktopPersistence] Position sync failed:', error.message)
    }
  }, [device, user?.id])

  // --- Sync customizations to DB ---
  const syncCustomizations = useCallback(async () => {
    if (suppressSyncRef.current || !user?.id) return

    const { overrides } = useDesktopCustomization.getState()
    const keys = Object.keys(overrides)

    if (keys.length === 0) return

    const rows = keys.map((key) => ({
      user_id: user.id,
      item_key: key,
      name: overrides[key].name ?? null,
      color: overrides[key].color ?? null,
      icon_key: overrides[key].iconKey ?? null,
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('desktop_customizations')
      .upsert(rows, { onConflict: 'user_id,item_key' })

    if (error) {
      console.warn('[DesktopPersistence] Customization sync failed:', error.message)
    }
  }, [user?.id])

  // --- Debounced sync on store changes ---
  const debouncedSync = useCallback(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    syncTimerRef.current = setTimeout(() => {
      syncPositions().catch((err) =>
        console.warn('[DesktopPersistence] Sync error:', err),
      )
      syncCustomizations().catch((err) =>
        console.warn('[DesktopPersistence] Sync error:', err),
      )
    }, 2000)
  }, [syncPositions, syncCustomizations])

  useEffect(() => {
    const unsubLayout = useDesktopLayout.subscribe(debouncedSync)
    const unsubCustom = useDesktopCustomization.subscribe(debouncedSync)

    return () => {
      unsubLayout()
      unsubCustom()
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    }
  }, [debouncedSync])

  // --- beforeunload: flush sync ---
  useEffect(() => {
    if (!device || !user?.id) return

    const handleUnload = () => {
      const { positions } = useDesktopLayout.getState()
      if (positions.length === 0) return

      const rows = positions.map((p) => ({
        user_id: user.id,
        device_id: device.id,
        item_key: p.key,
        col: p.col,
        row: p.row,
        updated_at: new Date().toISOString(),
      }))

      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/desktop_positions`
      const headers = {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      }

      try {
        fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(rows),
          keepalive: true,
        })
      } catch {
        // Best effort
      }
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [device, user?.id])
}
