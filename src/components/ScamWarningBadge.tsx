interface ScamWarningBadgeProps {
  warnings: string[]
  isScam: boolean
}

export default function ScamWarningBadge({ warnings, isScam }: ScamWarningBadgeProps) {
  if (warnings.length === 0 && !isScam) return null

  return (
    <div className="mt-1 space-y-1.5">
      {isScam && (
        <div
          className="px-2 py-2 text-xs text-center font-bold"
          style={{
            backgroundColor: 'rgba(255,0,0,0.15)',
            border: '2px solid #FF0000',
            color: '#FF0000',
            animation: 'scam-pulse 1s ease-in-out infinite',
          }}
        >
          !! POSSÍVEL GOLPE DETECTADO !!
        </div>
      )}
      {warnings.map((w, i) => (
        <div key={i} className="flex items-start gap-1.5">
          <span className="text-yellow-500 text-xs shrink-0">⚠</span>
          <span className="text-yellow-400 text-xs leading-relaxed">{w}</span>
        </div>
      ))}
    </div>
  )
}
