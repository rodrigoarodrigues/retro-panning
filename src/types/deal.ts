export interface Deal {
  title: string
  price: number
  originalPrice?: number
  seller: string
  url: string
  image?: string
  trustScore: number      // 0-100
  scamWarnings: string[]
  aiSummary: string
  platform: string
  isScam: boolean
}

export interface FreeModel {
  id: string
  name: string
  contextK: number  // context window in thousands
  tag?: string      // ex: "RÁPIDO", "PODEROSO", "PENSADOR"
}

export const FREE_MODELS: FreeModel[] = [
  {
    id: 'liquid/lfm-2.5-1.2b-instruct:free',
    name: 'LiquidAI LFM 1.2B',
    contextK: 32,
    tag: 'TURBO',
  },
  {
    id: 'liquid/lfm-2.5-1.2b-thinking:free',
    name: 'LiquidAI LFM Thinking',
    contextK: 32,
    tag: 'PENSADOR',
  },
  {
    id: 'stepfun/step-3.5-flash:free',
    name: 'StepFun Step 3.5 Flash',
    contextK: 256,
    tag: 'FLASH ⚡',
  },
  {
    id: 'nvidia/nemotron-3-nano-30b-a3b:free',
    name: 'NVIDIA Nemotron Nano',
    contextK: 256,
    tag: 'NANO',
  },
  {
    id: 'minimax/minimax-m2.5:free',
    name: 'MiniMax M2.5',
    contextK: 196,
  },
  {
    id: 'arcee-ai/trinity-large-preview:free',
    name: 'Arcee Trinity Large',
    contextK: 131,
    tag: 'PREVIEW',
  },
  {
    id: 'nvidia/nemotron-3-super-120b-a12b:free',
    name: 'NVIDIA Nemotron Super',
    contextK: 262,
    tag: 'PODEROSO',
  },
  {
    id: 'openrouter/free',
    name: 'Auto (menor latência)',
    contextK: 200,
    tag: 'AUTO',
  },
]

export const DEFAULT_MODEL = 'nvidia/nemotron-3-nano-30b-a3b:free'

export interface SearchRequest {
  query: string
  model?: string
}

export interface SearchResponse {
  deals: Deal[]
  query: string
  totalFound: number
  analyzedAt: string
}

export interface SearchError {
  error: string
  details?: string
}
