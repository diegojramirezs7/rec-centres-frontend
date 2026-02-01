export const colors = {
  brand: {
    brown: {
      900: "#6b5d4f", // Primary - text, buttons
      700: "#8b7355", // Secondary - icons, hover
      500: "#a0826d", // Tertiary - gradients
    },
    cream: {
      50: "#fffef9", // Card backgrounds
      100: "#f5f1e8", // Page background
      200: "#e8dcc8", // Badges, subtle bg
      300: "#d4c4b0", // Borders
    },
  },
  semantic: {
    text: {
      primary: "#6b5d4f",
      secondary: "#8b7355",
      muted: "#a0826d",
    },
    background: {
      page: "#f5f1e8",
      card: "#fffef9",
      subtle: "#e8dcc8",
    },
    border: {
      default: "#d4c4b0",
      subtle: "#e8dcc8",
    },
    accent: {
      success: "#059669", // emerald-600
      error: "#dc2626", // red-600
      warning: "#f59e0b", // amber-500
    },
  },
} as const;

export type Colors = typeof colors;
