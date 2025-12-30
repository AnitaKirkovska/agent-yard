# Swag Agent (Day 2)

AI picks custom swag based on your hobby and creates a draft order.

## Live Demo
[agentyard.co/swag](https://agentyard.co/swag)

## Overview

The Swag Agent creates personalized merchandise based on a user's hobby. It selects appropriate swag items, generates designs, and creates a draft order through Printify for fulfillment.

> **Note**: This is a demo only. Orders are created as drafts for human approval, not automatically fulfilled.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Vellum](https://vellum.ai) | AI workflow orchestration |
| [Printify](https://printify.com) | Print-on-demand fulfillment |
| [Lovable](https://lovable.dev) | Frontend app builder |
| Supabase Edge Functions | Serverless API layer |

## How It Works

```
User Input ─▶ Edge Function ─▶ Vellum Workflow
(hobby +                            │
shipping)                           ▼
                         ┌─────────────────────┐
                         │ Analyze Hobby       │
                         │ Select Swag Type    │
                         └─────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Generate Design     │
                         │ (placeholder logo)  │
                         └─────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Create Product      │
                         │ (Printify API)      │
                         └─────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Create Draft Order  │
                         │ (Printify API)      │
                         └─────────────────────┘
                                    │
                                    ▼
                         Return mockups + order ID
```

## Key Files

| File | Description |
|------|-------------|
| `src/pages/CustomerGifts.tsx` | Main page component (2-step form) |
| `src/components/SwagLoadingScreen.tsx` | Animated loading messages |
| `supabase/functions/execute-workflow/index.ts` | Edge function |

## Workflow Inputs

| Input | Type | Description |
|-------|------|-------------|
| `recipient_name` | STRING | Full name for shipping |
| `address1` | STRING | Street address |
| `city` | STRING | City |
| `state_code` | STRING | State/province code |
| `country_code` | STRING | ISO country code |
| `zip_code` | STRING | Postal code |
| `hobby` | STRING | User's hobby description |

## Workflow Outputs

| Output | Type | Description |
|--------|------|-------------|
| `message` | STRING | Success/status message |
| `order_id` | STRING | Printify draft order ID |
| `product_id` | STRING | Printify product ID |
| `mockup_images` | ARRAY | Product mockup image URLs |

## Features

- 🎨 AI-selected swag based on hobby
- 📦 Real Printify integration
- 🖼️ Product mockups displayed
- 📍 Full shipping address collection
- 🌍 International country support
- ⏳ Animated loading states

## User Flow

1. **Step 1**: User enters their hobby/passion
2. **Step 2**: User provides shipping details
3. **Processing**: AI selects swag, creates design, generates order
4. **Result**: Mockup images and confirmation displayed

## Country Code Mapping

The app converts common country names to ISO codes:
- "United States" → "US"
- "Canada" → "CA"  
- "United Kingdom" → "GB"
- etc.
