"use client";

import { useState } from "react";
import type { NormalizedActivity } from "@/lib/schemas/activity";
import type { CommunityCentre } from "@/lib/schemas/centre";
import { CentreDetailsSidebar } from "./CentreDetailsSidebar";
import { ActivityCategoryCard } from "./ActivityCategoryCard";

interface CentreDetailsContentProps {
  centre: CommunityCentre;
  activities: NormalizedActivity[];
}

export function CentreDetailsContent({
  centre,
  activities,
}: CentreDetailsContentProps) {
  // Filter state
  const [ageFilter, setAgeFilter] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Note: Activity categories are always shown, but filtering is applied to sessions within each category
  // Sessions are fetched when the category is expanded and filtered based on the filter criteria

  return (
    <div className="flex max-w-screen-2xl mx-auto -mx-6 mt-8">
      {/* Sidebar with Filters */}
      <CentreDetailsSidebar
        ageFilter={ageFilter}
        onAgeFilterChange={setAgeFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        showAvailableOnly={showAvailableOnly}
        onShowAvailableOnlyChange={setShowAvailableOnly}
      />

      {/* Activity List Area */}
      <main className="flex-1 min-w-0 px-8">
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
      </main>
    </div>
  );
}
