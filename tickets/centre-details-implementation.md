# Centre Details Page Implementation Plan

## Overview
Implement a detailed view for individual community centres that displays all activities available at that centre. This page should fetch data from `http://localhost:8000/centres/<centre_id>/normalized-activities` and present activities in an expandable accordion format with filtering capabilities.

## Current State Analysis

### Template Analysis (`templates/centre-details.html`)
- **Design System**:
  - Fonts: Fraunces (display), Plus Jakarta Sans (body)
  - Primary Color: `#A68971` (warm brown)
  - Background: `#F8F5F0` (warm cream)
  - Card Background: `#FFFFFF` (light) / `#252422` (dark)
  - Border Radius: `12px` default, `rounded-2xl` for cards
- **Layout Structure**:
  - Header: Breadcrumb navigation + Centre name + Location + Activity count badge
  - Sidebar (left): Filters panel with age input, date range selector, "show only available" toggle
  - Main Content: Expandable activity category cards with session tables
- **Key Features**:
  - Accordion-style expandable activity categories
  - Table view of sessions with columns: Activity Name, Day, Time, Age Group, Available Openings
  - Availability indicators (green = spots available, gray = full)
  - Hover effects on table rows
  - Custom scrollbar for activity session lists
  - Dark mode support

### API Response Format (`tickets/centre-activities.json`)
```json
{
  "name": "Basketball",           // Activity category name
  "centre_id": "697dc...",         // Centre ID
  "centre_name": "False Creek",    // Centre name
  "category": "sports",            // Activity category
  "total": 7,                      // Total number of sessions
  "examples": [                    // Sample activity names
    "Shooting Stars Academy - Girls Basketball Skill Development",
    "Night Hoops Basketball (False Creek)"
  ]
}
```

**Note**: The API currently returns activity summaries, not detailed session information (day, time, age group, availability). This plan assumes the backend will be extended to provide full session details, OR we will work with the summary data available.

### Existing Project Structure
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Components**: Located in `/app/components/`
- **Existing Pages**:
  - Home page with centre list and activity views
  - Toggle between "By Centre" and "Find Activity" views
- **Design Patterns**:
  - Server components for data fetching
  - Client components for interactivity
  - Consistent use of Material Symbols icons
  - Card-based layouts with hover effects

## Technical Requirements

### 1. Routing & Navigation
**New Route**: `/centres/[centreId]`
- Dynamic route using Next.js App Router
- Server-side data fetching for initial render
- SEO-friendly with proper meta tags

**Breadcrumb Navigation**:
- Link back to home page (centres list)
- Current centre name (non-clickable)

**Integration with Existing Pages**:
- Update `CentreCard.tsx` to link to centre details page
- Add click handler that navigates to `/centres/{centre._id}`
- Ensure smooth transition with Next.js Link component

### 2. Data Fetching

#### API Schema Definition
Create new schema in `lib/schemas/activity.ts`:

```typescript
export const activitySessionSchema = z.object({
  name: z.string(),
  date: z.string().optional(),
  day: z.string().optional(),
  time: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  ageGroup: z.string().optional(),
  availableSpots: z.number().optional(),
  totalSpots: z.number().optional(),
  type: z.string().optional(), // "Drop-in", "Seasonal", "Registration"
});

export const centreActivityGroupSchema = z.object({
  name: z.string(),
  centre_id: z.string(),
  centre_name: z.string(),
  category: z.string(),
  total: z.number(),
  examples: z.array(z.string()),
  sessions: z.array(activitySessionSchema).optional(),
});

export type ActivitySession = z.infer<typeof activitySessionSchema>;
export type CentreActivityGroup = z.infer<typeof centreActivityGroupSchema>;
```

#### API Endpoint Function
Create new function in `lib/api/endpoints/activities.ts`:

```typescript
export async function getCentreActivities(
  centreId: string,
  options?: RequestInit
): Promise<CentreActivityGroup[]> {
  const url = `${API_BASE_URL}/centres/${centreId}/normalized-activities`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch activities for centre ${centreId}`);
  }

  const data = await response.json();
  return z.array(centreActivityGroupSchema).parse(data);
}
```

#### Centre Details Fetching
Create function in `lib/api/endpoints/centres.ts`:

```typescript
export async function getCentreById(
  centreId: string,
  options?: RequestInit
): Promise<Centre> {
  const url = `${API_BASE_URL}/centres/${centreId}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch centre ${centreId}`);
  }

  const data = await response.json();
  return centreSchema.parse(data);
}
```

### 3. Component Architecture

#### New Page Component
**File**: `app/centres/[centreId]/page.tsx` (Server Component)

```typescript
interface PageProps {
  params: Promise<{ centreId: string }>;
}

export default async function CentreDetailsPage({ params }: PageProps) {
  const { centreId } = await params;

  const [centre, activities] = await Promise.all([
    getCentreById(centreId, { next: { revalidate: 3600 } }),
    getCentreActivities(centreId, { next: { revalidate: 3600 } }),
  ]);

  return (
    <div className="min-h-screen bg-[#F8F5F0] dark:bg-[#1A1917]">
      <CentreDetailsHeader
        centreName={centre.name}
        address={centre.address}
        totalActivities={activities.reduce((sum, group) => sum + group.total, 0)}
      />
      <CentreDetailsContent
        centre={centre}
        activities={activities}
      />
    </div>
  );
}
```

**Dynamic Metadata**:
```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { centreId } = await params;
  const centre = await getCentreById(centreId);

  return {
    title: `${centre.name} - Third Places Vancouver`,
    description: `Discover activities at ${centre.name}, located at ${centre.address}`,
  };
}
```

#### CentreDetailsHeader Component
**File**: `app/components/CentreDetailsHeader.tsx` (Server Component)

**Props**:
```typescript
interface CentreDetailsHeaderProps {
  centreName: string;
  address: string;
  totalActivities: number;
}
```

**Responsibilities**:
- Display breadcrumb navigation
- Show centre name and location with Material Icons
- Display total activities count badge
- Match template styling exactly

#### CentreDetailsContent Component
**File**: `app/components/CentreDetailsContent.tsx` (Client Component)

**Props**:
```typescript
interface CentreDetailsContentProps {
  centre: Centre;
  activities: CentreActivityGroup[];
}
```

**State Management**:
```typescript
const [ageFilter, setAgeFilter] = useState<string>('');
const [dateRange, setDateRange] = useState<string>('next-7-days');
const [showAvailableOnly, setShowAvailableOnly] = useState(false);
const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
```

**Responsibilities**:
- Layout with sidebar and main content area
- Manage filter state
- Filter activities based on user input
- Pass filtered data to child components

#### CentreDetailsSidebar Component
**File**: `app/components/CentreDetailsSidebar.tsx` (Client Component)

**Props**:
```typescript
interface CentreDetailsSidebarProps {
  ageFilter: string;
  onAgeFilterChange: (age: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  showAvailableOnly: boolean;
  onShowAvailableOnlyChange: (show: boolean) => void;
}
```

**Features**:
- Age input field with number validation
- Date range dropdown selector
- "Show only available" toggle switch
- Sticky positioning
- Consistent styling with existing sidebars

#### ActivityCategoryCard Component
**File**: `app/components/ActivityCategoryCard.tsx` (Client Component)

**Props**:
```typescript
interface ActivityCategoryCardProps {
  activity: CentreActivityGroup;
  isExpanded: boolean;
  onToggle: () => void;
  icon?: string; // Material Symbol icon name
  iconColor?: string;
}
```

**Features**:
- Expandable/collapsible accordion behavior
- Header with activity icon, name, session count
- Expand/collapse icon that rotates on state change
- Table of sessions when expanded (if session data available)
- Fallback to example list when session data unavailable
- Smooth transition animations

#### ActivitySessionsTable Component
**File**: `app/components/ActivitySessionsTable.tsx` (Component)

**Props**:
```typescript
interface ActivitySessionsTableProps {
  sessions: ActivitySession[];
}
```

**Features**:
- Responsive table/card layout
- Columns: Activity Name, Day, Time, Age Group, Available Openings
- Availability badges (green for available, gray for full)
- Hover effects on rows
- Custom scrollbar styling
- Empty state when no sessions available

### 4. Icon Mapping

**Reuse Existing System**: Leverage `lib/constants/activity-icons.ts`

**Extension for New Categories**:
- Map activity category names to Material Symbol icons
- Define color schemes for each category
- Fallback icon for unmapped categories

**Category to Icon Mapping**:
```typescript
const categoryIconMap: Record<string, string> = {
  'sports': 'sports_basketball',
  'fitness': 'fitness_center',
  'arts': 'palette',
  'aquatics': 'pool',
  'wellness': 'self_improvement',
  'education': 'school',
  'technology': 'computer',
  'music': 'music_note',
  // Add more as needed
};
```

### 5. Filtering Logic

**Age Filtering**:
```typescript
function matchesAgeFilter(session: ActivitySession, ageFilter: string): boolean {
  if (!ageFilter || !session.ageGroup) return true;

  const age = parseInt(ageFilter);
  const ageGroup = session.ageGroup.toLowerCase();

  // Parse age ranges like "Adult (19+)", "Teens (13-18)", "All Ages"
  if (ageGroup.includes('all ages')) return true;

  const match = ageGroup.match(/(\d+)[-+](\d+)?/);
  if (!match) return true;

  const min = parseInt(match[1]);
  const max = match[2] ? parseInt(match[2]) : Infinity;

  return age >= min && age <= max;
}
```

**Date Range Filtering**:
```typescript
function matchesDateRange(session: ActivitySession, range: string): boolean {
  if (!session.date) return true;

  const sessionDate = new Date(session.date);
  const today = new Date();

  switch (range) {
    case 'next-7-days':
      const sevenDaysLater = new Date(today);
      sevenDaysLater.setDate(today.getDate() + 7);
      return sessionDate >= today && sessionDate <= sevenDaysLater;

    case 'this-month':
      return sessionDate.getMonth() === today.getMonth();

    default:
      return true;
  }
}
```

**Availability Filtering**:
```typescript
function hasAvailableSpots(session: ActivitySession): boolean {
  if (!session.availableSpots && session.availableSpots !== 0) return true;
  return session.availableSpots > 0;
}
```

**Combined Filter**:
```typescript
const filteredActivities = useMemo(() => {
  return activities.map(group => ({
    ...group,
    sessions: group.sessions?.filter(session =>
      matchesAgeFilter(session, ageFilter) &&
      matchesDateRange(session, dateRange) &&
      (!showAvailableOnly || hasAvailableSpots(session))
    ) || [],
  })).filter(group => group.sessions && group.sessions.length > 0);
}, [activities, ageFilter, dateRange, showAvailableOnly]);
```

### 6. Styling Specifications

#### Color Palette
```css
/* Existing colors to maintain consistency */
--primary: #A68971;              /* Template color */
--background-light: #F8F5F0;     /* Template background */
--background-dark: #1A1917;      /* Dark mode background */
--card-light: #FFFFFF;           /* Card background light */
--card-dark: #252422;            /* Card background dark */
```

#### Typography
- **Display Font**: Fraunces (centre name, headings)
- **Body Font**: Plus Jakarta Sans (all other text)
- **Font Sizes**:
  - Centre Name: `text-3xl` (2rem)
  - Section Headers: `text-2xl` (1.5rem)
  - Activity Names: `text-lg font-bold` (1.125rem)
  - Body Text: `text-sm` (0.875rem)
  - Labels: `text-xs uppercase font-bold` (0.75rem)

#### Spacing & Layout
- **Page Padding**: `px-4 sm:px-6 lg:px-8`
- **Max Width**: `max-w-7xl mx-auto`
- **Sidebar Width**: `w-72` (288px)
- **Sidebar Sticky**: `sticky top-[61px] h-[calc(100vh-61px)]`
- **Card Spacing**: `space-y-4`
- **Border Radius**: `rounded-2xl` for cards, `rounded-lg` for inputs

#### Availability Indicators
```tsx
// Available (green)
<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-semibold">
  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
  {availableSpots} spots left
</div>

// Full (gray)
<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-semibold">
  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
  Full
</div>
```

#### Scrollbar Styling
```css
.activity-scroll-area::-webkit-scrollbar {
  width: 6px;
}
.activity-scroll-area::-webkit-scrollbar-track {
  background: transparent;
}
.activity-scroll-area::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .activity-scroll-area::-webkit-scrollbar-thumb {
  background: #334155;
}
```

### 7. Responsive Design

#### Breakpoints
- **Mobile**: `< 768px`
  - Stack sidebar above content
  - Hide table headers, use card layout for sessions
  - Full-width cards

- **Tablet**: `768px - 1024px`
  - Sidebar alongside content
  - Responsive table with abbreviated columns

- **Desktop**: `> 1024px`
  - Full layout with sidebar
  - Complete table view
  - Optimal spacing

#### Mobile Adaptations
```tsx
// Session table mobile view
<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
  {/* Mobile: Stack vertically */}
  {/* Desktop: 12-column grid */}
</div>

// Hide table headers on mobile
<div className="hidden md:grid grid-cols-12 ...">
  {/* Headers */}
</div>
```

### 8. Accessibility

**ARIA Labels**:
- Accordion buttons: `aria-expanded`, `aria-controls`
- Breadcrumb navigation: `aria-label="Breadcrumb"`
- Filter inputs: Proper `label` associations
- Toggle switches: `role="switch"`, `aria-checked`

**Keyboard Navigation**:
- Accordion toggle: `Enter` and `Space` keys
- Filter inputs: Standard form navigation
- Focus indicators on all interactive elements

**Screen Reader Support**:
- Semantic HTML (`<main>`, `<aside>`, `<nav>`)
- Descriptive alt text for icons (using `aria-label`)
- Status announcements for filter changes

### 9. Error Handling

**API Errors**:
```typescript
export default async function CentreDetailsPage({ params }: PageProps) {
  try {
    const { centreId } = await params;
    const [centre, activities] = await Promise.all([
      getCentreById(centreId),
      getCentreActivities(centreId),
    ]);

    // Render content
  } catch (error) {
    return <CentreNotFound />;
  }
}
```

**Not Found Component**:
```tsx
function CentreNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Centre Not Found</h1>
        <p className="text-slate-500 mb-8">
          The centre you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
```

**Empty States**:
- No activities available
- No sessions match filters
- Missing session data (show examples instead)

## Implementation Phases

### Phase 1: Routing & API Setup
**Goal**: Establish data flow from API to page

**Tasks**:
1. Create dynamic route `app/centres/[centreId]/page.tsx`
2. Define schemas in `lib/schemas/activity.ts`
3. Create `getCentreActivities()` in `lib/api/endpoints/activities.ts`
4. Create `getCentreById()` in `lib/api/endpoints/centres.ts`
5. Test API integration with a known centre ID

**Acceptance Criteria**:
- Can fetch centre details by ID
- Can fetch activities for a centre
- TypeScript types are correct
- Build passes without errors

### Phase 2: Page Structure & Header
**Goal**: Build page layout and header section

**Tasks**:
1. Create `CentreDetailsHeader.tsx` component
2. Implement breadcrumb navigation
3. Add centre name, address, and activity count badge
4. Style according to template specifications
5. Add dark mode support

**Acceptance Criteria**:
- Header displays all required information
- Breadcrumb links work correctly
- Styling matches template
- Responsive on mobile

### Phase 3: Sidebar & Filters
**Goal**: Implement filter sidebar

**Tasks**:
1. Create `CentreDetailsSidebar.tsx` component
2. Implement age input field
3. Implement date range dropdown
4. Implement "show only available" toggle
5. Add sticky positioning and proper spacing
6. Ensure consistent styling with existing sidebars

**Acceptance Criteria**:
- All filter inputs render correctly
- Sticky positioning works on scroll
- Matches sidebar styling from other pages
- Dark mode support

### Phase 4: Activity Categories & Accordion
**Goal**: Display activity categories with expand/collapse

**Tasks**:
1. Create `ActivityCategoryCard.tsx` component
2. Implement accordion expand/collapse logic
3. Add activity icons using Material Symbols
4. Map categories to icon colors
5. Add smooth transition animations
6. Handle expanded state management

**Acceptance Criteria**:
- Categories display with correct icons
- Click to expand/collapse works smoothly
- Icons rotate on state change
- Multiple categories can be expanded simultaneously

### Phase 5: Sessions Table
**Goal**: Display session details in table format

**Tasks**:
1. Create `ActivitySessionsTable.tsx` component
2. Implement responsive table/card layout
3. Add availability indicators
4. Add custom scrollbar styling
5. Handle empty states
6. Implement hover effects

**Acceptance Criteria**:
- Table displays all session fields correctly
- Availability badges show correct colors
- Scrolling works with custom scrollbar
- Mobile view uses card layout
- Empty state displays when no sessions

**Note**: If backend doesn't provide session details, show examples list instead of table as fallback.

### Phase 6: Filtering Logic
**Goal**: Filter sessions based on user input

**Tasks**:
1. Implement age filtering logic
2. Implement date range filtering logic
3. Implement availability filtering logic
4. Combine filters with useMemo for performance
5. Update activity counts when filters change
6. Handle edge cases (missing data, invalid input)

**Acceptance Criteria**:
- Age filter correctly filters sessions
- Date range filter works for all options
- Availability toggle filters correctly
- Filters work in combination
- Performance is acceptable with many activities

### Phase 7: Navigation Integration
**Goal**: Link centre list to details page

**Tasks**:
1. Update `CentreCard.tsx` to link to details page
2. Add click handler with proper routing
3. Ensure smooth navigation with Next.js Link
4. Add loading state during navigation
5. Test back navigation

**Acceptance Criteria**:
- Clicking centre card navigates to details
- URL updates correctly with centre ID
- Browser back button works
- Loading state is smooth

### Phase 8: Polish & Testing
**Goal**: Final refinements and quality assurance

**Tasks**:
1. Add loading skeletons for data fetching
2. Verify all accessibility features
3. Test keyboard navigation
4. Test dark mode thoroughly
5. Test responsive design on all breakpoints
6. Add error boundaries
7. Optimize performance
8. Cross-browser testing

**Acceptance Criteria**:
- Loading states are smooth
- All ARIA labels are correct
- Keyboard navigation works
- Dark mode works perfectly
- Responsive on all devices
- No console errors
- Performance is acceptable

## Data Assumptions & Fallbacks

### Backend Session Data Availability
**Assumption**: The API may not currently provide detailed session information (day, time, age group, availability).

**Fallback Strategy**:
1. **Primary**: If `sessions` array is available, display full table
2. **Fallback**: If only `examples` array available, display simple list:
   ```tsx
   <ul className="space-y-2 p-4">
     {activity.examples.map((example, i) => (
       <li key={i} className="text-slate-600 dark:text-slate-400">
         • {example}
       </li>
     ))}
   </ul>
   ```
3. **Empty**: If neither available, show "No session details available"

### Missing Data Handling
- **No centre address**: Hide location section
- **No activity count**: Hide badge
- **No category**: Use "general" category with default icon
- **No examples**: Show total count only

## Files to Create

1. **Route & Page**:
   - `app/centres/[centreId]/page.tsx`

2. **Components**:
   - `app/components/CentreDetailsHeader.tsx`
   - `app/components/CentreDetailsContent.tsx`
   - `app/components/CentreDetailsSidebar.tsx`
   - `app/components/ActivityCategoryCard.tsx`
   - `app/components/ActivitySessionsTable.tsx`

3. **API & Schemas**:
   - Update `lib/schemas/activity.ts` (add schemas)
   - Update `lib/api/endpoints/activities.ts` (add `getCentreActivities`)
   - Update `lib/api/endpoints/centres.ts` (add `getCentreById`)

4. **Styles** (if needed):
   - Update `app/globals.css` (add scrollbar styles if not present)

## Files to Modify

1. **Navigation Integration**:
   - `app/components/CentreCard.tsx` (add link to details page)

2. **Type Definitions**:
   - `lib/schemas/activity.ts` (ensure compatibility)

## Success Criteria

### Functional Requirements
- [ ] Navigate to centre details from centre list
- [ ] Display centre name, address, and total activities
- [ ] Show breadcrumb navigation with working links
- [ ] Filter activities by age
- [ ] Filter activities by date range
- [ ] Toggle "show only available" filter
- [ ] Expand/collapse activity categories
- [ ] Display session details in table format (or examples as fallback)
- [ ] Show availability indicators
- [ ] Handle empty states gracefully
- [ ] Handle API errors gracefully

### Visual Requirements
- [ ] Matches template design exactly
- [ ] Uses correct fonts (Fraunces, Plus Jakarta Sans)
- [ ] Uses correct colors (#A68971 primary, #F8F5F0 background)
- [ ] Activity icons display with correct colors
- [ ] Availability badges use correct colors
- [ ] Custom scrollbar styling applied
- [ ] Hover effects work smoothly
- [ ] Dark mode works correctly
- [ ] Responsive on mobile, tablet, desktop

### Technical Requirements
- [ ] TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Server-side rendering works
- [ ] ISR caching implemented (1 hour revalidation)
- [ ] ARIA labels are correct
- [ ] Keyboard navigation works
- [ ] Semantic HTML used throughout
- [ ] Performance is acceptable
- [ ] Build succeeds without errors

## Open Questions

### 1. Session Data Availability
**Question**: Does the backend provide detailed session information (day, time, age group, availability)?

**Impact**: Determines whether we show full table or fallback to examples list

**Action**: Check with backend team or inspect actual API response

### 2. Centre ID Format
**Question**: What format are centre IDs in the database? MongoDB ObjectId or custom format?

**Impact**: URL structure and validation

**Recommendation**: Use existing centre ID format from centres list

### 3. Accordion Default State
**Question**: Should the first activity category be expanded by default?

**Options**:
- A) All collapsed by default
- B) First category expanded
- C) Most popular category expanded

**Recommendation**: Option A (all collapsed) for cleaner initial view

### 4. Filter Persistence
**Question**: Should filter selections persist across page navigations?

**Options**:
- A) Reset filters on each page load
- B) Store in URL query params
- C) Store in localStorage

**Recommendation**: Option A initially, Option B for future enhancement

### 5. Activity Category Icons
**Question**: Should we use Material Symbols or custom icons?

**Impact**: Visual consistency and implementation complexity

**Recommendation**: Use Material Symbols for consistency with template

### 6. Mobile Filter Behavior
**Question**: On mobile, should filters be in a collapsible panel or always visible?

**Options**:
- A) Always visible (scroll to see)
- B) Collapsible panel at top
- C) Bottom sheet overlay

**Recommendation**: Option A for simplicity, Option B if many filters

### 7. Loading States
**Question**: What loading pattern should be used during data fetch?

**Options**:
- A) Full page skeleton
- B) Spinner in center
- C) Suspense with fallback

**Recommendation**: Option C (Suspense) for modern Next.js pattern

## Dependencies

### External Libraries
- **Already Installed**:
  - Next.js 15+
  - React 19+
  - TypeScript
  - Tailwind CSS
  - Zod (validation)
  - Material Symbols (icons)

- **No New Dependencies Required**

### Backend Requirements
- **API Endpoint**: `GET /centres/<centre_id>/normalized-activities`
- **Optional Enhancement**: Add detailed session information to response

### Design System Requirements
- **Fonts**: Fraunces, Plus Jakarta Sans (already loaded in template)
- **Icons**: Material Symbols Outlined (already available)

## Testing Strategy

### Manual Testing Checklist
1. **Navigation**:
   - [ ] Click centre card from home page
   - [ ] Breadcrumb "Centres" link returns to home
   - [ ] Browser back button works
   - [ ] Direct URL navigation works

2. **Filters**:
   - [ ] Age input accepts numbers
   - [ ] Age filter correctly filters sessions
   - [ ] Date range dropdown changes selection
   - [ ] Date range filter works
   - [ ] Availability toggle works
   - [ ] Combined filters work together
   - [ ] Clear filters resets state

3. **Accordion**:
   - [ ] Click to expand category
   - [ ] Click to collapse category
   - [ ] Multiple categories can be expanded
   - [ ] Icon rotates on state change
   - [ ] Smooth animation

4. **Responsive**:
   - [ ] Mobile: Sidebar stacks above content
   - [ ] Mobile: Table becomes cards
   - [ ] Tablet: Appropriate layout
   - [ ] Desktop: Full layout with sidebar

5. **Accessibility**:
   - [ ] Tab through all interactive elements
   - [ ] Enter/Space toggles accordion
   - [ ] Screen reader announces changes
   - [ ] Focus indicators visible

6. **Edge Cases**:
   - [ ] Invalid centre ID shows error
   - [ ] No activities available shows empty state
   - [ ] No sessions match filter shows message
   - [ ] Missing data fields handled gracefully

### Automated Testing (Future)
- Unit tests for filter functions
- Integration tests for data fetching
- E2E tests for user flows

## Performance Considerations

### Optimization Strategies
1. **Server-Side Rendering**: Initial page load with data
2. **ISR Caching**: Revalidate every hour to reduce API calls
3. **useMemo**: Memoize filtered activities to prevent re-computation
4. **Lazy Loading**: Load session details only when category expanded
5. **Image Optimization**: Use Next.js Image component if images added

### Expected Performance
- **Initial Load**: < 2 seconds (depends on API)
- **Filter Application**: < 100ms
- **Accordion Toggle**: < 50ms (smooth animation)
- **Navigation**: < 500ms with Next.js Link prefetch

## Future Enhancements

### Phase 2 Features (Post-MVP)
1. **Booking Integration**: "Register" or "Book" buttons for sessions
2. **Calendar View**: Display sessions in calendar format
3. **Map Integration**: Show centre location on map
4. **Share Functionality**: Share specific centre page
5. **Favorites**: Save favourite centres
6. **Notifications**: Alert when new activities added
7. **Advanced Filters**: Multi-select categories, price range, time of day
8. **Search**: Search within centre activities
9. **Sort Options**: Sort by date, availability, popularity
10. **Session Details Modal**: Click session for more info

## Timeline Estimate

**Total Effort**: ~16-20 hours

- **Phase 1**: API & Routing - 2-3 hours
- **Phase 2**: Page Structure & Header - 2 hours
- **Phase 3**: Sidebar & Filters - 2-3 hours
- **Phase 4**: Activity Categories - 2-3 hours
- **Phase 5**: Sessions Table - 2-3 hours
- **Phase 6**: Filtering Logic - 2 hours
- **Phase 7**: Navigation Integration - 1 hour
- **Phase 8**: Polish & Testing - 2-3 hours

**Note**: Timeline assumes session data is available from backend. Add 2-4 hours if backend changes are needed.

## Notes & Considerations

1. **Design Consistency**: This page uses a different design system than the existing home page (different fonts, colors). Ensure this is intentional or align with existing design.

2. **Backend Coordination**: Coordinate with backend team to ensure API returns necessary data, especially session details.

3. **Template vs. Reality**: The template shows detailed session information that may not be available in the API. Plan for graceful degradation.

4. **Accordion vs. Tabs**: Template uses accordion style. Consider if tabs might be better UX for some users.

5. **Mobile First**: Build mobile view first, then enhance for desktop.

6. **Accessibility**: This page has many interactive elements. Accessibility must be a priority.

7. **State Management**: Keep state management simple with useState for now. Consider Zustand or Context if state becomes complex.

8. **URL Structure**: Using `/centres/[centreId]` follows RESTful conventions and is SEO-friendly.

9. **Fallback Strategy**: The plan includes fallbacks for missing data to ensure robustness.

10. **Consistency Check**: Verify that fonts and colors in template match the rest of the application, or update as needed.
