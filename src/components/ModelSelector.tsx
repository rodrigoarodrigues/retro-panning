import { FREE_MODELS, type FreeModel } from '@/types/deal'

interface ModelSelectorProps {
  selected: string
  onChange: (modelId: string) => void
  disabled?: boolean
}

const TAG_COLORS: Record<string, string> = {
  'PODEROSO': '#FF4500',
  'RÁPIDO':   '#00CC66',
  'FLASH':    '#FFCC00',
  'PREVIEW':  '#CC66FF',
  'PENSADOR': '#66CCFF',
  'LEVE':     '#CC9966',
}

export default function ModelSelector({ selected, onChange, disabled }: ModelSelectorProps) {
  const current = FREE_MODELS.find(m => m.id === selected) ?? FREE_MODELS[0]

  return (
    <div className="w-full max-w-2xl mx-auto mt-3">
      <div className="flex items-center gap-0">
        <span
          className="flex items-center px-3 py-2 text-xs whitespace-nowrap shrink-0"
          style={{
            backgroundColor: 'rgba(139,37,0,0.2)',
            border: '2px solid #CC6600',
            borderRight: 'none',
            color: '#CC9966',
          }}
        >
          MODEL:
        </span>

        <div className="relative flex-1">
          <select
            value={selected}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            className="w-full text-xs px-3 py-2 appearance-none cursor-pointer"
            style={{
              backgroundColor: '#1A0A00',
              color: '#F5DEB3',
              border: '2px solid #CC6600',
              outline: 'none',
              paddingRight: '32px',
            }}
          >
            {FREE_MODELS.map((m: FreeModel) => (
              <option key={m.id} value={m.id}>
                {m.name} [{m.contextK}K ctx]{m.tag ? ` — ${m.tag}` : ''}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs"
            style={{ color: '#CC6600' }}
          >
            ▼
          </span>
        </div>

        {/* Tag badge */}
        {current.tag && (
          <span
            className="px-2 py-2 text-xs shrink-0"
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: '2px solid #CC6600',
              borderLeft: 'none',
              color: TAG_COLORS[current.tag] ?? '#CC9966',
            }}
          >
            {current.tag}
          </span>
        )}
      </div>

      <p className="text-xs mt-1 text-center" style={{ color: '#8B4513' }}>
        TODOS OS MODELOS SÃO 100% GRATUITOS VIA OPENROUTER
      </p>
    </div>
  )
}
