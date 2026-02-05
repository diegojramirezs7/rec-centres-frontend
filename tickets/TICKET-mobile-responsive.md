# Mobile Responsiveness: Home & Activities Pages

## Problem Statement
The home page (Community Centres) and Activities page are not mobile-friendly. Both pages use a desktop-first layout with fixed-width sidebars that break on mobile devices.

## Current Issues Identified

### 1. Fixed-Width Sidebars (Critical Issue)
**Both pages:**
- Sidebar is fixed at `w-80` (320px) with `flex-shrink-0`
- Always visible, taking up most/all screen width on mobile devices
- Leaves minimal space for main content on small screens
- No breakpoint to hide/collapse sidebar on mobile

**Example from Sidebar.tsx (line 26) & ActivitySidebar.tsx (line 13):**
```tsx
<aside className="w-80 flex-shrink-0 ... sticky top-[77px]">
```

### 2. Non-Responsive Layout Structure
**Both pages use:**
```tsx
<div className="flex max-w-screen-2xl mx-auto mt-8">
  <Sidebar /> {/* Fixed 320px */}
  <main className="flex-1 min-w-0 px-8"> {/* Content */}
```

**Issues:**
- Flex layout doesn't stack vertically on mobile
- No `flex-col` or `lg:flex-row` responsive breakpoints
- Content area has `px-8` padding which may be too wide on small screens

### 3. Navigation Header Issues
**NavigationHeader.tsx (lines 11-48):**
- Logo + long title ("Third Places: Centres") + 2 navigation buttons
- No responsive handling for small screens
- Title text may wrap awkwardly or get cut off on mobile
- Navigation buttons might crowd the header on small devices

### 4. Hero Section Layout
**CentresHero.tsx (line 31):**
- Uses `flex-col md:flex-row` (good!)
- "Close to Me" button has reasonable responsive handling
- Could benefit from better spacing/sizing on very small screens

**ActivitiesHero.tsx (line 4):**
- Already has responsive text (`text-3xl md:text-4xl`) ✓
- Simple, minimal design works well on mobile

### 5. Activity Cards Layout
**ActivityCard.tsx (lines 23-56):**
- Uses flex layout: `flex items-center gap-6`
- Icon (64px) + content + right section with counts
- No responsive breakpoints to stack elements vertically on mobile
- Right section might be cramped on small screens
- Text truncation may be needed for long centre names

### 6. Padding & Spacing
- Main containers use `px-6 py-12`
- Content areas use `px-8`
- Combined padding may be too large on mobile (320px - 56px padding = 264px usable)
- Should reduce to `px-4` on mobile

## Proposed Solution

### Approach 1: Hidden Sidebar with Bottom Sheet/Modal (Recommended)

#### Desktop (≥1024px):
- Keep current layout: fixed sidebar + content area
- No changes to existing desktop experience

#### Tablet (768px - 1023px):
- Hide sidebar by default
- Add floating filter button (bottom-right or top of content)
- Clicking button opens filters in a modal/slide-over panel
- OR: Keep sidebar but reduce width to w-64 (256px)

#### Mobile (< 768px):
- Hide sidebar completely
- Add sticky filter button at top of content or floating bottom-right
- Filters open in bottom sheet or full-screen modal
- Reduce padding: `px-4` instead of `px-6` or `px-8`
- Stack activity card elements vertically

### Approach 2: Collapsible Top Section (Alternative)

#### Mobile:
- Move filters to top of page (above content)
- Collapsible accordion-style filters
- Search always visible, other filters collapsed by default
- Simpler implementation but less clean UX

## Implementation Plan

### Phase 1: Layout Structure (Both Pages)
1. **Update main layout container:**
   ```tsx
   // CentreList.tsx & ActivityListView.tsx
   <div className="flex flex-col lg:flex-row max-w-screen-2xl mx-auto mt-8">
     <Sidebar className="hidden lg:block" />
     <main className="flex-1 min-w-0 px-4 lg:px-8">
   ```

2. **Add responsive padding:**
   - Update containers: `px-4 md:px-6` instead of `px-6`
   - Update content areas: `px-4 lg:px-8` instead of `px-8`

### Phase 2: Mobile Filter Access
1. **Create MobileFilterButton component:**
   - Floating button (bottom-right) or sticky header button
   - Shows filter icon + count of active filters (if any)
   - Only visible on mobile (`lg:hidden`)

2. **Create MobileFilterSheet component:**
   - Bottom sheet or modal overlay
   - Contains search + filters from sidebar
   - Slide-up animation for smooth UX
   - Close button and overlay click to dismiss

3. **Update Sidebar components:**
   - Add `className` prop for responsive hiding
   - Extract filter logic into shared hook (for reuse in mobile view)

### Phase 3: Navigation Header
1. **Update NavigationHeader.tsx:**
   ```tsx
   // Shorten title on mobile
   <span className="text-xl font-semibold hidden sm:inline">
     Third Places: Centres
   </span>
   <span className="text-xl font-semibold sm:hidden">
     TP Centres
   </span>

   // Stack or condense nav buttons
   <nav className="flex items-center gap-2 sm:gap-4">
     {/* Possibly icon-only on mobile */}
   ```

### Phase 4: Activity Cards
1. **Update ActivityCard.tsx:**
   ```tsx
   <Link className="activity-card flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 ...">
     <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
       {/* Icon */}
       {/* Content */}
     </div>
     <div className="w-full sm:w-auto sm:text-right ...">
       {/* Right section */}
     </div>
   ```

### Phase 5: Hero Sections
1. **CentresHero.tsx:**
   - Already has `flex-col md:flex-row` ✓
   - Verify button sizing on smallest screens (320px)
   - Consider making button full-width on mobile

2. **ActivitiesHero.tsx:**
   - Already minimal and responsive ✓
   - No changes needed

## Questions & Assumptions to Validate

### Design Decisions:
1. **Filter access pattern:** Do you prefer:
   - a) Bottom sheet (mobile-native, smooth UX)
   - b) Modal overlay (simpler, more traditional)
   - c) Collapsible top section (simplest implementation)
   - d) Hamburger-style slide-out drawer (familiar pattern)

2. **Navigation header:** Should we:
   - a) Shorten the title on mobile ("TP Centres")
   - b) Stack logo above title on very small screens
   - c) Hide the "About" link on mobile and add hamburger menu
   - d) Keep current layout but reduce spacing

3. **Activity cards:** On mobile, should we:
   - a) Stack all elements vertically (icon → content → stats)
   - b) Keep icon + content horizontal, stats below
   - c) Use a more compact card design (smaller icon, less padding)

4. **Breakpoints:** Standard Tailwind breakpoints OK?
   - sm: 640px
   - md: 768px
   - lg: 1024px
   - Primary mobile target: 375px - 428px (iPhone sizes)
   - Minimum support: 320px (iPhone SE)

### Technical Assumptions:
1. **Bottom sheet library:** Should we:
   - a) Use Vaul (recommended, lightweight, accessible)
   - b) Use Radix UI Dialog
   - c) Build custom with Tailwind animations
   - d) Use Shadcn/ui Sheet component

2. **Shared filter state:** Need to ensure:
   - Filter state is shared between desktop sidebar and mobile sheet
   - URL params sync with filters (for sharing/bookmarking)
   - Any existing filter logic is reusable

3. **Testing:** After implementation, test on:
   - iPhone SE (320px - smallest)
   - iPhone 12/13/14 (375px/390px)
   - iPhone Plus/Max (414px/428px)
   - Android (various sizes)
   - Tablet (768px - 1024px)

## Files to Modify

### Core Layout Files:
- `app/components/CentresContent.tsx`
- `app/components/ActivitiesContent.tsx`
- `app/components/CentreList.tsx`
- `app/components/ActivityListView.tsx`
- `app/components/Sidebar.tsx`
- `app/components/ActivitySidebar.tsx`

### New Components to Create:
- `app/components/MobileFilterButton.tsx`
- `app/components/MobileFilterSheet.tsx` (or integrate into existing sidebars)
- Potentially: `app/components/MobileActivityCard.tsx` (if design differs significantly)

### Other Files:
- `app/components/NavigationHeader.tsx`
- `app/components/ActivityCard.tsx`
- `app/components/CentresHero.tsx` (minor adjustments)
- `app/globals.css` (if custom animations needed)

## Success Criteria

After implementation, the pages should:
1. ✅ Display properly on screens from 320px to 1920px+
2. ✅ Hide sidebars on mobile (< 1024px) with accessible filter button
3. ✅ Allow full filter/search functionality on mobile
4. ✅ Maintain all existing functionality (sorting, filtering, search)
5. ✅ Pass mobile-friendly test (Google Mobile-Friendly Test)
6. ✅ Have readable text and tappable buttons (min 44x44px touch targets)
7. ✅ Smooth animations and transitions (no jank)
8. ✅ Work with touch gestures (swipe to close sheets, etc.)

## Estimated Complexity

- **Small changes:** Responsive padding, hero adjustments
- **Medium changes:** Layout restructuring, activity cards
- **Large changes:** Mobile filter sheet/modal component
- **Overall:** Medium-large ticket (3-5 hours implementation + testing)

## Next Steps

1. **Validate assumptions** with stakeholder/reviewer
2. **Choose design approach** for filters (bottom sheet vs modal vs other)
3. **Select component library** for mobile patterns (if any)
4. **Begin implementation** following phased plan
5. **Test thoroughly** on multiple devices/screen sizes

---

## ✅ IMPLEMENTATION COMPLETED

### Implementation Date
February 5, 2026

### Approach Chosen
**Slide-out Drawer from Left** using Shadcn/ui Sheet component

### Design Decisions Made
1. **Filter Access:** Slide-out drawer from left (maintains spatial consistency with desktop sidebar)
2. **Navigation Header:** Hide title on mobile (`hidden md:inline`), show only logo
3. **Activity Cards:** Keep icon + content horizontal, stack stats/explore button below on mobile
4. **Component Library:** Shadcn/ui (Sheet component based on Radix UI Dialog)

### Changes Implemented

#### 1. Shadcn/ui Setup ✅
- Initialized Shadcn/ui with stone color theme (matches existing design)
- Installed Sheet component from Shadcn/ui
- Fixed import path for Radix UI Dialog primitive
- Created `lib/utils.ts` with `cn()` helper function

#### 2. Navigation Header ✅
**File:** `app/components/NavigationHeader.tsx`
- Added `hidden md:inline` to title text (visible only on md+ screens)
- Reduced padding: `px-4 sm:px-6` instead of `px-6`
- Reduced nav button gap: `gap-2 sm:gap-4` instead of `gap-4`

#### 3. Responsive Layout Structure ✅
**Files Modified:**
- `app/components/CentresContent.tsx`
- `app/components/ActivitiesContent.tsx`
- `app/components/CentreList.tsx`
- `app/components/ActivityListView.tsx`

**Changes:**
- Updated main containers: `px-4 sm:px-6` and `py-8 sm:py-12`
- Added responsive flex direction: `flex-col lg:flex-row`
- Reduced margin-top: `mt-6 sm:mt-8`
- Updated content padding: `px-0 lg:px-8` (no padding on mobile, full padding on desktop)
- Hidden desktop sidebars on mobile: `className="hidden lg:block"`

#### 4. Sidebar Components ✅
**Files Modified:**
- `app/components/Sidebar.tsx`
- `app/components/ActivitySidebar.tsx`

**Changes:**
- Added `className?: string` prop to both components
- Applied className with template literal to allow responsive hiding

#### 5. Activity Cards ✅
**File:** `app/components/ActivityCard.tsx`

**Changes:**
- Main container: `flex-col sm:flex-row` (stack on mobile, horizontal on desktop)
- Adjusted padding: `p-4 sm:p-5`
- Created wrapper for icon + content that stays horizontal: `flex items-center gap-4 sm:gap-6`
- Smaller icon on mobile: `w-14 h-14 sm:w-16 sm:h-16`
- Stats section: `flex-row sm:flex-col` with responsive alignment
- Added text truncation on mobile: `truncate sm:whitespace-normal`
- Stats and explore button positioned horizontally on mobile, vertically on desktop

#### 6. New Components Created ✅

**a) MobileFilterButton.tsx**
- Floating action button (bottom-right, fixed position)
- Shows "Filters" text with tune icon
- Displays active filter count badge when filters are applied
- Only visible on mobile: `lg:hidden`
- Uses brand color: `bg-[#8b7360]`

**b) MobileCentresFilterDrawer.tsx**
- Uses Shadcn Sheet component sliding from left
- Width: `w-[85vw] sm:w-96`
- Contains search input with clear button
- Neighbourhood filter list (mirrors desktop sidebar)
- Clicking a filter closes the drawer automatically
- Styled with brand colors and fonts

**c) MobileActivitiesFilterDrawer.tsx**
- Similar to centres drawer but simplified
- Only contains search input
- Includes placeholder text for future filters
- Auto-focuses search input when opened

#### 7. Integration ✅

**CentreList.tsx:**
- Added state: `const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)`
- Calculates active filters count: `(searchQuery ? 1 : 0) + (selectedNeighbourhood ? 1 : 0)`
- Renders MobileFilterButton and MobileCentresFilterDrawer
- Passes all filter state and handlers to drawer

**ActivityListView.tsx:**
- Added state: `const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)`
- Calculates active filters count: `searchQuery ? 1 : 0`
- Renders MobileFilterButton and MobileActivitiesFilterDrawer
- Passes filter state and handlers to drawer

### Files Created
1. `components/ui/sheet.tsx` - Shadcn Sheet component
2. `lib/utils.ts` - Utility functions (cn helper)
3. `app/components/MobileFilterButton.tsx` - Floating filter button
4. `app/components/MobileCentresFilterDrawer.tsx` - Centres filter drawer
5. `app/components/MobileActivitiesFilterDrawer.tsx` - Activities filter drawer

### Files Modified
1. `app/components/NavigationHeader.tsx`
2. `app/components/CentresContent.tsx`
3. `app/components/ActivitiesContent.tsx`
4. `app/components/CentreList.tsx`
5. `app/components/ActivityListView.tsx`
6. `app/components/Sidebar.tsx`
7. `app/components/ActivitySidebar.tsx`
8. `app/components/ActivityCard.tsx`

### Dependencies Added
- `clsx` - Conditional className utility
- `tailwind-merge` - Tailwind class merging utility
- `@radix-ui/react-dialog` - Accessible dialog primitive for Sheet

### Breakpoints Used
- `sm: 640px` - Small devices (large phones)
- `md: 768px` - Medium devices (tablets)
- `lg: 1024px` - Large devices (desktops) - primary mobile/desktop breakpoint

### Testing Results
- ✅ Build successful with no TypeScript errors
- ✅ Dev server starts without issues
- ✅ All components properly typed
- ✅ No console errors during build

### Mobile-Friendly Features
1. **Touch Targets:** Filter button is 44x44px+ for easy tapping
2. **Reduced Padding:** Mobile gets `px-4` instead of `px-6` or `px-8`
3. **Floating FAB:** Fixed position button stays accessible while scrolling
4. **Slide Animation:** Smooth left-to-right drawer transition
5. **Active Filter Badge:** Visual indicator of applied filters
6. **Auto-Close:** Selecting a filter closes drawer (good mobile UX)
7. **Overlay Dismissal:** Tapping outside drawer closes it
8. **Responsive Text:** Smaller icons and text on mobile
9. **Text Truncation:** Prevents long text from breaking layout

### Spatial Consistency
- **Desktop:** Filters on left sidebar
- **Mobile:** Filters slide in from left
- **Mental Model:** "Filters come from the left" maintained across all screen sizes

### What Works Well
1. Clean transition from desktop to mobile layout
2. All filtering functionality preserved on mobile
3. Minimal code duplication (filter logic in parent components)
4. Accessible with proper ARIA labels
5. Brand-consistent styling throughout
6. Smooth animations using Radix UI primitives

### Future Improvements (Optional)
1. Add URL parameter syncing for filters (for bookmarking/sharing)
2. Keyboard shortcuts for opening/closing filters
3. Swipe gesture to close drawer (already supported by Radix)
4. Remember last filter state in localStorage
5. Add loading states for location-based sorting
6. Implement filter presets (e.g., "Near me", "Open now")

### Notes
- Hero sections already had good responsive behavior (no changes needed)
- CentresHero button already responsive with `flex-col md:flex-row`
- No custom CSS animations needed (Shadcn provides them)
- Maintained existing sidebar styles for consistency
- Filter state management kept in parent components (not extracted to hooks)
- No URL param syncing implemented yet (can be added later if needed)
