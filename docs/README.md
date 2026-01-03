# Agent Documentation

This folder contains detailed documentation for each AI agent in the 30 Days of AI Agents project.

## Agents

| Day | Agent | Documentation |
|-----|-------|---------------|
| 1 | Santa Agent | [santa-agent.md](./santa-agent.md) |
| 2 | Swag Agent | [swag-agent.md](./swag-agent.md) |
| 3 | Agent Reads | [agent-reads.md](./agent-reads.md) |
| 4 | SEO Agent | [seo-agent.md](./seo-agent.md) |
| 5 | 2025 Calendar Roast | [productivity-wrapped.md](./productivity-wrapped.md) |

## Architecture Overview

All agents follow a similar architecture pattern:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React UI      │────▶│  Edge Function   │────▶│  Vellum API     │
│   (Lovable)     │◀────│  (Supabase)      │◀────│  (AI Workflow)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                         │
                                                         ▼
                                                 ┌───────────────┐
                                                 │ External APIs │
                                                 │ (per agent)   │
                                                 └───────────────┘
```

### Common Components

- **Frontend**: React + TypeScript + Tailwind CSS (built with Lovable)
- **Backend**: Supabase Edge Functions
- **AI Orchestration**: Vellum workflows
- **Shared UI**: ToolHeader, LoadingState, TooltipProvider components

## Adding a New Agent

When adding a new agent, please:

1. Create the page component in `src/pages/`
2. Add a route in `src/App.tsx`
3. Add a card on the Index page
4. Create documentation in `docs/[agent-name].md`
5. Update the main `README.md` table
