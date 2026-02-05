"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getCentreById,
  getAllCentreActivities,
} from "@/lib/api/endpoints/centres";
import { CentreDetailsHeader } from "@/app/components/CentreDetailsHeader";
import { CentreDetailsContent } from "@/app/components/CentreDetailsContent";
import type { CommunityCentre } from "@/lib/schemas/centre";
import type { Activity } from "@/lib/schemas/activity";

export default function CentreDetailsPage() {
  const params = useParams();
  const centreId = params.centreId as string;

  // State for data
  const [centre, setCentre] = useState<CommunityCentre | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [activityTypeFilter, setActivityTypeFilter] = useState<string[]>([]);
  const [ageFilter, setAgeFilter] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [centreData, activitiesData] = await Promise.all([
          getCentreById(centreId),
          getAllCentreActivities(centreId),
        ]);
        setCentre(centreData);
        setActivities(activitiesData);
        setError(null);
      } catch (err) {
        setError("Failed to load centre details");
        console.error("Error fetching centre details:", err);
      } finally {
        setLoading(false);
      }
    }

    if (centreId) {
      fetchData();
    }
  }, [centreId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl text-stone-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !centre) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-stone-900 mb-4">
            Centre Not Found
          </h1>
          <p className="text-stone-500">
            {error || "The community centre you're looking for could not be found."}
          </p>
        </div>
      </div>
    );
  }

  // Calculate total activities
  const totalActivities = activities.length;

  return (
    <main>
      {/* Header Section */}
      <CentreDetailsHeader
        centreName={centre.name}
        address={centre.address}
        totalActivities={totalActivities}
        activities={activities}
        activityTypeFilter={activityTypeFilter}
        onActivityTypeFilterChange={setActivityTypeFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        ageFilter={ageFilter}
        onAgeFilterChange={setAgeFilter}
        showAvailableOnly={showAvailableOnly}
        onShowAvailableOnlyChange={setShowAvailableOnly}
      />

      {/* Main Content */}
      <CentreDetailsContent
        centre={centre}
        activities={activities}
        activityTypeFilter={activityTypeFilter}
        ageFilter={ageFilter}
        dateRange={dateRange}
        showAvailableOnly={showAvailableOnly}
      />
    </main>
  );
}
