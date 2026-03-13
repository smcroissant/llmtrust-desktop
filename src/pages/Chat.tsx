import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'

// ─── Types ────────────────────────────────────────────────────────────
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  model: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface LocalModel {
  id: string
  name: string
  parameters: string
}

// ─── Mock Models ──────────────────────────────────────────────────────
const localModels: LocalModel[] = [
  { id: 'llama-3.2-3b', name: 'Llama 3.2 3B', parameters: '3B' },
  { id: 'mistral-7b-v0.3', name: 'Mistral 7B v0.3', parameters: '7B' },
  { id: 'phi-3-mini', name: 'Phi-3 Mini 4K', parameters: '3.8B' },
]

// ─── Simulated AI responses ───────────────────────────────────────────
const aiResponses: string[] = [
  `That's a great question! Let me break this down for you.\n\n## Overview\n\nThe concept you're asking about involves several key components:\n\n1. **First principle** — Understanding the fundamentals\n2. **Second principle** — Applying the concepts\n3. **Third principle** — Iterating and improving\n\n\`\`\`python\ndef example():\n    return "Hello from local AI!"\n\`\`\`\n\nLet me know if you'd like me to elaborate on any of these points!`,
  `I understand what you're looking for. Here's my analysis:\n\n### Key Points\n\n- **Performance** is critical for local inference\n- **Privacy** is maintained since everything runs locally\n- **Flexibility** allows you to choose the right model for your task\n\n> "The best model is the one that fits your use case." — Anonymous AI\n\nWould you like me to dive deeper into any specific area?`,
  `Absolutely! Here's a comprehensive answer:\n\n#### Technical Details\n\n| Feature | Description |\n|---------|-------------|\n| Local Inference | Runs entirely on your machine |\n| No Cloud | Your data never leaves your device |\n| Fast | Optimized for consumer hardware |\n\nThe architecture leverages **quantized models** to run efficiently on standard hardware. This means you get:\n\n- Near-instant responses\n- Full privacy\n- No subscription fees\n\n*Pretty cool, right?* 🚀`,
  `Here's what I found:\n\n### Summary\n\nThis is a simulated response from the local model. In a real implementation, this would be connected to an actual LLM inference engine.\n\n**Current capabilities:**\n- Natural language understanding\n- Code generation\n- Analysis and reasoning\n- Creative writing\n\nThe \`streaming\` feature makes responses feel natural and immediate.\n\n---\n\nFeel free to ask follow-up questions!`,
]

// ─── Helpers ──────────────────────────────────────────────────────────
let msgIdCounter = 0
let convIdCounter = 0

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${++msgIdCounter}`
const generateConvId = () => `conv-${Date.now()}-${++convIdCounter}`

const formatTime = (date: Date) =>
  date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 86400000 && now.getDate() === date.getDate()) return "Aujourd'hui"
  if (diff < 172800000) return 'Hier'
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

// ─── Loading Animation ────────────────────────────────────────────────
function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-violet-400"
          style={{
            animation: `bounce-dot 1.4s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// ─── Copy Button ──────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-gray-300 cursor-pointer"
      title={copied ? 'Copied!' : 'Copy message'}
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}

// ─── Message Bubble ───────────────────────────────────────────────────
function MessageBubble({ message, isStreaming }: { message: Message; isStreaming?: boolean }) {
  const isUser = message.role === 'user'

  return (
    <div className={`group flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
          isUser
            ? 'bg-gradient-to-br from-violet-600/30 to-violet-800/20 border border-violet-500/30'
            : 'bg-gradient-to-br from-surface-lighter to-surface border border-border-glow/50'
        }`}
      >
        {isUser ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-violet-600/25 border border-violet-500/30 rounded-tr-md'
              : 'bg-surface-light/90 border border-border-glow/40 rounded-tl-md'
          }`}
        >
          {isUser ? (
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {isStreaming && <LoadingDots />}
            </div>
          )}

          {/* Copy button */}
          <div className={`absolute top-2 ${isUser ? 'left-2' : 'right-2'}`}>
            <CopyButton text={message.content} />
          </div>
        </div>

        {/* Timestamp */}
        <p className={`text-[10px] text-gray-600 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}

// ─── Conversation Sidebar ─────────────────────────────────────────────
function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  collapsed,
  onToggle,
}: {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  collapsed: boolean
  onToggle: () => void
}) {
  // Group by date
  const grouped = conversations.reduce<Record<string, Conversation[]>>((acc, conv) => {
    const key = formatDate(conv.updatedAt)
    if (!acc[key]) acc[key] = []
    acc[key].push(conv)
    return acc
  }, {})

  if (collapsed) {
    return (
      <div className="w-12 border-r border-border-glow bg-surface-light/30 flex flex-col items-center py-4 gap-2">
        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all cursor-pointer"
          title="Expand history"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
        <button
          onClick={onNew}
          className="p-2 rounded-xl text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
          title="New conversation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="w-64 border-r border-border-glow bg-surface-light/30 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border-glow/30">
        <h3 className="text-white font-semibold text-sm">Conversations</h3>
        <div className="flex gap-1">
          <button
            onClick={onNew}
            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
            title="New conversation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-surface-lighter transition-all cursor-pointer"
            title="Collapse"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-auto py-2">
        {conversations.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-gray-600 text-xs">No conversations yet</p>
            <p className="text-gray-700 text-[10px] mt-1">Click + to start</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, convs]) => (
            <div key={date} className="mb-3">
              <p className="px-4 py-1 text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {date}
              </p>
              {convs.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={`group relative mx-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 mb-0.5 ${
                    activeId === conv.id
                      ? 'bg-violet-600/15 border border-violet-500/25'
                      : 'hover:bg-surface-lighter/50 border border-transparent'
                  }`}
                >
                  <p className={`text-sm truncate pr-6 ${
                    activeId === conv.id ? 'text-violet-300' : 'text-gray-300'
                  }`}>
                    {conv.title}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{conv.model} · {conv.messages.length} msgs</p>

                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(conv.id) }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Model Selector ───────────────────────────────────────────────────
function ModelSelector({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = localModels.find(m => m.id === selected)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-lighter/60 border border-border-glow/40 hover:border-violet-500/40 text-sm transition-all cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-violet-500/60" />
        <span className="text-gray-300">{current?.name || 'Select model'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-surface-light border border-border-glow/50 shadow-xl shadow-black/40 z-50 overflow-hidden">
          <div className="p-1.5">
            <p className="px-3 py-1.5 text-[10px] text-gray-600 uppercase tracking-widest font-medium">Local Models</p>
            {localModels.map(model => (
              <button
                key={model.id}
                onClick={() => { onSelect(model.id); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all cursor-pointer ${
                  selected === model.id
                    ? 'bg-violet-600/20 text-violet-300'
                    : 'text-gray-400 hover:bg-surface-lighter hover:text-gray-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${selected === model.id ? 'bg-violet-400' : 'bg-gray-600'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{model.name}</p>
                  <p className="text-[10px] text-gray-600">{model.parameters} parameters</p>
                </div>
                {selected === model.id && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400 shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Chat Page ───────────────────────────────────────────────────
export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState(localModels[0]?.id || '')
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const responseIndexRef = useRef(0)

  const activeConversation = conversations.find(c => c.id === activeConvId)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages, isStreaming])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  const createNewConversation = useCallback(() => {
    const modelName = localModels.find(m => m.id === selectedModel)?.name || 'Unknown'
    const newConv: Conversation = {
      id: generateConvId(),
      title: 'New Chat',
      model: modelName,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setConversations(prev => [newConv, ...prev])
    setActiveConvId(newConv.id)
  }, [selectedModel])

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeConvId === id) {
      setActiveConvId(null)
    }
  }, [activeConvId])

  // Simulated streaming
  const simulateStreaming = useCallback((convId: string, fullResponse: string) => {
    setIsStreaming(true)
    const words = fullResponse.split(/(\s+)/) // keep spaces
    let currentIndex = 0

    // Add empty assistant message
    const assistantMsgId = generateId('msg')
    setConversations(prev => prev.map(c =>
      c.id === convId
        ? {
            ...c,
            messages: [...c.messages, {
              id: assistantMsgId,
              role: 'assistant' as const,
              content: '',
              timestamp: new Date(),
            }],
            updatedAt: new Date(),
          }
        : c
    ))

    const interval = setInterval(() => {
      if (currentIndex >= words.length) {
        clearInterval(interval)
        setIsStreaming(false)
        return
      }

      const chunk = words.slice(currentIndex, currentIndex + 3).join('')
      currentIndex += 3

      setConversations(prev => prev.map(c =>
        c.id === convId
          ? {
              ...c,
              messages: c.messages.map(m =>
                m.id === assistantMsgId
                  ? { ...m, content: m.content + chunk }
                  : m
              ),
            }
          : c
      ))
    }, 30)
  }, [])

  const handleSend = useCallback(() => {
    if (!input.trim() || isStreaming) return

    let convId = activeConvId

    // Create conversation if none active
    if (!convId) {
      const modelName = localModels.find(m => m.id === selectedModel)?.name || 'Unknown'
      const newConv: Conversation = {
        id: generateConvId(),
        title: input.trim().slice(0, 40) + (input.length > 40 ? '...' : ''),
        model: modelName,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setConversations(prev => [newConv, ...prev])
      setActiveConvId(newConv.id)
      convId = newConv.id
    }

    const userMsg: Message = {
      id: generateId('msg'),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    // Update conversation title if first message
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c
      const isFirstMsg = c.messages.length === 0
      return {
        ...c,
        title: isFirstMsg ? input.trim().slice(0, 40) + (input.length > 40 ? '...' : '') : c.title,
        messages: [...c.messages, userMsg],
        updatedAt: new Date(),
      }
    }))

    setInput('')

    // Simulate AI response after a short delay
    setTimeout(() => {
      const response = aiResponses[responseIndexRef.current % aiResponses.length]
      responseIndexRef.current++
      simulateStreaming(convId!, response)
    }, 500)
  }, [input, isStreaming, activeConvId, selectedModel, simulateStreaming])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  return (
    <div className="flex h-full overflow-hidden">
      {/* Conversation sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeId={activeConvId}
        onSelect={setActiveConvId}
        onNew={createNewConversation}
        onDelete={deleteConversation}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="px-6 py-3 border-b border-border-glow bg-surface-light/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">
                {activeConversation?.title || 'New Conversation'}
              </h2>
              <p className="text-gray-500 text-xs">
                {activeConversation ? `${activeConversation.messages.length} messages` : 'Select or create a conversation'}
              </p>
            </div>
          </div>

          {/* Model selector */}
          <ModelSelector selected={selectedModel} onSelect={setSelectedModel} />
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-full">
              {/* Background glows */}
              <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-amber-500/4 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/15 to-violet-800/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4 glow-violet animate-pulse-glow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">
                  {localModels.find(m => m.id === selectedModel)?.name || 'Start chatting'}
                </h3>
                <p className="text-gray-500 text-sm max-w-sm">
                  Type a message below to begin a conversation. Your data stays local and private.
                </p>

                {/* Quick prompts */}
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  {[
                    'Explain quantum computing',
                    'Write a Python function',
                    'Summarize this concept',
                    'Help me debug code',
                  ].map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => setInput(prompt)}
                      className="px-3 py-1.5 rounded-xl bg-surface-light/80 border border-border-glow/30 text-gray-400 text-xs hover:text-violet-300 hover:border-violet-500/30 transition-all cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Messages
            <div className="max-w-3xl mx-auto space-y-4">
              {activeConversation.messages.map((msg, idx) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isStreaming={isStreaming && idx === activeConversation.messages.length - 1 && msg.role === 'assistant'}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="px-6 py-4 border-t border-border-glow bg-surface-light/20">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-3 bg-surface-light border border-border-glow/60 rounded-2xl px-4 py-2 focus-within:border-violet-500/40 transition-colors">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${localModels.find(m => m.id === selectedModel)?.name || 'LLM Trust'}...`}
                rows={1}
                disabled={isStreaming}
                className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 focus:outline-none resize-none py-1.5 max-h-[120px] disabled:opacity-50"
              />

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                  input.trim() && !isStreaming
                    ? 'bg-violet-600 hover:bg-violet-500 text-white glow-violet'
                    : 'bg-surface-lighter text-gray-600 cursor-not-allowed'
                }`}
              >
                {isStreaming ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m22 2-7 20-4-9-9-4z" />
                    <path d="m22 2-10 10" />
                  </svg>
                )}
              </button>
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-[10px] text-gray-600">
                Press <kbd className="px-1 py-0.5 rounded bg-surface-lighter text-gray-500 font-mono">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-surface-lighter text-gray-500 font-mono">Shift+Enter</kbd> for new line
              </p>
              <p className="text-[10px] text-gray-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                All data stays local
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
