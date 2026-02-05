import Link from "next/link";
import { CentreDetailsFilters } from "./CentreDetailsFilters";

interface CentreDetailsHeaderProps {
  centreName: string;
  address: string;
  totalActivities: number;
  // Filter props
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  ageFilter: string;
  onAgeFilterChange: (age: string) => void;
  showAvailableOnly: boolean;
  onShowAvailableOnlyChange: (show: boolean) => void;
}

export function CentreDetailsHeader({
  centreName,
  address,
  totalActivities,
  dateRange,
  onDateRangeChange,
  ageFilter,
  onAgeFilterChange,
  showAvailableOnly,
  onShowAvailableOnlyChange,
}: CentreDetailsHeaderProps) {
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
                  href="/"
                  className="hover:text-[#8b7360] transition-colors"
                >
                  Centres
                </Link>
              </li>
              <li>
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </li>
              <li className="font-medium text-stone-900">{centreName}</li>
            </ol>
          </nav>

          {/* Page Title */}
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-stone-900 mb-4">
            {centreName}
          </h1>

          {/* Address */}
          <div className="flex items-center text-stone-500 text-lg mb-2">
            <span className="material-symbols-outlined mr-2">location_on</span>
            <span>{address}</span>
          </div>

          {/* Subtitle */}
          <p className="text-lg text-stone-500">
            {totalActivities} {totalActivities === 1 ? "activity" : "activities"}{" "}
            available
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col gap-3">
          <CentreDetailsFilters
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            ageFilter={ageFilter}
            onAgeFilterChange={onAgeFilterChange}
            showAvailableOnly={showAvailableOnly}
            onShowAvailableOnlyChange={onShowAvailableOnlyChange}
          />
        </div>
      </div>
    </header>
  );
}
