# SEO Agent (Day 4)

Automated SEO content creation from keyword research to article.

## Live Demo
[agentyard.co/seo](https://agentyard.co/seo)

## Overview

The SEO Agent automates the entire SEO content creation pipeline. It runs on a daily schedule, picking up keywords from a Google Sheet, analyzing top-ranking content, and generating optimized articles that are saved to Google Docs with Slack notifications.

> **Note**: This agent runs on a schedule and doesn't have an interactive demo. The page showcases the workflow architecture.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Vellum](https://vellum.ai) | AI workflow orchestration |
| [Firecrawl](https://firecrawl.dev) | Web scraping for competitor content |
| [SerpAPI](https://serpapi.com) | Search engine results analysis |
| [Google Drive](https://drive.google.com) | Article storage (Google Docs) |
| [Slack](https://slack.com) | Notifications |
| [Lovable](https://lovable.dev) | Frontend showcase page |

## How It Works

```
Daily Trigger (9am) ─▶ Vellum Workflow
                              │
                              ▼
               ┌──────────────────────────┐
               │ Fetch Keywords from      │
               │ Google Sheets            │
               └──────────────────────────┘
                              │
                              ▼
               ┌──────────────────────────┐
               │ Search SERP for Keyword  │
               │ (SerpAPI)                │
               └──────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        [Scrape #1]     [Scrape #2]     [Scrape #3]
        (Firecrawl)     (Firecrawl)     (Firecrawl)
              │               │               │
              └───────────────┼───────────────┘
                              ▼
               ┌──────────────────────────┐
               │ Analyze Top Content      │
               │ Extract Patterns         │
               └──────────────────────────┘
                              │
                              ▼
               ┌──────────────────────────┐
               │ Generate Outline         │
               │                          │
               └──────────────────────────┘
                              │
                              ▼
               ┌──────────────────────────┐
               │ Write Full Article       │
               │                          │
               └──────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
    ┌──────────────────┐           ┌──────────────────┐
    │ Save to Google   │           │ Send Slack       │
    │ Docs             │           │ Notification     │
    └──────────────────┘           └──────────────────┘
```

## Key Files

| File | Description |
|------|-------------|
| `src/pages/SEOAgent.tsx` | Showcase page with workflow preview |

## Workflow Steps

### 1. Daily Trigger
- Runs automatically at 9am
- Picks up new keywords from a connected Google Sheet

### 2. Competition Analysis
- Fetches top-ranking results for the keyword
- Scrapes content from top 3-5 competitors
- Extracts patterns, structures, and key topics

### 3. Parallel Research
- Gathers additional data points
- Collects statistics and facts
- Researches related topics

### 4. Content Generation
- Creates comprehensive article outline
- Writes full article with SEO optimization
- Includes headers, meta descriptions, internal linking suggestions

### 5. Delivery
- Saves completed article to Google Docs
- Sends Slack notification when ready for review

## Features

- ⏰ Scheduled daily execution
- 🔍 Automated SERP analysis
- 🕷️ Competitor content scraping
- 📊 Parallel research gathering
- ✍️ AI-generated SEO content
- 📄 Google Docs integration
- 💬 Slack notifications
- 👀 Interactive workflow preview

## Integrations

| Service | Integration Type |
|---------|------------------|
| Google Sheets | Input - keyword source |
| SerpAPI | Search results |
| Firecrawl | Web scraping |
| Google Drive | Output - article storage |
| Slack | Notifications |

## Workflow Preview

The page includes an interactive iframe that loads the Vellum workflow visualization, allowing users to see the full agent architecture.

## Vellum Workflow

[Fork this Agent →](https://app.vellum.ai/public/workflow-deployments/781c2781-7158-42d4-ad0b-de3a05855fb2?releaseTag=LATEST&condensedNodeView=1&showOpenInVellum=1)
