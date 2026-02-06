"use client";

import { useMemo, useState } from "react";
import type { Activity } from "@/lib/schemas/activity";
import type { CommunityCentre } from "@/lib/schemas/centre";
import { CentreActivitiesTable } from "./CentreActivitiesTable";
import { shouldShowActivityInDateFilter } from "@/lib/utils/date-filters";

interface CentreDetailsContentProps {
  centre: CommunityCentre;
  activities: Activity[];
  activityTypeFilter: string[];
  ageFilter: string;
  dateRange: string;
  showAvailableOnly: boolean;
}

export function CentreDetailsContent({
  centre,
  activities,
  activityTypeFilter,
  ageFilter,
  dateRange,
  showAvailableOnly,
}: CentreDetailsContentProps) {
  const [sortBy, setSortBy] = useState("activity_type");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter activities based on user criteria
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Activity type filter (OR logic)
      if (activityTypeFilter.length > 0) {
        if (
          !activity.normalized_activity_type ||
          !activityTypeFilter.includes(activity.normalized_activity_type)
        ) {
          return false;
        }
      }

      // Age filter
      if (ageFilter) {
        const userAge = parseInt(ageFilter);
        if (!isNaN(userAge)) {
          const minAge = activity.age_min_year || 0;
          const maxAge = activity.age_max_year || Infinity;
          const effectiveMaxAge = maxAge === 0 ? Infinity : maxAge;

          if (userAge < minAge || userAge > effectiveMaxAge) {
            return false;
          }
        }
      }

      // Date range filter
      if (dateRange !== "all") {
        if (!shouldShowActivityInDateFilter(
          activity.date_range_start,
          activity.date_range_end,
          dateRange
        )) {
          return false;
        }
      }

      // Availability filter
      if (showAvailableOnly) {
        if (
          activity.openings === null ||
          activity.openings === undefined ||
          activity.openings <= 0
        ) {
          return false;
        }
      }

      return true;
    });
  }, [activities, activityTypeFilter, ageFilter, dateRange, showAvailableOnly]);

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (field === sortBy) {
      // Toggle direction if clicking same field
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // New field, default to ascending
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Sort activities
  const sortedActivities = useMemo(() => {
    const sorted = [...filteredActivities];
    if (sortBy === "activity_type") {
      sorted.sort((a, b) => {
        const typeA = a.normalized_activity_type || "";
        const typeB = b.normalized_activity_type || "";
        const comparison = typeA.localeCompare(typeB);
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }
    return sorted;
  }, [filteredActivities, sortBy, sortDirection]);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16">
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
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <CentreActivitiesTable
            activities={sortedActivities}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
        </div>
      )}
    </div>
  );
}
