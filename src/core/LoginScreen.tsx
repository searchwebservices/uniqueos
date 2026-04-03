export function LoginScreen() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        background: 'linear-gradient(145deg, #2a5a6a 0%, #1a7a9a 40%, #3d8b9e 70%, #5ea3b4 100%)',
      }}
    >
      <div className="w-full max-w-sm px-6 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-2xl bg-white/12 backdrop-blur-md flex items-center justify-center mb-4 shadow-lg border border-white/15">
            <img
              src="/ucw-logo.png"
              alt="UCW"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            UniqueOS
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Unique Cabo Weddings
          </p>
        </div>

        {/* Click to enter */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-lg">
            <span className="text-lg font-medium text-white">LP</span>
          </div>
          <p className="text-sm text-white/80 font-medium">Luba Ponce</p>
          <p className="text-xs text-white/35 mt-4 animate-pulse">
            Click anywhere to enter
          </p>
        </div>
      </div>
    </div>
  )
}
