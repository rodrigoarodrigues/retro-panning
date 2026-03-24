import type { Deal } from '@/types/deal'
import DealCard from './DealCard'

interface DealGridProps {
  deals: Deal[]
}

export default function DealGrid({ deals }: DealGridProps) {
  const safeDeals = deals.filter(d => !d.isScam)
  const scamDeals = deals.filter(d => d.isScam)

  return (
    <div className="space-y-8">
      {/* Safe deals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {safeDeals.map((deal, i) => (
          <DealCard key={`safe-${deal.url}-${i}`} deal={deal} rank={i + 1} />
        ))}
      </div>

      {/* Scam section */}
      {scamDeals.length > 0 && (
        <div>
          <div
            className="text-center text-xs py-3 mb-6"
            style={{
              color: '#FF0000',
              borderTop: '2px solid #FF0000',
              borderBottom: '2px solid #FF0000',
            }}
          >
            ⚠ RESULTADOS SUSPEITOS — CUIDADO ⚠
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 opacity-70">
            {scamDeals.map((deal, i) => (
              <DealCard
                key={`scam-${deal.url}-${i}`}
                deal={deal}
                rank={safeDeals.length + i + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
