import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCentreById, getCentreActivities } from "@/lib/api/endpoints/centres";
import { CentreDetailsHeader } from "@/app/components/CentreDetailsHeader";
import { CentreDetailsContent } from "@/app/components/CentreDetailsContent";

interface PageProps {
  params: Promise<{ centreId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { centreId } = await params;
    const centre = await getCentreById(centreId);

    return {
      title: `${centre.name} - Third Places Vancouver`,
      description: `Discover activities at ${centre.name}, located at ${centre.address}`,
    };
  } catch (error) {
    return {
      title: "Centre Not Found - Third Places Vancouver",
      description: "The community centre you're looking for could not be found.",
    };
  }
}

export default async function CentreDetailsPage({ params }: PageProps) {
  try {
    const { centreId } = await params;

    // Fetch centre details and activities in parallel
    const [centre, activities] = await Promise.all([
      getCentreById(centreId, { next: { revalidate: 3600 } }),
      getCentreActivities(centreId, { next: { revalidate: 3600 } }),
    ]);

    // Calculate total activities across all groups
    const totalActivities = activities.reduce((sum, group) => sum + group.total, 0);

    return (
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <CentreDetailsHeader
          centreName={centre.name}
          address={centre.address}
          totalActivities={totalActivities}
        />

        {/* Main Content with Sidebar and Activity List */}
        <CentreDetailsContent centre={centre} activities={activities} />
      </main>
    );
  } catch (error) {
    // If centre not found or error occurred, show 404
    notFound();
  }
}
