# Home Page Styling Refinements

## Description

Refine the spacing and scroll behavior of the home page to improve content density and usability. The current implementation has excessive vertical padding on centre cards and neighbourhood links, preventing optimal content visibility. Additionally, the sidebar's long neighbourhood list requires users to scroll through the entire main content to access all options, which creates a poor UX.

This task focuses on:
- Reducing vertical padding on centre cards to increase content density (fit ~3 cards on screen)
- Tightening spacing between sidebar neighbourhood links for easier scanning
- Implementing independent scroll behavior for the sidebar
- Maintaining visual hierarchy and UI/UX best practices throughout

---

## Acceptance Criteria

### Content Density
- [ ] Centre cards have reduced vertical padding (py-10 → smaller value)
- [ ] Approximately 3 centre cards visible on screen at 1080p resolution without scrolling
- [ ] Cards remain visually distinct and readable with sufficient breathing room
- [ ] Card content (title, address, activities) maintains proper internal spacing

### Sidebar Spacing
- [ ] Neighbourhood links have reduced vertical spacing (space-y-3 → smaller value)
- [ ] Spacing reduction is less aggressive than centre cards (maintain readability)
- [ ] "All Areas" and individual neighbourhoods remain clearly clickable targets
- [ ] Visual hierarchy between sections (Search, Neighbourhoods) is preserved

### Independent Sidebar Scrolling
- [ ] Sidebar scrolls independently of main content area
- [ ] Users can scroll through all neighbourhoods without scrolling main content
- [ ] Sidebar maintains sticky positioning on desktop
- [ ] Scroll behavior works smoothly on all breakpoints (mobile, tablet, desktop)
- [ ] No layout shift or visual glitches when scrolling either section

### UI/UX Best Practices
- [ ] Touch targets remain at least 44x44px for accessibility
- [ ] Visual proportions and ratios remain balanced
- [ ] No negative impact on readability or scannability
- [ ] Hover states and interactive feedback still work correctly
- [ ] Responsive behavior is not negatively affected

---

## High-Level Implementation Plan

### Phase 1: Analyze Current Spacing

1. **Document Current Values**
   - Centre card: `py-10` (40px top/bottom)
   - Neighbourhood links: `space-y-3` (12px between items)
   - Sidebar container: `sticky top-32` with no max-height

2. **Identify Target Density**
   - Calculate optimal card padding for 3 cards at 1080p (1920x1080)
   - Typical viewport height available: ~900px (minus header ~80px)
   - Target: 3 cards in ~900px = ~300px per card
   - Consider: title (3xl), address, badges, activities, borders

---

### Phase 2: Reduce Centre Card Padding

**File:** `app/components/CentreCard.tsx`

1. **Update Vertical Padding**
   - Change `py-10` to `py-6` or `py-5` (test both)
   - Reduces vertical padding from 40px to 24px or 20px

2. **Adjust Internal Spacing**
   - Review `mb-2`, `mb-4` values on internal elements
   - Consider reducing bottom margin on address (`mb-4` → `mb-3`)
   - Ensure activity pills section spacing is proportional

3. **Test Visibility**
   - Verify 3 cards fit in viewport at 1080p
   - Check that borders and hover effects remain clear
   - Ensure no visual crowding

---

### Phase 3: Tighten Sidebar Neighbourhood Spacing

**File:** `app/components/Sidebar.tsx`

1. **Update Neighbourhood List Spacing**
   - Change `space-y-3` to `space-y-2` or `space-y-1.5`
   - Reduces spacing from 12px to 8px or 6px

2. **Verify Click Targets**
   - Ensure links remain easy to click (minimum 44x44px)
   - Test hover states are still visible and smooth
   - Check active state border alignment

3. **Maintain Section Spacing**
   - Keep `mb-10` on Search and Neighbourhoods sections
   - Ensure section headers remain distinct

---

### Phase 4: Implement Independent Sidebar Scrolling

**File:** `app/components/Sidebar.tsx`

1. **Add Scroll Container**
   - Wrap neighbourhood navigation in a scrollable container
   - Set `max-h-[calc(100vh-200px)]` or similar to constrain height
   - Add `overflow-y-auto` for vertical scrolling
   - Add custom scrollbar styling (optional, webkit-scrollbar)

2. **Maintain Sticky Positioning**
   - Keep `sticky top-32` on parent container
   - Ensure sticky behavior works with scrollable child
   - Test that sidebar sticks while content scrolls below it

3. **Calculate Max Height**
   - Account for header height (~80px)
   - Account for sticky offset (top-32 = 128px)
   - Account for search section and spacing
   - Example: `max-h-[calc(100vh-16rem)]` for neighbourhoods container

4. **Add Scroll Indicators**
   - Consider fade-out gradient at bottom to indicate more content
   - Optional: show scroll position indicator
   - Ensure scrollbar is visible but not intrusive

---

### Phase 5: Cross-Browser and Responsive Testing

1. **Desktop Testing (>= 1024px)**
   - Verify 3 cards visible at 1080p resolution
   - Test sidebar independent scrolling
   - Check sticky positioning
   - Test on Chrome, Firefox, Safari

2. **Tablet Testing (768px - 1024px)**
   - Verify layout adapts correctly
   - Sidebar and content should still work side-by-side
   - Scrolling behavior remains independent

3. **Mobile Testing (< 768px)**
   - Cards stack correctly with reduced padding
   - Sidebar scrolling works in stacked layout
   - Touch targets remain accessible

4. **Edge Cases**
   - Very long neighbourhood names
   - Single card (no scroll)
   - Many cards (100+)
   - Short viewport heights (<800px)

---

## Technical Implementation Details

### Sidebar Scroll Container Structure

**Before:**
```tsx
<aside className="w-full lg:w-64 flex-shrink-0">
  <div className="lg:sticky lg:top-32">
    <div className="mb-10">
      {/* Search */}
    </div>
    <div className="mb-10">
      <nav className="space-y-3">
        {/* Neighbourhoods */}
      </nav>
    </div>
  </div>
</aside>
```

**After:**
```tsx
<aside className="w-full lg:w-64 flex-shrink-0">
  <div className="lg:sticky lg:top-32">
    <div className="mb-10">
      {/* Search */}
    </div>
    <div className="mb-4">
      <h3>{/* Title */}</h3>
      <nav className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2">
        {/* Neighbourhoods - scrollable */}
      </nav>
    </div>
  </div>
</aside>
```

### Recommended Values

| Element | Current | Proposed | Reason |
|---------|---------|----------|--------|
| Centre card vertical padding | `py-10` (40px) | `py-6` (24px) | Fit 3 cards on screen |
| Centre card address margin | `mb-4` (16px) | `mb-3` (12px) | Tighter spacing |
| Neighbourhood link spacing | `space-y-3` (12px) | `space-y-2` (8px) | Easier scanning |
| Neighbourhood scroll height | N/A | `max-h-[calc(100vh-20rem)]` | Independent scroll |

---

## Testing Checklist

- [ ] Build completes without errors
- [ ] 3 centre cards visible at 1920x1080 resolution
- [ ] Centre cards remain readable and visually distinct
- [ ] Neighbourhood links have reduced spacing but remain clickable
- [ ] Sidebar scrolls independently of main content
- [ ] Sticky positioning still works on desktop
- [ ] No horizontal scrollbars appear
- [ ] Hover effects work on all interactive elements
- [ ] Active filter state remains visible
- [ ] Mobile layout (< 768px) works correctly
- [ ] Tablet layout (768px - 1024px) works correctly
- [ ] Desktop layout (>= 1024px) works correctly
- [ ] Scrollbar styling is consistent across browsers

---

## Files to Modify

1. `app/components/CentreCard.tsx` - Reduce card padding
2. `app/components/Sidebar.tsx` - Tighten spacing, add independent scroll
3. `app/globals.css` - Optional: custom scrollbar styles

---

## Future Considerations

- Add visual scroll indicators (fade gradients)
- Implement smooth scroll to top button
- Consider virtualization for very long lists (100+ centres)
- Add scroll position persistence in URL state 
