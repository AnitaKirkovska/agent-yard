# Agent Reads (Day 3)

AI librarian recommends books based on your goals and life situation.

## Live Demo
[agentyard.co/reads](https://agentyard.co/reads)

## Overview

Agent Reads is an AI-powered book recommendation engine that suggests books based on a user's current life situation, goals, or challenges. It provides personalized reading lists with cover images, ratings, and Amazon links.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Vellum](https://vellum.ai?utm_medium=agentyard&utm_source=github) | AI workflow orchestration |
| [SerpAPI](https://serpapi.com) | Book search and metadata |
| [Google Books API](https://developers.google.com/books) | Book covers and details |
| [Lovable](https://lovable.dev) | Frontend app builder |
| Supabase Edge Functions | Serverless API layer |

## How It Works

```
User Input ─▶ Edge Function ─▶ Vellum Workflow
(life situation)                     │
                                     ▼
                          ┌─────────────────────┐
                          │ Analyze Situation   │
                          │ Identify Categories │
                          └─────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              ▼                      ▼                      ▼
        [Category 1]           [Category 2]           [Category 3]
        SerpAPI Search         SerpAPI Search         SerpAPI Search
              │                      │                      │
              └──────────────────────┼──────────────────────┘
                                     ▼
                          ┌─────────────────────┐
                          │ Fetch Book Details  │
                          │ (Google Books API)  │
                          └─────────────────────┘
                                     │
                                     ▼
                          ┌─────────────────────┐
                          │ Curate & Rank       │
                          │ (Claude Haiku)      │
                          └─────────────────────┘
                                     │
                                     ▼
                          Return recommendations
```

## Key Files

| File | Description |
|------|-------------|
| `src/pages/AgentReads.tsx` | Main page component |
| `src/components/AgentReadsLearnings.tsx` | Performance optimization explainer |
| `supabase/functions/execute-workflow/index.ts` | Edge function |

## Workflow Inputs

| Input | Type | Description |
|-------|------|-------------|
| `life_situation` | STRING | User's current goals/situation/challenges |

## Workflow Outputs

| Output | Type | Description |
|--------|------|-------------|
| `recommendations` | ARRAY | Array of book recommendation objects |

### Book Recommendation Object

```typescript
interface BookRecommendation {
  title: string;
  author: string;
  description?: string;
  why_perfect?: string;
  why_relevant?: string;
  cover_url?: string;
  amazon_link?: string;
  amazon_url?: string;
  publication_year?: number;
  rating?: number;
  review_quote?: string;
}
```

## Performance Optimization

The workflow was optimized from ~130s to ~20s through:

### Before: Sequential (~130s)
```
Analyze → Search Cat1 → Search Cat2 → Search Cat3 → 
Fetch Details → Fetch Details → Fetch Details → 
Get Reviews → Get Reviews → Get Reviews → 
Curate → Return
```

### After: Parallel (~20s)
```
Analyze → [Search Cat1 | Search Cat2 | Search Cat3] →
          [Fetch All Details in Parallel] →
          [Get All Reviews in Parallel] →
          Curate (Claude Haiku) → Return
```

### Key Optimizations

1. **Parallel Map Nodes** — Concurrent searches and fetches
2. **Faster Model** — Claude Haiku for curation (vs. slower models)
3. **Pre-search Strategy** — Search across multiple categories upfront

## Features

- 📚 Personalized book recommendations
- 📖 Book covers from Google Books API
- ⭐ Ratings and review quotes
- 🔗 Direct Amazon purchase links
- 🎨 Beautiful library-themed UI
- 📱 Responsive grid layout

## Vellum Workflow

[Fork this Agent →](https://app.vellum.ai/public/workflow-deployments/4c0d8f19-90b4-4d91-a663-874e782656aa?releaseTag=LATEST&condensedNodeView=1&showOpenInVellum=1)
