export default function Home() {
  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Hero Section */}
      <section className="relative px-8 pt-12 pb-10 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-amber-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-80 h-40 bg-violet-800/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto w-full">
          {/* Logo + Brand */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center glow-violet animate-pulse-glow">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-violet-500/20 blur-sm -z-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-violet-300 via-violet-400 to-amber-400 bg-clip-text text-transparent">
                  LLM Trust
                </span>
                <span className="text-gray-500 font-normal ml-2">Desktop</span>
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">Your trusted local AI companion · Private · Fast · Open</p>
            </div>
          </div>

          {/* Neural Glow decorative line */}
          <div className="relative h-px mb-8 max-w-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/50 via-amber-500/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-transparent blur-sm" />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Local Models', value: '0', sub: 'installed', color: 'violet' },
              { label: 'Conversations', value: '0', sub: 'total', color: 'violet' },
              { label: 'Tokens Processed', value: '—', sub: 'this session', color: 'amber' },
              { label: 'Status', value: '●', sub: 'ready', color: 'green' },
            ].map((stat, i) => (
              <div
                key={i}
                className="relative group p-4 rounded-xl bg-surface-light/80 border border-border-glow/50 hover:border-violet-500/40 transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-gray-500 text-[11px] uppercase tracking-widest mb-1.5">{stat.label}</p>
                <p className={`text-2xl font-bold ${
                  stat.color === 'amber' ? 'text-amber-400' :
                  stat.color === 'green' ? 'text-emerald-400' :
                  'text-white'
                }`}>
                  {stat.value}
                </p>
                <p className="text-gray-600 text-xs mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-8 pb-8">
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                title: 'New Chat',
                desc: 'Start a conversation with a local model',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <line x1="9" y1="10" x2="15" y2="10" />
                    <line x1="12" y1="7" x2="12" y2="13" />
                  </svg>
                ),
                bg: 'from-violet-600/15 to-violet-800/5',
                border: 'hover:border-violet-500/50',
                glow: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]',
              },
              {
                title: 'Browse Models',
                desc: 'Discover and download open-source models',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v4" />
                    <path d="m4.93 10.93 1.41 1.41" />
                    <path d="M2 18h2" />
                    <path d="M20 18h2" />
                    <path d="m19.07 10.93-1.41 1.41" />
                    <path d="M22 22H2" />
                    <path d="m8 6 4-4 4 4" />
                    <path d="M16 18a4 4 0 0 0-8 0" />
                  </svg>
                ),
                bg: 'from-amber-600/15 to-amber-800/5',
                border: 'hover:border-amber-500/50',
                glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
              },
              {
                title: 'Settings',
                desc: 'Configure performance and preferences',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ),
                bg: 'from-gray-600/15 to-gray-800/5',
                border: 'hover:border-gray-500/50',
                glow: 'group-hover:shadow-[0_0_30px_rgba(156,163,175,0.1)]',
              },
            ].map((action, i) => (
              <button
                key={i}
                className={`group relative p-5 rounded-2xl bg-gradient-to-br ${action.bg} bg-surface-light border border-border-glow/50 ${action.border} transition-all duration-300 cursor-pointer text-left ${action.glow}`}
              >
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center mb-3 border border-border-glow/30 group-hover:border-white/10 transition-colors">
                  {action.icon}
                </div>
                <h3 className="text-white font-semibold mb-1">{action.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Models */}
      <section className="px-8 pb-10">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Featured Models
            </h2>
            <span className="text-xs text-violet-400/70 hover:text-violet-400 cursor-pointer transition-colors">
              View all →
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Llama 3.1', size: '8B', type: 'General', speed: 'Fast', color: 'violet' },
              { name: 'Mistral', size: '7B', type: 'General', speed: 'Fast', color: 'amber' },
              { name: 'CodeLlama', size: '13B', type: 'Code', speed: 'Medium', color: 'emerald' },
              { name: 'Phi-3', size: '3.8B', type: 'Lightweight', speed: 'Very Fast', color: 'sky' },
            ].map((model, i) => (
              <div
                key={i}
                className="group relative p-4 rounded-xl bg-surface-light/60 border border-border-glow/40 hover:border-violet-500/30 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-violet-500/60" />
                      <h3 className="text-white font-medium text-sm">{model.name}</h3>
                      <span className="text-[10px] text-gray-500 bg-surface px-1.5 py-0.5 rounded-md border border-border-glow/20">
                        {model.size}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">{model.type} · {model.speed}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
                      <path d="m5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer info */}
      <section className="px-8 pb-8 mt-auto">
        <div className="max-w-5xl mx-auto w-full">
          <div className="relative h-px mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border-glow/50 to-transparent" />
          </div>
          <div className="flex items-center justify-between text-gray-600 text-xs">
            <span>LLM Trust Desktop v0.1.0</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                Ollama detected
              </span>
              <span>All data stays local</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
