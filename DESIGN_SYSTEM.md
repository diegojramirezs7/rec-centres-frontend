# Third Places Vancouver - Design System

This document defines the design system, layout patterns, and styling conventions for the Third Places Vancouver application. **Follow these guidelines for ALL new pages and components** to maintain consistency.

## Table of Contents
1. [Layout Patterns](#layout-patterns)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Component Patterns](#component-patterns)
5. [Spacing & Sizing](#spacing--sizing)
6. [Code Examples](#code-examples)

---

## Layout Patterns

### Standard Page Layout

**Every page should follow this structure:**

```jsx
<main className="max-w-7xl mx-auto px-6 py-12">
  {/* Page header/hero section */}
  <PageHeader />

  {/* Content area - can break out of max-w-7xl if needed */}
  <PageContent />
</main>
```

**Key rules:**
- ✅ Use `max-w-7xl mx-auto px-6 py-12` for the main container
- ✅ This creates consistent margins and max width (1280px)
- ✅ Header/hero sections stay within this container
- ✅ Content sections CAN break out using negative margins

### Sidebar + Content Layout

**For pages with sidebars (like home page, centre details):**

```jsx
<main className="max-w-7xl mx-auto px-6 py-12">
  {/* Header stays within max-w-7xl */}
  <PageHeader />

  {/* Content breaks out to be wider */}
  <div className="flex max-w-screen-2xl mx-auto -mx-6 overflow-x-hidden">
    {/* Sidebar */}
    <aside className="w-80 flex-shrink-0 h-[calc(100vh-61px)] sticky top-[61px] border-r border-gray-200 bg-white/50 p-6 overflow-y-auto">
      {/* Sidebar content */}
    </aside>

    {/* Main content */}
    <main className="flex-1 min-w-0 p-8">
      {/* Cards or list items */}
    </main>
  </div>
</main>
```

**Why this works:**
- Outer `max-w-7xl`: Contains header (1280px max)
- Inner `max-w-screen-2xl`: Allows content to be wider (1536px max)
- `-mx-6`: Cancels parent's `px-6`, allowing sidebar to touch left edge
- `overflow-x-hidden`: Prevents horizontal scroll on mobile

**Visual diagram:**
```
┌─────────────────────────────────────────┐
│ max-w-7xl (1280px)                      │
│ ┌─────────────────────────────────────┐ │
│ │ Header/Hero                         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌───────────────────────────────────────────┐ max-w-screen-2xl (1536px)
│ │ ┌─────────┬───────────────────────┐ │     │
│ │ │ Sidebar │ Content (cards/list)  │ │     │
│ │ │ (320px) │ (flex-1)              │ │     │
│ │ └─────────┴───────────────────────┘ │     │
│ └───────────────────────────────────────────┘
└─────────────────────────────────────────┘
```

### Sidebar Specifications

**Always use this exact styling for sidebars:**

```jsx
<aside className="w-80 flex-shrink-0 h-[calc(100vh-61px)] sticky top-[61px] border-r border-gray-200 bg-white/50 p-6 overflow-y-auto">
  <div className="space-y-8">
    {/* Sidebar sections */}
  </div>
</aside>
```

**Key properties:**
- `w-80`: Fixed width (320px) - never changes
- `flex-shrink-0`: Prevents sidebar from shrinking
- `h-[calc(100vh-61px)]`: Full viewport height minus header (61px)
- `sticky top-[61px]`: Sticks to top, accounting for header
- `border-r border-gray-200`: Right border
- `bg-white/50`: Semi-transparent white background
- `p-6`: Internal padding
- `overflow-y-auto`: Allows scrolling if content is tall

### Card Grid/List Layout

**For card-based content:**

```jsx
<main className="flex-1 min-w-0 p-8">
  <div className="space-y-4">
    {items.map((item) => (
      <Card key={item.id} />
    ))}
  </div>
</main>
```

**Card styling (see Component Patterns section):**
- White background
- `rounded-3xl` (24px border radius)
- `border border-gray-100`
- `shadow-sm hover:shadow-md` transition

---

## Color Palette

### Primary Colors

```css
/* Primary brand color */
--primary: #8b7360;  /* Warm brown */

/* Use for: */
/* - Interactive elements (buttons, links) */
/* - Hover states */
/* - Active states */
/* - Icon accents */
```

**Usage examples:**
```jsx
// Buttons
className="bg-[#8b7360] text-white hover:bg-stone-700"

// Links
className="text-[#8b7360] hover:text-[#6b5340]"

// Active state
className="bg-[#8b7360] text-white"

// Badge backgrounds
className="bg-[#8b7360]/10 text-[#8b7360]"
```

### Neutral Colors (Stone Palette)

**Use the `stone` palette for all text and neutral UI elements:**

```jsx
// Primary text
text-stone-900  // Headings, important text

// Secondary text
text-stone-500  // Body text, descriptions

// Tertiary text
text-stone-400  // Labels, captions, less important text

// Backgrounds
bg-stone-50     // Light backgrounds for pills/badges
bg-stone-100    // Slightly darker backgrounds
bg-white        // Card backgrounds
```

**DO NOT use:**
- ❌ `slate-*` colors
- ❌ `gray-*` colors (except for borders: `border-gray-200`, `border-gray-100`)
- ❌ Custom hex colors (except primary: `#8b7360`)

### Background Colors

```jsx
// Page background (from globals.css)
--background: #F8F5EE  // Warm cream

// Card backgrounds
bg-white               // Cards, sidebars (solid)
bg-white/50            // Sidebar (semi-transparent)

// Input backgrounds
bg-white               // For inputs in sidebars
```

---

## Typography

### Fonts

**Two font families are used:**

1. **Serif (Display font)** - Playfair Display
   - Use for: Page titles, section headings, card titles
   - Class: `font-serif`
   - Weights: 400 (normal), 700 (bold)

2. **Sans-serif (Body font)** - Inter
   - Use for: Body text, UI elements, buttons, labels
   - Default font (no class needed)
   - Weights: 300, 400, 500, 600

### Font Size Scale

```jsx
// Page titles (H1)
className="font-serif text-4xl md:text-5xl font-normal"
// 36px mobile, 48px desktop

// Card titles (H2)
className="font-serif text-3xl"
// 30px

// Section headings (H3)
className="font-serif text-2xl"
// 24px

// Body text (default)
className="text-base"  // or no size class
// 16px

// Secondary text
className="text-lg"
// 18px

// Small text
className="text-sm"
// 14px

// Labels / tiny text
className="text-xs"
// 12px

// Mini labels
className="text-[10px]"
// 10px (used for category badges)
```

### Font Weights

```jsx
// Headings
font-normal    // 400 (serif headings)
font-medium    // 500 (sans-serif labels)
font-semibold  // 600 (buttons, important text)
font-bold      // 700 (labels, section headers)
```

### Text Examples

```jsx
// Page title
<h1 className="font-serif text-4xl md:text-5xl font-normal text-stone-900">
  Page Title
</h1>

// Section heading
<h2 className="font-serif text-3xl text-stone-900">
  Section Heading
</h2>

// Body text
<p className="text-stone-500 text-lg">
  Descriptive text goes here
</p>

// Label
<label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
  Form Label
</label>

// Small badge
<span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
  Badge Text
</span>
```

---

## Component Patterns

### Cards

**Standard card styling:**

```jsx
<div className="group cursor-pointer bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
    <div className="flex-grow">
      {/* Card content */}
    </div>
    <div className="flex items-center justify-end md:justify-start">
      <span className="material-symbols-outlined text-slate-300 group-hover:text-[#8b7360] transition-colors text-3xl">
        arrow_forward_ios
      </span>
    </div>
  </div>
</div>
```

**Key features:**
- White background
- `rounded-3xl` (24px corners)
- `border-gray-100` (subtle border)
- `shadow-sm` → `hover:shadow-md` transition
- Arrow icon that changes color on hover
- `group` class for coordinated hover effects

### Badges / Pills

**Category badges:**

```jsx
<span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#8b7360]/10 text-[#8b7360] rounded">
  Category Name
</span>
```

**Example pills:**

```jsx
<span className="text-xs bg-slate-50 text-slate-600 px-3 py-1 rounded-full border border-gray-100">
  Example Text
</span>
```

### Buttons

**Primary button:**

```jsx
<button className="flex items-center gap-2 px-6 py-3 bg-[#8b7360] text-white rounded-full text-sm font-medium hover:bg-stone-700 transition-all shadow-sm">
  <span className="material-symbols-outlined text-lg">icon_name</span>
  Button Text
</button>
```

**Text button:**

```jsx
<button className="text-[#8b7360] hover:text-[#6b5340] text-sm font-semibold">
  Button Text
</button>
```

### Form Inputs

**Text input (in sidebar):**

```jsx
<input
  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border-gray-200 focus:ring-2 focus:ring-[#8b7360] text-sm"
  placeholder="Placeholder text..."
  type="text"
/>
```

**Select dropdown:**

```jsx
<select className="w-full px-3 py-2.5 rounded-xl bg-white border-gray-200 focus:ring-2 focus:ring-[#8b7360] text-sm">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

**Toggle switch:**

```jsx
<label className="relative inline-flex items-center cursor-pointer w-full justify-between">
  <span className="text-sm font-medium">Toggle Label</span>
  <input type="checkbox" className="sr-only peer" />
  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8b7360] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b7360]"></div>
</label>
```

### Icons

**Material Symbols icons are used throughout:**

```jsx
// Standard icon
<span className="material-symbols-outlined">icon_name</span>

// With color
<span className="material-symbols-outlined text-[#8b7360]">icon_name</span>

// Different sizes
<span className="material-symbols-outlined text-xl">icon_name</span>  // 20px
<span className="material-symbols-outlined text-3xl">icon_name</span> // 30px
```

**Common icons:**
- `search` - Search functionality
- `location_on` - Addresses
- `arrow_forward_ios` - Card navigation arrows
- `chevron_right` - Breadcrumb separators
- `event_available` - Activity counts
- `filter_list` - Filters
- `restart_alt` - Clear/reset actions
- `search_off` - Empty states

---

## Spacing & Sizing

### Container Widths

```jsx
max-w-7xl        // 1280px - Main content container
max-w-screen-2xl // 1536px - Wide content (sidebar layouts)
max-w-2xl        // 672px  - Narrow content (headers)
```

### Spacing Scale (Tailwind)

```jsx
gap-2    // 8px   - Tight spacing
gap-3    // 12px  - Small spacing
gap-4    // 16px  - Default spacing
gap-6    // 24px  - Medium spacing
gap-8    // 32px  - Large spacing
gap-12   // 48px  - Extra large spacing

space-y-4  // 16px vertical spacing between items
space-y-8  // 32px vertical spacing between sections
```

### Padding

```jsx
p-6      // 24px - Default card/sidebar padding
p-8      // 32px - Main content area padding
px-6     // 24px horizontal - Page margins
py-12    // 48px vertical - Page margins

py-2.5   // 10px - Input vertical padding
px-3     // 12px - Input horizontal padding
```

### Border Radius

```jsx
rounded          // 4px  - Small elements
rounded-xl       // 12px - Inputs
rounded-3xl      // 24px - Cards
rounded-full     // 9999px - Pills, buttons, badges
```

### Heights

```jsx
h-[calc(100vh-61px)]  // Full viewport minus header
min-h-[700px]         // Minimum height for content areas
```

---

## Code Examples

### Complete Page Example

```jsx
import type { SomeData } from "@/lib/schemas/some-data";

interface PageProps {
  data: SomeData[];
}

export default function SomePage({ data }: PageProps) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-stone-900 mb-4">
            Page Title
          </h1>
          <p className="text-stone-500 text-lg">
            Page description goes here
          </p>
        </div>
      </div>

      {/* Content with Sidebar */}
      <div className="flex max-w-screen-2xl mx-auto -mx-6 overflow-x-hidden">
        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0 h-[calc(100vh-61px)] sticky top-[61px] border-r border-gray-200 bg-white/50 p-6 overflow-y-auto">
          <div className="space-y-8">
            {/* Sidebar content */}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-8">
          <div className="space-y-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
              >
                {/* Card content */}
              </div>
            ))}
          </div>
        </main>
      </div>
    </main>
  );
}
```

### Component Example

```jsx
interface CardProps {
  title: string;
  category: string;
  description: string;
}

export function Card({ title, category, description }: CardProps) {
  return (
    <div className="group cursor-pointer bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#8b7360]/10 text-[#8b7360] rounded">
              {category}
            </span>
          </div>
          <h2 className="font-serif text-3xl text-slate-900 mb-2">
            {title}
          </h2>
          <p className="text-stone-500">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-end md:justify-start">
          <span className="material-symbols-outlined text-slate-300 group-hover:text-[#8b7360] transition-colors text-3xl">
            arrow_forward_ios
          </span>
        </div>
      </div>
    </div>
  );
}
```

---

## Common Mistakes to Avoid

### ❌ Wrong

```jsx
// Using slate colors instead of stone
<p className="text-slate-500">Text</p>

// Wrong primary color
<button className="bg-[#A68971]">Button</button>

// Missing container structure
<div className="p-8">
  <Sidebar />
  <Content />
</div>

// Wrong border radius on cards
<div className="rounded-xl">Card</div>

// Wrong sidebar width
<aside className="w-64">Sidebar</aside>
```

### ✅ Correct

```jsx
// Using stone colors
<p className="text-stone-500">Text</p>

// Correct primary color
<button className="bg-[#8b7360]">Button</button>

// Proper container structure
<main className="max-w-7xl mx-auto px-6 py-12">
  <Header />
  <div className="flex max-w-screen-2xl mx-auto -mx-6">
    <Sidebar />
    <Content />
  </div>
</main>

// Correct border radius on cards
<div className="rounded-3xl">Card</div>

// Correct sidebar width
<aside className="w-80">Sidebar</aside>
```

---

## Quick Reference Checklist

When creating a new page, verify:

- [ ] Using `max-w-7xl mx-auto px-6 py-12` for main container
- [ ] If using sidebar: `flex max-w-screen-2xl mx-auto -mx-6`
- [ ] Sidebar is `w-80 flex-shrink-0 sticky...`
- [ ] Cards use `rounded-3xl border-gray-100 shadow-sm hover:shadow-md`
- [ ] Using `stone-*` colors for text (NOT `slate-*`)
- [ ] Primary color is `#8b7360` (NOT `#A68971`)
- [ ] Headings use `font-serif`
- [ ] Body text uses default Inter font
- [ ] Material Symbols icons are used
- [ ] Proper spacing: `space-y-4` for lists, `gap-4` in flex layouts
- [ ] Hover states on interactive elements
- [ ] Responsive design with `md:` breakpoints

---

## Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Material Symbols**: https://fonts.google.com/icons
- **Fonts**:
  - Playfair Display: https://fonts.google.com/specimen/Playfair+Display
  - Inter: https://fonts.google.com/specimen/Inter

---

**Last Updated**: February 2026
**Maintained By**: Third Places Vancouver Team
