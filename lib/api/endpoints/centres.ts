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

export async function getCentreById(
  centreId: string,
  options?: FetchOptions,
) {
  // Fetch all centres and find the matching one
  // Note: The API doesn't have a dedicated endpoint for individual centres
  const centres = await api.get("/centres", z.array(communityCentreSchema), options);
  const centre = centres.find(c => c.id === centreId);

  if (!centre) {
    throw new Error(`Centre with ID ${centreId} not found`);
  }

  return centre;
}

export async function getCentreActivities(
  centreId: string,
  options?: FetchOptions,
) {
  return api.get(
    `/centres/${centreId}/normalized-activities`,
    z.array(normalizedActivitySchema),
    options,
  );
}

export async function getCentreActivityDetails(
  centreId: string,
  activityName: string,
  options?: FetchOptions,
) {
  return api.get(
    `/centres/${centreId}/activities/${encodeURIComponent(activityName)}`,
    z.array(activitySchema),
    options,
  );
}

export async function getAllCentreActivities(
  centreId: string,
  options?: FetchOptions,
) {
  return api.get(
    `/centres/${centreId}/activities`,
    z.array(activitySchema),
    options,
  );
}
