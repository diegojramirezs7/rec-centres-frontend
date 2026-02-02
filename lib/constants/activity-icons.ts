import {
  Target,
  Dumbbell,
  Zap,
  Circle,
  Users,
  Waves,
  Palette,
  UtensilsCrossed,
  Music,
  Heart,
  TreePine,
  Hammer,
  BookOpen,
  Camera,
  Scissors,
  Flower2,
  Baby,
  BadgeHelp,
  Bike,
  Swords,
  Brain,
  Trophy,
  Ship,
  Activity,
  Cross,
  type LucideIcon,
} from "lucide-react";

export interface ActivityIconConfig {
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
}

/**
 * Maps activity names to their corresponding icons and colors.
 * Activity names are normalized to lowercase for matching.
 */
const activityIconMap: Record<string, ActivityIconConfig> = {
  // Sports & Fitness
  archery: {
    icon: Target,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  athletics: {
    icon: Dumbbell,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  badminton: {
    icon: Zap,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  basketball: {
    icon: Circle,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  soccer: {
    icon: Circle,
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  football: {
    icon: Circle,
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  volleyball: {
    icon: Circle,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  tennis: {
    icon: Circle,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  pickleball: {
    icon: Circle,
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  hockey: {
    icon: Circle,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  skating: {
    icon: Circle,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },

  // Aquatics
  swimming: {
    icon: Waves,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  aquatics: {
    icon: Waves,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  "aqua fit": {
    icon: Waves,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  "water aerobics": {
    icon: Waves,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },

  // Wellness & Fitness
  yoga: {
    icon: Heart,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  pilates: {
    icon: Heart,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  fitness: {
    icon: Dumbbell,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  "weight training": {
    icon: Dumbbell,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  aerobics: {
    icon: Heart,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  zumba: {
    icon: Heart,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  dance: {
    icon: Music,
    bgColor: "bg-fuchsia-100",
    iconColor: "text-fuchsia-600",
  },

  // Arts & Crafts
  pottery: {
    icon: Hammer,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  ceramics: {
    icon: Hammer,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  painting: {
    icon: Palette,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  art: {
    icon: Palette,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  drawing: {
    icon: Palette,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  woodworking: {
    icon: Hammer,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  crafts: {
    icon: Scissors,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  sewing: {
    icon: Scissors,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  knitting: {
    icon: Scissors,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },

  // Music & Performance
  music: {
    icon: Music,
    bgColor: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  guitar: {
    icon: Music,
    bgColor: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  piano: {
    icon: Music,
    bgColor: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  singing: {
    icon: Music,
    bgColor: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  choir: {
    icon: Music,
    bgColor: "bg-violet-100",
    iconColor: "text-violet-600",
  },

  // Outdoor & Nature
  hiking: {
    icon: TreePine,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  camping: {
    icon: TreePine,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  gardening: {
    icon: Flower2,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  cycling: {
    icon: Bike,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  biking: {
    icon: Bike,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },

  // Education & Learning
  cooking: {
    icon: UtensilsCrossed,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  baking: {
    icon: UtensilsCrossed,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  photography: {
    icon: Camera,
    bgColor: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  "computer skills": {
    icon: BookOpen,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  language: {
    icon: BookOpen,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  esl: {
    icon: BookOpen,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },

  // Children & Youth
  preschool: {
    icon: Baby,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  daycare: {
    icon: Baby,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  "child care": {
    icon: Baby,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  youth: {
    icon: Users,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },

  // Social & Community
  seniors: {
    icon: Users,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  "drop-in": {
    icon: Users,
    bgColor: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  social: {
    icon: Users,
    bgColor: "bg-slate-100",
    iconColor: "text-slate-600",
  },

  // Additional Sports
  boxing: {
    icon: Swords,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  capoeira: {
    icon: Activity,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  gymnastics: {
    icon: Activity,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  "rhythmic gymnastics": {
    icon: Activity,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  netball: {
    icon: Circle,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  boccia: {
    icon: Circle,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  croquet: {
    icon: Circle,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  curling: {
    icon: Circle,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  "lawn bowling": {
    icon: Circle,
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  "dragon boat": {
    icon: Ship,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  multisport: {
    icon: Trophy,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  "open gym": {
    icon: Dumbbell,
    bgColor: "bg-slate-100",
    iconColor: "text-slate-600",
  },

  // Training & Certifications
  chess: {
    icon: Brain,
    bgColor: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  "first aid": {
    icon: Cross,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  "food safe": {
    icon: UtensilsCrossed,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
};

/**
 * Default icon configuration for activities not in the map
 */
const defaultActivityIcon: ActivityIconConfig = {
  icon: BadgeHelp,
  bgColor: "bg-slate-100",
  iconColor: "text-slate-600",
};

/**
 * Get the icon configuration for an activity.
 * Performs fuzzy matching by checking if the activity name contains any mapped keywords.
 *
 * @param activityName - The name of the activity
 * @returns Icon configuration with icon component, background color, and icon color
 */
export function getActivityIcon(activityName: string): ActivityIconConfig {
  const normalized = activityName.toLowerCase().trim();

  // First try exact match
  if (activityIconMap[normalized]) {
    return activityIconMap[normalized];
  }

  // Then try fuzzy matching - check if activity name contains any mapped keyword
  for (const [keyword, config] of Object.entries(activityIconMap)) {
    if (normalized.includes(keyword) || keyword.includes(normalized)) {
      return config;
    }
  }

  // Return default icon if no match found
  return defaultActivityIcon;
}
