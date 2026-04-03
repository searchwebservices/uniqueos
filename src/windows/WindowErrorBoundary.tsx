import { Component, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw, X } from 'lucide-react'
import { useWindowStore } from '@/stores/window-store'

interface Props {
  windowId: string
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class WindowErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 gap-4 text-center">
          <AlertTriangle size={32} className="text-[var(--color-warning)]" />
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              This app crashed
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1 max-w-xs">
              {this.state.error?.message}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] border border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <RotateCcw size={12} />
              Reload
            </button>
            <button
              onClick={() => useWindowStore.getState().closeWindow(this.props.windowId)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] border border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <X size={12} />
              Close
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
