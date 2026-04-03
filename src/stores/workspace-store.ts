import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Workspace } from '@/types/os'

interface WorkspaceStore {
  workspaces: Workspace[]
  activeWorkspaceId: string

  setActive: (id: string) => void
  addWorkspace: (name: string) => void
  removeWorkspace: (id: string) => void
  renameWorkspace: (id: string, name: string) => void
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      workspaces: [{ id: 'default', name: 'Desktop 1', order: 0 }],
      activeWorkspaceId: 'default',

      setActive: (id) => set({ activeWorkspaceId: id }),

      addWorkspace: (name) => set(state => {
        const id = `ws-${Date.now()}`
        return {
          workspaces: [
            ...state.workspaces,
            { id, name, order: state.workspaces.length },
          ],
        }
      }),

      removeWorkspace: (id) => set(state => {
        if (state.workspaces.length <= 1) return state
        const workspaces = state.workspaces.filter(w => w.id !== id)
        const activeWorkspaceId = state.activeWorkspaceId === id
          ? workspaces[0].id
          : state.activeWorkspaceId
        return { workspaces, activeWorkspaceId }
      }),

      renameWorkspace: (id, name) => set(state => ({
        workspaces: state.workspaces.map(w =>
          w.id === id ? { ...w, name } : w
        ),
      })),
    }),
    { name: 'tabletop-workspaces' }
  )
)
