interface TrustScoreMeterProps {
  score: number // 0-100
}

// Cor de cada bloco pela posição (gradiente vermelho → verde)
const BLOCK_COLORS = [
  '#CC1111', // 0  — vermelho
  '#DD2200', // 1
  '#EE4400', // 2  — laranja-vermelho
  '#FF6600', // 3  — laranja
  '#DDAA00', // 4  — amarelo-laranja
  '#CCCC00', // 5  — amarelo
  '#AACC00', // 6  — amarelo-verde
  '#66CC00', // 7  — verde-claro
  '#33BB11', // 8
  '#00AA22', // 9  — verde
]

export default function TrustScoreMeter({ score }: TrustScoreMeterProps) {
  const blocks = 10
  const filledBlocks = Math.round(score / 10)

  const labelColor =
    score >= 75 ? '#33BB11' :
    score >= 55 ? '#CCCC00' :
    score >= 35 ? '#FF6600' :
                  '#CC1111'

  const label =
    score >= 75 ? 'CONFIÁVEL' :
    score >= 55 ? 'NEUTRO' :
    score >= 35 ? 'SUSPEITO' :
                  'PERIGOSO'

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[#CC9966] text-xs shrink-0">CONFIANÇA:</span>
      <div className="flex gap-px" title={`Score: ${score}/100`}>
        {Array.from({ length: blocks }, (_, i) => (
          <div
            key={i}
            className="w-2.5 h-3.5"
            style={{
              backgroundColor: i < filledBlocks ? BLOCK_COLORS[i] : '#2A1200',
              border: `1px solid #CC6600`,
            }}
          />
        ))}
      </div>
      <span className="text-xs font-bold" style={{ color: labelColor }}>
        {score}
      </span>
      <span className="text-xs" style={{ color: labelColor }}>
        {label}
      </span>
    </div>
  )
}
