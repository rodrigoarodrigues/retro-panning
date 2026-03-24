// ============================================================
// RetroPanning — Cloudflare Worker
// Fluxo: POST /api/search → Serper Shopping → fetch páginas → OpenRouter AI → deals rankeados
// ============================================================

export interface Env {
  SERPER_API_KEY: string
  OPENROUTER_API_KEY: string
}

// ---- Types ----

interface SerperShoppingResult {
  title: string
  price: string
  source: string
  link: string
  productLink?: string
  imageUrl?: string
  rating?: number
  reviews?: number
}

interface SerperResponse {
  shopping?: SerperShoppingResult[]
}

interface PageContext {
  text: string
  scrapedPrice: number
}

interface EnrichedResult extends SerperShoppingResult {
  pageContext?: PageContext
}

interface AIAnalysisItem {
  index: number
  trustScore: number
  isScam: boolean
  scamWarnings: string[]
  aiSummary: string
  rank: number
}

interface OpenRouterResponse {
  choices: Array<{
    message: { content: string }
  }>
}

interface Deal {
  title: string
  price: number
  originalPrice?: number
  seller: string
  url: string
  image?: string
  trustScore: number
  scamWarnings: string[]
  aiSummary: string
  platform: string
  isScam: boolean
}

interface SearchResponse {
  deals: Deal[]
  query: string
  totalFound: number
  analyzedAt: string
}

// ---- CORS ----

const CORS_HEADERS: HeadersInit = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS })
}

function errorResponse(message: string, status = 500): Response {
  return jsonResponse({ error: message }, status)
}

// ---- Serper Shopping Search ----

async function searchSerper(query: string, apiKey: string): Promise<SerperShoppingResult[]> {
  const resp = await fetch('https://google.serper.dev/shopping', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query,
      num: 10,
      gl: 'br',
      hl: 'pt-br',
    }),
  })

  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`Serper error ${resp.status}: ${body}`)
  }

  const data = (await resp.json()) as SerperResponse
  return data.shopping ?? []
}

// ---- Detect if URL is a Google Shopping catalog page ----

function isDirectProductUrl(url: string): boolean {
  return !url.includes('google.com/search') && !url.includes('shopping.google.com')
}

// ---- Fetch product page for extra context ----

async function fetchPageContext(url: string): Promise<PageContext | undefined> {
  if (!isDirectProductUrl(url)) return undefined

  try {
    const resp = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
    })
    if (!resp.ok) return undefined

    const html = await resp.text()

    // Tenta extrair preço via JSON-LD
    let scrapedPrice = 0
    const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    for (const block of jsonLdBlocks) {
      try {
        const data = JSON.parse(block[1].trim()) as Record<string, unknown>
        const offers = data?.offers as Record<string, unknown> | undefined
        const rawPrice = offers?.price ?? data?.price
        if (rawPrice !== undefined) {
          const p = parseFloat(String(rawPrice).replace(/[^0-9.,]/g, '').replace(',', '.'))
          if (!isNaN(p) && p > 0) { scrapedPrice = p; break }
        }
      } catch { /* ignore */ }
    }

    // Extrai texto limpo (500 chars — contexto focado para a IA)
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500)

    return { text, scrapedPrice }
  } catch {
    return undefined
  }
}

// ---- Parse price ----

function parsePrice(priceStr: string): number {
  const brl = priceStr.match(/R\$\s*([\d.,]+)/)
  if (brl) {
    const val = parseFloat(brl[1].replace(/\./g, '').replace(',', '.'))
    return isNaN(val) ? 0 : val
  }
  const val = parseFloat(priceStr.replace(/[^0-9.]/g, ''))
  return isNaN(val) ? 0 : val
}

// ---- Detect platform ----

function detectPlatform(seller: string, url = ''): string {
  const s = (seller + url).toLowerCase()
  if (s.includes('mercado livre') || s.includes('mercadolivre') || s.includes('mercadolibre')) return 'Mercado Livre'
  if (s.includes('olx')) return 'OLX'
  if (s.includes('shopee')) return 'Shopee'
  if (s.includes('magazine luiza') || s.includes('magazineluiza') || s.includes('magalu')) return 'Magalu'
  if (s.includes('americanas')) return 'Americanas'
  if (s.includes('casas bahia') || s.includes('casasbahia')) return 'Casas Bahia'
  if (s.includes('kabum')) return 'Kabum'
  if (s.includes('submarino')) return 'Submarino'
  if (s.includes('enjoei')) return 'Enjoei'
  if (s.includes('amazon')) return 'Amazon'
  if (s.includes('ebay')) return 'eBay'
  if (s.includes('aliexpress')) return 'AliExpress'
  return seller
}

// ---- Build AI Prompt ----

function buildPrompt(query: string, results: EnrichedResult[]): string {
  const n = results.length

  const itemList = results
    .map((r, i) => {
      const page = r.pageContext?.text ? ` | Página: ${r.pageContext.text.slice(0, 300)}` : ''
      return `[${i + 1}] ${r.title} | ${r.price} | ${r.source} | Rating:${r.rating ?? '?'} Reviews:${r.reviews ?? '?'}${page}`
    })
    .join('\n')

  return `Analise ${n} anúncios de "${query}" no Brasil e retorne EXATAMENTE ${n} objetos JSON.

${itemList}

REGRAS:
- trustScore 0-100: 88-100=loja oficial/autêntico, 72-87=confiável, 55-71=mediano, 38-54=duvidoso, 20-37=suspeito, 0-19=golpe
- Evite valores redondos (50,60,70). Use números específicos como 67, 83, 41.
- isScam=true se preço impossível, loja falsa ou produto claramente falsificado
- rank: 1=melhor custo-benefício, ${n}=pior
- aiSummary: 1 frase curta em pt-BR sobre o produto/oferta
- RETORNE EXATAMENTE ${n} OBJETOS — um para cada índice de 1 a ${n}

[{"index":1,"trustScore":0,"isScam":false,"scamWarnings":[],"aiSummary":"","rank":0},{"index":2,"trustScore":0,"isScam":false,"scamWarnings":[],"aiSummary":"","rank":0}]`
}

// ---- OpenRouter AI ----

const DEFAULT_MODEL = 'nvidia/nemotron-3-nano-30b-a3b:free'

// Ordenados por confiabilidade — usados como fallback sequencial em caso de 429
const ALLOWED_FREE_MODELS = [
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'stepfun/step-3.5-flash:free',
  'liquid/lfm-2.5-1.2b-instruct:free',
  'liquid/lfm-2.5-1.2b-thinking:free',
  'minimax/minimax-m2.5:free',
  'arcee-ai/trinity-large-preview:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'openrouter/free',
]

const ALLOWED_FREE_MODELS_SET = new Set(ALLOWED_FREE_MODELS)

async function callOpenRouter(prompt: string, apiKey: string, model: string): Promise<string | null> {
  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    signal: AbortSignal.timeout(25000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://retro.rrodrigues.qzz.io',
      'X-Title': 'RetroPanning Deal Finder',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'Você é uma API JSON. Retorne APENAS arrays JSON válidos. Sem markdown. Sem blocos de código. Sem explicação.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  })

  if (resp.status === 429 || resp.status === 503) return null  // rate limit → tentar próximo modelo
  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`OpenRouter error ${resp.status}: ${body}`)
  }

  const data = (await resp.json()) as OpenRouterResponse
  return data.choices?.[0]?.message?.content ?? null
}

function parseAIContent(content: string): AIAnalysisItem[] {
  const stripped = content.replace(/```json/gi, '').replace(/```/g, '').trim()

  // Tentativa 1: array JSON completo
  const arrayMatch = stripped.match(/\[[\s\S]*\]/)
  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0]) as AIAnalysisItem[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch { /* tenta próxima estratégia */ }
  }

  // Tentativa 2: objetos individuais (JSONL ou separados)
  const objects: AIAnalysisItem[] = []
  for (const match of stripped.matchAll(/\{[^{}]*"index"[^{}]*"trustScore"[^{}]*\}/g)) {
    try {
      const obj = JSON.parse(match[0]) as AIAnalysisItem
      if (typeof obj.index === 'number' && typeof obj.trustScore === 'number') {
        objects.push(obj)
      }
    } catch { /* ignora */ }
  }
  if (objects.length > 0) return objects

  console.error('AI parse failed. Raw response:', stripped.slice(0, 400))
  return []
}

async function analyzeWithAI(prompt: string, apiKey: string, model: string): Promise<AIAnalysisItem[]> {
  const preferredModel = ALLOWED_FREE_MODELS_SET.has(model) ? model : DEFAULT_MODEL

  // Monta fila: modelo preferido primeiro, depois 2 fallbacks (max 3 tentativas — limite do Worker)
  const fallbacks = ALLOWED_FREE_MODELS.filter(m => m !== preferredModel).slice(0, 2)
  const queue = [preferredModel, ...fallbacks]

  for (const candidate of queue) {
    try {
      const content = await callOpenRouter(prompt, apiKey, candidate)
      if (content === null) {
        console.warn(`Model ${candidate} returned 429/503, trying next...`)
        continue
      }
      if (!content) continue
      const result = parseAIContent(content)
      if (result.length > 0) return result
    } catch (err) {
      console.error(`Model ${candidate} error:`, err)
      // Só para em erro não-429 se for o último modelo
    }
  }

  console.error('All models failed or returned empty results.')
  return []
}

// ---- Merge results ----

function mergeResults(results: EnrichedResult[], aiResults: AIAnalysisItem[]): Deal[] {
  const aiMap = new Map<number, AIAnalysisItem>()
  for (const a of aiResults) aiMap.set(a.index, a)

  type DealWithRank = Deal & { _rank: number }

  const deals: DealWithRank[] = results.map((r, i) => {
    const ai = aiMap.get(i + 1)
    const serperPrice = parsePrice(r.price)
    const price = r.pageContext?.scrapedPrice || serperPrice

    return {
      title: r.title,
      price,
      seller: r.source,
      url: r.productLink ?? r.link,
      image: r.imageUrl,
      trustScore: ai?.trustScore ?? 0,
      scamWarnings: ai?.scamWarnings ?? [],
      aiSummary: ai?.aiSummary ?? 'Análise não disponível.',
      platform: detectPlatform(r.source, r.link),
      isScam: ai?.isScam ?? false,
      _rank: ai?.rank ?? 999,
    }
  })

  return deals
    .sort((a, b) => {
      if (a.isScam && !b.isScam) return 1
      if (!a.isScam && b.isScam) return -1
      return a._rank - b._rank
    })
    .map(({ _rank: _r, ...rest }) => rest as Deal)
}

// ---- Main Handler ----

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    if (url.pathname === '/api/health') {
      return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() })
    }

    if (url.pathname === '/api/search' && request.method === 'POST') {
      try {
        const body = (await request.json()) as { query?: string; model?: string }
        const query = body.query?.trim()
        const model = body.model ?? DEFAULT_MODEL

        if (!query || query.length < 2) return errorResponse('A busca precisa ter pelo menos 2 caracteres', 400)
        if (query.length > 100) return errorResponse('Busca muito longa (máx 100 caracteres)', 400)

        // 1. Buscar produtos no Google Shopping BR
        const serperResults = (await searchSerper(query, env.SERPER_API_KEY)).slice(0, 6)

        if (serperResults.length === 0) {
          return jsonResponse({ deals: [], query, totalFound: 0, analyzedAt: new Date().toISOString() } satisfies SearchResponse)
        }

        // 2. Fetch das páginas diretas em paralelo (ignora links do Google Shopping)
        const pageContexts = await Promise.allSettled(
          serperResults.map(r => fetchPageContext(r.productLink ?? r.link))
        )

        const enriched: EnrichedResult[] = serperResults.map((r, i) => ({
          ...r,
          pageContext: pageContexts[i].status === 'fulfilled' ? pageContexts[i].value : undefined,
        }))

        // 3. IA analisa com metadados + conteúdo das páginas que carregaram
        const prompt = buildPrompt(query, enriched)
        const aiAnalysis = await analyzeWithAI(prompt, env.OPENROUTER_API_KEY, model)

        // 4. Merge + retornar
        const deals = mergeResults(enriched, aiAnalysis)

        return jsonResponse({ deals, query, totalFound: deals.length, analyzedAt: new Date().toISOString() } satisfies SearchResponse)
      } catch (err) {
        console.error('Search error:', err)
        return errorResponse(err instanceof Error ? err.message : 'Erro interno', 500)
      }
    }

    return errorResponse('Rota não encontrada', 404)
  },
}
