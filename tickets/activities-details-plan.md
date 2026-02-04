# Activity Details Page Implementation Plan

## Overview
Create a new page that displays all activity sessions for a specific normalized activity type (e.g., "Basketball", "Tennis"). When users click on an activity card from the activities list view, they navigate to this page which shows all specific activity sessions across all community centres for that activity type.

## Purpose
This page bridges the gap between:
- **Activity List View** (shows normalized activities like "Basketball" with aggregate counts)
- **Activity Sessions** (shows specific programs like "Adult Basketball Drop-in", "Teen Basketball League")

## Page Flow
```
Home Page (Activities Tab)
  → Activity Card: "Basketball" (23 activities across 5 centres)
    → Click "Explore"
      → Activity Details Page: "Basketball Schedules"
        → Shows table of all 23 basketball sessions with details
```

## Current State

### Existing API Integration
**Endpoint**: `GET /activities/:name`
- **Function**: `getActivitiesByName(name, options?)` in `lib/api/endpoints/activities.ts`
- **Schema**: `activitySchema` in `lib/schemas/activity.ts`
- **Status**: ✅ Already implemented

**Sample Response** (Array of Activity objects):
```json
[
  {
    "id": 581081,
    "name": "Tennis Academy - Future Stars (9-14yrs)",
    "desc": "This class continues to develop tennis skills...",
    "centre_id": "697dc62dddfff1d0ecc38033",
    "centre_name": "Britannia",
    "category_id": "27",
    "date_range_start": "2026-01-17",
    "date_range_end": "2026-03-07",
    "date_range": "January 17, 2026 to March 7, 2026",
    "time_range": "3:30 PM - 5:00 PM",
    "days_of_week": "Sat",
    "age_min_year": 8,
    "age_max_year": 15,
    "ages": "At least 8y 9m but less than 15",
    "openings": 3,
    "enroll_url": "https://...",
    "normalized_activity_type": "Tennis"
  }
]
```

### Template Reference
**File**: `templates/activities-details.html`

**Key Features**:
- Breadcrumb navigation: Activities > {Activity Name}
- Hero section: "{Activity Name} Schedules"
- Filter buttons: Any Date, All Ages, Has Openings, Close to Me
- Table header: Program & Location | Date & Time | Date Range | Openings
- Session rows with hover effects
- Availability badges (color-coded by openings)
- Dark mode support

**Design Tokens**:
- Primary Color: `#9D836F` (taupe/tan)
- Background: `#F5F2EA` (cream)
- Card Background: `#FFFFFF` (light) / `#1E1E1E` (dark)
- Fonts: Playfair Display (headings), Inter (body)
- Border Radius: `12px` default, `16px` large

### Related Pages
1. **Home Page** (`app/page.tsx`)
   - Activities tab shows `ActivityListView` component
   - Contains `ActivityCard` components (not yet linked)

2. **Centre Details Page** (`app/centres/[centreId]/page.tsx`)
   - Similar pattern with filters and accordion
   - Can reuse sidebar component patterns
   - Uses lazy-loading for activity details

### Available Components
- `ActivityCard.tsx` - Shows normalized activity summary (needs link)
- `ActivitySidebar.tsx` - Sidebar for activities list (reference)
- `CentreDetailsSidebar.tsx` - Sidebar with filters (can adapt)
- `ActivitySessionsTable.tsx` - Table for displaying sessions (can reuse!)
- `CentreDetailsHeader.tsx` - Header with breadcrumb (reference)

## Requirements

### Functional Requirements

#### 1. Routing & Navigation
- **Route**: `/activities/[name]`
  - Example: `/activities/Basketball`
  - Dynamic route using Next.js App Router
  - URL-encode activity names with spaces
- **Navigation Source**: Click "Explore" button on `ActivityCard`
- **Breadcrumb**:
  - "Activities" (link to home with activities tab active)
  - "{Activity Name}" (current page)

#### 2. Data Fetching
- **Method**: Server-side fetch in page component
- **API Call**: `getActivitiesByName(name, { next: { revalidate: 3600 } })`
- **Error Handling**: Show 404 if activity not found
- **Revalidation**: 1 hour ISR caching

#### 3. Filtering Capabilities
Based on template and similar to centre details page:

**Date Range Filter**:
- Options: All Dates, Next 7 Days, This Month, Next Month
- Filter by `date_range_start` field
- Default: "All Dates"

**Age Filter**:
- Numeric input field
- Filter by `age_min_year` and `age_max_year`
- Logic: User age must be within session's age range
- Placeholder: "Enter age"

**Availability Filter**:
- Toggle: "Has Openings"
- Filter by `openings > 0`
- Default: Off (show all)

**Location Filter** (Future Enhancement):
- Toggle: "Close to Me"
- Requires geolocation API
- Filter by centre proximity
- Defer to Phase 2

#### 4. Display Components
**Header Section**:
- Breadcrumb navigation
- Activity name + " Schedules" title
- Subtitle: "{Activity name} sessions across all community centres."
- Filter buttons (Date, Age, Has Openings)

**Sessions Table**:
- Desktop: Full table with columns
  - Program & Location (activity name + centre)
  - Date & Time (days_of_week + time_range)
  - Date Range (formatted date_range)
  - Openings (badge with color coding)
- Mobile: Card layout (stacked)
- Hover effects on rows
- Clickable rows → open `enroll_url` in new tab

**Empty States**:
- No sessions found: "No sessions available for this activity"
- No matches for filters: "No sessions match your filters"

### Visual Requirements

#### Color Coding for Availability
```tsx
openings >= 10:  green (many spots)
openings 1-9:    amber (few spots)
openings === 0:  red (full/waitlist)
```

#### Responsive Breakpoints
- **Mobile** (`< 768px`):
  - Hide table headers
  - Stack filter buttons
  - Card layout for sessions

- **Tablet** (`768px - 1024px`):
  - Show abbreviated table
  - 2-column filter layout

- **Desktop** (`> 1024px`):
  - Full table layout
  - Horizontal filter buttons

#### Spacing & Layout
- Max width: `max-w-7xl mx-auto`
- Padding: `px-6` horizontal, `py-12` vertical
- Filter buttons: `space-x-3` gap
- Session cards: `space-y-3` gap

## Implementation Plan

### Phase 1: Page Structure & Routing
**Goal**: Create the page route and basic structure

**Tasks**:
1. Create `app/activities/[name]/page.tsx`
2. Implement `generateMetadata()` for SEO
3. Set up server-side data fetching with error handling
4. Add 404 handling via `notFound()`

**Deliverables**:
- Dynamic route that accepts activity name
- Server component that fetches activity data
- Proper TypeScript types
- SEO-friendly metadata

**Acceptance Criteria**:
- Can navigate to `/activities/Basketball`
- Page fetches data from API
- Shows 404 for invalid activity names
- TypeScript compiles without errors

---

### Phase 2: Header Component
**Goal**: Build page header with breadcrumb and title

**Tasks**:
1. Create `ActivityDetailsHeader.tsx` component
2. Implement breadcrumb navigation
   - "Activities" link to home page
   - Current activity name (non-clickable)
3. Add hero section with title
4. Style according to template specs

**Component Props**:
```typescript
interface ActivityDetailsHeaderProps {
  activityName: string;
  totalSessions: number;
}
```

**Deliverables**:
- Reusable header component
- Breadcrumb with proper links
- Responsive typography

**Acceptance Criteria**:
- Header displays activity name correctly
- Breadcrumb links to home page
- Matches template styling
- Responsive on all screen sizes

---

### Phase 3: Filter Section
**Goal**: Implement filter UI (functionality in Phase 5)

**Tasks**:
1. Create `ActivityDetailsFilters.tsx` component
2. Add Date Range dropdown button
3. Add Age input field
4. Add "Has Openings" toggle button
5. Style as pill buttons matching template
6. Add proper icons using Material Symbols

**Component Props**:
```typescript
interface ActivityDetailsFiltersProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  ageFilter: string;
  onAgeFilterChange: (age: string) => void;
  showAvailableOnly: boolean;
  onShowAvailableOnlyChange: (show: boolean) => void;
}
```

**Deliverables**:
- Filter button UI
- Dropdown for date range
- Input for age
- Toggle for availability

**Acceptance Criteria**:
- All filter inputs render correctly
- Buttons have proper hover states
- Icons display correctly
- Matches template design

---

### Phase 4: Sessions Display
**Goal**: Display activity sessions in table format

**Options**:
- **Option A**: Reuse `ActivitySessionsTable.tsx` from centre details
  - Pros: Already built, tested, has filtering logic
  - Cons: May need minor adjustments for different context

- **Option B**: Create new `ActivitySessionsList.tsx` component
  - Pros: Custom-built for this page
  - Cons: Duplicate code/logic

**Recommendation**: **Option A** - Reuse and adapt if needed

**Tasks**:
1. Adapt `ActivitySessionsTable.tsx` or create wrapper
2. Map Activity fields to table columns:
   - Program & Location: `name` + `centre_name`
   - Date & Time: `days_of_week` + `time_range`
   - Date Range: `date_range` (formatted)
   - Openings: `openings` with color-coded badge
3. Add hover effects and clickable rows
4. Handle missing data gracefully
5. Add mobile responsive card layout

**Field Mapping**:
```typescript
// Desktop Table Columns
Column 1: name + centre_name
Column 2: days_of_week + time_range
Column 3: date_range (formatted)
Column 4: openings badge
```

**Deliverables**:
- Table component displaying all sessions
- Responsive layout
- Clickable rows (open enroll_url)

**Acceptance Criteria**:
- Table displays all session data
- Availability badges show correct colors
- Rows are clickable and open registration links
- Mobile view uses card layout
- Missing data shows "-" or is hidden

---

### Phase 5: Client-Side Filtering
**Goal**: Implement filter logic that updates the table

**Tasks**:
1. Create `ActivityDetailsContent.tsx` client component
2. Manage filter state (dateRange, ageFilter, showAvailableOnly)
3. Implement filtering functions:
   - `filterByDateRange(sessions, range)`
   - `filterByAge(sessions, age)`
   - `filterByAvailability(sessions, showAvailableOnly)`
4. Use `useMemo` for performance
5. Pass filtered sessions to table component
6. Handle empty filter results

**Filter Logic** (reuse from centre details):

**Age Filtering**:
```typescript
const userAge = parseInt(ageFilter);
const minAge = session.age_min_year || 0;
const maxAge = session.age_max_year || Infinity;
const effectiveMaxAge = maxAge === 0 ? Infinity : maxAge;
return userAge >= minAge && userAge <= effectiveMaxAge;
```

**Date Range Filtering**:
```typescript
const sessionStart = new Date(session.date_range_start);
const today = new Date();

switch (dateRange) {
  case 'next-7-days':
    const sevenDays = new Date(today);
    sevenDays.setDate(today.getDate() + 7);
    return sessionStart >= today && sessionStart <= sevenDays;

  case 'this-month':
    return sessionStart.getMonth() === today.getMonth();

  case 'next-month':
    return sessionStart.getMonth() === (today.getMonth() + 1) % 12;

  default:
    return true;
}
```

**Availability Filtering**:
```typescript
return !showAvailableOnly || (session.openings && session.openings > 0);
```

**Component Structure**:
```
ActivityDetailsPage (Server Component)
  ↓ fetches sessions
ActivityDetailsContent (Client Component)
  ↓ manages filter state
  ├── ActivityDetailsHeader
  ├── ActivityDetailsFilters
  └── ActivitySessionsTable (with filtered sessions)
```

**Deliverables**:
- Client component managing filter state
- Working filter logic
- Filtered sessions passed to table

**Acceptance Criteria**:
- Date range filter works correctly
- Age filter shows only matching sessions
- Availability toggle shows only open sessions
- Filters work in combination (AND logic)
- Empty state shows when no matches
- Performance is smooth (memoized)

---

### Phase 6: Navigation Integration
**Goal**: Link activity cards to the details page

**Tasks**:
1. Update `ActivityCard.tsx` to add navigation
2. Wrap card or button in Next.js `Link` component
3. Use `/activities/${encodeURIComponent(activity.name)}` as href
4. Add hover effects to indicate clickability
5. Test navigation flow

**Implementation**:
```tsx
import Link from 'next/link';

// In ActivityCard component
<Link href={`/activities/${encodeURIComponent(activity.name)}`}>
  <button className="...">Explore</button>
</Link>
```

**Deliverables**:
- Clickable activity cards
- Smooth navigation to activity details

**Acceptance Criteria**:
- Clicking "Explore" navigates to activity details
- URL updates correctly
- Browser back button works
- Loading state is smooth

---

### Phase 7: Styling & Polish
**Goal**: Match template design exactly and ensure consistency

**Tasks**:
1. Apply template color palette
   - Primary: `#9D836F`
   - Background: `#F5F2EA`
   - Cards: `#FFFFFF` / `#1E1E1E` (dark)
2. Use correct fonts (Playfair Display, Inter)
3. Add dark mode support
4. Add smooth transitions and hover effects
5. Ensure responsive design works on all devices
6. Add loading skeletons for better UX

**Deliverables**:
- Pixel-perfect match to template
- Dark mode implementation
- Smooth animations

**Acceptance Criteria**:
- Colors match template exactly
- Fonts are correct
- Dark mode works
- Hover effects are smooth
- Mobile/tablet/desktop layouts work
- No layout shifts

---

### Phase 8: Testing & Accessibility
**Goal**: Ensure quality and accessibility

**Tasks**:
1. Test all filter combinations
2. Test with various activity names (spaces, special chars)
3. Test error states (404, API errors)
4. Verify keyboard navigation
5. Add ARIA labels
6. Test screen reader compatibility
7. Verify focus indicators
8. Cross-browser testing

**Accessibility Checklist**:
- [ ] Semantic HTML (`<main>`, `<nav>`, `<table>`)
- [ ] Breadcrumb has `aria-label="Breadcrumb"`
- [ ] Filter buttons have proper labels
- [ ] Table has proper headers
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA

**Deliverables**:
- Comprehensive test coverage
- Accessible component

**Acceptance Criteria**:
- All tests pass
- WCAG AA compliance
- Keyboard navigation works
- Screen reader compatible
- Works in Chrome, Firefox, Safari

## Technical Architecture

### File Structure
```
app/
├── activities/
│   └── [name]/
│       └── page.tsx              # Server Component (data fetching)
└── components/
    ├── ActivityDetailsHeader.tsx  # Header with breadcrumb
    ├── ActivityDetailsContent.tsx # Client Component (filter state)
    ├── ActivityDetailsFilters.tsx # Filter UI
    └── ActivitySessionsTable.tsx  # Reused from centre details
```

### Component Responsibilities

**page.tsx** (Server Component):
- Fetch activity sessions from API
- Handle URL param decoding
- Generate metadata for SEO
- Handle 404 errors
- Pass data to client components

**ActivityDetailsContent.tsx** (Client Component):
- Manage filter state
- Apply filter logic
- Render child components
- Handle empty states

**ActivityDetailsHeader.tsx** (Server Component):
- Display breadcrumb
- Display activity name
- Display subtitle

**ActivityDetailsFilters.tsx** (Client Component):
- Render filter buttons
- Handle filter interactions
- Emit filter change events

**ActivitySessionsTable.tsx** (Component):
- Display filtered sessions
- Handle responsive layout
- Show availability badges
- Make rows clickable

### Data Flow
```
1. User clicks "Explore" on ActivityCard
   ↓
2. Navigate to /activities/Basketball
   ↓
3. page.tsx fetches getActivitiesByName("Basketball")
   ↓
4. Pass sessions array to ActivityDetailsContent
   ↓
5. User interacts with filters
   ↓
6. State updates → filters applied → table re-renders
```

### State Management
```typescript
// In ActivityDetailsContent.tsx
const [dateRange, setDateRange] = useState<string>('all');
const [ageFilter, setAgeFilter] = useState<string>('');
const [showAvailableOnly, setShowAvailableOnly] = useState(false);

const filteredSessions = useMemo(() => {
  return sessions.filter(session => {
    // Apply all filters
    return (
      matchesDateRange(session, dateRange) &&
      matchesAge(session, ageFilter) &&
      matchesAvailability(session, showAvailableOnly)
    );
  });
}, [sessions, dateRange, ageFilter, showAvailableOnly]);
```

## Files to Create

### New Files
1. `app/activities/[name]/page.tsx` - Main page route
2. `app/components/ActivityDetailsHeader.tsx` - Page header
3. `app/components/ActivityDetailsContent.tsx` - Content wrapper with filters
4. `app/components/ActivityDetailsFilters.tsx` - Filter buttons

### Files to Modify
1. `app/components/ActivityCard.tsx` - Add link to details page
2. `app/components/ActivitySessionsTable.tsx` - Minor adjustments if needed

## Acceptance Criteria

### Functional Requirements
- [ ] Can navigate from activity card to activity details page
- [ ] Page displays all sessions for the activity
- [ ] Breadcrumb links back to home
- [ ] Date range filter works correctly
- [ ] Age filter works correctly
- [ ] Availability toggle works correctly
- [ ] Filters work in combination
- [ ] Clicking session row opens registration link
- [ ] Empty states display appropriately
- [ ] 404 page shows for invalid activities

### Visual Requirements
- [ ] Matches template design
- [ ] Colors match (#9D836F primary, #F5F2EA background)
- [ ] Fonts are correct (Playfair Display, Inter)
- [ ] Availability badges use correct colors
- [ ] Hover effects work smoothly
- [ ] Dark mode works correctly
- [ ] Responsive on mobile/tablet/desktop

### Technical Requirements
- [ ] TypeScript types are correct
- [ ] Server-side rendering works
- [ ] ISR caching implemented (1 hour)
- [ ] No console errors or warnings
- [ ] Build succeeds
- [ ] SEO metadata is correct
- [ ] Accessibility standards met
- [ ] Performance is acceptable

## Open Questions

### 1. Filter Defaults
**Question**: Should any filters be active by default?

**Options**:
- A) All filters off (show all sessions)
- B) "Has Openings" on by default
- C) "Next 7 Days" on by default

**Recommendation**: **Option A** - Show everything by default, let users filter

**Decision needed**: User preference

---

### 2. Session Click Behavior
**Question**: What should happen when user clicks a session row?

**Options**:
- A) Open `enroll_url` in new tab
- B) Show session details modal
- C) Navigate to session details page
- D) Copy registration link

**Recommendation**: **Option A** - Direct enrollment in new tab

**Decision needed**: User preference

---

### 3. "Close to Me" Filter
**Question**: Should we implement geolocation-based filtering now or later?

**Options**:
- A) Implement now (requires geolocation API, distance calculation)
- B) Show as disabled/coming soon
- C) Omit completely for now

**Recommendation**: **Option C** - Omit for MVP, add in Phase 2

**Decision needed**: User preference

---

### 4. Empty State for Specific Filters
**Question**: What message to show when filters return no results?

**Current**: "No sessions match your filters. Try adjusting your age, date, or availability filters."

**Alternative**: Show which filter(s) eliminated all results

**Recommendation**: Keep current (simple, actionable)

**Decision needed**: User preference

---

### 5. Activity Name Display
**Question**: How to handle long activity names in title?

**Example**: "Aquatic Leadership - Bronze Cross Instructor Assistant Recertification"

**Options**:
- A) Truncate with ellipsis
- B) Wrap to multiple lines
- C) Use smaller font for long names

**Recommendation**: **Option B** - Wrap naturally

**Decision needed**: User preference

---

### 6. Filter Persistence
**Question**: Should filters persist across page navigations?

**Options**:
- A) Reset on each page load
- B) Store in URL query params
- C) Store in localStorage

**Recommendation**: **Option A** for MVP, **Option B** for future

**Decision needed**: User preference

## Risk Assessment

### Low Risk
- API endpoint already exists ✅
- Similar pattern to centre details page ✅
- Can reuse existing components ✅
- TypeScript types already defined ✅

### Medium Risk
- Need to ensure URL encoding handles special characters
- Filter logic may need tweaking for different data patterns
- Mobile responsive layout needs careful testing

### Mitigation Strategies
- Use `encodeURIComponent()` for URL params
- Write comprehensive filter tests
- Test on real devices early

## Timeline Estimate

**Total Effort**: ~12-16 hours

- **Phase 1**: Page Structure & Routing - 2 hours
- **Phase 2**: Header Component - 1.5 hours
- **Phase 3**: Filter Section - 2 hours
- **Phase 4**: Sessions Display - 2.5 hours
- **Phase 5**: Client-Side Filtering - 2 hours
- **Phase 6**: Navigation Integration - 1 hour
- **Phase 7**: Styling & Polish - 2 hours
- **Phase 8**: Testing & Accessibility - 2 hours

**Dependencies**: None (all APIs and types already exist)

## Success Metrics

### User Experience
- Seamless navigation from activity list to details
- Fast page loads (< 2 seconds)
- Instant filter updates (< 100ms)
- No layout shifts or flashing

### Technical Quality
- TypeScript strict mode passes
- No console errors
- Lighthouse score > 90
- Accessibility score > 95

### Business Value
- Users can find specific activity sessions easily
- Clear path to registration
- Reduced clicks to enrollment

## Future Enhancements (Phase 2)

1. **Map View**: Show sessions on a map by centre location
2. **Favorites**: Save favorite activities
3. **Share**: Share specific activity page URL
4. **Sort Options**: Sort by date, availability, centre, distance
5. **Advanced Filters**:
   - Time of day (morning, afternoon, evening)
   - Specific centres
   - Price range
   - Program type (drop-in, registration, seasonal)
6. **Calendar View**: Display sessions in calendar format
7. **Notifications**: Alert when new sessions added
8. **Comparison**: Compare multiple sessions side-by-side
9. **Reviews**: Show user reviews for activities
10. **Waitlist**: Join waitlist for full sessions

## Notes

- This page completes the "activity discovery" flow
- Design should feel consistent with centre details page
- Performance is critical - use ISR caching aggressively
- Consider adding analytics to track which activities are most viewed
- May want to add "Popular Activities" section at top in future
- Consider adding a "Sign up for notifications" feature for full sessions
- The template shows a toggle/button UI style that differs slightly from centre details - decide which to standardize on
