import type { Activity } from "@/lib/schemas/activity";
import { ActivityTypeLabel } from "./ActivityTypeLabel";

interface CentreActivitiesTableProps {
  activities: Activity[];
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSortChange: (field: string) => void;
}

function formatDateRange(
  startDate: string | null | undefined,
  endDate?: string | null | undefined,
): string {
  if (!startDate) return "-";

  const start = new Date(startDate);
  const startYear = start.getFullYear();
  const startFormatted = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: startYear === 2026 ? undefined : "numeric",
  });

  if (!endDate) return startFormatted;

  const end = new Date(endDate);
  const endFormatted = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${startFormatted} - ${endFormatted}`;
}

export function CentreActivitiesTable({
  activities,
  sortBy,
  sortDirection,
  onSortChange,
}: CentreActivitiesTableProps) {
  if (activities.length === 0) {
    return (
      <div className="border-t border-gray-100 p-8 bg-stone-50/50">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-stone-300 mb-3 block">
            filter_list_off
          </span>
          <p className="text-sm text-stone-500 mb-2">No activities found</p>
          <p className="text-xs text-stone-400">
            Try adjusting your filters to see more results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100">
      {/* Table Header - Hidden on Mobile */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-3 bg-stone-50/50 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-gray-100">
        <button
          onClick={() => onSortChange("activity_type")}
          className="col-span-4 text-left flex items-center gap-2 hover:text-stone-600 transition-colors"
        >
          <span>Activity & Session</span>
          {sortBy === "activity_type" && (
            <span className="material-symbols-outlined text-sm">
              {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
            </span>
          )}
        </button>
        <div className="col-span-2">Day & Time</div>
        <div className="col-span-2 text-center">Age Group</div>
        <div className="col-span-2 text-center">Date Range</div>
        <div className="col-span-2 text-right">Status</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-stone-50">
        {activities.map((activity, idx) => {
          const RowWrapper = activity.detail_url ? "a" : "div";
          const linkProps = activity.detail_url
            ? {
                href: activity.detail_url,
                target: "_blank",
                rel: "noopener noreferrer",
                className:
                  "grid grid-cols-1 lg:grid-cols-12 gap-4 items-center px-8 py-5 border border-stone-100 hover:bg-stone-50 transition-colors cursor-pointer group",
              }
            : {
                className:
                  "grid grid-cols-1 lg:grid-cols-12 gap-4 items-center px-8 py-5",
              };

          return (
            <RowWrapper key={activity.id || idx} {...linkProps}>
              {/* Column 1: Activity/Session */}
              <div className="col-span-4">
                {activity.normalized_activity_type && (
                  <div className="mb-1">
                    <ActivityTypeLabel
                      activityType={activity.normalized_activity_type}
                      size="sm"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-stone-900">{activity.name}</h4>
                  {activity.detail_url && (
                    <span className="material-symbols-outlined text-stone-400 group-hover:text-[#8b7360] transition-colors text-sm">
                      open_in_new
                    </span>
                  )}
                </div>
                {/* Mobile: Show day/time inline */}
                <p className="text-xs text-stone-400 lg:hidden mt-1">
                  {activity.days_of_week && (
                    <span className="font-semibold">
                      {activity.days_of_week}
                    </span>
                  )}
                  {activity.days_of_week && activity.time_range && (
                    <span> • </span>
                  )}
                  {activity.time_range && <span>{activity.time_range}</span>}
                </p>
              </div>

              {/* Column 2: Day/Time */}
              <div className="col-span-2 hidden lg:block">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-stone-900">
                    {activity.days_of_week || "-"}
                  </span>
                  <span className="text-xs text-stone-500">
                    {activity.time_range || "-"}
                  </span>
                </div>
              </div>

              {/* Column 3: Age Group */}
              <div className="col-span-2 flex justify-start lg:justify-center">
                {activity.ages ? (
                  <span className="text-xs px-2 py-1 bg-stone-100 rounded-md text-stone-600">
                    {activity.ages}
                  </span>
                ) : (
                  <span className="text-sm text-stone-400">-</span>
                )}
              </div>

              {/* Column 4: Date Range */}
              <div className="col-span-2 flex justify-start lg:justify-center">
                <span className="text-xs font-medium text-stone-600">
                  {formatDateRange(
                    activity.date_range_start,
                    activity.date_range_end,
                  )}
                </span>
              </div>

              {/* Column 5: Openings */}
              <div className="col-span-2 flex justify-start lg:justify-end">
                {activity.openings !== undefined &&
                activity.openings !== null ? (
                  activity.openings > 0 ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      {activity.openings} spot
                      {activity.openings !== 1 ? "s" : ""} left
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-500 text-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                      Full
                    </div>
                  )
                ) : (
                  <span className="text-sm text-stone-400">-</span>
                )}
              </div>
            </RowWrapper>
          );
        })}
      </div>
    </div>
  );
}
