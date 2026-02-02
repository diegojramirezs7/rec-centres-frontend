# Activities Page Implementation - Detailed Plan

## Overview
Implement the "By Activity" view for the home page based on `templates/activities.html`. This involves significant structural, styling, and functional changes to ensure both the Centre and Activity views are consistent and functional.

## Current State Analysis

### Existing Implementation
- **Toggle Location**: Currently in `Hero.tsx` component below the page title
- **Layout**: Header → Main (Hero → CentreList/ActivityView)
- **ActivityView**: Simple placeholder with "Coming Soon" message
- **Background**: `#fdfcf9` (very light cream)
- **Primary Color**: `#8b7360` (brown)
- **API**: `getNormalizedActivities()` exists but returns only activity names

### Template Analysis (`templates/activities.html`)
- **Background Color**: `#F8F5EE` (slightly warmer cream - **this should be the new standard**)
- **Primary Color**: `#A68972` (lighter brown - template uses this but notes say keep current)
- **Header Structure**: Logo + Toggle + Spacer (toggle is IN the header)
- **Sidebar Filters**:
  - Search input
  - Date Range dropdown
  - Age Group radio buttons
  - "Show Available Only" toggle
- **Main Content**:
  - "Popular Activities" section with horizontal scroll of filter chips
  - Activity cards with: icon (Material Symbols), name, description, session count, explore button
- **Styling Details**:
  - Rounded corners: `0.75rem` (12px) default
  - Cards: `rounded-3xl` (24px), white background, subtle shadow
  - Activity cards have hover effect: `translateY(-2px)`
  - Icons have colored background circles (orange, emerald, purple, cyan, etc.)

### Expected API Response
**Endpoint**: `http://localhost:8000/normalized-activities` ✅ VERIFIED

```json
[
  {
    "name": "Archery",
    "total_activities": 2,
    "centres": ["Britannia"]
  },
  {
    "name": "Badminton",
    "total_activities": 385,
    "centres": ["Britannia", "Champlain Heights", ...]
  }
]
```

**Note**: Schema created as `aggregatedActivitySchema` and `getNormalizedActivities()` endpoint updated to use it.

## What Should NOT Be Implemented

Based on user notes, the following template features should be excluded or modified:

1. **Date Range Filter** - Not available in API data
2. **Age Group Filter** - Not available in API data
3. **"Show Available Only" Toggle** - Not available in API data
4. **Activity Description** - Not in API response, replace with centre list
5. **Session Count Label** - API has `total_activities` not sessions

## Major Structural Changes

### 1. Header Reorganization
**Current**: Header is separate from toggle
```
Header.tsx (logo + About)
Hero.tsx (title + Find Nearest + toggle)
```

**New**: Toggle moves into header
```
Header.tsx (logo + toggle + spacer)
Hero.tsx (title + subtitle) - NO toggle
```

**Impact**:
- `Header.tsx`: Needs to become a client component, accept viewMode and onViewModeChange props
- `Hero.tsx`: Remove toggle section, simplify to just title/subtitle
- `HomeContent.tsx`: Pass viewMode state to Header instead of Hero
- Layout changes across both views

### 2. Background Color Update
**Change**: `#fdfcf9` → `#F8F5EE` in `globals.css`

**Impact**:
- Affects both Centre and Activity views
- All components need to work with new background
- Card shadows and borders may need adjustment

### 3. API Integration
**Required**: Create or identify endpoint that returns aggregated activity data

**Options**:
1. Check if backend has an endpoint for aggregated activities (likely `/activities/normalized` or similar)
2. Create new schema: `aggregatedActivitySchema`
3. Add new endpoint function: `getAggregatedActivities()`

**Schema**:
```typescript
export const aggregatedActivitySchema = z.object({
  name: z.string(),
  total_activities: z.number(),
  centres: z.array(z.string()),
});

export type AggregatedActivity = z.infer<typeof aggregatedActivitySchema>;
```

## Component Architecture

### New Components

#### 1. `ActivityListView.tsx` (Client Component)
**Purpose**: Main container for activity view with search/filter state
**State**:
- `searchQuery: string` - Search input value
- `selectedCategory: string | null` - Currently selected popular activity filter

**Props**:
```typescript
interface ActivityListViewProps {
  activities: AggregatedActivity[];
}
```

**Layout**:
- ActivitySidebar (left)
- ActivityContent (right): PopularActivities + ActivityCards

#### 2. `ActivitySidebar.tsx` (Client Component)
**Purpose**: Left sidebar with search and filters

**Props**:
```typescript
interface ActivitySidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  // Future: Add filter props when data becomes available
}
```

**Content**:
- Search input (functional)
- Placeholder text explaining filters not yet available
- Future: Date range, age group, availability filters

#### 3. `PopularActivities.tsx` (Client Component)
**Purpose**: Horizontal scrolling list of activity category chips

**Props**:
```typescript
interface PopularActivitiesProps {
  activities: AggregatedActivity[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}
```

**Behavior**:
- Extract top 8-10 activities by `total_activities`
- "All Activities" shows all
- Clicking a chip filters the list below

#### 4. `ActivityCard.tsx` (Component)
**Purpose**: Individual activity display card

**Props**:
```typescript
interface ActivityCardProps {
  activity: AggregatedActivity;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}
```

**Layout**:
- Left: Colored circle with icon (64x64)
- Center: Activity name + centre list (max 2, then "and X more")
- Right: Total count + explore button (non-functional for now)

**Centre Display Logic**:
```typescript
const displayCentres = centres.slice(0, 2).join(", ");
const remaining = centres.length - 2;
const centreText = remaining > 0
  ? `${displayCentres}, and ${remaining} more`
  : displayCentres;
```

### Modified Components

#### 1. `Header.tsx`
**Before**: Server component with static logo and About link
**After**: Client component with logo, toggle, and About link

**Changes**:
- Add `"use client"` directive
- Accept `viewMode` and `onViewModeChange` props
- Integrate toggle from Hero.tsx
- Update styling to match template (3px padding, sticky positioning)

**New Structure**:
```tsx
<header className="bg-white border-b border-gray-200 py-3 px-6 sticky top-0 z-50">
  <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
    <div className="flex items-center gap-3">
      {/* Logo */}
    </div>
    <div className="flex bg-slate-100 p-1 rounded-full border border-gray-200">
      {/* Toggle buttons */}
    </div>
    <div className="w-8"></div> {/* Spacer for center alignment */}
  </div>
</header>
```

#### 2. `Hero.tsx`
**Changes**:
- Remove toggle section completely
- Keep title and subtitle
- Keep "Find Nearest Centre" button (non-functional)
- Remove `viewMode` and `onViewModeChange` props

**New Props**: None needed (can be a regular component)

#### 3. `HomeContent.tsx`
**Changes**:
- Pass `viewMode` and `setViewMode` to Header instead of Hero
- Load activities data (need to handle in parent or use SWR/React Query)

**Question**: Should activities be fetched in `page.tsx` or lazily in ActivityListView?
- **Recommendation**: Fetch in `page.tsx` alongside centres for consistency with SSR/ISR pattern

#### 4. `CentreList.tsx` & `CentreCard.tsx`
**Changes**:
- Update to work with new background color `#F8F5EE`
- Ensure hover states are consistent with activity cards
- May need to adjust card `rounded-3xl` vs current rounding

#### 5. `Sidebar.tsx` (Centre Sidebar)
**Changes**:
- Ensure consistent styling with ActivitySidebar
- Both should have same heights, spacing, borders

## Activity Icon Mapping

### Implementation Strategy
Install `lucide-react`:
```bash
npm install lucide-react
```

### Icon Mapping Data Structure
Create `lib/constants/activity-icons.ts`:

```typescript
import {
  Target,          // Archery
  Dumbbell,        // Athletics
  Zap,             // Badminton
  Home,            // Basketball (or Activity)
  Bike,            // Cycling
  Palette,         // Art/Painting
  UtensilsCrossed, // Cooking
  Waves,           // Swimming/Aquatics
  TreePine,        // Outdoor activities
  Music,           // Music classes
  HeartPulse,      // Fitness/Yoga
  Hammer,          // Woodworking/Pottery
  Users,           // Group activities
  type LucideIcon,
} from "lucide-react";

interface ActivityIconConfig {
  icon: LucideIcon;
  bgColor: string;    // Tailwind class like "bg-orange-100"
  iconColor: string;  // Tailwind class like "text-orange-600"
}

const activityIconMap: Record<string, ActivityIconConfig> = {
  archery: { icon: Target, bgColor: "bg-orange-100", iconColor: "text-orange-600" },
  athletics: { icon: Dumbbell, bgColor: "bg-red-100", iconColor: "text-red-600" },
  badminton: { icon: Zap, bgColor: "bg-yellow-100", iconColor: "text-yellow-600" },
  basketball: { icon: Activity, bgColor: "bg-orange-100", iconColor: "text-orange-600" },
  yoga: { icon: HeartPulse, bgColor: "bg-purple-100", iconColor: "text-purple-600" },
  pilates: { icon: HeartPulse, bgColor: "bg-purple-100", iconColor: "text-purple-600" },
  swimming: { icon: Waves, bgColor: "bg-cyan-100", iconColor: "text-cyan-600" },
  aquatics: { icon: Waves, bgColor: "bg-cyan-100", iconColor: "text-cyan-600" },
  pottery: { icon: Hammer, bgColor: "bg-amber-100", iconColor: "text-amber-600" },
  ceramics: { icon: Hammer, bgColor: "bg-amber-100", iconColor: "text-amber-600" },
  painting: { icon: Palette, bgColor: "bg-pink-100", iconColor: "text-pink-600" },
  cooking: { icon: UtensilsCrossed, bgColor: "bg-green-100", iconColor: "text-green-600" },
  woodworking: { icon: Hammer, bgColor: "bg-orange-100", iconColor: "text-orange-600" },
  // Add more as needed
};

const defaultActivityIcon: ActivityIconConfig = {
  icon: Users,
  bgColor: "bg-slate-100",
  iconColor: "text-slate-600",
};

export function getActivityIcon(activityName: string): ActivityIconConfig {
  const normalized = activityName.toLowerCase().trim();
  return activityIconMap[normalized] || defaultActivityIcon;
}
```

### Usage in ActivityCard:
```tsx
const iconConfig = getActivityIcon(activity.name);
const IconComponent = iconConfig.icon;

<div className={`w-16 h-16 ${iconConfig.bgColor} ${iconConfig.iconColor} rounded-full flex items-center justify-center shrink-0`}>
  <IconComponent size={32} />
</div>
```

## Styling Consistency Plan

### Global Changes (`globals.css`)

1. **Background Color**:
```css
:root {
  --background: #F8F5EE; /* Changed from #fdfcf9 */
  --foreground: #292524;
}
```

2. **Add Activity Card Hover**:
```css
.activity-card:hover {
  transform: translateY(-2px);
}
```

3. **Ensure Consistent Border Radius**:
```css
/* May need to update default rounding if not already using 0.75rem */
```

### Component-Level Styling Updates

#### Centre Cards
- Change to `rounded-3xl` (24px) to match activity cards
- Ensure hover effect is subtle and consistent
- Background: `bg-white` with `border border-gray-100 shadow-sm`

#### Sidebars (Both)
- Width: `w-80` (320px)
- Height: `h-[calc(100vh-61px)]` (61px = header height)
- Sticky: `sticky top-[61px]`
- Background: `bg-white/50` (semi-transparent)
- Border: `border-r border-gray-200`

#### Toggle Buttons
- Container: `bg-slate-100 p-1 rounded-full border border-gray-200`
- Inactive: `text-slate-500`
- Active: `bg-primary text-white shadow-sm`

## Data Flow & State Management

### Page-Level Data Fetching (`page.tsx`)
```tsx
export default async function Home() {
  const [centres, activities] = await Promise.all([
    getCentres({ next: { revalidate: 3600 } }),
    getAggregatedActivities({ next: { revalidate: 3600 } }),
  ]);

  return (
    <HomeContent centres={centres} activities={activities} />
  );
}
```

### Component State Flow
```
page.tsx (SSR)
  ↓ centres[], activities[]
HomeContent (Client)
  ↓ viewMode state
  ↓ centres, activities
  ├─ Header (viewMode, onViewModeChange)
  └─ main
     ├─ Hero (no props)
     └─ viewMode === "centre" ?
        └─ CentreList (centres)
           ├─ searchQuery, selectedNeighbourhood state
           ├─ Sidebar (search, neighbourhoods)
           └─ CentreCard[]
        OR
        └─ ActivityListView (activities)
           ├─ searchQuery, selectedCategory state
           ├─ ActivitySidebar (search)
           ├─ PopularActivities (categories, filter)
           └─ ActivityCard[]
```

## Implementation Phases

### Phase 1: API & Schema Setup ✅ COMPLETE
**Goal**: Ensure we can fetch activity data

**Tasks**:
1. ✅ Verified backend endpoint: `http://localhost:8000/normalized-activities`
2. ✅ Created `aggregatedActivitySchema` in `lib/schemas/activity.ts`
3. ✅ Updated `getNormalizedActivities()` in `lib/api/endpoints/activities.ts` to use new schema
4. ✅ Tested endpoint with verification script

**Acceptance Criteria**:
- ✅ Can successfully fetch activity data (29 activities fetched)
- ✅ Data matches expected format (name, total_activities, centres[])
- ✅ TypeScript types are correct (build passes)

**Verified API Response Format**:
```json
{
  "name": "Badminton",
  "total_activities": 385,
  "centres": ["Britannia", "Champlain Heights", "Marpole-Oakridge", ...]
}
```

### Phase 2: Activity Icons Setup ✅ COMPLETE
**Goal**: Prepare icon mapping system

**Tasks**:
1. ✅ Installed `lucide-react` using bun
2. ✅ Created `lib/constants/activity-icons.ts` with icon mapping
3. ✅ Mapped 50+ activities to icons with fuzzy matching
4. ✅ Created test page at `/test-icons` to verify rendering
5. ✅ Verified icon coverage with real API data

**Acceptance Criteria**:
- ✅ Icons render correctly (verified with test page)
- ✅ Fallback icon works for unmapped activities
- ✅ Colors are visually appealing and distinct (10 different color schemes)

**Results**:
- 89.7% icon coverage (26/29 activities from API)
- Fuzzy matching algorithm for partial name matches
- 10 distinct color schemes (orange, red, yellow, emerald, blue, cyan, purple, pink, teal, amber)
- Default icon (BadgeHelp) for unmapped activities

### Phase 3: Global Styling Updates ✅ COMPLETE
**Goal**: Update background and ensure consistency

**Tasks**:
1. ✅ Changed background color in `globals.css` from `#fdfcf9` to `#F8F5EE`
2. ✅ Added activity card hover effect (translateY(-2px) with transition)
3. ✅ Verified existing card styling (already using appropriate border radius)
4. ✅ Build passes with no errors

**Acceptance Criteria**:
- ✅ New background color applied (`#F8F5EE` - warmer cream tone)
- ✅ Activity card hover effect ready for use
- ✅ Build passes successfully

**Changes Made**:
- Updated `--background` CSS variable to `#F8F5EE`
- Added `.activity-card` and `.activity-card:hover` styles for smooth hover transitions
- Background color will now be consistent across both Centre and Activity views

### Phase 4: Header Restructuring ✅ COMPLETE
**Goal**: Move toggle into header

**Tasks**:
1. ✅ Updated `Header.tsx` to accept viewMode and onViewModeChange props
2. ✅ Moved toggle JSX from `Hero.tsx` to `Header.tsx`
3. ✅ Updated styling to match template (simpler, clean white background)
4. ✅ Updated `HomeContent.tsx` to render Header and pass viewMode state
5. ✅ Simplified `Hero.tsx` to remove toggle and props
6. ✅ Updated `page.tsx` to remove duplicate Header rendering

**Acceptance Criteria**:
- ✅ Toggle appears in header between logo and spacer
- ✅ Toggle functions correctly (manages viewMode state)
- ✅ Header styling matches template
- ✅ Hero is simplified (just title, subtitle, and Find Nearest button)

**Structural Changes**:
- Header now includes: Logo + Toggle + Spacer (for centering)
- Header is client component with viewMode state management
- HomeContent now renders Header at the top level
- Toggle button labels: "By Community Centre" and "Find Activity"
- Active state: `bg-[#8b7360] text-white` (matches primary color)
- Header height reduced, cleaner design matching template

### Phase 5: Activity View Components ✅ COMPLETE
**Goal**: Build all activity-related components

**Tasks**:
1. ✅ Created `ActivityListView.tsx` with search/filter state
2. ✅ Created `ActivitySidebar.tsx` with search input
3. ✅ Created `PopularActivities.tsx` with category chips
4. ✅ Created `ActivityCard.tsx` with icon, name, centres, button
5. ✅ Implemented filtering logic with useMemo
6. ✅ Added no-scrollbar CSS for horizontal scroll

**Acceptance Criteria**:
- ✅ All components render correctly
- ✅ Search filters activities by name (case-insensitive)
- ✅ Popular activities chips work (top 8 by total_activities)
- ✅ Centre list displays correctly ("and X more" logic)
- ✅ Icons display with proper colors using lucide-react

**Components Created**:

1. **ActivityCard.tsx**:
   - Displays activity icon with colored background
   - Shows activity name and centre list
   - Truncates centres to 2, shows "and X more"
   - Shows total activities count
   - "Explore" button (non-functional for now)
   - Uses activity-card class for hover effect

2. **ActivitySidebar.tsx**:
   - Search input with icon
   - Sticky sidebar (height: calc(100vh-61px))
   - Placeholder text for future filters
   - Matches styling with centre sidebar

3. **PopularActivities.tsx**:
   - "All Activities" button
   - Top 8 activities by total_activities
   - Horizontal scrolling chips
   - Active state highlighting
   - Filters activity list when clicked

4. **ActivityListView.tsx**:
   - Main container with sidebar + content layout
   - Manages search and category filter state
   - useMemo for efficient filtering
   - Empty state when no results
   - Renders ActivityCard for each activity

### Phase 6: Centre View Updates ✅ COMPLETE
**Goal**: Ensure centre view matches new styling

**Tasks**:
1. ✅ Updated `CentreCard.tsx` to use card-based design with `rounded-3xl`
2. ✅ Updated `Sidebar.tsx` to match ActivitySidebar styling
3. ✅ Updated `CentreList.tsx` to match ActivityListView layout
4. ✅ Verified hover effects work consistently
5. ✅ Build passes successfully

**Acceptance Criteria**:
- ✅ Centre cards use consistent rounding (`rounded-3xl`)
- ✅ Sidebars have matching dimensions and styling
- ✅ Hover effects are consistent (shadow-md on cards)
- ✅ Both views feel cohesive

**Changes Made**:

1. **CentreCard.tsx**:
   - Changed from border-bottom list style to card-based design
   - Added `rounded-3xl` border radius
   - White background with `border-gray-100` and `shadow-sm`
   - Hover effect: `hover:shadow-md` for subtle elevation
   - Updated colors to use slate palette (slate-900, slate-500, slate-400)
   - Improved spacing and layout

2. **Sidebar.tsx**:
   - Fixed width: `w-80` (matching ActivitySidebar)
   - Sticky positioning: `h-[calc(100vh-61px)] sticky top-[61px]`
   - Semi-transparent background: `bg-white/50`
   - Border right: `border-r border-gray-200`
   - Updated search input to rounded style with proper padding
   - Consistent spacing with `space-y-8`

3. **CentreList.tsx**:
   - Layout structure: `flex max-w-screen-2xl mx-auto`
   - Main content wrapped in `<main>` with `flex-1 p-8`
   - Added spacing between cards: `space-y-4`
   - Updated empty state to match ActivityListView
   - Material icon for empty state
   - Consistent button styling

### Phase 7: Integration & Data Flow ✅ COMPLETE
**Goal**: Connect everything together

**Tasks**:
1. ✅ Updated `page.tsx` to fetch activities data in parallel with centres
2. ✅ Updated `HomeContent.tsx` to accept and pass activities to ActivityListView
3. ✅ Replaced `ActivityView.tsx` placeholder with `ActivityListView`
4. ✅ Deleted unused ActivityView.tsx file
5. ✅ Verified build passes and integration works

**Acceptance Criteria**:
- ✅ Activities fetch on page load (parallel fetch with Promise.all)
- ✅ View switching works smoothly (toggle between centre/activity)
- ✅ Data updates with ISR (1 hour revalidation for both endpoints)
- ✅ No console errors or TypeScript errors

**Changes Made**:

1. **page.tsx**:
   - Added import for `getNormalizedActivities`
   - Fetch centres and activities in parallel using `Promise.all`
   - Both use ISR with 1 hour revalidation (`revalidate: 3600`)
   - Pass both datasets to HomeContent

2. **HomeContent.tsx**:
   - Added `AggregatedActivity` type import
   - Updated props to include `activities: AggregatedActivity[]`
   - Replaced `ActivityView` import with `ActivityListView`
   - Conditionally render ActivityListView when viewMode is "activity"

3. **Cleanup**:
   - Deleted `app/components/ActivityView.tsx` (no longer needed)
   - All references removed

**Data Flow**:
```
page.tsx (Server Component)
  ↓ Fetches centres & activities in parallel
  ↓ Passes both to HomeContent
HomeContent (Client Component)
  ↓ Manages viewMode state
  ↓ Passes to Header for toggle
  ↓ Conditionally renders:
    ├─ CentreList (with centres data)
    └─ ActivityListView (with activities data)
```

### Phase 8: Polish & Testing ✅ COMPLETE
**Goal**: Final refinements

**Tasks**:
1. ✅ Fixed sidebar collapse issue (added flex-shrink-0)
2. ✅ Added clear button to search inputs
3. ✅ Added clear all filters button to empty states
4. ✅ Verified build passes
5. ✅ Tested responsive layout

**Acceptance Criteria**:
- ✅ Sidebar maintains fixed width (320px) in both views
- ✅ Search inputs have clear button when text is entered
- ✅ Empty states have actionable clear filters button
- ✅ No TypeScript errors
- ✅ Build succeeds

**Fixes & Improvements**:

1. **Sidebar Width Fix**:
   - Added `flex-shrink-0` to both ActivitySidebar and Sidebar
   - Prevents sidebar from being squeezed by flex-1 main content
   - Ensures 320px width is maintained at all times

2. **Search UX Improvements**:
   - Added clear button (× icon) to search inputs
   - Appears only when there's text
   - Clicking clears the search instantly
   - Better user experience for quick clearing

3. **Empty State Improvements**:
   - Added "Clear all filters" button
   - Clears both search and selected category/neighbourhood
   - Provides clear action when no results found
   - Consistent across both views

**Testing Coverage**:

✅ **Layout & Responsiveness**:
- Sidebar maintains fixed width
- Content area flexes appropriately
- Cards render correctly
- Spacing is consistent

✅ **Functionality**:
- Toggle switches between views
- Search filters work in both views
- Popular activities filter works
- Neighbourhood filter works
- Clear buttons work correctly

✅ **Edge Cases**:
- Empty search results handled
- No filters applied works
- All filters applied works
- Search + category filter combination works

✅ **Performance**:
- useMemo prevents unnecessary re-renders
- Parallel data fetching (Promise.all)
- ISR caching (1 hour)
- Smooth hover animations

✅ **Data Integrity**:
- 29 activities load correctly
- 89.7% icon coverage
- Centre list displays correctly
- Activity counts accurate

## Open Questions & Decisions Needed

### 1. API Endpoint
**Question**: Does the backend have an endpoint that returns aggregated activities in the expected format?
**Action Required**: Check backend API documentation or ask team
**Alternative**: If not, we may need to aggregate on frontend or request backend changes

### 2. Popular Activities Logic
**Question**: Should "Popular Activities" be:
- A) Top 10 by `total_activities` (dynamic)
- B) Hardcoded list of popular activities (static)
- C) Configurable in a constants file

**Recommendation**: Option A (dynamic) for simplicity, with Option C as future enhancement

### 3. Activity Card "Explore" Button
**Question**: Should the button:
- A) Be non-functional for now (like "Find Nearest")
- B) Navigate to a detail page
- C) Expand to show all centres

**Recommendation**: Option A for now, implement functionality later

### 4. Sidebar Placeholder Content
**Question**: What should replace age/date/availability filters?
**Options**:
- A) Just search, with note "More filters coming soon"
- B) Keep filters but disabled with tooltips
- C) Add different filters (e.g., activity category from schema)

**Recommendation**: Option A initially, Option C if category data is available

### 5. Error Handling
**Question**: How to handle API errors for activities?
**Recommendation**: Show placeholder with error message, similar to current ActivityView

### 6. Loading States
**Question**: Should we show loading skeletons while fetching?
**Recommendation**: Yes, add skeleton components for better UX

## Files to Create

1. `lib/schemas/activity.ts` - Add `aggregatedActivitySchema` (update existing)
2. `lib/api/endpoints/activities.ts` - Add `getAggregatedActivities()` (update existing)
3. `lib/constants/activity-icons.ts` - Icon mapping
4. `app/components/ActivityListView.tsx` - Main activity view container
5. `app/components/ActivitySidebar.tsx` - Activity filters sidebar
6. `app/components/PopularActivities.tsx` - Category chips
7. `app/components/ActivityCard.tsx` - Individual activity card

## Files to Modify

1. `app/globals.css` - Background color, hover effects
2. `app/components/Header.tsx` - Add toggle, make client component
3. `app/components/Hero.tsx` - Remove toggle
4. `app/components/HomeContent.tsx` - Pass activities data, update props flow
5. `app/page.tsx` - Fetch activities data
6. `app/components/CentreCard.tsx` - Update border radius
7. `app/components/Sidebar.tsx` - Ensure consistent styling
8. `app/components/ActivityView.tsx` - Delete or replace with ActivityListView

## Files to Delete

1. `app/components/ActivityView.tsx` - Replace with ActivityListView

## Success Criteria

### Functional Requirements
- [x] Activities view displays real data from API
- [x] Search filters activities by name
- [x] Popular activities chips filter the list
- [x] Activity cards show icons, names, and centre lists
- [x] Centre list truncates at 2 with "and X more"
- [x] Toggle in header switches between views
- [x] Both views share consistent styling

### Visual Requirements
- [x] Background color is `#F8F5EE`
- [x] Activity cards have colored icon circles
- [x] Cards have hover effect (translateY(-2px))
- [x] Toggle styling matches template
- [x] Sidebars have consistent heights
- [x] Responsive design works on mobile

### Technical Requirements
- [x] TypeScript types are correct
- [x] No console errors or warnings
- [x] SSR/ISR works for activities data
- [x] Code is modular and maintainable
- [x] Icons from lucide-react work correctly

## Risks & Mitigations

### Risk 1: API Endpoint Doesn't Exist
**Impact**: Cannot implement feature
**Mitigation**: Check API early, request backend changes if needed, or aggregate on frontend

### Risk 2: Icon Mapping Incomplete
**Impact**: Some activities show default icon
**Mitigation**: Use good default icon, allow easy addition of new mappings

### Risk 3: Performance with Many Activities
**Impact**: Slow rendering, laggy UI
**Mitigation**: Use React.memo, virtualization if needed, pagination

### Risk 4: Toggle State Synchronization
**Impact**: Views get out of sync
**Mitigation**: Single source of truth in HomeContent, clear data flow

## Timeline Estimate

- **Phase 1**: API & Schema - 1-2 hours
- **Phase 2**: Activity Icons - 1 hour
- **Phase 3**: Global Styling - 30 minutes
- **Phase 4**: Header Restructuring - 1-2 hours
- **Phase 5**: Activity Components - 3-4 hours
- **Phase 6**: Centre View Updates - 1 hour
- **Phase 7**: Integration - 1-2 hours
- **Phase 8**: Polish & Testing - 2-3 hours

**Total**: ~12-16 hours

## Notes

- This is a significant refactor, not just adding a new component
- Header restructuring will affect both views
- Styling changes will affect the entire app
- Good opportunity to improve code organization
- Should consider creating a design system document for future consistency
