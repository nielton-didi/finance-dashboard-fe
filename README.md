# finance-dashboard-fe

Next.js frontend for the finance dashboard, built with shadcn/ui. Talks to the
`finance-dashboard-be` API (sibling repo) for auth, organizations, and reports — see
[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for how the two repos fit together.

## Prerequisites

- Node.js 20+
- The `finance-dashboard-be` backend running locally (or reachable elsewhere) — see its
  README for setup. Default port is `3001`.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example env file and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Description | Default |
   |---|---|---|
   | `BACKEND_API_URL` | Base URL of the `finance-dashboard-be` API | `http://localhost:3001` |

3. Start the backend (in the sibling `finance-dashboard-be` repo) if it isn't already
   running.

4. Run the dev server:

   ```bash
   npm run dev
   ```

   The app runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | Type-check with `tsc --noEmit` |

## Adding shadcn/ui components

```bash
npx shadcn@latest add button
```

This places the component in the `components` directory. Import it as:

```tsx
import { Button } from "@/components/ui/button"
```
