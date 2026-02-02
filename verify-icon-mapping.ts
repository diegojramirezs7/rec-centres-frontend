import { getNormalizedActivities } from "@/lib/api/endpoints";
import { getActivityIcon } from "@/lib/constants/activity-icons";

async function verifyIconMapping() {
  try {
    console.log("Fetching activities and testing icon mapping...\n");
    const activities = await getNormalizedActivities();

    console.log(`Testing icon mapping for ${activities.length} activities:\n`);

    // Group by whether they have a custom icon or use default
    const withCustomIcon: string[] = [];
    const withDefaultIcon: string[] = [];

    activities.forEach((activity) => {
      const iconConfig = getActivityIcon(activity.name);
      if (iconConfig.bgColor === "bg-slate-100") {
        withDefaultIcon.push(activity.name);
      } else {
        withCustomIcon.push(activity.name);
      }
    });

    console.log(`✓ ${withCustomIcon.length} activities with custom icons:`);
    withCustomIcon.forEach((name) => {
      const config = getActivityIcon(name);
      console.log(`  - ${name} → ${config.bgColor} ${config.iconColor}`);
    });

    console.log(`\n⚠ ${withDefaultIcon.length} activities using default icon:`);
    withDefaultIcon.forEach((name) => {
      console.log(`  - ${name}`);
    });

    const coveragePercent = (
      (withCustomIcon.length / activities.length) *
      100
    ).toFixed(1);
    console.log(`\n📊 Icon Coverage: ${coveragePercent}%`);

    console.log("\n✓ Icon mapping verification complete!");
  } catch (error) {
    console.error("\n✗ Error:", error);
    process.exit(1);
  }
}

verifyIconMapping();
