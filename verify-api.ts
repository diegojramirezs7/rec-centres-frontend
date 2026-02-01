/**
 * Verification script to test API infrastructure
 * Run with: bun run verify-api.ts
 */

import { getCentres, getCentreActivities, getNormalizedActivities } from "./lib/api/endpoints";

async function verify() {
  console.log("🔍 Verifying API Infrastructure...\n");

  try {
    // Test 1: Fetch all centres
    console.log("1. Testing getCentres()...");
    const centres = await getCentres({ cache: 'no-store' });
    console.log(`   ✅ Fetched ${centres.length} centres`);
    console.log(`   Example: ${centres[0]?.name} in ${centres[0]?.neighbourhood}\n`);

    // Test 2: Fetch activities for first centre
    if (centres.length > 0) {
      console.log("2. Testing getCentreActivities()...");
      const activities = await getCentreActivities(Number(centres[0].id), { cache: 'no-store' });
      console.log(`   ✅ Fetched ${activities.length} activities for ${centres[0].name}`);
      if (activities.length > 0) {
        console.log(`   Example: ${activities[0]?.name} (${activities[0]?.total} activities)\n`);
      }
    }

    // Test 3: Fetch normalized activities
    console.log("3. Testing getNormalizedActivities()...");
    const normalizedActivities = await getNormalizedActivities({ cache: 'no-store' });
    console.log(`   ✅ Fetched ${normalizedActivities.length} normalized activity types`);
    console.log(`   Examples: ${normalizedActivities.slice(0, 5).map(a => a.name).join(", ")}\n`);

    console.log("✅ All API tests passed!");
    console.log("\n📍 Next steps:");
    console.log("   - Visit http://localhost:3000 to see the server component example");
    console.log("   - Visit http://localhost:3000/client-example to see the client component example");

  } catch (error) {
    console.error("❌ API verification failed:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
      console.error("   Name:", error.name);
    }
    process.exit(1);
  }
}

verify();
