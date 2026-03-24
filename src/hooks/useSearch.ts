import { useState, useCallback } from 'react'
import type { Deal, SearchResponse } from '@/types/deal'

interface UseSearchReturn {
  deals: Deal[]
  isLoading: boolean
  error: string | null
  query: string
  search: (q: string, model?: string) => Promise<void>
}

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export function useSearch(): UseSearchReturn {
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const search = useCallback(async (q: string, model?: string) => {
    if (!q.trim()) return

    setIsLoading(true)
    setError(null)
    setQuery(q)
    setDeals([])

    try {
      const resp = await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, model }),
      })

      const text = await resp.text()

      if (!resp.ok) {
        let message = `HTTP ${resp.status}`
        try {
          const err = JSON.parse(text) as { error: string }
          message = err.error ?? message
        } catch {
          if (text) message = text
        }
        throw new Error(message)
      }

      const data = JSON.parse(text) as SearchResponse
      setDeals(data.deals)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { deals, isLoading, error, query, search }
}
