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

export function useCentreActivities(centreId: string | null) {
  return useQuery({
    queryKey: ["centres", centreId, "activities"],
    queryFn: () => getCentreActivities(centreId!),
    enabled: centreId !== null,
  });
}

export function useCentreActivityDetails(
  centreId: string | null,
  activityName: string | null,
) {
  return useQuery({
    queryKey: ["centres", centreId, "activities", activityName],
    queryFn: () => getCentreActivityDetails(centreId!, activityName!),
    enabled: centreId !== null && activityName !== null,
  });
}
