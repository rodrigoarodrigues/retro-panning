import { useState } from 'react'
import { useSearch } from '@/hooks/useSearch'
import { DEFAULT_MODEL } from '@/types/deal'

import Header from '@/components/Header'
import AppFooter from '@/components/AppFooter'
import SearchBar from '@/components/SearchBar'
import ModelSelector from '@/components/ModelSelector'
import ErrorBanner from '@/components/ErrorBanner'
import LoadingScreen from '@/components/LoadingScreen'
import ResultsHeader from '@/components/ResultsHeader'
import DealGrid from '@/components/DealGrid'
import EmptyState from '@/components/EmptyState'
import WelcomeState from '@/components/WelcomeState'

export default function App() {
  const { deals, isLoading, error, search, query } = useSearch()
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)

  return (
    <div className="min-h-screen scanline-overlay" style={{ backgroundColor: '#1A0A00' }}>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <SearchBar onSearch={(q) => search(q, selectedModel)} isLoading={isLoading} />
        <ModelSelector selected={selectedModel} onChange={setSelectedModel} disabled={isLoading} />

        {error && <ErrorBanner message={error} />}

        {isLoading && <LoadingScreen />}

        {!isLoading && deals.length > 0 && <ResultsHeader deals={deals} query={query} />}
        {!isLoading && deals.length > 0 && <DealGrid deals={deals} />}

        {!isLoading && deals.length === 0 && query && <EmptyState />}
        {!isLoading && !query && <WelcomeState />}
      </main>

      <AppFooter />
    </div>
  )
}
