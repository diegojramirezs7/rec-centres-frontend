import { useMemo } from "react";
import type { Activity } from "@/lib/schemas/activity";

interface ActivitySessionsTableProps {
  sessions?: Activity[];
  examples: string[];
  isLoading?: boolean;
  error?: string | null;
  ageFilter?: string;
  dateRange?: string;
  showAvailableOnly?: boolean;
}

export function ActivitySessionsTable({
  sessions,
  examples,
  isLoading = false,
  error = null,
  ageFilter = "",
  dateRange = "all",
  showAvailableOnly = false,
}: ActivitySessionsTableProps) {
  // Filter sessions based on user criteria
  const filteredSessions = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];

    return sessions.filter((session) => {
      // Age filter
      if (ageFilter) {
        const userAge = parseInt(ageFilter);
        if (!isNaN(userAge)) {
          const minAge = session.age_min_year || 0;
          const maxAge = session.age_max_year || Infinity;

          // If max age is 0, it usually means no upper limit
          const effectiveMaxAge = maxAge === 0 ? Infinity : maxAge;

          if (userAge < minAge || userAge > effectiveMaxAge) {
            return false;
          }
        }
      }

      // Date range filter
      if (dateRange !== "all" && session.date_range_start) {
        const sessionStart = new Date(session.date_range_start);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateRange === "next-7-days") {
          const sevenDaysLater = new Date(today);
          sevenDaysLater.setDate(today.getDate() + 7);
          if (sessionStart < today || sessionStart > sevenDaysLater) {
            return false;
          }
        } else if (dateRange === "this-month") {
          if (sessionStart.getMonth() !== today.getMonth() ||
              sessionStart.getFullYear() !== today.getFullYear()) {
            return false;
          }
        } else if (dateRange === "next-month") {
          const nextMonth = new Date(today);
          nextMonth.setMonth(today.getMonth() + 1);
          if (sessionStart.getMonth() !== nextMonth.getMonth() ||
              sessionStart.getFullYear() !== nextMonth.getFullYear()) {
            return false;
          }
        }
      }

      // Availability filter
      if (showAvailableOnly) {
        if (session.openings === null || session.openings === undefined || session.openings <= 0) {
          return false;
        }
      }

      return true;
    });
  }, [sessions, ageFilter, dateRange, showAvailableOnly]);
  // Show loading state
  if (isLoading) {
    return (
      <div className="border-t border-gray-100 p-8 bg-stone-50/50">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-stone-300 border-t-[#8b7360] rounded-full animate-spin"></div>
          <p className="text-sm text-stone-500">Loading activity details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="border-t border-gray-100 p-6 bg-stone-50/50">
        <div className="flex items-start gap-3 text-sm text-red-600">
          <span className="material-symbols-outlined text-lg mt-0.5">error</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // If we have detailed session data, show table
  if (sessions && sessions.length > 0) {
    // Check if there are any sessions after filtering
    if (filteredSessions.length === 0) {
      return (
        <div className="border-t border-gray-100 p-8 bg-stone-50/50">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-stone-300 mb-3 block">
              filter_list_off
            </span>
            <p className="text-sm text-stone-500 mb-2">
              No sessions match your filters
            </p>
            <p className="text-xs text-stone-400">
              Try adjusting your age, date, or availability filters
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="border-t border-gray-100">
        {/* Table Header - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-3 bg-stone-50/50 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-gray-100">
          <div className="col-span-4">Activity Name</div>
          <div className="col-span-2 text-center">Day</div>
          <div className="col-span-2 text-center">Time</div>
          <div className="col-span-2 text-center">Age Group</div>
          <div className="col-span-2 text-right">Available Openings</div>
        </div>

        {/* Table Body - Scrollable */}
        <div className="overflow-y-auto activity-scroll-area max-h-96">
          {filteredSessions.map((session, idx) => {
            const RowWrapper = session.detail_url ? 'a' : 'div';
            const linkProps = session.detail_url
              ? {
                  href: session.detail_url,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-8 py-5 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-b-0 cursor-pointer group',
                }
              : {
                  className: 'grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-8 py-5 border-b border-stone-50 last:border-b-0',
                };

            return (
              <RowWrapper key={session.id || idx} {...linkProps}>
                {/* Activity Name */}
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-stone-900">{session.name}</h4>
                    {session.detail_url && (
                      <span className="material-symbols-outlined text-stone-400 group-hover:text-[#8b7360] transition-colors text-sm">
                        open_in_new
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 md:hidden mt-1">
                    {session.days_of_week && <span>{session.days_of_week} • </span>}
                    {session.time_range && <span>{session.time_range}</span>}
                  </p>
                </div>

                {/* Day */}
                <div className="col-span-2 md:text-center">
                  <span className="text-sm font-medium hidden md:inline">
                    {session.days_of_week || '-'}
                  </span>
                </div>

                {/* Time */}
                <div className="col-span-2 md:text-center">
                  <span className="text-sm font-medium hidden md:inline">
                    {session.time_range || '-'}
                  </span>
                </div>

                {/* Age Group */}
                <div className="col-span-2 md:text-center">
                  {session.ages ? (
                    <span className="text-xs px-2 py-1 bg-stone-100 rounded-md text-stone-600">
                      {session.ages}
                    </span>
                  ) : (
                    <span className="text-sm text-stone-400">-</span>
                  )}
                </div>

                {/* Availability */}
                <div className="col-span-2 md:text-right">
                  {session.openings !== undefined && session.openings !== null ? (
                    session.openings > 0 ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        {session.openings} spot{session.openings !== 1 ? 's' : ''} left
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-sm font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Full
                      </div>
                    )
                  ) : (
                    <span className="text-sm text-stone-400">-</span>
                  )}
                </div>
              </RowWrapper>
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback: Show examples list
  return (
    <div className="border-t border-gray-100 p-6 bg-stone-50/50">
      <p className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4">
        Example Activities
      </p>

      {examples.length > 0 ? (
        <ul className="space-y-3">
          {examples.map((example, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="material-symbols-outlined text-[#8b7360] text-lg mt-0.5 flex-shrink-0">
                check_circle
              </span>
              <span className="text-stone-700">{example}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-stone-500 text-sm italic">
          No example activities available
        </p>
      )}

      {/* Info Message */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-stone-400 italic">
          Detailed session information (schedule, availability) will be displayed here when available from the API.
        </p>
      </div>
    </div>
  );
}
