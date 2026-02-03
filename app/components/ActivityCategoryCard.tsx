"use client";

import { useState, useEffect } from "react";
import type { NormalizedActivity, Activity } from "@/lib/schemas/activity";
import { getActivityIcon } from "@/lib/constants/activity-icons";
import { ActivitySessionsTable } from "./ActivitySessionsTable";
import { getCentreActivityDetails } from "@/lib/api/endpoints/centres";

interface ActivityCategoryCardProps {
  activity: NormalizedActivity;
  ageFilter: string;
  dateRange: string;
  showAvailableOnly: boolean;
}

export function ActivityCategoryCard({
  activity,
  ageFilter,
  dateRange,
  showAvailableOnly,
}: ActivityCategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sessions, setSessions] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iconConfig = getActivityIcon(activity.name);
  const Icon = iconConfig.icon;

  // Fetch session details when card is expanded
  useEffect(() => {
    if (isExpanded && sessions.length === 0 && !error) {
      setIsLoading(true);
      getCentreActivityDetails(activity.centre_id, activity.name)
        .then((data) => {
          setSessions(data);
          setError(null);
        })
        .catch((err) => {
          console.error("Failed to fetch activity details:", err);
          setError("Failed to load activity details");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isExpanded, activity.centre_id, activity.name, sessions.length, error]);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Accordion Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between group hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Activity Icon */}
          <div
            className={`w-14 h-14 rounded-xl ${iconConfig.bgColor} ${iconConfig.iconColor} flex items-center justify-center flex-shrink-0`}
          >
            <Icon size={32} />
          </div>

          {/* Activity Info */}
          <div className="text-left">
            <h2 className="font-serif text-2xl text-stone-900 mb-1">
              {activity.name}
            </h2>
            <p className="text-stone-500 text-sm">
              {activity.total} {activity.total === 1 ? 'session' : 'sessions'} available • {activity.category}
            </p>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <span
          className={`material-symbols-outlined text-stone-400 group-hover:text-[#8b7360] transition-all text-3xl ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Accordion Content - Shows when Expanded */}
      {isExpanded && (
        <ActivitySessionsTable
          sessions={sessions}
          examples={activity.examples}
          isLoading={isLoading}
          error={error}
          ageFilter={ageFilter}
          dateRange={dateRange}
          showAvailableOnly={showAvailableOnly}
        />
      )}
    </div>
  );
}
