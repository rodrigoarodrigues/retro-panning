# RetroPanning 🕹️

> Projeto Integrador — Análise e Desenvolvimento de Sistemas
> SENAC — 2026

---

## Descrição

O **RetroPanning** é uma aplicação web que utiliza Inteligência Artificial para garimpar e analisar ofertas de videogames e acessórios retrô em marketplaces brasileiros. A ferramenta busca produtos em tempo real, avalia o nível de confiabilidade de cada anúncio e apresenta os resultados com uma pontuação de confiança, auxiliando o consumidor a tomar decisões mais seguras ao comprar itens colecionáveis.

---

## Funcionalidades

- Busca de produtos em plataformas brasileiras (Mercado Livre, OLX, Shopee, Magalu, entre outras)
- Scraping automático das páginas de produto para enriquecer a análise
- Pontuação de confiança (CONFIANÇA) de 0 a 100 gerada exclusivamente pela IA
- Análise baseada em: metadados do anúncio + conteúdo real da página do produto
- Detecção de anúncios suspeitos e possíveis golpes
- Resumo em português gerado pela IA para cada oferta
- Seleção de modelos de linguagem gratuitos (OpenRouter), ordenados por latência
- Interface temática retrô com estética arcade
- Deploy serverless na Cloudflare (Worker + Assets)

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Estilização | Tailwind CSS |
| Backend | Cloudflare Workers (edge computing) |
| Busca de produtos | Serper.dev (Google Shopping API) |
| Inteligência Artificial | OpenRouter (modelos LLM gratuitos) |
| Deploy | Cloudflare Workers + Assets |

---

## Arquitetura

```
Usuário
  │
  ▼
Frontend React (Vite)
  │  POST /api/search  { query, model }
  ▼
Cloudflare Worker (TypeScript)
  │
  ├─ 1. Serper.dev Shopping API
  │      └─ Resultados Google Shopping BR (preço, loja, rating, imagem)
  │
  ├─ 2. Scraping paralelo (Promise.allSettled)
  │      └─ Para cada URL direta de produto:
  │           ├─ Extrai preço via JSON-LD (structured data)
  │           └─ Extrai texto limpo da página (até 1000 chars)
  │
  └─ 3. OpenRouter LLM (modelo gratuito escolhido pelo usuário)
         └─ Analisa: metadados + conteúdo scrapeado
              └─ Retorna: trustScore (0-100), isScam, aiSummary, rank
                    │
                    ▼
            Deals ranqueados por rank da IA
            com pontuação de confiança real
```

---

## Deploy

A aplicação está disponível em produção:

**https://retro.rrodrigues.qzz.io**

Hospedada na Cloudflare (Worker + Static Assets). Frontend e API servidos no mesmo domínio, sem servidor dedicado.

---

## Como Executar Localmente

### Pré-requisitos

- Node.js 18+
- Conta no [Serper.dev](https://serper.dev) (API key gratuita)
- Conta no [OpenRouter.ai](https://openrouter.ai) (API key gratuita)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/rodrigoarodrigues/retro-panning.git
cd retro-panning

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .dev.vars.example .dev.vars
# Editar .dev.vars com suas chaves de API
```

### Desenvolvimento

```bash
# Terminal 1 — Worker (backend)
npm run worker:dev

# Terminal 2 — Frontend
npm run dev
```

Acesse `http://localhost:5173`

### Deploy

```bash
# Build do frontend
npm run build

# Deploy na Cloudflare
npx wrangler deploy
```

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `SERPER_API_KEY` | Chave da API Serper.dev |
| `OPENROUTER_API_KEY` | Chave da API OpenRouter |

---

## Modelos de IA Suportados

Todos os modelos são gratuitos via OpenRouter, ordenados por latência:

| Modelo | Tag |
|--------|-----|
| LiquidAI LFM 1.2B | TURBO |
| LiquidAI LFM 1.2B Thinking | PENSADOR |
| StepFun Step 3.5 Flash | FLASH (padrão) |
| NVIDIA Nemotron Nano | NANO |
| MiniMax M2.5 | — |
| Arcee Trinity Large | PREVIEW |
| NVIDIA Nemotron Super | PODEROSO |
| OpenRouter Auto | AUTO |

---

## Equipe

**Grupo 56**

| Nome |
|------|
| Ivan Leonildo da Silva Junior |
| Leticia Seullyn da Silva Braga |
| Luis Guilherme Alves Collar |
| Rodrigo de Andrade Rodrigues |

---

*Projeto desenvolvido para a disciplina de Projeto Integrador — Grupo 56 — SENAC ADS 2026*
