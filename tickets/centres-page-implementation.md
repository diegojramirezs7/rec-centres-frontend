# Home Page Implementation - Third Places Vancouver

## Description

Transform the current basic homepage (`app/page.tsx`) into a fully functional, visually polished community centre discovery page following the design in `home-template.html`. The page will serve as the main entry point for users to browse Vancouver recreation centres, with search and filtering capabilities, following the Thirdplaces design system.

This implementation includes:
- Complete UI overhaul matching the template's layout and styling
- Integration of the design system tokens (brand colors, typography)
- Client-side interactivity for search and filters
- Responsive design for mobile, tablet, and desktop
- Accessibility improvements with proper semantic HTML

---

## Acceptance Criteria

### Visual Design
- [ ] Header matches template: logo, "Third Places Vancouver" branding, About link
- [ ] Hero section with page title, subtitle, action buttons, and view toggle (By Centre/By Activity)
- [ ] Left sidebar with search input and neighborhood filter list
- [ ] Main content displays centres as list items (not grid) with hover effects
- [ ] Each centre card shows: neighborhood badge, activity count, name, address, example activities, arrow icon
- [ ] Design system colors used throughout (brand-brown, brand-cream, semantic tokens)
- [ ] Typography uses Georgia/serif for headings (font-display), Inter/sans-serif for body
- [ ] Material Symbols Outlined icons integrated
- [ ] Responsive layout: stacked on mobile, sidebar + list on desktop

### Functionality
- [ ] Search filters centres by name (case-insensitive, live filtering)
- [ ] Neighborhood filter shows "All Areas" + unique neighborhoods from data
- [ ] Active filter state visually indicated with sidebar-link-active style
- [ ] View toggle UI present but "By Activity" is non-functional (shows placeholder message)
- [ ] "Find Nearest Centre" button present but non-functional (no action on click)
- [ ] Hover states on interactive elements (cards, buttons, links)
- [ ] Server-side data fetching preserved (no regression on existing getCentres call)
- [ ] Centre cards are static (not clickable/expandable - deferred to future)

### Code Quality
- [ ] Component structure: extract Header, Hero, Sidebar, CentreList components
- [ ] Client components clearly separated from server components
- [ ] TypeScript types for all props and state
- [ ] Design system tokens imported and used correctly
- [ ] No hardcoded colors (use design system variables)
- [ ] Proper use of Next.js app router patterns

---

## High-Level Implementation Plan

### Phase 1: Design System Integration
**Objective:** Set up the foundation with fonts, colors, and CSS variables

1. **Update `app/globals.css`**
   - Add design system color tokens to `@theme inline` block
   - Include brand-brown (900, 700, 500) and brand-cream (50, 100, 200, 300)
   - Add semantic tokens: text-*, background-*, border-*
   - Define font families: font-serif (Georgia), font-sans (Inter)
   - Add custom CSS for hover effects (list-item-hover, sidebar-link styles)

2. **Add Google Fonts**
   - Update `app/layout.tsx` to load Inter (weights: 300, 400, 500, 600)
   - Load Playfair Display (weights: 400, 700, italic)
   - Load Material Symbols Outlined icon font
   - Configure font variables for use in Tailwind

3. **Verify Tailwind Configuration**
   - Ensure Tailwind v4 can read custom color tokens from globals.css
   - Test that semantic color classes work (bg-brand-brown-900, text-brand-cream-50, etc.)

---

### Phase 2: Static Layout Structure
**Objective:** Build the HTML structure and non-interactive styling

1. **Create Header Component** (`app/components/Header.tsx`)
   - Logo circle with home_work icon
   - "Third Places Vancouver" text with font-display (Playfair Display italic)
   - About navigation link
   - Sticky positioning with backdrop blur
   - Use brand colors for logo background

2. **Create Hero Section** (`app/components/Hero.tsx`)
   - Page title: "Find Your Community Centre" (h1, font-display, large)
   - Subtitle: "Discover local spaces..."
   - "Find Nearest Centre" button with near_me icon
   - View toggle pills: "By Centre" (active) / "By Activity" (inactive)
   - Responsive flex layout (column on mobile, row on desktop)

3. **Create Sidebar Component** (`app/components/Sidebar.tsx`)
   - Search input with magnifying glass icon
   - "Neighbourhoods" section header
   - Navigation links for neighborhoods (initially static)
   - Sticky positioning (top-32) for scroll persistence
   - Use sidebar-link and sidebar-link-active classes

4. **Create CentreCard Component** (`app/components/CentreCard.tsx`)
   - Props: CommunityCentre data
   - Neighborhood badge (small, uppercase, subtle bg)
   - Activity count text (muted)
   - Centre name (h2, font-display, text-3xl)
   - Address (small, muted)
   - Example activities as rounded pills (limit to 3)
   - Forward arrow icon (transitions on hover)
   - Hover effect: subtle background color change

5. **Update `app/page.tsx`**
   - Keep server component for getCentres()
   - Compose layout: Header + Hero + main (Sidebar + CentreList)
   - Pass centres data down to client components
   - Use max-w-7xl container, proper spacing

---

### Phase 3: Client-Side Interactivity
**Objective:** Add search, filtering, and interactive state

1. **Create CentreList Client Component** (`app/components/CentreList.tsx`)
   - Mark as "use client"
   - State for searchQuery, selectedNeighborhood
   - Derive filtered centres from props.centres + filters
   - Render CentreCard for each filtered centre
   - Show empty state if no results

2. **Make Sidebar Interactive**
   - Convert to client component or extract filter controls
   - Search input with onChange handler
   - Neighborhood links with click handlers
   - Extract unique neighborhoods from centres data
   - Highlight active neighborhood
   - Clear filters when "All Areas" clicked

3. **Make Hero Interactive**
   - View toggle state (byCentre vs byActivity)
   - Toggle pill styling based on active state
   - When "By Activity" clicked, show placeholder message ("Coming soon" or similar)
   - "Find Nearest Centre" button renders but has no onClick handler (deferred)
   - Future: geolocation integration, actual activity view

4. **Add Hover States and Transitions**
   - List item hover background (list-item-hover class)
   - Arrow color transition on hover (text-stone-300 → text-primary)
   - Button hover effects (bg-primary → bg-stone-700)
   - Link hover effects (text-stone-500 → text-stone-900)

---

### Phase 4: Responsive Design
**Objective:** Ensure mobile, tablet, desktop layouts work correctly

1. **Mobile (< 768px)**
   - Stacked layout: Header → Hero → Sidebar → List
   - Hero buttons stack vertically
   - Sidebar not sticky (normal flow)
   - Cards full width

2. **Tablet (768px - 1024px)**
   - Hero buttons in row
   - Sidebar + List side-by-side
   - Sidebar narrow (w-64)

3. **Desktop (> 1024px)**
   - Full layout with max-w-7xl container
   - Sidebar sticky with top-32 offset
   - List items with comfortable padding
   - Hover effects prominent

---

### Phase 5: Polish & Accessibility
**Objective:** Final touches for production readiness

1. **Accessibility**
   - Semantic HTML (header, main, aside, nav)
   - ARIA labels for icon buttons
   - Keyboard navigation for filters
   - Focus states on interactive elements
   - Alt text for icons (use aria-label on Material Symbols)

2. **Performance**
   - Verify server component caching (revalidate: 3600)
   - Minimize client bundle size (split components)
   - Optimize font loading (font-display: swap)

3. **Dark Mode**
   - Keep dark mode classes from template (dark:bg-*, dark:text-*) for future use
   - NO dark mode toggle in UI (deferred to future)
   - Will respect system preference automatically via Tailwind's dark mode classes

4. **Edge Cases**
   - Empty state when no centres match filters
   - Long centre names (text overflow)
   - Missing example_activities (show placeholder or hide section)
   - Neighborhoods with special characters

---

## Component Hierarchy

```
app/page.tsx (Server Component)
├── Header (Client Component)
├── Hero (Client Component)
│   ├── Find Nearest Button
│   └── View Toggle
└── main
    ├── Sidebar (Client Component)
    │   ├── Search Input
    │   └── Neighbourhood Filter List
    └── CentreList (Client Component)
        └── CentreCard[] (Client Component)
```

---

## Design System Mapping

| Template Style | Design System Token | Tailwind Class |
|----------------|---------------------|----------------|
| Primary color (#8b7360) | brand-brown-700 | bg-brand-brown-700 |
| Background light (#fdfcf9) | brand-cream-50 | bg-brand-cream-50 |
| Background (#ffffff) | brand-cream-50 | bg-brand-cream-50 |
| Border (#d4c4b0) | brand-cream-300 | border-brand-cream-300 |
| Text primary | text-primary (#6b5d4f) | text-text-primary |
| Text muted | text-muted (#a0826d) | text-text-muted |
| Playfair Display | font-serif | font-serif |
| Inter | font-sans | font-sans |

Note: Template uses stone-* colors from Tailwind. We'll map these to design system:
- stone-900 → text-primary
- stone-500 → text-secondary
- stone-400 → text-muted
- stone-100 → brand-cream-200

---

## Data Flow

1. **Server**: `page.tsx` fetches centres via `getCentres()` with ISR (revalidate: 3600)
2. **Props**: Pass centres array to `<CentreList centres={centres} />`
3. **Client State**: CentreList maintains searchQuery and selectedNeighborhood
4. **Derived State**: Filter centres array based on search + neighborhood
5. **Render**: Map filtered centres to CentreCard components

---

## Testing Checklist

- [ ] All centres display correctly with real API data
- [ ] Search filters work (try partial names, case variations)
- [ ] Neighborhood filter shows all unique neighborhoods
- [ ] Clicking neighborhood filters the list
- [ ] "All Areas" resets filter
- [ ] Hover effects work on cards, buttons, links
- [ ] Page loads fast (check Network tab for font loading)
- [ ] Responsive breakpoints work (resize browser window)
- [ ] No console errors or warnings
- [ ] TypeScript compiles without errors

---

## Explicitly Deferred Features (Do NOT Implement)

These features are in the template but should NOT be implemented in this phase:
- [ ] "By Activity" view functionality (show placeholder only)
- [ ] "Find Nearest Centre" button functionality (render button, no action)
- [ ] Expandable panels on centre cards (cards are static)
- [ ] Sorting by distance or any sorting UI
- [ ] Dark mode toggle (keep CSS classes, no toggle UI)
- [ ] Clickable centre cards / navigation to detail pages

## Future Enhancements (Post-MVP)

- [ ] Implement "By Activity" view (group centres by activities)
- [ ] Implement "Find Nearest Centre" geolocation feature
- [ ] Make centre cards clickable/expandable (link to detail page)
- [ ] Add sorting options (alphabetical, by activity count, by distance)
- [ ] Persist filter state in URL query params
- [ ] Add loading states and skeletons
- [ ] Add dark mode toggle UI
- [ ] Add map view
