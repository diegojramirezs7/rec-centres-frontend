import { getNormalizedActivities } from "@/lib/api/endpoints";
import { ActivitiesContent } from "../components/ActivitiesContent";

export const metadata = {
  title: "Find Activities | Third Places Vancouver",
  description: "Discover activities and programs across all Vancouver community centres.",
};

export default async function ActivitiesPage() {
  const activities = await getNormalizedActivities({
    next: { revalidate: 3600 },
  });

  return <ActivitiesContent activities={activities} />;
}
