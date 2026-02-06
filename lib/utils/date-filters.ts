/**
 * Determines whether an activity should be shown based on the date filter.
 *
 * Logic:
 * 1. "all" filter → always show
 * 2. No dates (both null) → always show (perpetual/always available)
 * 3. Has end date AND end date < today → hide (already ended)
 * 4. Has both start AND end dates → check if filter period overlaps with activity period
 * 5. Has only start date → treat as single-day event, check if start falls within filter period
 */
export function shouldShowActivityInDateFilter(
  dateRangeStart: string | null | undefined,
  dateRangeEnd: string | null | undefined,
  dateFilter: string
): boolean {
  // Rule 1: "all" filter shows everything
  if (dateFilter === "all") {
    return true;
  }

  // Rule 2: No dates → show in all filters (always available)
  if (!dateRangeStart && !dateRangeEnd) {
    return true;
  }

  // Get today at midnight for consistent comparisons
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse dates if they exist
  const activityStart = dateRangeStart ? new Date(dateRangeStart) : null;
  const activityEnd = dateRangeEnd ? new Date(dateRangeEnd) : null;

  // Validate parsed dates
  if (activityStart) {
    activityStart.setHours(0, 0, 0, 0);
    if (isNaN(activityStart.getTime())) {
      // Invalid start date, treat as no date
      return true;
    }
  }

  if (activityEnd) {
    activityEnd.setHours(0, 0, 0, 0);
    if (isNaN(activityEnd.getTime())) {
      // Invalid end date, ignore it
      // Continue with just start date logic
    }
  }

  // Rule 3: Activity already ended (end date is before today)
  if (activityEnd && activityEnd < today) {
    return false;
  }

  // Define filter period based on the selected filter
  let filterStart: Date;
  let filterEnd: Date;

  switch (dateFilter) {
    case "next-7-days":
      filterStart = new Date(today);
      filterEnd = new Date(today);
      filterEnd.setDate(today.getDate() + 7);
      break;

    case "this-month":
      filterStart = new Date(today.getFullYear(), today.getMonth(), 1);
      filterEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;

    case "next-month":
      filterStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      filterEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      break;

    default:
      // Unknown filter, show everything
      return true;
  }

  // Rule 4: Has both start AND end dates → check overlap
  if (activityStart && activityEnd) {
    // Overlap exists if: activityStart <= filterEnd AND activityEnd >= filterStart
    return activityStart <= filterEnd && activityEnd >= filterStart;
  }

  // Rule 5: Has only start date → single-day event
  if (activityStart) {
    // Check if start date falls within filter period
    return activityStart >= filterStart && activityStart <= filterEnd;
  }

  // Has only end date (no start) → treat as ongoing until end date
  // Show if end date is within or after the filter period start
  if (activityEnd) {
    return activityEnd >= filterStart;
  }

  // Shouldn't reach here, but default to showing
  return true;
}
