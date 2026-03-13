export default function Home() {
  return (
    <div className="flex flex-col h-full p-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-glow-violet text-violet-300 mb-2">
            LLM Trust Desktop
          </h1>
          <p className="text-gray-400 text-lg">
            Your trusted local LLM companion
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-surface-light border border-border-glow hover:border-violet-500/50 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center mb-4 group-hover:glow-violet transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">New Chat</h3>
            <p className="text-gray-500 text-sm">Start a conversation with your model</p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-light border border-border-glow hover:border-amber-500/50 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 group-hover:glow-amber transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
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
            <h3 className="text-white font-semibold mb-1">Browse Models</h3>
            <p className="text-gray-500 text-sm">Explore and download local models</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-light border border-border-glow">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Models</p>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-light border border-border-glow">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Conversations</p>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-light border border-border-glow">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Uptime</p>
            <p className="text-2xl font-bold text-violet-400 text-glow-violet">Ready</p>
          </div>
        </div>
      </div>
    </div>
  )
}
