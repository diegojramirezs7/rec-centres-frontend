import { z } from "zod";

export const normalizedActivityNameSchema = z.object({
  name: z.string(),
});

export const normalizedActivitySchema = z.object({
  name: z.string(),
  centre_id: z.string(),
  centre_name: z.string(),
  category: z.string(),
  total: z.number(),
  examples: z.array(z.string()),
});

export const activitySchema = z.object({
  id: z.number(),
  name: z.string(),
  desc: z.string(),
  centre_id: z.string(),
  centre_name: z.string(),
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
export type NormalizedActivity = z.infer<typeof normalizedActivitySchema>;
export type Activity = z.infer<typeof activitySchema>;
