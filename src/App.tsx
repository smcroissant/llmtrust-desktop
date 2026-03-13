import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Models from './pages/Models'
import Chat from './pages/Chat'
import Settings from './pages/Settings'

export type Page = 'home' | 'models' | 'chat' | 'settings'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />
      case 'models':
        return <Models />
      case 'chat':
        return <Chat />
      case 'settings':
        return <Settings />
      default:
        return <Home />
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
