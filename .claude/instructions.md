# Claude Code Instructions for Third Places Vancouver

## Critical: Always Check Design System First

Before implementing ANY new page or component, **READ `/DESIGN_SYSTEM.md`** to ensure consistency.

## Page Layout Template (ALWAYS USE THIS)

```jsx
// For pages WITH sidebar (most common)
<main className="max-w-7xl mx-auto px-6 py-12">
  {/* Header/Hero - stays within max-w-7xl */}
  <PageHeader />

  {/* Content - breaks out to be wider */}
  <div className="flex max-w-screen-2xl mx-auto -mx-6 overflow-x-hidden">
    <aside className="w-80 flex-shrink-0 h-[calc(100vh-61px)] sticky top-[61px] border-r border-gray-200 bg-white/50 p-6 overflow-y-auto">
      {/* Sidebar */}
    </aside>
    <main className="flex-1 min-w-0 p-8">
      {/* Content */}
    </main>
  </div>
</main>
```

## Non-Negotiable Rules

1. **Primary Color**: `#8b7360` (NOT `#A68971` or any other brown)
2. **Text Colors**: Use `stone-*` palette (NOT `slate-*`)
3. **Sidebar Width**: Always `w-80` (320px, NOT `w-64` or `w-72`)
4. **Card Radius**: Always `rounded-3xl` (NOT `rounded-2xl` or `rounded-xl`)
5. **Borders**: Use `border-gray-100` or `border-gray-200` (NOT `border-slate-*`)
6. **Fonts**:
   - Headings: `font-serif` (Playfair Display)
   - Body: Default (Inter)

## Quick Color Reference

```jsx
// Text
text-stone-900  // Primary text (headings)
text-stone-500  // Secondary text (body)
text-stone-400  // Tertiary text (labels)

// Backgrounds
bg-white        // Cards
bg-white/50     // Sidebar
bg-[#8b7360]/10 // Category badges

// Borders
border-gray-100 // Cards
border-gray-200 // Sidebar, inputs

// Interactive
bg-[#8b7360]           // Primary button
text-[#8b7360]         // Links
hover:bg-stone-700     // Button hover
hover:text-[#6b5340]   // Link hover
```

## Component Reference

### Card
```jsx
<div className="group cursor-pointer bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
  {/* content */}
</div>
```

### Sidebar Section
```jsx
<div>
  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
    Label
  </label>
  {/* input */}
</div>
```

### Input
```jsx
<input className="w-full pl-3 pr-3 py-2.5 rounded-xl bg-white border-gray-200 focus:ring-2 focus:ring-[#8b7360] text-sm" />
```

## Verification Checklist

Before submitting work, verify:
- [ ] Main container uses `max-w-7xl mx-auto px-6 py-12`
- [ ] Sidebar uses exact specs from template
- [ ] Using `stone-*` NOT `slate-*` for text
- [ ] Primary color is `#8b7360`
- [ ] Cards use `rounded-3xl`
- [ ] Headings use `font-serif`

## Reference Files

- **Full Design System**: `/DESIGN_SYSTEM.md` - Read this first for new pages
- **Example Pages**:
  - Home: `/app/page.tsx` + `/app/components/HomeContent.tsx`
  - Centre Details: `/app/centres/[centreId]/page.tsx`
- **Example Components**:
  - Card: `/app/components/CentreCard.tsx`
  - Sidebar: `/app/components/Sidebar.tsx`
