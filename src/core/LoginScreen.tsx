export function LoginScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a4559 0%, #0f5f7a 30%, #1a7a9a 60%, #3a97b8 100%)' }}>
      <div className="w-full max-w-sm px-6 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 shadow-lg border border-white/15">
            <img src="/ucw-logo-white.png" alt="UCW" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">UniqueOS</h1>
          <p className="text-sm text-white/60 mt-1">Unique Cabo Weddings</p>
        </div>

        {/* Click to enter */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
            <span className="text-lg font-medium text-white">LP</span>
          </div>
          <p className="text-sm text-white/80 font-medium">Luba Ponce</p>
          <p className="text-xs text-white/40 mt-4 animate-pulse">Click anywhere to enter</p>
        </div>
      </div>
    </div>
  )
}
