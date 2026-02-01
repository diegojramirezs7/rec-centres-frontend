/**
 * Tailwind CSS Preset for Thirdplaces Design System
 *
 * For Tailwind v3: Use this preset in your tailwind.config.js
 * For Tailwind v4: Import the CSS variables from globals.css or use the CSS snippet in README.md
 */
import type { Config } from "tailwindcss";
import { colors, typography, spacing, borderRadius } from "./tokens";

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: colors.brand,
        text: colors.semantic.text,
        background: colors.semantic.background,
        border: colors.semantic.border,
        accent: colors.semantic.accent,
      },
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      spacing: spacing,
      borderRadius: borderRadius,
    },
  },
};

export default preset;

// Re-export tokens for direct usage
export { colors, typography, spacing, borderRadius };
