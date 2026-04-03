export function DiscoveryApp() {
  return (
    <div className="app-container flex flex-col h-full bg-[var(--color-bg-elevated)]">
      <iframe
        src="https://ucw-discovery.netlify.app/"
        className="w-full flex-1 border-0"
        title="UCW Discovery Questionnaire"
        allow="clipboard-write"
      />
    </div>
  )
}
