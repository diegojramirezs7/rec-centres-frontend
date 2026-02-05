"use client";

import { useState, useMemo, useEffect } from "react";
import type { Activity } from "@/lib/schemas/activity";
import { ActivityDetailsHeader } from "./ActivityDetailsHeader";
import { ActivitySessionsList } from "./ActivitySessionsList";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { calculateDistance } from "@/lib/utils/geolocation";
import type { GeolocationError } from "@/lib/types/geolocation";

interface ActivityDetailsContentProps {
  activityName: string;
  sessions: Activity[];
}

type SessionWithDistance = Activity & { distance?: number };

export function ActivityDetailsContent({
  activityName,
  sessions,
}: ActivityDetailsContentProps) {
  // Filter state
  const [dateRange, setDateRange] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<string>("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [closeToMe, setCloseToMe] = useState(false);

  // Geolocation hook for proximity sorting
  const { coordinates, loading, error, requestLocation, clearLocation } =
    useGeolocation();

  // Request location when closeToMe becomes true
  useEffect(() => {
    if (closeToMe) {
      requestLocation();
    } else {
      clearLocation();
    }
  }, [closeToMe, requestLocation, clearLocation]);

  // Error message mapping
  const getErrorMessage = (error: GeolocationError): string => {
    switch (error) {
      case "permission_denied":
        return "Location access denied. Please enable location permissions to use this feature.";
      case "position_unavailable":
        return "Unable to determine your location. Please try again.";
      case "timeout":
        return "Location request timed out. Please try again.";
      case "unsupported":
        return "Location services are not available. This feature requires HTTPS.";
    }
  };

  // Filter and sort sessions based on user criteria
  const filteredSessions = useMemo<SessionWithDistance[]>(() => {
    // First, filter sessions
    let result: SessionWithDistance[] = sessions.filter((session) => {
      // Age filter
      if (ageFilter) {
        const userAge = parseInt(ageFilter);
        if (!isNaN(userAge)) {
          const minAge = session.age_min_year || 0;
          const maxAge = session.age_max_year || Infinity;

          // If max age is 0, it usually means no upper limit
          const effectiveMaxAge = maxAge === 0 ? Infinity : maxAge;

          if (userAge < minAge || userAge > effectiveMaxAge) {
            return false;
          }
        }
      }

      // Date range filter
      if (dateRange !== "all" && session.date_range_start) {
        const sessionStart = new Date(session.date_range_start);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateRange === "next-7-days") {
          const sevenDaysLater = new Date(today);
          sevenDaysLater.setDate(today.getDate() + 7);
          if (sessionStart < today || sessionStart > sevenDaysLater) {
            return false;
          }
        } else if (dateRange === "this-month") {
          if (
            sessionStart.getMonth() !== today.getMonth() ||
            sessionStart.getFullYear() !== today.getFullYear()
          ) {
            return false;
          }
        } else if (dateRange === "next-month") {
          const nextMonth = new Date(today);
          nextMonth.setMonth(today.getMonth() + 1);
          if (
            sessionStart.getMonth() !== nextMonth.getMonth() ||
            sessionStart.getFullYear() !== nextMonth.getFullYear()
          ) {
            return false;
          }
        }
      }

      // Availability filter
      if (showAvailableOnly) {
        if (
          session.openings === null ||
          session.openings === undefined ||
          session.openings <= 0
        ) {
          return false;
        }
      }

      return true;
    });

    // Then, sort by distance if closeToMe is active and we have coordinates
    if (closeToMe && coordinates) {
      result = result
        .map((session) => {
          // Only calculate distance if the centre has valid coordinates
          if (
            session.centre_lat != null &&
            session.centre_lng != null &&
            session.centre_lat !== 0 &&
            session.centre_lng !== 0
          ) {
            return {
              ...session,
              distance: calculateDistance(
                coordinates.latitude,
                coordinates.longitude,
                session.centre_lat,
                session.centre_lng,
              ),
            };
          }
          // Sessions without coordinates get undefined distance (will be sorted to the end)
          return { ...session, distance: undefined };
        })
        .sort((a, b) => {
          // Sessions without distance go to the end
          if (a.distance === undefined && b.distance === undefined) {
            return a.name.localeCompare(b.name);
          }
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;

          // Sort by distance, with alphabetical tie-breaking
          if (Math.abs(a.distance - b.distance) < 0.01) {
            return a.name.localeCompare(b.name);
          }
          return a.distance - b.distance;
        });
    }

    return result;
  }, [
    sessions,
    ageFilter,
    dateRange,
    showAvailableOnly,
    closeToMe,
    coordinates,
  ]);

  return (
    <>
      {/* Header with filters */}
      <ActivityDetailsHeader
        activityName={activityName}
        totalSessions={sessions.length}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        ageFilter={ageFilter}
        onAgeFilterChange={setAgeFilter}
        showAvailableOnly={showAvailableOnly}
        onShowAvailableOnlyChange={setShowAvailableOnly}
        closeToMe={closeToMe}
        onCloseToMeChange={setCloseToMe}
        loading={loading}
        error={error}
      />

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-600 text-xl mt-0.5">
                warning
              </span>
              <div>
                <p className="text-sm text-amber-900 font-medium">
                  {getErrorMessage(error)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCloseToMe(false)}
              className="text-amber-600 hover:text-amber-800 transition-colors"
              aria-label="Dismiss error"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        )}

        {filteredSessions.length === 0 ? (
          // Empty state when filters return no results
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-stone-300 mb-4 block">
              filter_list_off
            </span>
            <h3 className="text-2xl font-serif text-stone-900 mb-2">
              No sessions match your filters
            </h3>
            <p className="text-stone-500 mb-4">
              Try adjusting your age, date, or availability filters
            </p>
            <button
              onClick={() => {
                setDateRange("all");
                setAgeFilter("");
                setShowAvailableOnly(false);
              }}
              className="text-[#8b7360] hover:text-[#6a5340] text-sm font-semibold transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          // Sessions list
          <ActivitySessionsList sessions={filteredSessions} />
        )}
      </main>
    </>
  );
}
