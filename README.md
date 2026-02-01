# Vancouver Recreation Centres - Frontend

A Next.js 16 application for browsing Vancouver recreation centres and their activities.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Package Manager**: Bun
- **Data Fetching**: Native fetch + TanStack Query (React Query)
- **Validation**: Zod
- **Backend API**: FastAPI (http://localhost:8000)

## Getting Started

### Prerequisites

- Bun installed
- Backend API running on http://localhost:8000

### Installation

```bash
bun install
```

### Environment Setup

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
bun dev
```

Visit:
- http://localhost:3000 - Server Component example
- http://localhost:3000/client-example - Client Component example

### Verify API

Test the API infrastructure:

```bash
bun run verify-api.ts
```

## Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (Server Component)
│   ├── client-example/          # Client Component example
│   └── providers.tsx            # React Query provider
├── lib/
│   ├── api/                     # API client layer
│   │   ├── client.ts           # Base fetch wrapper
│   │   ├── errors.ts           # Custom error classes
│   │   └── endpoints/          # API endpoint functions
│   ├── config/
│   │   └── env.ts              # Environment validation
│   ├── hooks/                   # React Query hooks
│   │   ├── use-centres.ts
│   │   └── use-activities.ts
│   └── schemas/                 # Zod schemas & types
│       ├── centre.ts
│       └── activity.ts
└── public/                      # Static assets
```

## API Infrastructure

The application uses a complete type-safe API layer:

### Server Components (Recommended)

```typescript
import { getCentres } from "@/lib/api/endpoints";

export default async function Page() {
  const centres = await getCentres({
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  return <div>{/* render */}</div>;
}
```

### Client Components

```typescript
"use client";
import { useCentres } from "@/lib/hooks";

export default function Page() {
  const { data, isLoading, error } = useCentres();
  // ...
}
```

### Available Endpoints

**Centres:**
- `getCentres()` - Get all community centres
- `getCentreActivities(centreId)` - Get activities for a centre
- `getCentreActivityDetails(centreId, activityName)` - Get activity details

**Activities:**
- `getNormalizedActivities()` - Get all activity types
- `getActivitiesByName(name)` - Get activities by name

### Available Hooks

**Centres:**
- `useCentres()` - Fetch all centres
- `useCentreActivities(centreId)` - Fetch centre activities
- `useCentreActivityDetails(centreId, activityName)` - Fetch activity details

**Activities:**
- `useNormalizedActivities()` - Fetch activity types
- `useActivitiesByName(name)` - Fetch activities by name

## Type Safety

All API responses are validated at runtime with Zod and typed with TypeScript:

```typescript
import type { CommunityCentre, Activity } from "@/lib/schemas";

// Full type safety from API to UI
const centres: CommunityCentre[] = await getCentres();
```

## Documentation

- [API Infrastructure Guide](./API_INFRASTRUCTURE.md) - Complete API documentation
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Implementation details

## Features

✅ Full TypeScript type safety
✅ Runtime validation with Zod
✅ React Query for client-side state management
✅ Next.js caching and revalidation
✅ Custom error handling
✅ Environment variable validation
✅ Server and Client component patterns
✅ Auto-complete and type inference

## Building for Production

```bash
bun run build
bun start
```

## License

MIT
