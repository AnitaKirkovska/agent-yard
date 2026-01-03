# 2025 Calendar Roast (Day 5)

AI agent that roasts how you spent your time in 2025 based on your Google Calendar and creates a brutally honest Gamma presentation.

## Live Demo
[agentyard.co/productivity-wrapped](https://agentyard.co/productivity-wrapped)

## Overview

The 2025 Calendar Roast agent connects to your Google Calendar, analyzes how you spent your time over the past year, and generates a brutally honest "Wrapped"-style presentation. It calls out meeting overload, context switching, fake busy work, and anything that looks obviously dumb in hindsight.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Vellum](https://vellum.ai) | AI workflow orchestration |
| [Lovable](https://lovable.dev) | Frontend app builder |
| [Google Calendar](https://calendar.google.com) | Calendar data source |
| [Google Docs](https://docs.google.com) | Document processing |
| [Gamma](https://gamma.app) | Presentation generation |

## How It Works

```
Google Calendar ─▶ Vellum Workflow
                        │
                        ▼
               [Fetch Calendar Events]
                        │
                        ▼
               [Analyze Time Patterns]
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   [Meeting         [Context        [Productivity
    Overload]        Switching]      Sins]
        │               │               │
        └───────────────┼───────────────┘
                        ▼
               [Generate Roasts]
                        │
                        ▼
               [Create Gamma Presentation]
                        │
                        ▼
               4-Slide Wrapped Deck
```

## Key Files

| File | Description |
|------|-------------|
| `src/pages/ProductivityWrapped.tsx` | Main page component |
| `src/components/ToolHeader.tsx` | Shared header component |

## Workflow Inputs

| Input | Type | Description |
|-------|------|-------------|
| `calendar_data` | STRING | Google Calendar events from the past year |

## Workflow Outputs

| Output | Type | Description |
|--------|------|-------------|
| `presentation_url` | STRING | Link to the generated Gamma presentation |
| `roast_insights` | STRING | JSON with time analysis and roasts |

## Presentation Slides

The agent generates a 4-slide presentation covering:

1. **Where Your Time Went** — Breakdown of hours spent across categories
2. **What Wasted It** — Meetings that could've been emails, recurring time sinks
3. **What Actually Mattered** — Deep work time, high-impact activities
4. **What to Stop Doing** — Actionable recommendations for 2026

## Features

- 📅 Google Calendar integration
- 🔥 Brutally honest time analysis
- 📊 Meeting overload detection
- 🔄 Context switching identification
- 🎭 "Fake busy work" calling out
- 🎬 Gamma presentation output
- 🎨 "Wrapped" style design

## Vellum Workflow

[Build this Agent →](https://app.vellum.ai/onboarding/agent-builder/signup?agentBuilderPrompt=I%20want%20to%20build%20an%20agent%20that%20looks%20only%20at%20my%20calendar%20from%20the%20last%20year%20and%20roasts%20how%20I%20spent%20my%20time.%20It%20should%20call%20out%20meeting%20overload%2C%20context%20switching%2C%20fake%20busy%20work%2C%20and%20anything%20that%20looks%20obviously%20dumb%20in%20hindsight.%20The%20output%20should%20be%20a%20Gamma%20presentation%20with%204%20slides%20covering%20the%20top%20insights%20only%3A%20where%20my%20time%20went%2C%20what%20wasted%20it%2C%20what%20actually%20mattered%2C%20and%20what%20to%20stop%20doing&utm_medium=agentyard&utm_source=calendar-roast)
