"use client";

import { useState } from "react";
import type { CommunityCentre } from "@/lib/schemas/centre";
import type { AggregatedActivity } from "@/lib/schemas/activity";
import { Header, type ViewMode } from "./Header";
import { Hero } from "./Hero";
import { CentreList } from "./CentreList";
import { ActivityListView } from "./ActivityListView";

interface HomeContentProps {
  centres: CommunityCentre[];
  activities: AggregatedActivity[];
}

export function HomeContent({ centres, activities }: HomeContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("centre");

  return (
    <>
      <Header viewMode={viewMode} onViewModeChange={setViewMode} />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Hero viewMode={viewMode} />
        {viewMode === "centre" ? (
          <CentreList centres={centres} />
        ) : (
          <ActivityListView activities={activities} />
        )}
      </main>
    </>
  );
}
