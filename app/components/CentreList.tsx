"use client";

import { useState, useMemo } from "react";
import type { CommunityCentre } from "@/lib/schemas/centre";
import { CentreCard } from "./CentreCard";
import { Sidebar } from "./Sidebar";
import { MobileFilterButton } from "./MobileFilterButton";
import { MobileCentresFilterDrawer } from "./MobileCentresFilterDrawer";
import { calculateDistance } from "@/lib/utils/geolocation";
import type {
  Coordinates,
  GeolocationError,
} from "@/lib/types/geolocation";

interface CentreListProps {
  centres: CommunityCentre[];
  closeToMe: boolean;
  coordinates: Coordinates | null;
  error: GeolocationError | null;
  onDismissError: () => void;
}

type CentreWithDistance = CommunityCentre & { distance?: number };

export function CentreList({
  centres,
  closeToMe,
  coordinates,
  error,
  onDismissError,
}: CentreListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<
    string | null
  >(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  // Extract unique neighbourhoods from centres
  const neighbourhoods = useMemo(() => {
    const unique = new Set(centres.map((c) => c.neighbourhood));
    return Array.from(unique).sort();
  }, [centres]);

  // Filter and sort centres based on search, neighbourhood, and proximity
  const sortedAndFilteredCentres = useMemo<CentreWithDistance[]>(() => {
    // First, filter centres
    let result: CentreWithDistance[] = centres.filter((centre) => {
      const matchesSearch =
        searchQuery === "" ||
        centre.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNeighbourhood =
        selectedNeighbourhood === null ||
        centre.neighbourhood === selectedNeighbourhood;
      return matchesSearch && matchesNeighbourhood;
    });

    // Then, sort by distance if closeToMe is active and we have coordinates
    if (closeToMe && coordinates) {
      result = result
        .map((centre) => ({
          ...centre,
          distance: calculateDistance(
            coordinates.latitude,
            coordinates.longitude,
            centre.lat,
            centre.lng
          ),
        }))
        .sort((a, b) => {
          // Sort by distance, with alphabetical tie-breaking
          if (Math.abs(a.distance - b.distance) < 0.01) {
            return a.name.localeCompare(b.name);
          }
          return a.distance - b.distance;
        });
    } else {
      // Sort alphabetically by name when not using proximity
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [centres, searchQuery, selectedNeighbourhood, closeToMe, coordinates]);

  // Calculate active filters count
  const activeFiltersCount =
    (searchQuery ? 1 : 0) + (selectedNeighbourhood ? 1 : 0);

  return (
    <>
      {/* Mobile Filter Button */}
      <MobileFilterButton
        onClick={() => setMobileFiltersOpen(true)}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Mobile Filter Drawer */}
      <MobileCentresFilterDrawer
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        neighbourhoods={neighbourhoods}
        selectedNeighbourhood={selectedNeighbourhood}
        onNeighbourhoodChange={setSelectedNeighbourhood}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* LAYOUT PATTERN: Sidebar + Content */}
      {/* This breaks out of parent's max-w-7xl to be wider (max-w-screen-2xl) */}
      {/* Parent has px-4 sm:px-6, responsive padding */}
      {/* Note: No overflow-x-hidden here as it breaks sticky positioning */}
      {/* mt-6 sm:mt-8: Creates space between Hero section and this content area */}
      {/* flex-col lg:flex-row: Stack on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row max-w-screen-2xl mx-auto mt-6 sm:mt-8">
        <Sidebar
          neighbourhoods={neighbourhoods}
          selectedNeighbourhood={selectedNeighbourhood}
          onNeighbourhoodChange={setSelectedNeighbourhood}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          className="hidden lg:block"
        />
        <main className="flex-1 min-w-0 px-0 lg:px-8">
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
              onClick={onDismissError}
              className="text-amber-600 hover:text-amber-800 transition-colors"
              aria-label="Dismiss error"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        )}

        {sortedAndFilteredCentres.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">
              search_off
            </span>
            <h3 className="font-serif text-2xl text-slate-900 mb-2">
              No centres found
            </h3>
            <p className="text-slate-500 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedNeighbourhood(null);
              }}
              className="text-[#8b7360] hover:text-[#6b5340] text-sm font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAndFilteredCentres.map((centre) => (
              <CentreCard
                key={centre.id}
                centre={centre}
                distance={centre.distance}
              />
            ))}
          </div>
        )}
      </main>
    </div>
    </>
  );
}
