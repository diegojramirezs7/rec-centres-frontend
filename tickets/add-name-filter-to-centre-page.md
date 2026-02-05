## Add name filter to centre details page

Page `app/centres/[centreId]/page.tsx` needs to have a new filter (it should be the first one from left to right) next to the other filters.

This filter should let users filter by `normalized_activity_type`.

This filter should be a chip-based multiselect that looks like a combobox. Meaning the component that lets users type and chips are displayed inside of the text field.
- it should users remove selected chips by clicking on them or with the delete key
- it should restrict users to only add chips from available options (list of unique `normalized_activity_type`). It should let them add chips by clicking on item on the list or by typing enter on the active option.
- The filter should have a very similar style to the ages filter in that same page. Meaning the options that show up underneath should have the same style as the little component that opens for the text filter.

---

## Implementation Plan

### Architecture Overview
Current filter flow:
1. `app/centres/[centreId]/page.tsx` - Manages filter state
2. `CentreDetailsHeader` - Passes filters to UI component
3. `CentreDetailsFilters` - Renders filter controls
4. `CentreDetailsContent` - Applies filters to activities

### Changes Required

#### 1. State Management (`app/centres/[centreId]/page.tsx`)
- Add state: `const [activityTypeFilter, setActivityTypeFilter] = useState<string[]>([]);`
- Pass to CentreDetailsHeader: `activityTypeFilter` and `onActivityTypeFilterChange`
- Pass to CentreDetailsContent: `activityTypeFilter`

#### 2. Props Update (`app/components/CentreDetailsHeader.tsx`)
- Add to interface: `activityTypeFilter`, `onActivityTypeFilterChange`, `activities`
- Pass all to CentreDetailsFilters

#### 3. Filter UI (`app/components/CentreDetailsFilters.tsx`)
**Position:** First filter (leftmost), before Date Range filter

**Component Features:**
- Button with "category" icon, showing "Activity Types" or "Activity Types (n)" when items selected
- Active state styling when items selected (border-[#8b7360], bg-[#8b7360]/10)
- Dropdown opens on click with same styling as age filter (rounded-xl, shadow-lg, border)

**Chip Combobox Implementation:**
- Input field for typing/searching with chips displayed inline
- Chips show selected activity types with X button
- Dropdown shows filtered options based on input text
- Click option or press Enter to add chip
- Click X on chip or press Backspace/Delete to remove chip
- Extract unique `normalized_activity_type` values from activities (filter out null/undefined)
- Case-insensitive search filtering

**State:**
- `isActivityTypeDropdownOpen` - dropdown visibility
- `activityTypeInput` - current input text for search
- `highlightedIndex` - keyboard navigation
- Local ref for click-outside detection

**Keyboard Navigation:**
- ArrowDown/ArrowUp - navigate options
- Enter - select highlighted option
- Backspace - remove last chip when input empty
- Escape - close dropdown

#### 4. Filtering Logic (`app/components/CentreDetailsContent.tsx`)
Add to `filteredActivities` useMemo (after age filter, before date filter):
```typescript
// Activity type filter (OR logic)
if (activityTypeFilter.length > 0) {
  if (!activity.normalized_activity_type ||
      !activityTypeFilter.includes(activity.normalized_activity_type)) {
    return false;
  }
}
```

### UI/UX Specifications
- **Filter Logic:** OR - show activities matching ANY selected type
- **Button Label:** Show count (e.g., "Activity Types (2)")
- **Icon:** Material Symbols "category"
- **Styling:** Match age filter dropdown style
- **Empty State:** No filter applied when array is empty

### Files to Modify
1. `app/centres/[centreId]/page.tsx` - Add state and pass props
2. `app/components/CentreDetailsHeader.tsx` - Update interface and pass props
3. `app/components/CentreDetailsFilters.tsx` - Implement chip-based multiselect combobox
4. `app/components/CentreDetailsContent.tsx` - Add filtering logic 
