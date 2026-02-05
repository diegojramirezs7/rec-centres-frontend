"use client";

import type { NormalizedActivity } from "@/lib/schemas/activity";
import type { CommunityCentre } from "@/lib/schemas/centre";
import { ActivityCategoryCard } from "./ActivityCategoryCard";

interface CentreDetailsContentProps {
  centre: CommunityCentre;
  activities: NormalizedActivity[];
  ageFilter: string;
  dateRange: string;
  showAvailableOnly: boolean;
}

export function CentreDetailsContent({
  centre,
  activities,
  ageFilter,
  dateRange,
  showAvailableOnly,
}: CentreDetailsContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-6">
      {activities.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">
            search_off
          </span>
          <h3 className="font-serif text-2xl text-slate-900 mb-2">
            No activities found
          </h3>
          <p className="text-slate-500">
            This centre doesn&apos;t have any activities at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, idx) => (
            <ActivityCategoryCard
              key={idx}
              activity={activity}
              ageFilter={ageFilter}
              dateRange={dateRange}
              showAvailableOnly={showAvailableOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
}
