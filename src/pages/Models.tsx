export default function Models() {
  return (
    <div className="flex flex-col h-full p-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Models</h1>
          <p className="text-gray-400">Manage your local LLM models</p>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search models..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-light border border-border-glow text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
              <path d="M12 2v8" />
              <path d="m4.93 10.93 1.41 1.41" />
              <path d="M2 18h2" />
              <path d="M20 18h2" />
              <path d="m19.07 10.93-1.41 1.41" />
              <path d="M22 22H2" />
              <path d="m8 6 4-4 4 4" />
              <path d="M16 18a4 4 0 0 0-8 0" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No models installed</h3>
          <p className="text-gray-500 max-w-sm mb-6">
            Download your first model to get started with local inference.
          </p>
          <button className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-colors glow-violet cursor-pointer">
            Browse Model Hub
          </button>
        </div>
      </div>
    </div>
  )
}
