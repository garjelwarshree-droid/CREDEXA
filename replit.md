# CardSense AI

A smart financial card comparison and recommendation platform using Association Rule Mining (Apriori Algorithm) — entirely frontend-based with no backend.

## Run & Operate

- `pnpm --filter @workspace/card-recommender run dev` — run the frontend (auto-assigned PORT)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, health check only)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS v4
- Routing: Wouter
- Animations: Framer Motion
- Charts: Recharts (PieChart, BarChart, RadarChart)
- Components: shadcn/ui (Radix UI primitives)
- State: React useState + localStorage for bookmarks/analytics
- No backend required — all data is in-memory from data files

## Where things live

- `artifacts/card-recommender/src/data/cards.ts` — 36 financial card dataset (Card type + cardsData array)
- `artifacts/card-recommender/src/data/associationRules.ts` — 20 association rules + 10 user preference patterns
- `artifacts/card-recommender/src/lib/apriori.ts` — Apriori algorithm, recommendation engine (getRecommendations, calculateCardScore)
- `artifacts/card-recommender/src/lib/localStorage.ts` — bookmarks and analytics persistence
- `artifacts/card-recommender/src/components/CardVisual.tsx` — animated credit card visual component
- `artifacts/card-recommender/src/components/Layout.tsx` — nav bar + footer + theme toggle
- `artifacts/card-recommender/src/components/ThemeProvider.tsx` — dark/light mode context
- `artifacts/card-recommender/src/pages/` — 8 pages (Home, Recommendations, Compare, CardDetails, Bookmarks, Analytics, Search, About)

## Architecture decisions

- Frontend-only by design: the Apriori algorithm runs in JavaScript in the browser; no server needed for recommendations
- Association rules are pre-mined and stored in `associationRules.ts`; the live algorithm applies them to user preferences at query time
- localStorage persists bookmarks and session analytics (card views, recommendation sessions, rule trigger counts) across page reloads
- ThemeProvider wraps the Layout; dark mode toggles a `.dark` class on `document.documentElement`
- CSS custom properties use HSL space-separated values (no `hsl()` wrapper) per Tailwind v4 convention

## Product

- **Home** — Hero, stats, 6 featured cards, 9 category browse, trending rules, how-it-works
- **AI Match** (`/recommendations`) — 12 preference toggles → Apriori analysis → ranked cards with support/confidence/lift + triggered rules table
- **Compare** (`/compare`) — up to 4 cards side-by-side, feature table with best-value highlights, radar chart, fee bar chart
- **Card Details** (`/cards/:id`) — full card page with CardVisual, benefits grid, applicable rules, related cards
- **Bookmarks** (`/bookmarks`) — saved cards with quick stats, localStorage-backed
- **Analytics** (`/analytics`) — dataset charts (category distribution, top-rated, cashback breakdown, fee distribution), sortable rules table
- **Search** (`/search`) — live search + filter sidebar (type, fee, rating, benefits, bank), 4 sort options
- **About** (`/about`) — algorithm explanation, metric definitions with examples, pseudocode, tech stack

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Google Fonts import must be the VERY FIRST line in index.css (before `@import "tailwindcss"`)
- CSS sidebar variable must be `--sidebar` (not `--sidebar-background`) for the theme tokens to resolve
- No DATABASE_URL needed — this project has no DB usage

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
