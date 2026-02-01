"use client";

interface SidebarProps {
  neighbourhoods: string[];
  selectedNeighbourhood: string | null;
  onNeighbourhoodChange: (neighbourhood: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Sidebar({
  neighbourhoods,
  selectedNeighbourhood,
  onNeighbourhoodChange,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="lg:sticky lg:top-32">
        <div className="mb-10">
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400 mb-6">
            Search
          </h3>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-stone-400 text-xl">
              search
            </span>
            <input
              className="w-full pl-8 pr-0 py-2 bg-transparent border-0 border-b border-stone-200 focus:ring-0 focus:border-[#8b7360] placeholder-stone-300 text-sm"
              placeholder="Search centres..."
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400 mb-6">
            Neighbourhoods
          </h3>
          <nav className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2">
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
