/**
 * Verification script for centre details API
 * Run with: bun run verify-centre-details-api.ts
 */

import { getCentres, getCentreById, getCentreActivities } from "./lib/api/endpoints";

async function verify() {
  console.log("🔍 Verifying Centre Details API...\n");

  try {
    // Test 1: Get a valid centre ID
    console.log("1. Fetching centres to get a valid ID...");
    const centres = await getCentres({ cache: 'no-store' });
    console.log(`   ✅ Fetched ${centres.length} centres`);

    if (centres.length === 0) {
      console.error("   ❌ No centres found in API");
      process.exit(1);
    }

    const testCentreId = centres[0].id;
    const testCentreName = centres[0].name;
    console.log(`   Using test centre: "${testCentreName}" (ID: ${testCentreId})\n`);

    // Test 2: Fetch centre by ID
    console.log("2. Testing getCentreById()...");
    const centre = await getCentreById(testCentreId, { cache: 'no-store' });
    console.log(`   ✅ Successfully fetched centre by ID`);
    console.log(`   Name: ${centre.name}`);
    console.log(`   Address: ${centre.address}`);
    console.log(`   Neighbourhood: ${centre.neighbourhood}`);
    console.log(`   Total Activities: ${centre.total_activities}\n`);

    // Test 3: Fetch activities for centre
    console.log("3. Testing getCentreActivities()...");
    const activities = await getCentreActivities(testCentreId, { cache: 'no-store' });
    console.log(`   ✅ Fetched ${activities.length} activity groups`);

    if (activities.length > 0) {
      console.log(`   Examples:`);
      activities.slice(0, 3).forEach((activity, idx) => {
        console.log(`     ${idx + 1}. ${activity.name} (${activity.total} sessions, category: ${activity.category})`);
        if (activity.examples.length > 0) {
          console.log(`        Sample: ${activity.examples[0]}`);
        }
      });
    }

    console.log("\n✅ All Centre Details API tests passed!");
    console.log("\n📍 Test the page by running:");
    console.log(`   npm run dev`);
    console.log(`   Then visit: http://localhost:3000/centres/${testCentreId}`);

  } catch (error) {
    console.error("\n❌ API verification failed:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
      console.error("   Stack:", error.stack);
    }
    process.exit(1);
  }
}

verify();
