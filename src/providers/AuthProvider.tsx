import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextValue {
  user: { id: string; email: string }
  profile: { display_name: string; avatar_url: string | null; role?: string }
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

const DEMO_USER = {
  id: 'demo-user-001',
  email: 'luba@uniquecaboweddings.com',
}

const DEMO_PROFILE = {
  display_name: 'Luba Ponce',
  avatar_url: null,
  role: 'admin',
}

interface AuthProviderProps {
  children: ReactNode
  loginScreen: ReactNode
  loadingScreen: ReactNode
}

export function AuthProvider({ children, loginScreen }: AuthProviderProps) {
  const [loggedIn, setLoggedIn] = useState(false)

  const signOut = async () => {
    setLoggedIn(false)
  }

  if (!loggedIn) {
    return (
      <AuthContext.Provider value={{ user: DEMO_USER, profile: DEMO_PROFILE, signOut }}>
        <div onClick={() => setLoggedIn(true)} className="cursor-pointer">
          {loginScreen}
        </div>
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ user: DEMO_USER, profile: DEMO_PROFILE, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
