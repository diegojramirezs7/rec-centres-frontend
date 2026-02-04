import type { Activity } from "@/lib/schemas/activity";
import { formatDistance } from "@/lib/utils/formatDistance";

type SessionWithDistance = Activity & { distance?: number };

interface ActivitySessionsListProps {
  sessions: SessionWithDistance[];
}

export function ActivitySessionsList({ sessions }: ActivitySessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-6xl text-stone-300 mb-4 block">
          event_busy
        </span>
        <h3 className="text-2xl font-serif text-stone-900 mb-2">
          No sessions available
        </h3>
        <p className="text-stone-500">
          There are currently no sessions for this activity.
        </p>
      </div>
    );
  }

  // Helper function to get availability badge
  const getAvailabilityBadge = (openings: number | null | undefined) => {
    if (openings === null || openings === undefined) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 text-sm font-semibold border border-stone-200">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
          Unknown
        </div>
      );
    }

    if (openings === 0) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-800 text-sm font-semibold border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
          Full (Waitlist)
        </div>
      );
    }

    if (openings >= 10) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-semibold border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
          {openings >= 20 ? "20+" : openings} Spots Left
        </div>
      );
    }

    // 1-9 spots (few)
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-sm font-semibold border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
        {openings} Spot{openings !== 1 ? "s" : ""} Left
      </div>
    );
  };

  return (
    <>
      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.map((session) => {
          // Determine the URL to use (prefer enroll_url, fallback to detail_url)
          const targetUrl = session.enroll_url || session.detail_url;
          const isClickable = !!targetUrl;

          const handleClick = () => {
            if (targetUrl) {
              window.open(targetUrl, "_blank", "noopener,noreferrer");
            }
          };

          return (
            <div
              key={session.id}
              onClick={handleClick}
              className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all group ${
                isClickable
                  ? "hover:shadow-md hover:bg-stone-50 cursor-pointer"
                  : ""
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-6 lg:px-8">
                {/* Program & Location */}
                <div className="lg:col-span-4">
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#8b7360] transition-colors">
                    {session.name}
                  </h3>
                  <div className="flex items-center text-stone-500 mt-1">
                    <span className="material-symbols-outlined text-sm mr-1 text-[#8b7360]">
                      location_on
                    </span>
                    <span className="text-sm">
                      {session.centre_name}
                      {session.distance !== undefined && (
                        <span className="text-stone-400">
                          {" · "}
                          {formatDistance(session.distance)}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="lg:col-span-3 flex justify-center items-center text-stone-700">
                  <div className="text-center">
                    <p className="font-medium text-sm">
                      {session.days_of_week || "TBA"}
                    </p>
                    {session.time_range && (
                      <p className="text-xs text-stone-500">
                        {session.time_range}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date Range */}
                <div className="lg:col-span-3 flex justify-center items-center text-stone-700">
                  {session.date_range ? (
                    <div className="flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[#8b7360] text-sm">
                        date_range
                      </span>
                      <span className="text-sm font-medium">
                        {session.date_range}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-stone-400">No dates set</span>
                  )}
                </div>

                {/* Openings */}
                <div className="lg:col-span-2 flex justify-end">
                  {getAvailabilityBadge(session.openings)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-12 text-center text-stone-400 text-sm italic">
        Showing all available programs for the selected filters.
      </div>
    </>
  );
}
