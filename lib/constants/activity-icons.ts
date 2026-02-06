export interface ActivityIconConfig {
  iconPath: string;
  bgColor: string;
  iconColor: string;
}

/**
 * Maps activity names to their corresponding icons and colors.
 * Activity names are normalized to lowercase for matching.
 */
const activityIconMap: Record<string, ActivityIconConfig> = {
  archery: {
    iconPath: "/icons/archery.svg",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  athletics: {
    iconPath: "/icons/athletics.svg",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  badminton: {
    iconPath: "/icons/badminton.svg",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  basketball: {
    iconPath: "/icons/basketball.svg",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  boccia: {
    iconPath: "/icons/boccia.svg",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  boxing: {
    iconPath: "/icons/boxing.svg",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  capoeira: {
    iconPath: "/icons/fighting.svg",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  chess: {
    iconPath: "/icons/chess.svg",
    bgColor: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  croquet: {
    iconPath: "/icons/mallet.svg",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  curling: {
    iconPath: "/icons/curling.svg",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  "dragon boat": {
    iconPath: "/icons/row.svg",
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  "first aid": {
    iconPath: "/icons/first-aid.svg",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  fitness: {
    iconPath: "/icons/fitness.svg",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  "food safe": {
    iconPath: "/icons/food.svg",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  gymnastics: {
    iconPath: "/icons/gymnastics.svg",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  hockey: {
    iconPath: "/icons/hockey.svg",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  "lawn bowling": {
    iconPath: "/icons/bowling.svg",
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  multisport: {
    iconPath: "/icons/athletics.svg",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  netball: {
    iconPath: "/icons/netball.svg",
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  "open gym": {
    iconPath: "/icons/open-gym.svg",
    bgColor: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  pickleball: {
    iconPath: "/icons/pickleball.svg",
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  "rhythmic gymnastics": {
    iconPath: "/icons/gymnastics.svg",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  soccer: {
    iconPath: "/icons/soccer.svg",
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  "status card clinic": {
    iconPath: "/icons/card.svg",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  "table tennis": {
    iconPath: "/icons/table-tennis.svg",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  tennis: {
    iconPath: "/icons/tennis.svg",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  volleyball: {
    iconPath: "/icons/volleyball.svg",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  yoga: {
    iconPath: "/icons/yoga.svg",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  "youth dragon boat team": {
    iconPath: "/icons/row.svg",
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
};

/**
 * Default icon configuration for activities not in the map
 */
const defaultActivityIcon: ActivityIconConfig = {
  iconPath: "/icons/card.svg",
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
