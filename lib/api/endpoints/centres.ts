import { z } from "zod";
import { api } from "../client";
import { communityCentreSchema } from "@/lib/schemas/centre";
import {
  normalizedActivitySchema,
  activitySchema,
} from "@/lib/schemas/activity";

type FetchOptions = RequestInit & {
  next?: NextFetchRequestConfig;
};

export async function getCentres(options?: FetchOptions) {
  return api.get("/centres", z.array(communityCentreSchema), options);
}

export async function getCentreActivities(
  centreId: number,
  options?: FetchOptions,
) {
  return api.get(
    `/centres/${centreId}/normalized-activities`,
    z.array(normalizedActivitySchema),
    options,
  );
}

export async function getCentreActivityDetails(
  centreId: number,
  activityName: string,
  options?: FetchOptions,
) {
  return api.get(
    `/centres/${centreId}/activities/${encodeURIComponent(activityName)}`,
    z.array(activitySchema),
    options,
  );
}
