"use client";

import { useState, useEffect } from "react";
import type { CommunityCentre } from "@/lib/schemas/centre";
import type { AggregatedActivity } from "@/lib/schemas/activity";
import { Header, type ViewMode } from "./Header";
import { Hero } from "./Hero";
import { CentreList } from "./CentreList";
import { ActivityListView } from "./ActivityListView";
import { useGeolocation } from "@/lib/hooks/use-geolocation";

interface HomeContentProps {
  centres: CommunityCentre[];
  activities: AggregatedActivity[];
}

export function HomeContent({ centres, activities }: HomeContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("centre");
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

  return (
    <>
      <Header viewMode={viewMode} onViewModeChange={setViewMode} />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Hero
          viewMode={viewMode}
          closeToMe={closeToMe}
          setCloseToMe={setCloseToMe}
          loading={loading}
          error={error}
        />
        {viewMode === "centre" ? (
          <CentreList
            centres={centres}
            closeToMe={closeToMe}
            coordinates={coordinates}
            error={error}
            onDismissError={() => setCloseToMe(false)}
          />
        ) : (
          <ActivityListView activities={activities} />
        )}
      </main>
    </>
  );
}
