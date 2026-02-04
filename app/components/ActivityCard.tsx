import Link from "next/link";
import type { AggregatedActivity } from "@/lib/schemas/activity";
import { getActivityIcon } from "@/lib/constants/activity-icons";

interface ActivityCardProps {
  activity: AggregatedActivity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const iconConfig = getActivityIcon(activity.name);
  const IconComponent = iconConfig.icon;

  // Format centres display: show first 2, then "and X more"
  const displayCentres = activity.centres.slice(0, 2).join(", ");
  const remaining = activity.centres.length - 2;
  const centreText =
    remaining > 0 ? `${displayCentres}, and ${remaining} more` : displayCentres;

  // URL-encode the activity name for the link
  const activityUrl = `/activities/${encodeURIComponent(activity.name)}`;

  return (
    <Link
      href={activityUrl}
      className="activity-card group flex items-center gap-6 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#8b7360] transition-all cursor-pointer"
    >
      {/* Icon */}
      <div
        className={`w-16 h-16 ${iconConfig.bgColor} ${iconConfig.iconColor} rounded-full flex items-center justify-center shrink-0`}
      >
        <IconComponent size={32} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg text-slate-900 mb-1">
          {activity.name}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed">
          {centreText}
        </p>
      </div>

      {/* Right section */}
      <div className="text-right shrink-0 pr-4">
        <div className="text-[#8b7360] font-bold text-xs uppercase tracking-wider mb-1">
          {activity.total_activities}{" "}
          {activity.total_activities === 1 ? "Activity" : "Activities"}{" "}
          Available
        </div>
        <div className="bg-[#8b7360]/10 group-hover:bg-[#8b7360] text-[#8b7360] group-hover:text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors inline-block">
          Explore
        </div>
      </div>
    </Link>
  );
}
