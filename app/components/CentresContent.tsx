"use client";

import { useState, useEffect } from "react";
import type { CommunityCentre } from "@/lib/schemas/centre";
import { CentresHero } from "./CentresHero";
import { CentreList } from "./CentreList";
import { useGeolocation } from "@/lib/hooks/use-geolocation";

interface CentresContentProps {
  centres: CommunityCentre[];
}

export function CentresContent({ centres }: CentresContentProps) {
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <CentresHero
        closeToMe={closeToMe}
        setCloseToMe={setCloseToMe}
        loading={loading}
        error={error}
      />
      <CentreList
        centres={centres}
        closeToMe={closeToMe}
        coordinates={coordinates}
        error={error}
        onDismissError={() => setCloseToMe(false)}
      />
    </main>
  );
}
