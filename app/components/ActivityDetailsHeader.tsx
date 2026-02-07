import Link from "next/link";
import { ActivityDetailsFilters } from "./ActivityDetailsFilters";
import type { GeolocationError } from "@/lib/types/geolocation";

interface ActivityDetailsHeaderProps {
  activityName: string;
  totalSessions: number;
  // Filter props
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  ageFilter: string;
  onAgeFilterChange: (age: string) => void;
  showAvailableOnly: boolean;
  onShowAvailableOnlyChange: (show: boolean) => void;
  // Geolocation props
  closeToMe: boolean;
  onCloseToMeChange: (value: boolean) => void;
  loading: boolean;
  error: GeolocationError | null;
}

export function ActivityDetailsHeader({
  activityName,
  totalSessions,
  dateRange,
  onDateRangeChange,
  ageFilter,
  onAgeFilterChange,
  showAvailableOnly,
  onShowAvailableOnlyChange,
  closeToMe,
  onCloseToMeChange,
  loading,
  error,
}: ActivityDetailsHeaderProps) {
  return (
    <header className="max-w-7xl mx-auto px-6 pt-12 pb-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex mb-4 text-sm text-stone-500"
          >
            <ol className="flex items-center space-x-2">
              <li>
                <Link
                  href="/activities"
                  className="hover:text-[#8b7360] transition-colors"
                >
                  Activities
                </Link>
              </li>
              <li>
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </li>
              <li className="font-medium text-stone-900">{activityName}</li>
            </ol>
          </nav>

          {/* Page Title */}
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-stone-900 mb-4">
            {activityName} <span className="text-[#8b7360]">Schedules</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-stone-500">
            {totalSessions} {totalSessions === 1 ? "session" : "sessions"}{" "}
            across all community centres
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col gap-3">
          <ActivityDetailsFilters
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            ageFilter={ageFilter}
            onAgeFilterChange={onAgeFilterChange}
            showAvailableOnly={showAvailableOnly}
            onShowAvailableOnlyChange={onShowAvailableOnlyChange}
            closeToMe={closeToMe}
            onCloseToMeChange={onCloseToMeChange}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </header>
  );
}
