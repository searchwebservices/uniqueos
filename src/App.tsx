import { AuthProvider } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { SyncProvider } from '@/providers/SyncProvider'
import { Desktop } from '@/core/Desktop'
import { LoginScreen } from '@/core/LoginScreen'
import { LoadingScreen } from '@/core/LoadingScreen'

export default function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider
          loginScreen={<LoginScreen />}
          loadingScreen={<LoadingScreen />}
        >
          <SyncProvider>
            <Desktop />
          </SyncProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
