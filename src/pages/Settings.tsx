export default function Settings() {
  return (
    <div className="flex flex-col h-full p-8">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Configure LLM Trust Desktop</p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {/* General */}
          <section className="p-6 rounded-2xl bg-surface-light border border-border-glow">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              General
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Theme</p>
                  <p className="text-gray-500 text-xs">Neural Glow (dark)</p>
                </div>
                <div className="w-10 h-6 rounded-full bg-violet-600 flex items-center px-1 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-white translate-x-4" />
                </div>
              </div>
            </div>
          </section>

          {/* Model Settings */}
          <section className="p-6 rounded-2xl bg-surface-light border border-border-glow">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                <path d="M12 2v8" />
                <path d="m4.93 10.93 1.41 1.41" />
                <path d="M2 18h2" />
                <path d="M20 18h2" />
                <path d="m19.07 10.93-1.41 1.41" />
                <path d="M22 22H2" />
                <path d="m8 6 4-4 4 4" />
                <path d="M16 18a4 4 0 0 0-8 0" />
              </svg>
              Model Defaults
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1.5">Default Model</label>
                <div className="px-4 py-2.5 rounded-xl bg-surface border border-border-glow text-gray-500 text-sm">
                  No model selected
                </div>
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-1.5">Context Length</label>
                <div className="px-4 py-2.5 rounded-xl bg-surface border border-border-glow text-gray-500 text-sm">
                  Auto
                </div>
              </div>
            </div>
          </section>

          {/* About */}
          <section className="p-6 rounded-2xl bg-surface-light border border-border-glow">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              About
            </h2>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">LLM Trust Desktop v0.1.0</p>
              <p className="text-gray-500 text-xs">Built with Electron + Vite + React</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
