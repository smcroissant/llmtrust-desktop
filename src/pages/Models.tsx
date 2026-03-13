import { useState, useEffect } from 'react'

// Types
interface Model {
  id: string
  name: string
  author: string
  size: string
  sizeBytes: number
  parameters: string
  quantization: string
  description: string
  downloaded: boolean
  downloadProgress?: number
  downloading?: boolean
}

interface HubModel extends Model {
  downloads: number
  likes: number
}

// Mock data for local (downloaded) models
const mockLocalModels: Model[] = [
  {
    id: 'llama-3.2-3b',
    name: 'Llama 3.2 3B',
    author: 'Meta',
    size: '1.8 GB',
    sizeBytes: 1800000000,
    parameters: '3B',
    quantization: 'Q4_K_M',
    description: 'Lightweight and efficient, great for everyday tasks.',
    downloaded: true,
  },
  {
    id: 'mistral-7b-v0.3',
    name: 'Mistral 7B v0.3',
    author: 'Mistral AI',
    size: '4.1 GB',
    sizeBytes: 4100000000,
    parameters: '7B',
    quantization: 'Q5_K_M',
    description: 'Powerful open-weight model with strong reasoning.',
    downloaded: true,
  },
  {
    id: 'phi-3-mini',
    name: 'Phi-3 Mini 4K',
    author: 'Microsoft',
    size: '2.2 GB',
    sizeBytes: 2200000000,
    parameters: '3.8B',
    quantization: 'Q4_K_M',
    description: 'Compact yet capable, optimized for local deployment.',
    downloaded: true,
  },
]

// Mock data for hub (available to download) models
const mockHubModels: HubModel[] = [
  {
    id: 'llama-3.1-8b',
    name: 'Llama 3.1 8B',
    author: 'Meta',
    size: '4.7 GB',
    sizeBytes: 4700000000,
    parameters: '8B',
    quantization: 'Q4_K_M',
    description: 'Latest Llama with improved reasoning and multilingual support.',
    downloaded: false,
    downloads: 125000,
    likes: 8400,
  },
  {
    id: 'gemma-2-9b',
    name: 'Gemma 2 9B',
    author: 'Google',
    size: '5.4 GB',
    sizeBytes: 5400000000,
    parameters: '9B',
    quantization: 'Q4_K_M',
    description: 'Google\'s efficient open model with strong performance.',
    downloaded: false,
    downloads: 89000,
    likes: 5200,
  },
  {
    id: 'qwen-2.5-7b',
    name: 'Qwen 2.5 7B',
    author: 'Alibaba',
    size: '4.2 GB',
    sizeBytes: 4200000000,
    parameters: '7B',
    quantization: 'Q4_K_M',
    description: 'Strong multilingual model excelling in code and math.',
    downloaded: false,
    downloads: 67000,
    likes: 4100,
  },
  {
    id: 'codellama-13b',
    name: 'CodeLlama 13B',
    author: 'Meta',
    size: '7.3 GB',
    sizeBytes: 7300000000,
    parameters: '13B',
    quantization: 'Q4_K_M',
    description: 'Specialized for code generation and understanding.',
    downloaded: false,
    downloads: 54000,
    likes: 3800,
  },
  {
    id: 'deepseek-coder-v2',
    name: 'DeepSeek Coder V2',
    author: 'DeepSeek',
    size: '8.9 GB',
    sizeBytes: 8900000000,
    parameters: '16B',
    quantization: 'Q4_K_M',
    description: 'State-of-the-art coding assistant with MoE architecture.',
    downloaded: false,
    downloads: 42000,
    likes: 3200,
  },
]

// Tab type
type Tab = 'installed' | 'hub'
type SortBy = 'name' | 'size' | 'date'
type FilterSize = 'all' | 'small' | 'medium' | 'large'

export default function Models() {
  const [tab, setTab] = useState<Tab>('installed')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('name')
  const [filterSize, setFilterSize] = useState<FilterSize>('all')
  const [localModels, setLocalModels] = useState<Model[]>(mockLocalModels)
  const [hubModels, setHubModels] = useState<HubModel[]>(mockHubModels)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Simulate download progress
  useEffect(() => {
    const interval = setInterval(() => {
      setHubModels(prev => prev.map(m => {
        if (m.downloading && m.downloadProgress !== undefined && m.downloadProgress < 100) {
          const increment = Math.random() * 8 + 2
          const newProgress = Math.min(m.downloadProgress + increment, 100)
          if (newProgress >= 100) {
            // Move to local models
            setLocalModels(local => [...local, { ...m, downloaded: true, downloading: false, downloadProgress: 100 }])
            return { ...m, downloaded: true, downloading: false, downloadProgress: 100 }
          }
          return { ...m, downloadProgress: newProgress }
        }
        return m
      }))
    }, 300)
    return () => clearInterval(interval)
  }, [])

  // Filter and sort logic
  const filterAndSort = <T extends Model>(models: T[]): T[] => {
    let filtered = models

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.author.toLowerCase().includes(q) ||
        m.parameters.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      )
    }

    // Size filter
    if (filterSize !== 'all') {
      filtered = filtered.filter(m => {
        if (filterSize === 'small') return m.sizeBytes < 3_000_000_000
        if (filterSize === 'medium') return m.sizeBytes >= 3_000_000_000 && m.sizeBytes < 6_000_000_000
        if (filterSize === 'large') return m.sizeBytes >= 6_000_000_000
        return true
      })
    }

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'size') return b.sizeBytes - a.sizeBytes
      return 0
    })
  }

  const displayedLocal = filterAndSort(localModels)
  const displayedHub = filterAndSort(hubModels.filter(m => !m.downloaded))

  const handleDownload = (id: string) => {
    setHubModels(prev => prev.map(m =>
      m.id === id ? { ...m, downloading: true, downloadProgress: 0 } : m
    ))
  }

  const handleCancelDownload = (id: string) => {
    setHubModels(prev => prev.map(m =>
      m.id === id ? { ...m, downloading: false, downloadProgress: undefined } : m
    ))
  }

  const handleDelete = (id: string) => {
    setLocalModels(prev => prev.filter(m => m.id !== id))
    setHubModels(prev => prev.map(m => m.id === id ? { ...m, downloaded: false } : m))
    setDeleteConfirm(null)
  }

  const totalSize = localModels.reduce((acc, m) => acc + m.sizeBytes, 0)
  const formatTotalSize = (bytes: number) => {
    if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`
    return `${(bytes / 1_000_000).toFixed(0)} MB`
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header Section with Glow */}
      <section className="relative px-8 pt-10 pb-6 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/6 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto w-full">
          {/* Title row */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-amber-500/10 border border-violet-500/30 flex items-center justify-center glow-violet">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
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
              <div>
                <h1 className="text-3xl font-bold text-white">Models</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  {localModels.length} installed · {formatTotalSize(totalSize)} total
                </p>
              </div>
            </div>

            {/* Stats pills */}
            <div className="flex gap-3">
              <div className="px-4 py-2 rounded-xl bg-surface-light border border-border-glow/50 text-center">
                <p className="text-xl font-bold text-white">{localModels.length}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Local</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-surface-light border border-border-glow/50 text-center">
                <p className="text-xl font-bold text-amber-400">{hubModels.filter(m => !m.downloaded).length}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Available</p>
              </div>
            </div>
          </div>

          {/* Decorative line */}
          <div className="relative h-px mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/40 via-amber-500/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/15 to-transparent blur-sm" />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setTab('installed')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                tab === 'installed'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 glow-violet'
                  : 'text-gray-500 hover:text-gray-300 border border-transparent hover:bg-surface-lighter'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Installed
              </span>
            </button>
            <button
              onClick={() => setTab('hub')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                tab === 'hub'
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                  : 'text-gray-500 hover:text-gray-300 border border-transparent hover:bg-surface-lighter'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Model Hub
              </span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search models by name, author, or parameter size..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-light border border-border-glow/60 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Size filter */}
            <select
              value={filterSize}
              onChange={e => setFilterSize(e.target.value as FilterSize)}
              className="px-3 py-2.5 rounded-xl bg-surface-light border border-border-glow/60 text-gray-300 text-sm focus:outline-none focus:border-violet-500/50 cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: '30px' }}
            >
              <option value="all">All sizes</option>
              <option value="small">Small (&lt;3B)</option>
              <option value="medium">Medium (3-6B)</option>
              <option value="large">Large (&gt;6B)</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2.5 rounded-xl bg-surface-light border border-border-glow/60 text-gray-300 text-sm focus:outline-none focus:border-violet-500/50 cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: '30px' }}
            >
              <option value="name">Sort: Name</option>
              <option value="size">Sort: Size</option>
            </select>
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="px-8 pb-10 flex-1">
        <div className="max-w-5xl mx-auto w-full">
          {/* Installed Models */}
          {tab === 'installed' && (
            <>
              {displayedLocal.length === 0 ? (
                <EmptyState
                  icon="download"
                  title={searchQuery ? 'No matching models' : 'No models installed'}
                  description={searchQuery ? 'Try adjusting your search or filters.' : 'Download your first model from the Hub to get started with local inference.'}
                  action={!searchQuery ? { label: 'Browse Model Hub', onClick: () => setTab('hub') } : undefined}
                />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {displayedLocal.map(model => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      onDelete={() => setDeleteConfirm(model.id)}
                      deleteConfirm={deleteConfirm === model.id}
                      onConfirmDelete={() => handleDelete(model.id)}
                      onCancelDelete={() => setDeleteConfirm(null)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Hub Models */}
          {tab === 'hub' && (
            <>
              {displayedHub.length === 0 ? (
                <EmptyState
                  icon="search"
                  title="No models found"
                  description="Try adjusting your search or filters to discover more models."
                />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {displayedHub.map(model => (
                    <HubModelCard
                      key={model.id}
                      model={model}
                      onDownload={() => handleDownload(model.id)}
                      onCancel={() => handleCancelDownload(model.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

// Empty State Component
function EmptyState({ icon, title, description, action }: {
  icon: 'download' | 'search'
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6">
        {icon === 'download' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        )}
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-colors glow-violet cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// Local Model Card
function ModelCard({ model, onDelete, deleteConfirm, onConfirmDelete, onCancelDelete }: {
  model: Model
  onDelete: () => void
  deleteConfirm: boolean
  onConfirmDelete: () => void
  onCancelDelete: () => void
}) {
  return (
    <div className="group relative rounded-2xl bg-surface-light/80 border border-border-glow/40 hover:border-violet-500/40 transition-all duration-300 overflow-hidden">
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative p-5 flex items-start gap-5">
        {/* Model icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-violet-800/10 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:border-violet-500/40 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        {/* Model info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold truncate">{model.name}</h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-medium uppercase tracking-wider border border-emerald-500/20">
                  Local
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-2">{model.author} · {model.description}</p>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-surface-lighter text-gray-400 text-xs border border-border-glow/30">
                  {model.parameters} params
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-lighter text-gray-400 text-xs border border-border-glow/30">
                  {model.quantization}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-lighter text-gray-400 text-xs border border-border-glow/30">
                  {model.size}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors glow-violet cursor-pointer">
                Use
              </button>

              {deleteConfirm ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={onConfirmDelete}
                    className="px-3 py-2 rounded-xl bg-red-600/20 text-red-400 text-sm font-medium hover:bg-red-600/30 border border-red-500/30 transition-colors cursor-pointer"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={onCancelDelete}
                    className="px-3 py-2 rounded-xl bg-surface-lighter text-gray-400 text-sm hover:text-gray-300 border border-border-glow/30 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={onDelete}
                  className="p-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                  title="Delete model"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hub Model Card
function HubModelCard({ model, onDownload, onCancel }: {
  model: HubModel
  onDownload: () => void
  onCancel: () => void
}) {
  const isDownloading = model.downloading && model.downloadProgress !== undefined && model.downloadProgress < 100
  const isComplete = model.downloadProgress !== undefined && model.downloadProgress >= 100

  return (
    <div className="group relative rounded-2xl bg-surface-light/80 border border-border-glow/40 hover:border-amber-500/30 transition-all duration-300 overflow-hidden">
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Download progress bar at top */}
      {isDownloading && (
        <div className="relative h-1 bg-surface-lighter">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-amber-500 transition-all duration-300 ease-out"
            style={{ width: `${model.downloadProgress}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-amber-500/30 blur-sm" />
        </div>
      )}

      <div className="relative p-5 flex items-start gap-5">
        {/* Model icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600/20 to-amber-800/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:border-amber-500/40 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>

        {/* Model info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold truncate">{model.name}</h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-medium uppercase tracking-wider border border-amber-500/20">
                  Hub
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-2">{model.author} · {model.description}</p>

              {/* Tags & stats */}
              <div className="flex gap-2 flex-wrap items-center">
                <span className="px-2.5 py-1 rounded-lg bg-surface-lighter text-gray-400 text-xs border border-border-glow/30">
                  {model.parameters} params
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-lighter text-gray-400 text-xs border border-border-glow/30">
                  {model.quantization}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-lighter text-gray-400 text-xs border border-border-glow/30">
                  {model.size}
                </span>
                <span className="text-gray-600 text-xs ml-1">
                  ↓ {model.downloads >= 1000 ? `${(model.downloads / 1000).toFixed(0)}k` : model.downloads}
                </span>
                <span className="text-gray-600 text-xs">
                  ♥ {model.likes >= 1000 ? `${(model.likes / 1000).toFixed(1)}k` : model.likes}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {isDownloading ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-violet-400 text-sm font-semibold">{Math.round(model.downloadProgress!)}%</p>
                    <p className="text-gray-600 text-[10px]">downloading</p>
                  </div>
                  <button
                    onClick={onCancel}
                    className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                    title="Cancel download"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : isComplete ? (
                <span className="px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 text-sm font-medium border border-emerald-500/20">
                  ✓ Downloaded
                </span>
              ) : (
                <button
                  onClick={onDownload}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </button>
              )}
            </div>
          </div>

          {/* Download progress details */}
          {isDownloading && (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-surface-lighter overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-amber-500 transition-all duration-300 ease-out"
                  style={{ width: `${model.downloadProgress}%` }}
                />
              </div>
              <span className="text-gray-500 text-xs shrink-0">{model.size}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
