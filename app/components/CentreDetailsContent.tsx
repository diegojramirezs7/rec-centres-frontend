"use client";

import { useState, useMemo } from "react";
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

  // Filter activities based on current filters
  // Note: Current API doesn't provide session-level data for age/date/availability filtering
  // This is a placeholder for future implementation when session data becomes available
  const filteredActivities = useMemo(() => {
    // For now, return all activities since we don't have session-level data
    // In the future, this will filter based on session details
    return activities;
  }, [activities, ageFilter, dateRange, showAvailableOnly]);

  return (
    <div className="flex max-w-screen-2xl mx-auto overflow-x-hidden -mx-6">
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
      <main className="flex-1 min-w-0 p-8">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">
              search_off
            </span>
            <h3 className="font-serif text-2xl text-slate-900 mb-2">
              No activities found
            </h3>
            <p className="text-slate-500 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setAgeFilter('');
                setDateRange('all');
                setShowAvailableOnly(false);
              }}
              className="text-[#8b7360] hover:text-[#6b5340] text-sm font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity, idx) => (
              <ActivityCategoryCard key={idx} activity={activity} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
