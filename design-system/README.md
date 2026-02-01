# Thirdplaces Design System

A portable, reusable design system for the Thirdplaces brand. This system provides consistent colors, typography, and spacing tokens that can be used across multiple projects.

## Installation

### For Tailwind v4 (CSS-based)

Copy the theme variables from `globals.css` or add these CSS custom properties to your stylesheet:

```css
@theme inline {
  /* Brand Colors */
  --color-brand-brown-900: #6b5d4f;
  --color-brand-brown-700: #8b7355;
  --color-brand-brown-500: #a0826d;
  --color-brand-cream-50: #fffef9;
  --color-brand-cream-100: #f5f1e8;
  --color-brand-cream-200: #e8dcc8;
  --color-brand-cream-300: #d4c4b0;

  /* Semantic Colors */
  --color-text-primary: #6b5d4f;
  --color-text-secondary: #8b7355;
  --color-text-muted: #a0826d;
  --color-bg-page: #f5f1e8;
  --color-bg-card: #fffef9;
  --color-bg-subtle: #e8dcc8;
  --color-border-default: #d4c4b0;
  --color-border-subtle: #e8dcc8;
  --color-accent-success: #059669;
  --color-accent-error: #dc2626;
  --color-accent-warning: #f59e0b;

  /* Typography */
  --font-serif: Georgia, serif;
}
```

### For Tailwind v3 (JavaScript-based)

Use the preset in your `tailwind.config.js`:

```typescript
import thirdplacesPreset from './design-system/tailwind.preset'

export default {
  presets: [thirdplacesPreset],
  // ... your other config
}
```

### Direct Token Access

Import tokens directly for use in JavaScript/TypeScript:

```typescript
import { colors, typography, spacing } from './design-system/tokens'

// Use in styled-components, CSS-in-JS, etc.
const primaryColor = colors.brand.brown[900] // '#6b5d4f'
```

---

## Color Palette

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-brown-900` | `#6b5d4f` | Primary text, buttons, main brand color |
| `brand-brown-700` | `#8b7355` | Secondary text, icons, hover states |
| `brand-brown-500` | `#a0826d` | Gradients, tertiary accents |
| `brand-cream-50` | `#fffef9` | Card backgrounds, off-white |
| `brand-cream-100` | `#f5f1e8` | Page background, light beige |
| `brand-cream-200` | `#e8dcc8` | Badges, subtle backgrounds |
| `brand-cream-300` | `#d4c4b0` | Borders, separators |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#6b5d4f` | Main body text |
| `text-secondary` | `#8b7355` | Secondary text, labels |
| `text-muted` | `#a0826d` | Disabled or muted text |
| `bg-page` | `#f5f1e8` | Page background |
| `bg-card` | `#fffef9` | Card/modal backgrounds |
| `bg-subtle` | `#e8dcc8` | Subtle background accents |
| `border-default` | `#d4c4b0` | Default borders |
| `border-subtle` | `#e8dcc8` | Subtle borders |
| `accent-success` | `#059669` | Success states |
| `accent-error` | `#dc2626` | Error states |
| `accent-warning` | `#f59e0b` | Warning states |

---

## Typography

### Font Families

| Token | Fonts | Usage |
|-------|-------|-------|
| `font-sans` | Geist, system-ui, sans-serif | Body text |
| `font-serif` | Georgia, serif | Headings |
| `font-mono` | Geist Mono, monospace | Code |

### Font Sizes

| Token | Size | Line Height |
|-------|------|-------------|
| `text-xs` | 0.75rem (12px) | 1rem |
| `text-sm` | 0.875rem (14px) | 1.25rem |
| `text-base` | 1rem (16px) | 1.5rem |
| `text-lg` | 1.125rem (18px) | 1.75rem |
| `text-xl` | 1.25rem (20px) | 1.75rem |
| `text-2xl` | 1.5rem (24px) | 2rem |
| `text-3xl` | 1.875rem (30px) | 2.25rem |
| `text-4xl` | 2.25rem (36px) | 2.5rem |
| `text-5xl` | 3rem (48px) | 1 |

### Font Weights

| Token | Weight |
|-------|--------|
| `font-normal` | 400 |
| `font-medium` | 500 |
| `font-semibold` | 600 |
| `font-bold` | 700 |

---

## Spacing

Standard Tailwind spacing scale is used:

| Token | Value |
|-------|-------|
| `0.5` | 0.125rem (2px) |
| `1` | 0.25rem (4px) |
| `1.5` | 0.375rem (6px) |
| `2` | 0.5rem (8px) |
| `3` | 0.75rem (12px) |
| `4` | 1rem (16px) |
| `5` | 1.25rem (20px) |
| `6` | 1.5rem (24px) |
| `8` | 2rem (32px) |

---

## Usage Examples

### Tailwind Classes

```html
<!-- Primary button -->
<button class="bg-brand-brown-900 hover:bg-brand-brown-900/90 text-white">
  Click me
</button>

<!-- Card -->
<div class="bg-brand-cream-50 border-2 border-brand-cream-300 rounded-lg p-6">
  <h2 class="text-brand-brown-900 font-serif text-2xl">Card Title</h2>
  <p class="text-brand-brown-700">Card content here</p>
</div>

<!-- Badge -->
<span class="bg-brand-cream-200 text-brand-brown-900 border border-brand-cream-300 px-2 py-0.5 rounded-full">
  Tag
</span>

<!-- Gradient header -->
<div class="bg-gradient-to-r from-brand-brown-700 to-brand-brown-500 text-white">
  Header content
</div>
```

---

## File Structure

```
design-system/
├── tokens/
│   ├── colors.ts      # Color definitions
│   ├── typography.ts  # Font families, sizes, weights
│   ├── spacing.ts     # Spacing and border radius
│   └── index.ts       # Barrel export
├── tailwind.preset.ts # Tailwind v3 preset
└── README.md          # This file
```

---

## Contributing

When adding new tokens:

1. Add the token to the appropriate file in `tokens/`
2. Update `tailwind.preset.ts` if using Tailwind v3
3. Update `globals.css` @theme block if using Tailwind v4
4. Document the new token in this README
