"use client";

import { useState } from "react";
import type { CommunityCentre } from "@/lib/schemas/centre";
import { Hero, type ViewMode } from "./Hero";
import { CentreList } from "./CentreList";
import { ActivityView } from "./ActivityView";

interface HomeContentProps {
  centres: CommunityCentre[];
}

export function HomeContent({ centres }: HomeContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("centre");

  return (
    <>
      <Hero viewMode={viewMode} onViewModeChange={setViewMode} />
      {viewMode === "centre" ? (
        <CentreList centres={centres} />
      ) : (
        <ActivityView />
      )}
    </>
  );
}
