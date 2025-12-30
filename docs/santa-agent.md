# Santa Agent (Day 1)

AI-powered gift recommendations based on your friend's personality.

## Live Demo
[agentyard.co/santa](https://agentyard.co/santa)

## Overview

The Santa Agent helps users find personalized Secret Santa gifts by analyzing a description of their friend's personality and interests. It searches real products and returns curated recommendations with purchase links.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Vellum](https://vellum.ai) | AI workflow orchestration |
| [Firecrawl](https://firecrawl.dev) | Web scraping for product details |
| [Lovable](https://lovable.dev) | Frontend app builder |
| Supabase Edge Functions | Serverless API layer |

## How It Works

```
User Input ─▶ Edge Function ─▶ Vellum Workflow
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              [Search 1]      [Search 2]      [Search 3]
              (Google)        (Google)        (Google)
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                           Deduplicate Results
                                    │
                                    ▼
                           Rank & Filter
                                    │
                                    ▼
                           Scrape Top Products
                           (via Firecrawl)
                                    │
                                    ▼
                           Format & Return
```

## Key Files

| File | Description |
|------|-------------|
| `src/pages/SecretSantaGiftFinder.tsx` | Main page component |
| `src/components/GiftFinderForm.tsx` | Input form component |
| `src/components/RecommendationsDisplay.tsx` | Results display |
| `src/components/LoadingState.tsx` | Loading animation |
| `src/components/CatchPresentsGame.tsx` | Mini-game while waiting |
| `supabase/functions/execute-workflow/index.ts` | Edge function |

## Workflow Inputs

| Input | Type | Description |
|-------|------|-------------|
| `friend_description` | STRING | Description of the gift recipient |
| `budget` | STRING | Budget limit for the gift |
| `exclude_previous` | STRING | Previously shown products to exclude |

## Workflow Outputs

| Output | Type | Description |
|--------|------|-------------|
| `recommendations` | STRING | JSON array of product recommendations |

## Learnings & Optimizations

1. **Map nodes for parallelization** — Concurrent product searches cut ~40s of latency
2. **Deduplication is required** — Multiple search angles return duplicate products
3. **Diversity needs forcing** — Without explicit rules, AI reuses similar keywords
4. **Constraints improve quality** — Clear "avoid rules" filter out bad gifts
5. **Simple filter works best** — "Would they buy this themselves?" = not a good gift
6. **Speed vs quality tradeoff** — Fewer results per search = faster workflow
7. **Links are tricky** — Google Shopping gives redirect URLs, need extra cleanup

## Features

- 🎁 Personalized gift recommendations
- 💰 Budget-aware suggestions  
- 🔄 "Find More" to get additional ideas
- 🎮 Mini-game while waiting for results
- ❄️ Christmas-themed UI with snow animations
- 🎉 Confetti celebration when results load

## Vellum Workflow

[Fork this Agent →](https://app.vellum.ai/public/workflow-deployments/98d37ca2-5771-4fe7-bd26-01d5f95bea32?releaseTag=LATEST&condensedNodeView=1&showOpenInVellum=1)
