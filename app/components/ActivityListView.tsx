"use client";

import { useState, useMemo } from "react";
import type { AggregatedActivity } from "@/lib/schemas/activity";
import { ActivitySidebar } from "./ActivitySidebar";
import { PopularActivities } from "./PopularActivities";
import { ActivityCard } from "./ActivityCard";

interface ActivityListViewProps {
  activities: AggregatedActivity[];
}

export function ActivityListView({ activities }: ActivityListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter activities based on search and category
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((activity) =>
        activity.name.toLowerCase().includes(query),
      );
    }

    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter(
        (activity) => activity.name === selectedCategory,
      );
    }

    return filtered;
  }, [activities, searchQuery, selectedCategory]);

  return (
    <div className="flex max-w-screen-2xl mx-auto mt-8">
      {/* Sidebar */}
      <ActivitySidebar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main content */}
      <main className="flex-1 min-w-0 px-8">
        {/* <PopularActivities
          activities={activities}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        /> */}

        {/* Activity cards */}
        <div className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <ActivityCard key={activity.name} activity={activity} />
            ))
          ) : (
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
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="text-[#8b7360] hover:text-[#6b5340] text-sm font-semibold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
