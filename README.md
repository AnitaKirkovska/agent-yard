# 30 Days of AI Agents

Every day for 30 days, I'm building a new AI agent app. Follow along and try each one as they launch!

🔗 **Live Site**: [agentyard.co](https://agentyard.co)  
🐦 **Follow**: [@anitakirkovska](https://x.com/anitakirkovska)

## Published AI Agents

| Day | Name | Description | Technologies Used | Docs |
|-----|------|-------------|-------------------|------|
| 1 | **Santa Agent** | AI-powered gift recommendations based on your friend's personality | Vellum, Firecrawl, Lovable | [📖](./docs/santa-agent.md) |
| 2 | **Swag Agent** | AI picks custom swag based on your hobby and creates a draft order | Vellum, Printify, Lovable | [📖](./docs/swag-agent.md) |
| 3 | **Agent Reads** | AI librarian recommends books based on your goals and life situation | Vellum, SerpAPI, Google Books API, Lovable | [📖](./docs/agent-reads.md) |
| 4 | **SEO Agent** | Automated SEO content creation from keyword research to article | Vellum, Firecrawl, SerpAPI, Google Drive, Slack, Lovable | [📖](./docs/seo-agent.md) |
| 5 | **2025 Calendar Roast** | AI roasts how you spent your time and creates a brutally honest Gamma presentation | Vellum, Google Calendar, Gamma, Lovable | [📖](./docs/productivity-wrapped.md) |

> 📚 See [docs/](./docs/) for detailed documentation on each agent's architecture and implementation.

## Core Tech Stack

This project is built with:

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (via Lovable Cloud)
- **AI Orchestration**: [Vellum](https://vellum.ai)
- **App Builder**: [Lovable](https://lovable.dev)

## Project Structure

```
src/
├── pages/           # Individual agent pages
├── components/      # Reusable UI components
├── assets/          # Images and logos
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── integrations/    # Supabase client
```

## Local Development

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

## Deployment

This project is deployed via [Lovable](https://lovable.dev). Simply click Share → Publish to deploy.

## Connect a Custom Domain

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

Built with ❤️ using [Lovable](https://lovable.dev) and [Vellum](https://vellum.ai)
