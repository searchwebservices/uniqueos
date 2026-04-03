export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a4559 0%, #0f5f7a 30%, #1a7a9a 60%, #3a97b8 100%)' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
          <span className="text-xl font-bold text-white">U</span>
        </div>
        <div className="w-5 h-5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )
}
