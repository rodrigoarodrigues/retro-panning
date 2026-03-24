import type { Deal } from '@/types/deal'

interface ResultsHeaderProps {
  deals: Deal[]
  query: string
}

export default function ResultsHeader({ deals, query }: ResultsHeaderProps) {
  const safe = deals.filter(d => !d.isScam).length
  const scam = deals.filter(d => d.isScam).length

  return (
    <div
      className="mt-8 mb-4 text-center text-xs"
      style={{ color: '#CC9966' }}
    >
      &gt; {safe} OFERTAS EM POTENCIAL
      {scam > 0 && (
        <span style={{ color: '#FF4500' }}> · {scam} SUSPEITAS</span>
      )}
      {' '}ENCONTRADAS PARA &quot;{query.toUpperCase()}&quot;
    </div>
  )
}
