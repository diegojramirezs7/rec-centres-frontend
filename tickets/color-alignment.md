# Color Alignment with Home Template

## Description

The current implementation uses the design system colors (brand-brown, brand-cream) extensively, but the `home-template.html` uses a different, simpler color palette. The template primarily relies on Tailwind's stone palette with a single custom primary color (`#8b7360`), creating a cleaner, more neutral look with better contrast.

This task aligns our React implementation with the template's exact color choices to ensure visual consistency.

---

## Color Comparison Analysis

### Template Color Scheme
```javascript
// Custom colors defined in template
colors: {
  primary: "#8b7360",           // Warm brown - used for accents
  "background-light": "#fdfcf9", // Very light cream (almost white)
  "background-dark": "#121212",  // Dark mode background
  "surface-light": "#ffffff",    // Pure white for cards/surfaces
  "surface-dark": "#1e1e1e",     // Dark mode surfaces
}

// Relies heavily on Tailwind's built-in stone palette:
// stone-50, stone-100, stone-200, stone-300, stone-400, stone-500
// stone-600, stone-700, stone-800, stone-900
```

### Current Implementation (Design System)
```javascript
// Brand colors
brand-brown-900: "#6b5d4f"  // Primary text, buttons
brand-brown-700: "#8b7355"  // Secondary (close to template primary but different)
brand-brown-500: "#a0826d"  // Tertiary

brand-cream-50: "#fffef9"   // Card backgrounds
brand-cream-100: "#f5f1e8"  // Page background (more beige than template)
brand-cream-200: "#e8dcc8"  // Badges
brand-cream-300: "#d4c4b0"  // Borders
```

### Key Differences

| Element | Template Uses | We Currently Use | Issue |
|---------|---------------|------------------|-------|
| Primary accent | `#8b7360` | `brand-brown-700` (#8b7355) | Slightly different hue |
| Body background | `#fdfcf9` (very light cream) | `brand-cream-100` (#f5f1e8) | Ours is more beige |
| Header background | `white/70` with backdrop blur | Same ✓ | Correct |
| Logo background | `bg-primary` (#8b7360) | `bg-brand-brown-700` | Different color |
| Main button | `bg-primary` | `bg-brand-brown-700` | Different color |
| Button hover | `hover:bg-stone-700` | `hover:bg-stone-700` | Correct ✓ |
| About link hover | `hover:text-primary` | `hover:text-brand-brown-700` | Different color |
| Search focus | `focus:border-primary` | `focus:border-brand-brown-700` | Different color |
| Sidebar active | `text-primary border-primary` | `text-brand-brown-700 border-brand-brown-700` | Different color |
| Arrow hover | `group-hover:text-primary` | `group-hover:text-brand-brown-700` | Different color |

---

## Acceptance Criteria

### Color Accuracy
- [ ] Primary color is exactly `#8b7360` (template's primary)
- [ ] Body background is `#fdfcf9` (very light cream, not beige)
- [ ] All accent colors use the single `primary` color consistently
- [ ] Stone palette used for text, borders, badges (not custom cream colors)
- [ ] Header remains `white/70` with backdrop blur
- [ ] Dark mode uses template's dark colors

### Component Updates
- [ ] Header logo background uses `primary` color
- [ ] "Find Nearest Centre" button uses `bg-primary`
- [ ] About link hovers to `primary` color
- [ ] Search input focus border is `primary` color
- [ ] Sidebar active state uses `primary` for text and border
- [ ] Centre card arrow hovers to `primary` color
- [ ] All stone-* classes match template usage

### Visual Consistency
- [ ] Page background is lighter, less beige
- [ ] Accent color is consistent throughout (no mixing brand-brown-700/900)
- [ ] Text uses stone palette (stone-400, stone-500, stone-600, etc.)
- [ ] Badges use stone-100 background, not brand-cream-200
- [ ] Borders use stone-100/stone-200, not brand-cream-300

---

## High-Level Implementation Plan

### Phase 1: Update CSS Variables and Theme

**File:** `app/globals.css`

1. **Replace Design System Colors with Template Colors**
   ```css
   /* Remove all brand-brown and brand-cream variables */
   /* Add template colors instead */
   --color-primary: #8b7360;
   --color-background-light: #fdfcf9;
   --color-background-dark: #121212;
   --color-surface-light: #ffffff;
   --color-surface-dark: #1e1e1e;
   ```

2. **Update Body Background**
   ```css
   body {
     background: #fdfcf9;  /* Light cream, not beige */
   }
   ```

3. **Update Custom Classes**
   - `.sidebar-link-active`: Use `primary` color
   - `.list-item-hover`: Keep rgba(139, 115, 96, 0.03) (based on primary)

---

### Phase 2: Update Component Colors

**File:** `app/components/Header.tsx`

1. **Logo Background**
   ```tsx
   // Before: bg-brand-brown-700
   // After: bg-primary or style={{ backgroundColor: '#8b7360' }}
   <div className="... bg-[#8b7360] ...">
   ```

2. **About Link Hover**
   ```tsx
   // Before: hover:text-brand-brown-700
   // After: hover:text-[#8b7360]
   <a className="... hover:text-[#8b7360] ...">
   ```

---

**File:** `app/components/Hero.tsx`

1. **Find Nearest Button**
   ```tsx
   // Before: bg-brand-brown-700
   // After: bg-[#8b7360]
   <button className="... bg-[#8b7360] ...">
   ```

---

**File:** `app/components/Sidebar.tsx`

1. **Search Input Focus Border**
   ```tsx
   // Before: focus:border-brand-brown-700
   // After: focus:border-[#8b7360]
   <input className="... focus:border-[#8b7360] ..." />
   ```

2. **Sidebar Active State Class**
   Update in `globals.css`:
   ```css
   .sidebar-link-active {
     color: #8b7360;
     border-color: #8b7360;
   }
   ```

---

**File:** `app/components/CentreCard.tsx`

1. **Arrow Hover Color**
   ```tsx
   // Before: group-hover:text-brand-brown-700
   // After: group-hover:text-[#8b7360]
   <span className="... group-hover:text-[#8b7360] ...">
   ```

---

**File:** `app/components/ActivityView.tsx`

1. **Update Any Brand Colors**
   - Use stone palette for muted elements
   - Use primary (#8b7360) for any accent needs

---

### Phase 3: Define Primary Color as CSS Variable

**File:** `app/globals.css`

1. **Add Primary Variable to @theme**
   ```css
   @theme inline {
     --color-primary: #8b7360;
     /* Keep fonts */
     --font-sans: var(--font-inter);
     --font-serif: var(--font-playfair);
   }
   ```

2. **Use Tailwind's Arbitrary Color Reference**
   Throughout components, use:
   - `bg-[var(--color-primary)]` or
   - `bg-primary` (if Tailwind v4 supports it) or
   - Direct hex: `bg-[#8b7360]`

---

### Phase 4: Simplify Background and Surface Colors

1. **Body Background**
   ```css
   body {
     background: #fdfcf9;  /* Very light cream from template */
   }
   ```

2. **Remove Custom Cream Colors**
   - Stop using brand-cream-50, brand-cream-100, etc.
   - Use stone-50, stone-100 for subtle backgrounds
   - Use white for surfaces/cards

3. **Header Background**
   - Keep `bg-white/70 dark:bg-surface-dark/70`
   - Already matches template ✓

---

### Phase 5: Update Text and Border Colors

**Systematic Replacement:**

| Current | Replace With | Usage |
|---------|--------------|-------|
| `text-brand-brown-900` | `text-stone-900` | Dark text |
| `text-brand-brown-700` | `text-stone-700` | Medium text |
| `text-brand-brown-500` | `text-stone-500` | Muted text |
| `bg-brand-cream-50` | `bg-stone-50` | Very subtle bg |
| `bg-brand-cream-100` | `bg-stone-100` | Badge background |
| `bg-brand-cream-200` | `bg-stone-100` | Badge background |
| `border-brand-cream-300` | `border-stone-100` | Borders |
| `border-brand-cream-200` | `border-stone-200` | Borders |

**Files to Update:**
- `app/components/CentreCard.tsx` - Badges, borders
- `app/components/Hero.tsx` - Toggle background
- `app/components/Sidebar.tsx` - Input borders

---

## Detailed Component Changes

### Header.tsx
```tsx
// Logo background
<div className="w-9 h-9 rounded-full bg-[#8b7360] ...">

// About link
<a className="... hover:text-[#8b7360] ...">
```

### Hero.tsx
```tsx
// Button
<button className="... bg-[#8b7360] ...">

// Toggle container (already correct with stone-100)
<div className="... bg-stone-100 dark:bg-stone-900 ...">
```

### Sidebar.tsx
```tsx
// Search input
<input className="... focus:border-[#8b7360] ..." />
```

### CentreCard.tsx
```tsx
// Neighbourhood badge
<span className="... bg-stone-100 dark:bg-stone-900 text-stone-500 ...">

// Activity pills
<span className="... bg-stone-50 dark:bg-stone-900/50 text-stone-600 ...">

// Arrow
<span className="... group-hover:text-[#8b7360] ...">
```

### globals.css
```css
@theme inline {
  --color-primary: #8b7360;
  --font-sans: var(--font-inter);
  --font-serif: var(--font-playfair);
  --font-mono: var(--font-geist-mono);
}

body {
  background: #fdfcf9;
  color: #292524; /* stone-800 */
}

.sidebar-link-active {
  @apply font-medium border-l-2 pl-4 -ml-4;
  color: #8b7360;
  border-color: #8b7360;
}
```

---

## Testing Checklist

- [ ] Primary color `#8b7360` used consistently across all accent elements
- [ ] Body background is `#fdfcf9` (very light cream)
- [ ] Logo background matches template primary
- [ ] "Find Nearest Centre" button matches template primary
- [ ] About link hover matches template primary
- [ ] Search focus border matches template primary
- [ ] Sidebar active state matches template primary
- [ ] Arrow hover matches template primary
- [ ] Badges use stone-100, not custom cream
- [ ] Text uses stone palette throughout
- [ ] Borders use stone-100/200, not custom cream
- [ ] No references to brand-brown-* or brand-cream-* remain
- [ ] Visual appearance matches template screenshot
- [ ] Dark mode still works correctly
- [ ] Build completes without errors

---

## Migration Strategy

### Option A: Direct Replacement (Recommended)
1. Update `globals.css` to remove design system colors
2. Add single primary color variable
3. Find/replace all `brand-brown-700` → `#8b7360` in components
4. Find/replace all `brand-cream-*` with appropriate stone-* values
5. Test thoroughly

### Option B: Create Primary Alias
1. Keep design system for future use
2. Add `primary` alias pointing to `#8b7360`
3. Update components to use `primary` or direct hex
4. Document that design system is available but not used on home page

**Recommendation:** Option A - Simplify to match template exactly

---

## Files to Modify

1. ✅ `app/globals.css` - Remove design system, add primary color
2. ✅ `app/components/Header.tsx` - Update logo bg, About link hover
3. ✅ `app/components/Hero.tsx` - Update button bg
4. ✅ `app/components/Sidebar.tsx` - Update focus border
5. ✅ `app/components/CentreCard.tsx` - Update arrow hover, badge colors
6. ✅ `app/components/ActivityView.tsx` - Verify no brand colors used

---

## Expected Visual Changes

### Before (Current)
- Body background: Warm beige (#f5f1e8)
- Accent color: Slightly different brown (#8b7355)
- Overall warmer, more saturated look

### After (Template Match)
- Body background: Very light cream (#fdfcf9) - almost white
- Accent color: Exact template brown (#8b7360)
- Overall lighter, cleaner, more neutral look
- Better contrast and readability

---

## Notes

- The template uses a simpler color system: one primary + stone palette
- This is easier to maintain than the full design system
- The lighter background (#fdfcf9 vs #f5f1e8) creates better contrast
- Using stone-* classes is more standard and predictable
- The design system can be preserved for other pages if needed
