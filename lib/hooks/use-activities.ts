"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getNormalizedActivities,
  getActivitiesByName,
} from "@/lib/api/endpoints";

export function useNormalizedActivities() {
  return useQuery({
    queryKey: ["normalized-activities"],
    queryFn: () => getNormalizedActivities(),
  });
}

export function useActivitiesByName(name: string | null) {
  return useQuery({
    queryKey: ["activities", name],
    queryFn: () => getActivitiesByName(name!),
    enabled: name !== null,
  });
}
