import { getActivityIcon } from "@/lib/constants/activity-icons";

interface ActivityTypeLabelProps {
  activityType: string;
  size?: "sm" | "md";
}

export function ActivityTypeLabel({
  activityType,
  size = "sm",
}: ActivityTypeLabelProps) {
  const iconConfig = getActivityIcon(activityType);
  const Icon = iconConfig.icon;

  const iconSizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const textSizeClass =
    size === "sm" ? "text-[10px]" : "text-xs";
  const paddingClass = size === "sm" ? "px-2 py-1" : "px-2.5 py-1.5";

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${paddingClass} rounded-md ${iconConfig.bgColor}`}
    >
      <Icon className={`${iconSizeClass} ${iconConfig.iconColor} flex-shrink-0`} />
      <span
        className={`${textSizeClass} font-bold uppercase tracking-wider ${iconConfig.iconColor}`}
      >
        {activityType}
      </span>
    </div>
  );
}
