import type { Deal } from '@/types/deal'
import TrustScoreMeter from './TrustScoreMeter'
import ScamWarningBadge from './ScamWarningBadge'

interface DealCardProps {
  deal: Deal
  rank: number
}

const PLATFORM_ICONS: Record<string, string> = {
  'Mercado Livre': '🛒',
  'OLX': '📢',
  'Shopee': '🛍️',
  'Magalu': '🏬',
  'Americanas': '🔴',
  'Casas Bahia': '🏠',
  'Kabum': '💻',
  'Submarino': '🚀',
  'Enjoei': '♻️',
  'Ponto Frio': '❄️',
  'Extra': '⭐',
  'AliExpress': '🌏',
  'Amazon': '📦',
  'eBay': '🏷️',
  'GameStop': '🎮',
  'Walmart': '🛒',
  'Etsy': '🧶',
}

export default function DealCard({ deal, rank }: DealCardProps) {
  const isTopDeal = rank === 1 && !deal.isScam
  const borderClass = deal.isScam
    ? 'pixel-border-scam'
    : isTopDeal
    ? 'pixel-border-accent'
    : 'pixel-border'

  const platformIcon = PLATFORM_ICONS[deal.platform] ?? '🏪'

  return (
    <div
      className={`${borderClass} flex flex-col gap-3 relative`}
      style={{ backgroundColor: '#2A1200', padding: '16px' }}
    >
      {/* Top rank badge */}
      {isTopDeal && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 text-glow"
          style={{ backgroundColor: '#FF4500', color: '#1A0A00', whiteSpace: 'nowrap' }}
        >
          ★ MELHOR OFERTA
        </div>
      )}

      {/* Product image or rank fallback */}
      <div style={{ position: 'relative' }}>
        {/* Rank badge — always visible */}
        <div
          className="absolute top-0 right-0 text-xs px-2 py-1 z-10"
          style={{ backgroundColor: '#8B2500', color: '#F5DEB3' }}
        >
          #{rank}
        </div>
        {deal.image && (
          <div
            className="w-full overflow-hidden"
            style={{ height: '140px', border: '2px solid #CC6600' }}
          >
            <img
              src={deal.image}
              alt={deal.title}
              className="w-full h-full object-cover"
              style={{ opacity: 0.85 }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'
              }}
            />
          </div>
        )}
      </div>

      {/* Title */}
      <h3
        className="text-xs leading-relaxed pr-8"
        style={{ color: '#F5DEB3' }}
        title={deal.title}
      >
        {deal.title.length > 80 ? deal.title.slice(0, 77) + '...' : deal.title}
      </h3>

      {/* Price */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xl font-bold text-glow" style={{ color: '#FF4500' }}>
          {deal.price > 0 ? deal.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Ver preço'}
        </span>
        {deal.originalPrice && deal.originalPrice > deal.price && (
          <span
            className="text-xs line-through"
            style={{ color: '#CC9966' }}
          >
            {deal.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        )}
        <span className="ml-auto text-xs" style={{ color: '#CC9966' }}>
          {platformIcon} {deal.platform}
        </span>
      </div>

      {/* Trust meter */}
      <TrustScoreMeter score={deal.trustScore} />

      {/* AI summary */}
      <div
        className="text-xs leading-relaxed"
        style={{
          color: '#CC9966',
          borderTop: '1px solid #CC6600',
          paddingTop: '8px',
        }}
      >
        <span style={{ color: '#FF4500' }}>&gt; </span>
        {deal.aiSummary}
      </div>

      {/* Scam warnings */}
      <ScamWarningBadge warnings={deal.scamWarnings} isScam={deal.isScam} />

      {/* CTA button */}
      <a
        href={deal.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto block text-center text-xs py-3 px-4 transition-colors"
        style={{
          backgroundColor: deal.isScam ? '#4A0000' : '#8B2500',
          color: '#F5DEB3',
          border: `2px solid ${deal.isScam ? '#FF0000' : '#CC6600'}`,
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          if (!deal.isScam) {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#FF4500'
          }
        }}
        onMouseLeave={(e) => {
          if (!deal.isScam) {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#8B2500'
          }
        }}
      >
        {deal.isScam ? '⚠ VER MESMO ASSIM' : 'VER OFERTA >>'}
      </a>
    </div>
  )
}
