# API Data Fetching Infrastructure

This document describes the complete API data fetching layer that connects the Next.js frontend with the FastAPI backend.

## Overview

The infrastructure provides:
- Type-safe API clients with Zod validation
- React Query hooks for client-side data fetching
- Server Component support with Next.js caching
- Custom error handling
- Environment variable validation

## Technology Stack

- **Validation**: Zod (runtime validation + TypeScript type inference)
- **HTTP Client**: Native fetch with custom wrapper
- **Client State Management**: TanStack Query (React Query)
- **Error Handling**: Custom error classes

## Directory Structure

```
frontend/
├── lib/
│   ├── config/
│   │   └── env.ts              # Environment variable validation
│   ├── schemas/
│   │   ├── centre.ts           # CommunityCentre schema + type
│   │   ├── activity.ts         # Activity schemas + types
│   │   └── index.ts            # Export all schemas
│   ├── api/
│   │   ├── errors.ts           # Custom error classes
│   │   ├── client.ts           # Base API client
│   │   └── endpoints/
│   │       ├── centres.ts      # Centre-related API calls
│   │       ├── activities.ts   # Activity-related API calls
│   │       └── index.ts        # Export all endpoints
│   └── hooks/
│       ├── use-centres.ts      # React Query hooks for centres
│       ├── use-activities.ts   # React Query hooks for activities
│       └── index.ts            # Export all hooks
└── app/
    ├── providers.tsx           # QueryClientProvider wrapper
    └── layout.tsx              # Includes providers
```

## Usage Examples

### Server Component (Recommended for SSR)

```typescript
import { getCentres } from "@/lib/api/endpoints";

export default async function CentresPage() {
  const centres = await getCentres({
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  return (
    <div>
      {centres.map((centre) => (
        <div key={centre.id}>{centre.name}</div>
      ))}
    </div>
  );
}
```

### Client Component with React Query

```typescript
"use client";

import { useCentres } from "@/lib/hooks";

export default function ClientCentresPage() {
  const { data: centres, isLoading, error } = useCentres();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {centres?.map((centre) => (
        <div key={centre.id}>{centre.name}</div>
      ))}
    </div>
  );
}
```

### Fetch Centre Activities

```typescript
import { getCentreActivities } from "@/lib/api/endpoints";

const activities = await getCentreActivities(centreId, {
  next: { revalidate: 1800 }, // Cache for 30 minutes
});
```

### Client Hook for Centre Activities

```typescript
"use client";

import { useCentreActivities } from "@/lib/hooks";

function CentreActivities({ centreId }: { centreId: number }) {
  const { data, isLoading } = useCentreActivities(centreId);
  // ... render activities
}
```

## Available Endpoints

### Centres

- `getCentres()` → GET /centres
- `getCentreActivities(centreId)` → GET /centres/{id}/normalized-activities
- `getCentreActivityDetails(centreId, activityName)` → GET /centres/{id}/activities/{name}

### Activities

- `getNormalizedActivities()` → GET /normalized-activities
- `getActivitiesByName(name)` → GET /activities/{name}

## Available Hooks

### Centre Hooks

- `useCentres()` - Fetch all centres
- `useCentreActivities(centreId)` - Fetch activities for a centre
- `useCentreActivityDetails(centreId, activityName)` - Fetch activity details

### Activity Hooks

- `useNormalizedActivities()` - Fetch all normalized activities
- `useActivitiesByName(name)` - Fetch activities by name

## Type Safety

All API responses are validated at runtime using Zod schemas and typed with TypeScript:

```typescript
import type { CommunityCentre, Activity, NormalizedActivity } from "@/lib/schemas";

// TypeScript knows the exact shape of the data
const centres: CommunityCentre[] = await getCentres();
```

## Error Handling

The infrastructure includes custom error classes:

- `APIError` - API request failures (4xx, 5xx responses)
- `ValidationError` - Zod validation failures
- `NetworkError` - Network/fetch failures

```typescript
try {
  const centres = await getCentres();
} catch (error) {
  if (error instanceof APIError) {
    console.error("API Error:", error.status, error.message);
  } else if (error instanceof ValidationError) {
    console.error("Validation Error:", error.errors);
  } else if (error instanceof NetworkError) {
    console.error("Network Error:", error.message);
  }
}
```

## Environment Variables

Set the API URL in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, create `.env.production`:

```bash
NEXT_PUBLIC_API_URL=https://your-production-api.com
```

## React Query Configuration

The QueryClient is configured with sensible defaults:

```typescript
{
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
}
```

You can override these on a per-query basis:

```typescript
const { data } = useCentres({
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: true,
});
```

## Next.js Caching

Server Components support Next.js caching options:

```typescript
// Cache for 1 hour
const centres = await getCentres({
  next: { revalidate: 3600 }
});

// No caching (always fresh)
const centres = await getCentres({
  cache: 'no-store'
});

// Use cache tags for on-demand revalidation
const centres = await getCentres({
  next: { tags: ['centres'] }
});
```

## Testing the Setup

1. Start the backend:
   ```bash
   cd ../backend
   uvicorn src.main:app --reload
   ```

2. Start the frontend:
   ```bash
   bun dev
   ```

3. Visit:
   - http://localhost:3000 - Server Component example
   - http://localhost:3000/client-example - Client Component example

## Benefits

- **Full Type Safety**: TypeScript types inferred from Zod schemas
- **Runtime Validation**: API responses validated at runtime
- **Next.js Optimized**: Works with Server Components and caching
- **React Query Features**: Automatic caching, refetching, optimistic updates
- **Error Handling**: Clear, typed error messages
- **Developer Experience**: Full auto-complete and type inference
- **Maintainable**: Clean separation of concerns
- **Scalable**: Easy to add new endpoints
