import { z } from "zod";

export const communityCentreSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  neighbourhood: z.string(),
  lat: z.number(),
  lng: z.number(),
  total_activities: z.number().default(0),
  example_activities: z.array(z.string()).default([]),
});

export type CommunityCentre = z.infer<typeof communityCentreSchema>;
