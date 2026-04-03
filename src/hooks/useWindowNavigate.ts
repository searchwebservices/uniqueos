import { useNavigate } from 'react-router-dom'

/**
 * Convenience wrapper around react-router's useNavigate.
 * Named distinctly so developers never confuse it with browser-level navigation.
 * This navigates within the current window's MemoryRouter only.
 */
export function useWindowNavigate() {
  return useNavigate()
}
