"use client";

import type { AggregatedActivity } from "@/lib/schemas/activity";
import { ActivitiesHero } from "./ActivitiesHero";
import { ActivityListView } from "./ActivityListView";

interface ActivitiesContentProps {
  activities: AggregatedActivity[];
}

export function ActivitiesContent({ activities }: ActivitiesContentProps) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <ActivitiesHero />
      <ActivityListView activities={activities} />
    </main>
  );
}
