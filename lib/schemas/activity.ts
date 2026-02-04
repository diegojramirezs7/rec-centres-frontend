import { z } from "zod";

export const normalizedActivityNameSchema = z.object({
  name: z.string(),
});

export const aggregatedActivitySchema = z.object({
  name: z.string(),
  total_activities: z.number(),
  centres: z.array(z.string()),
});

export const normalizedActivitySchema = z.object({
  name: z.string(),
  centre_id: z.string(),
  centre_name: z.string(),
  category: z.string(),
  total: z.number(),
  examples: z.array(z.string()),
});

// Session detail schema for centre details page
export const activitySessionSchema = z.object({
  name: z.string(),
  date: z.string().optional(),
  day: z.string().optional(),
  time: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  ageGroup: z.string().optional(),
  availableSpots: z.number().optional(),
  totalSpots: z.number().optional(),
  type: z.string().optional(), // "Drop-in", "Seasonal", "Registration"
});

// Extended schema with optional session details
export const centreActivityGroupSchema = z.object({
  name: z.string(),
  centre_id: z.string(),
  centre_name: z.string(),
  category: z.string(),
  total: z.number(),
  examples: z.array(z.string()),
  sessions: z.array(activitySessionSchema).optional(),
});

export const activitySchema = z.object({
  id: z.number(),
  name: z.string(),
  desc: z.string(),
  centre_id: z.string(),
  centre_name: z.string(),
  centre_lat: z.number(),
  centre_lng: z.number(),
  category_id: z.string(),
  detail_url: z.string().nullable().optional(),
  date_range_start: z.string().nullable().optional(),
  date_range_end: z.string().nullable().optional(),
  date_range_description: z.string().nullable().optional(),
  date_range: z.string().nullable().optional(),
  time_range: z.string().nullable().optional(),
  only_one_day: z.boolean().nullable().optional(),
  days_of_week: z.string().nullable().optional(),
  age_max_year: z.number().nullable().optional(),
  age_max_month: z.number().nullable().optional(),
  age_min_year: z.number().nullable().optional(),
  age_min_month: z.number().nullable().optional(),
  ages: z.string().nullable().optional(),
  openings: z.number().nullable().optional(),
  enroll_url: z.string().nullable().optional(),
  normalized_activity_type: z.string().nullable().optional(),
});

export type NormalizedActivityName = z.infer<
  typeof normalizedActivityNameSchema
>;
export type AggregatedActivity = z.infer<typeof aggregatedActivitySchema>;
export type NormalizedActivity = z.infer<typeof normalizedActivitySchema>;
export type ActivitySession = z.infer<typeof activitySessionSchema>;
export type CentreActivityGroup = z.infer<typeof centreActivityGroupSchema>;
export type Activity = z.infer<typeof activitySchema>;
