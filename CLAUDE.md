# Claude Code Instructions

## Project Information

This is a Next.js 16 application for exploring Vancouver community centres and their activities.

## Package Manager

**IMPORTANT: This project uses Bun, not npm.**

Always use `bun` commands:
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun install` - Install dependencies
- `bun add <package>` - Add a dependency

## Tech Stack

- **Framework:** Next.js 16.1.6 with App Router
- **Runtime:** React 19.2.3
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/ui (with Radix UI primitives)
- **Query Library:** TanStack React Query
- **Icons:** Lucide React, Material Symbols Outlined
- **Validation:** Zod
- **Package Manager:** Bun

## Project Structure

```
app/
  components/        # React components
  activities/        # Activities page
  centres/           # Centre details pages
  layout.tsx         # Root layout
  page.tsx           # Home page (centres list)
  globals.css        # Global styles
lib/
  api/               # API endpoints and fetching
  schemas/           # Zod schemas
  hooks/             # Custom React hooks
  utils/             # Utility functions
  constants/         # Constants and configs
components/
  ui/                # Shadcn/ui components
```

## Design System

- **Primary Color:** `#8b7360` (warm earth tone)
- **Background:** `#F8F5EE` (warm cream)
- **Fonts:**
  - Sans: Inter
  - Serif: Playfair Display (for headings)
  - Mono: Geist Mono
- **Responsive Breakpoints:**
  - sm: 640px
  - md: 768px
  - lg: 1024px (primary mobile/desktop breakpoint)

## Mobile Responsiveness

The application is mobile-responsive:
- Sidebars hidden on mobile (< 1024px)
- Mobile filter drawers slide in from left
- Floating filter button on mobile
- Responsive padding and spacing
- Activity cards stack appropriately

## Development Notes

1. **Always use Bun** for all package management and script running
2. Tailwind v4 uses `@import "tailwindcss"` in CSS files
3. Material Symbols icons are loaded from Google Fonts CDN
4. The app uses server components by default, client components marked with "use client"
5. Data fetching uses Next.js fetch with revalidation

## Common Commands

```bash
# Development
bun run dev

# Build
bun run build

# Start production server
bun run start

# Lint
bun run lint

# Add a package
bun add <package>

# Add Shadcn component
bunx shadcn@latest add <component>
```

## API

The app fetches data from a backend API. Key endpoints:
- `/centres` - List of community centres
- `/activities` - List of aggregated activities
- `/centres/:id/activities` - Activities for a specific centre

## Important Patterns

1. **Sidebar Pattern:** Fixed width (w-80), sticky positioning, hidden on mobile
2. **Filter State:** Managed in parent components, passed to both desktop sidebar and mobile drawer
3. **Responsive Layout:** Use `flex-col lg:flex-row` for desktop sidebar layouts
4. **Mobile Filters:** Floating button (bottom-right) triggers slide-out drawer from left

## Testing

Always test responsive behavior at these breakpoints:
- 320px (iPhone SE)
- 375px (iPhone 12/13)
- 428px (iPhone 14 Pro Max)
- 768px (Tablet)
- 1024px (Desktop)
