import { z } from "zod";
import { api } from "../client";
import { normalizedActivityNameSchema, activitySchema } from "@/lib/schemas/activity";

type FetchOptions = RequestInit & {
  next?: NextFetchRequestConfig;
};

export async function getNormalizedActivities(options?: FetchOptions) {
  return api.get(
    "/normalized-activities",
    z.array(normalizedActivityNameSchema),
    options
  );
}

export async function getActivitiesByName(
  name: string,
  options?: FetchOptions
) {
  return api.get(
    `/activities/${encodeURIComponent(name)}`,
    z.array(activitySchema),
    options
  );
}
