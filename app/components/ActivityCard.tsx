import Link from "next/link";
import Image from "next/image";
import type { AggregatedActivity } from "@/lib/schemas/activity";
import { getActivityIcon } from "@/lib/constants/activity-icons";

interface ActivityCardProps {
  activity: AggregatedActivity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const iconConfig = getActivityIcon(activity.name);

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
      className="activity-card group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#8b7360] transition-all cursor-pointer"
    >
      {/* Top section: Icon + Content (always horizontal) */}
      <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0 w-full">
        {/* Icon */}
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 ${iconConfig.bgColor} rounded-full flex items-center justify-center shrink-0`}
        >
          <Image
            src={iconConfig.iconPath}
            alt={`${activity.name} icon`}
            width={32}
            height={32}
            className="w-7 h-7 sm:w-8 sm:h-8"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1">
            {activity.name}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed truncate sm:whitespace-normal">
            {centreText}
          </p>
        </div>
      </div>

      {/* Bottom/Right section: Stats + Explore button */}
      <div className="w-full sm:w-auto sm:text-right sm:shrink-0 sm:pr-4 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
        <div className="text-[#8b7360] font-bold text-xs uppercase tracking-wider">
          {activity.total_activities}{" "}
          {activity.total_activities === 1 ? "Activity" : "Activities"}
        </div>
        <div className="bg-[#8b7360]/10 group-hover:bg-[#8b7360] text-[#8b7360] group-hover:text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors">
          Explore
        </div>
      </div>
    </Link>
  );
}
