export default function Chat() {
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="px-6 py-4 border-b border-border-glow bg-surface-light/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-semibold">New Conversation</h2>
            <p className="text-gray-500 text-xs">No model selected</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-light border border-border-glow flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">Select a model to start chatting</p>
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border-glow">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border-glow text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
            />
          </div>
          <button className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center hover:bg-violet-500 transition-colors glow-violet cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <path d="m22 2-7 20-4-9-9-4z" />
              <path d="m22 2-10 10" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
