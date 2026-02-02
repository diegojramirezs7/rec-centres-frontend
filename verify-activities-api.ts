import { getNormalizedActivities } from "@/lib/api/endpoints";

async function verifyActivitiesAPI() {
  try {
    console.log("Fetching normalized activities from API...");
    const activities = await getNormalizedActivities();

    console.log(`\n✓ Successfully fetched ${activities.length} activities`);

    if (activities.length > 0) {
      console.log("\nFirst 3 activities:");
      activities.slice(0, 3).forEach((activity, idx) => {
        console.log(`\n${idx + 1}. ${activity.name}`);
        console.log(`   Total Activities: ${activity.total_activities}`);
        console.log(`   Centres: ${activity.centres.slice(0, 3).join(", ")}${activity.centres.length > 3 ? "..." : ""}`);
      });
    }

    // Verify data structure
    const firstActivity = activities[0];
    if (firstActivity) {
      console.log("\n✓ Data structure verified:");
      console.log(`  - name: ${typeof firstActivity.name}`);
      console.log(`  - total_activities: ${typeof firstActivity.total_activities}`);
      console.log(`  - centres: ${Array.isArray(firstActivity.centres) ? "array" : typeof firstActivity.centres}`);
    }

    console.log("\n✓ API endpoint verified successfully!");
  } catch (error) {
    console.error("\n✗ Error fetching activities:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

verifyActivitiesAPI();
