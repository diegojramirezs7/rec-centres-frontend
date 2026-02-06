import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActivitiesByName } from "@/lib/api/endpoints/activities";
import { ActivityDetailsContent } from "@/app/components/ActivityDetailsContent";

interface PageProps {
  params: Promise<{ name: string }>;
}

/**
 * Normalize activity name to title case for consistent display
 */
function normalizeActivityName(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);
    const normalizedName = normalizeActivityName(decodedName);

    return {
      title: `${normalizedName} Schedules - Third Places Vancouver`,
      description: `Find ${normalizedName} sessions across all Vancouver community centres. Browse available programs, dates, and register online.`,
    };
  } catch (error) {
    return {
      title: "Activity Not Found - Third Places Vancouver",
      description:
        "The activity you're looking for could not be found or is no longer available.",
    };
  }
}

export default async function ActivityDetailsPage({ params }: PageProps) {
  try {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);
    const normalizedName = normalizeActivityName(decodedName);

    // Fetch activity sessions with ISR caching
    // API call with normalized name for case-insensitive matching
    const sessions = await getActivitiesByName(normalizedName, {
      next: { revalidate: 3600 },
    });

    // If no sessions found, show 404
    if (!sessions || sessions.length === 0) {
      notFound();
    }

    // Use the actual activity type from the API response for consistent display
    const activityName =
      sessions[0]?.normalized_activity_type || normalizedName;

    return (
      <main className="min-h-screen bg-background-light">
        <ActivityDetailsContent
          activityName={activityName}
          sessions={sessions}
        />
      </main>
    );
  } catch (error) {
    // If API error or any other error occurred, show 404
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching activity details:", error);
    }
    notFound();
  }
}
