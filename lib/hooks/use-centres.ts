"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCentres,
  getCentreActivities,
  getCentreActivityDetails,
} from "@/lib/api/endpoints";

export function useCentres() {
  return useQuery({
    queryKey: ["centres"],
    queryFn: () => getCentres(),
  });
}

export function useCentreActivities(centreId: number | null) {
  return useQuery({
    queryKey: ["centres", centreId, "activities"],
    queryFn: () => getCentreActivities(centreId!),
    enabled: centreId !== null,
  });
}

export function useCentreActivityDetails(
  centreId: number | null,
  activityName: string | null,
) {
  return useQuery({
    queryKey: ["centres", centreId, "activities", activityName],
    queryFn: () => getCentreActivityDetails(centreId!, activityName!),
    enabled: centreId !== null && activityName !== null,
  });
}
