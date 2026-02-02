import { getCentres, getNormalizedActivities } from "@/lib/api/endpoints";
import { HomeContent } from "./components/HomeContent";

export default async function Home() {
  // Fetch both centres and activities in parallel
  const [centres, activities] = await Promise.all([
    getCentres({
      next: { revalidate: 3600 },
    }),
    getNormalizedActivities({
      next: { revalidate: 3600 },
    }),
  ]);

  return <HomeContent centres={centres} activities={activities} />;
}
