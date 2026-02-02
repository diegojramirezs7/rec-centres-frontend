"use client";

import type { AggregatedActivity } from "@/lib/schemas/activity";

interface PopularActivitiesProps {
  activities: AggregatedActivity[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function PopularActivities({
  activities,
  selectedCategory,
  onCategorySelect,
}: PopularActivitiesProps) {
  // Get top 8 activities by total_activities count
  const popularActivities = [...activities]
    .sort((a, b) => b.total_activities - a.total_activities)
    .slice(0, 8);

  return (
    <section className="mb-10">
      <h2 className="font-serif text-xl font-bold text-slate-900 mb-4">
        Popular Activities
      </h2>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {/* All Activities */}
        <button
          onClick={() => onCategorySelect(null)}
          className={`px-5 py-2 rounded-full text-sm font-semibold shadow-sm whitespace-nowrap transition-colors ${
            selectedCategory === null
              ? "bg-[#8b7360] text-white"
              : "bg-white border border-gray-200 hover:border-[#8b7360]"
          }`}
        >
          All Activities
        </button>

        {/* Popular activity chips */}
        {popularActivities.map((activity) => (
          <button
            key={activity.name}
            onClick={() => onCategorySelect(activity.name)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === activity.name
                ? "bg-[#8b7360] text-white"
                : "bg-white border border-gray-200 hover:border-[#8b7360]"
            }`}
          >
            {activity.name}
          </button>
        ))}
      </div>
    </section>
  );
}
