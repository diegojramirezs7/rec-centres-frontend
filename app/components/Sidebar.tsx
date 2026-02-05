"use client";

interface SidebarProps {
  neighbourhoods: string[];
  selectedNeighbourhood: string | null;
  onNeighbourhoodChange: (neighbourhood: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

export function Sidebar({
  neighbourhoods,
  selectedNeighbourhood,
  onNeighbourhoodChange,
  searchQuery,
  onSearchChange,
  className,
}: SidebarProps) {
  return (
    // STANDARD SIDEBAR PATTERN - Always use these exact classes for consistency
    // w-80: Fixed width (320px)
    // flex-shrink-0: Prevents shrinking
    // max-h-[calc(100vh-77px)]: Max height accounting for header + gap (61px + 16px)
    // sticky top-[77px]: Sticks below header with 16px gap when scrolling
    // bg-white: Solid white background
    // p-8: 32px padding all sides (matches main content for alignment)
    <aside className={`w-80 flex-shrink-0 max-h-[calc(100vh-77px)] sticky top-[77px] border-r border-gray-200 bg-white p-8 overflow-y-auto ${className || ""}`}>
      <div className="space-y-8">
        {/* Search */}
        <div>
          <label className="block text-xs font-bold text-[#8b7360] uppercase tracking-wider mb-3">
            Search
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              search
            </span>
            <input
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-50 border border-gray-300 focus:ring-2 focus:ring-[#8b7360] focus:bg-white text-sm"
              placeholder="Search centres..."
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xl cursor-pointer"
                aria-label="Clear search"
              >
                close
              </button>
            )}
          </div>
        </div>

        {/* Neighbourhoods */}
        <div>
          <label className="block text-xs font-bold text-[#8b7360] uppercase tracking-wider mb-3">
            Neighbourhoods
          </label>
          <nav className="space-y-2">
            <button
              onClick={() => onNeighbourhoodChange(null)}
              className={
                selectedNeighbourhood === null
                  ? "sidebar-link sidebar-link-active"
                  : "sidebar-link"
              }
            >
              All Areas
            </button>
            {neighbourhoods.map((neighbourhood) => (
              <button
                key={neighbourhood}
                onClick={() => onNeighbourhoodChange(neighbourhood)}
                className={
                  selectedNeighbourhood === neighbourhood
                    ? "sidebar-link sidebar-link-active"
                    : "sidebar-link"
                }
              >
                {neighbourhood}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
