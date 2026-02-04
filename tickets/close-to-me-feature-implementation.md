# Close to Me Feature Implementation

## Description

Implement the "Close to Me" button functionality that sorts community centres by proximity to the user's current location. This feature will use the browser's Geolocation API to obtain the user's coordinates, calculate distances to each centre using their existing lat/lng properties, and sort the list accordingly.

The button UI already exists in the Hero component and toggles the `closeToMe` state, but currently has no functional implementation. This ticket focuses on making it fully operational with proper error handling and user feedback.

---

## Acceptance Criteria

### Core Functionality
- [ ] When user clicks "Close to Me" button, browser requests location permission
- [ ] User location is obtained via Geolocation API
- [ ] Centres are sorted by distance from user location (nearest first)
- [ ] Sorting persists while filters (search/neighbourhood) are applied
- [ ] Clicking button again toggles off proximity sorting (returns to default order)
- [ ] Distance calculation uses Haversine formula for lat/lng accuracy

### User Feedback & States
- [ ] Loading state shown while obtaining geolocation
- [ ] Permission denied shows user-friendly error message
- [ ] Geolocation timeout/error shows appropriate message
- [ ] Display distance on each centre card when "Close to Me" is active (e.g., "800m", "1.2km")
- [ ] Distance uses appropriate units for easy reading (meters for < 1km, kilometers for >= 1km)
- [ ] Distance disappears when "Close to Me" is toggled off
- [ ] Button visual state clearly indicates active/inactive proximity mode

### Error Handling
- [ ] Handle permission denied gracefully
- [ ] Handle geolocation timeout (10 second timeout)
- [ ] Handle geolocation unavailable (HTTP context, browser doesn't support)
- [ ] Handle edge cases (same distance, missing lat/lng)
- [ ] Errors don't break existing search/filter functionality

### Code Quality
- [ ] Utility function for Haversine distance calculation
- [ ] Utility function for formatting distance display
- [ ] TypeScript types for geolocation state and errors
- [ ] Proper cleanup of geolocation watchers
- [ ] Reusable custom hook for geolocation management
- [ ] No performance degradation when sorting large centre lists

---

## High-Level Implementation Plan

### Phase 1: Geolocation Utility & Distance Calculation
**Objective:** Create reusable utilities for location and distance operations

1. **Create `lib/utils/geolocation.ts`**
   - Implement Haversine formula for distance calculation
   - Function signature: `calculateDistance(lat1, lng1, lat2, lng2): number` (returns km)
   - Handle edge cases (same point, invalid coordinates)
   - Unit tests for distance calculation accuracy

2. **Create `lib/utils/formatDistance.ts`**
   - Format distance for display: `formatDistance(km: number): string`
   - Use different units for easier reading:
     - Return "XXm" for distances < 1 km (e.g., "50m", "800m")
     - Round to nearest 10m for < 1km (e.g., 847m becomes "850m")
     - Return "X.Xkm" for distances >= 1 km and < 10 km (1 decimal, e.g., "1.2km", "5.8km")
     - Return "XXkm" for distances >= 10 km (no decimal, e.g., "12km", "25km")
   - Example outputs:
     - 0.045 km → "50m"
     - 0.847 km → "850m"
     - 1.234 km → "1.2km"
     - 5.678 km → "5.7km"
     - 12.345 km → "12km"

3. **Add TypeScript types in `lib/types/geolocation.ts`**
   ```typescript
   export interface Coordinates {
     latitude: number;
     longitude: number;
   }

   export interface GeolocationState {
     coordinates: Coordinates | null;
     loading: boolean;
     error: GeolocationError | null;
   }

   export type GeolocationError =
     | 'permission_denied'
     | 'position_unavailable'
     | 'timeout'
     | 'unsupported';
   ```

**Haversine Formula Implementation Notes:**
```javascript
// Distance between two points on Earth
// Input: lat/lng in degrees
// Output: distance in kilometers

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
```

---

### Phase 2: Geolocation Hook
**Objective:** Create a custom React hook for managing user location

1. **Create `lib/hooks/use-geolocation.ts`**
   - Custom hook: `useGeolocation()`
   - Returns: `{ coordinates, loading, error, requestLocation, clearLocation }`
   - Use `useState` for coordinates, loading, error states
   - Implement `requestLocation()` function that:
     - Checks if Geolocation API is supported
     - Sets loading state
     - Calls `navigator.geolocation.getCurrentPosition()`
     - Uses options: `{ enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }`
     - On success: store coordinates, clear loading
     - On error: map error code to GeolocationError type
   - Implement `clearLocation()` to reset state
   - No watchers (use `getCurrentPosition` not `watchPosition`)

2. **Error Mapping**
   ```typescript
   function mapGeolocationError(error: GeolocationPositionError): GeolocationError {
     switch (error.code) {
       case error.PERMISSION_DENIED:
         return 'permission_denied';
       case error.POSITION_UNAVAILABLE:
         return 'position_unavailable';
       case error.TIMEOUT:
         return 'timeout';
       default:
         return 'position_unavailable';
     }
   }
   ```

3. **Handle HTTPS Requirement**
   - Geolocation API requires HTTPS in production
   - Add check for `window.isSecureContext`
   - Return 'unsupported' error if not secure context
   - localhost is always considered secure (works in dev)

---

### Phase 3: Update CentreList Component
**Objective:** Integrate proximity sorting into existing list logic

1. **Update `app/components/CentreList.tsx`**
   - Import `useGeolocation` hook
   - Import `calculateDistance` utility
   - Call `useGeolocation()` to get location state
   - Add effect: when `closeToMe` becomes true, call `requestLocation()`
   - Add effect: when `closeToMe` becomes false, call `clearLocation()`

2. **Add Sorting Logic**
   - Extend `filteredCentres` useMemo to include sorting
   - If `closeToMe` is true AND coordinates exist:
     - Map centres to include distance: `{ ...centre, distance: calculateDistance(...) }`
     - Sort by distance ascending
   - If `closeToMe` is false OR no coordinates:
     - Return centres in default order (or alphabetical)
   - Dependencies: `[centres, searchQuery, selectedNeighbourhood, closeToMe, coordinates]`

   ```typescript
   const sortedAndFilteredCentres = useMemo(() => {
     let result = centres.filter(/* existing filters */);

     if (closeToMe && coordinates) {
       result = result.map(centre => ({
         ...centre,
         distance: calculateDistance(
           coordinates.latitude,
           coordinates.longitude,
           centre.lat,
           centre.lng
         )
       })).sort((a, b) => a.distance - b.distance);
     }

     return result;
   }, [centres, searchQuery, selectedNeighbourhood, closeToMe, coordinates]);
   ```

3. **Update CentreCard Component**
   - Add `distance?: number` prop to CentreCard
   - When distance is provided, display it below the address
   - Use `formatDistance(distance)` to format the display
   - Style: small text, muted color (text-stone-500), with location_on icon
   - Icon: Use material-symbols-outlined `location_on` icon before distance text
   - Layout: Place in same line as or below address, maintain proper spacing
   - Example: "📍 850m" or "📍 1.2km"

---

### Phase 4: Loading & Error States
**Objective:** Provide clear feedback during geolocation operations

1. **Update Hero Component** (`app/components/Hero.tsx`)
   - Pass loading/error state from CentreList to Hero
   - Update props: `{ loading?: boolean, error?: GeolocationError | null }`
   - When loading: show spinner icon in button instead of location icon
   - When error: change button style (border-red-300, etc.)

2. **Add Error Messages to CentreList**
   - If geolocation error exists, show banner above centre list
   - Error message mapping:
     - `permission_denied`: "Location access denied. Please enable location permissions to use this feature."
     - `position_unavailable`: "Unable to determine your location. Please try again."
     - `timeout`: "Location request timed out. Please try again."
     - `unsupported`: "Location services are not available. This feature requires HTTPS."
   - Include "Dismiss" button to clear error and turn off closeToMe
   - Style: amber/yellow background, not blocking (can still use search/filters)

3. **Loading Indicator**
   - Show subtle loading indicator in button or near list
   - Use material-symbols-outlined icon: `progress_activity` (spinning)
   - Disable button while loading (prevent multiple requests)

4. **Update Button Accessibility**
   - Update aria-label based on state:
     - Default: "Sort centres by proximity"
     - Loading: "Requesting your location..."
     - Active: "Currently showing nearest centres first"
     - Error: "Location access failed"
   - Update aria-disabled when loading

---

### Phase 5: Edge Cases & Refinements
**Objective:** Handle edge cases and polish the experience

1. **Permission Persistence**
   - On permission denied, disable closeToMe state
   - Show hint: "Enable location in browser settings to use this feature"
   - Consider storing permission state in localStorage (avoid repeated prompts)

2. **Caching Location**
   - Use `maximumAge: 300000` (5 minutes) in geolocation options
   - Don't request location every time button is toggled
   - Only request fresh location if:
     - No coordinates exist
     - Last location > 5 minutes old

3. **Performance Optimization**
   - Distance calculation is O(n), acceptable for ~30 centres
   - If centre list grows large (> 100), consider memoizing distances
   - Avoid recalculating on every render (use useMemo)

4. **Default Sorting When Not Using Proximity**
   - When closeToMe is false, sort alphabetically by name
   - Provides consistent, predictable order
   - Update filteredCentres logic to include `.sort((a, b) => a.name.localeCompare(b.name))`

5. **Handle Missing Coordinates**
   - If centre has missing/invalid lat/lng, place at end of list
   - Log warning to console for debugging
   - Consider filtering out centres with invalid coordinates

6. **Tie-Breaking**
   - If two centres have same distance (rounded), sort alphabetically
   - Ensures consistent order on re-renders

---

### Phase 6: Testing & Accessibility
**Objective:** Ensure reliability and accessibility

1. **Manual Testing Checklist**
   - [ ] Test on HTTPS (production/staging)
   - [ ] Test on HTTP (localhost) - should work
   - [ ] Test with location permissions allowed
   - [ ] Test with location permissions denied
   - [ ] Test with location permissions prompt (first time)
   - [ ] Test geolocation timeout (use throttling in DevTools)
   - [ ] Test toggling on/off multiple times
   - [ ] Verify distance displays correctly on cards (shows when on, hides when off)
   - [ ] Verify distance units are correct (meters for < 1km, kilometers for >= 1km)
   - [ ] Test proximity sorting with search filters active
   - [ ] Test proximity sorting with neighbourhood filter active
   - [ ] Verify distances are accurate (use Google Maps to verify)
   - [ ] Test on different browsers (Chrome, Firefox, Safari)
   - [ ] Test on mobile devices (iOS Safari, Chrome Android)

2. **Accessibility**
   - Keyboard navigation: button should be focusable and activatable with Enter/Space
   - Screen reader announcements for state changes
   - Error messages should be announced (use aria-live region)
   - Loading state should be announced
   - Focus management when error banner appears

3. **Unit Tests** (Optional but Recommended)
   - Test `calculateDistance` with known coordinates
     - Vancouver to Toronto: ~3362 km
     - Vancouver to Seattle: ~200 km
   - Test `formatDistance` with various inputs
   - Test error mapping function
   - Test sorting logic with mock centres

---

## Component Updates Summary

### New Files
- `lib/utils/geolocation.ts` - Haversine distance calculation
- `lib/utils/formatDistance.ts` - Distance formatting for display
- `lib/types/geolocation.ts` - TypeScript types
- `lib/hooks/use-geolocation.ts` - Custom hook for geolocation

### Modified Files
- `app/components/CentreList.tsx` - Add geolocation hook, sorting logic, pass distance to cards
- `app/components/Hero.tsx` - Add loading/error state props (optional)
- `app/components/CentreCard.tsx` - Add distance display when proximity mode is active
- `app/components/HomeContent.tsx` - May need to lift geolocation state if sharing with Hero

---

## User Flow

1. **User clicks "Close to Me" button**
   - Button shows loading spinner
   - Browser prompts for location permission (if first time)

2. **User allows permission**
   - Browser determines location (up to 10 seconds)
   - Centre list re-sorts, nearest centre jumps to top
   - Button shows active state (filled background)
   - Distance appears on each card (e.g., "850m", "1.2km")

3. **User filters or searches**
   - Proximity sorting persists
   - Filtered centres still sorted by distance

4. **User clicks "Close to Me" again**
   - Sorting reverts to alphabetical
   - Button returns to inactive state
   - Distances disappear from cards

### Alternative Flow: Permission Denied
1. User clicks "Close to Me" button
2. User denies permission (or previously denied)
3. Error banner appears: "Location access denied..."
4. Button shows error state
5. User can dismiss error or open browser settings

---

## Technical Decisions & Rationale

### Why Haversine Formula?
- Accurate for distances on Earth's surface
- Simple implementation, no external dependencies
- Sufficient accuracy for "close to me" feature (±0.5% error)
- Alternative (Vincenty) is more accurate but complex and unnecessary

### Why getCurrentPosition vs watchPosition?
- Users don't move significantly while browsing
- Reduces battery/resource usage
- Simpler state management
- Can manually refresh if needed

### Why 10 Second Timeout?
- Balance between accuracy and user patience
- GPS cold start can take 5-10 seconds
- Fallback to network location is usually < 3 seconds
- If timeout, user can try again

### Why Not Store Distance on Server?
- User location changes between sessions
- Would require server-side calculation or storing user location
- Privacy concerns with storing user location
- Client-side calculation is fast enough for small lists

---

## Future Enhancements (Out of Scope)

- [ ] Display centres on a map view with user location pin
- [ ] "Recalculate" button to refresh location
- [ ] Distance radius filter (e.g., "Only show within 5km")
- [ ] Remember user's last location (localStorage)
- [ ] Show "You are here" indicator on map
- [ ] Walking/driving time estimates (requires routing API)
- [ ] Geolocation watching (continuous updates as user moves)
- [ ] Elevation consideration for hillier areas

---

## Dependencies

### Browser APIs
- Geolocation API (browser native, no install required)
- Check support: `'geolocation' in navigator`
- Requires HTTPS in production (localhost exempt)

### Existing Dependencies (No new packages needed)
- React (useState, useMemo, useEffect)
- TypeScript
- Tailwind CSS (for styling)

### External Services
- None required (purely client-side feature)

---

## Testing Plan

### Unit Tests
- `calculateDistance()` with known coordinate pairs
- `formatDistance()` with edge cases covering both units:
  - 0.045 km → "50m"
  - 0.5 km → "500m"
  - 0.847 km → "850m"
  - 0.999 km → "1000m" or "1.0km"
  - 1.234 km → "1.2km"
  - 9.876 km → "9.9km"
  - 12.345 km → "12km"
  - 50 km → "50km"
- Error mapping function

### Integration Tests
- Mock geolocation API responses
- Test sorting behavior with various centre datasets
- Test error handling paths

### Manual Testing
See Phase 6 checklist above

---

## Rollout Strategy

### Phase 1: Core Implementation (MVP)
- Implement Phases 1-3 above
- Sorting by proximity with distance display on cards
- Basic error handling (console.error)
- Deploy to staging, test with real devices

### Phase 2: Polish & Error Handling
- Improve error messages and UI feedback
- Add loading states to button and Hero component
- Enhance accessibility features
- Deploy to production with feature flag (optional)

### Phase 3: Monitoring & Iteration
- Monitor error rates (permission denied, timeouts)
- Gather user feedback
- Consider A/B testing distance display on/off

---

## Success Metrics

### Functional Success
- [ ] Feature works on all major browsers (Chrome, Firefox, Safari, Edge)
- [ ] Feature works on mobile devices (iOS, Android)
- [ ] Permission prompts appear correctly
- [ ] Sorting accuracy verified (spot check with Google Maps)
- [ ] No regressions in existing search/filter functionality

### User Experience
- [ ] Clear feedback at each stage (loading, error, success)
- [ ] Sorting feels instant (< 200ms after location obtained)
- [ ] Error messages are actionable
- [ ] Button states are clear and understandable

### Technical Quality
- [ ] No console errors or warnings
- [ ] TypeScript compiles without errors
- [ ] Code is maintainable and well-documented
- [ ] Reusable utilities can be used for future location features

---

## Implementation Notes

### Geolocation API Options
```javascript
{
  enableHighAccuracy: false,  // Use network location (faster, less battery)
  timeout: 10000,             // 10 second timeout
  maximumAge: 300000          // Accept cached position up to 5 minutes old
}
```

### Distance Calculation Example
```javascript
// User at Vancouver City Hall: 49.2606, -123.1140
// Strathcona Community Centre: 49.2741, -123.0847
// Expected distance: ~3.2 km

calculateDistance(49.2606, -123.1140, 49.2741, -123.0847)
// Returns: 3.18 (km)
```

### Sorting Example
```javascript
// Before (alphabetical):
1. Britannia Community Centre
2. Carnegie Community Centre
3. Strathcona Community Centre

// After proximity sorting (from Vancouver City Hall):
1. Carnegie Community Centre (1.2km)
2. Strathcona Community Centre (3.2km)
3. Britannia Community Centre (4.8km)
```

### Distance Formatting Examples
```javascript
formatDistance(0.045)  // "50m"
formatDistance(0.5)    // "500m"
formatDistance(0.847)  // "850m"
formatDistance(1.234)  // "1.2km"
formatDistance(5.678)  // "5.7km"
formatDistance(12.345) // "12km"
```
