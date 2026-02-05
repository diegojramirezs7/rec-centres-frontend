"use client";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

interface MobileCentresFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  neighbourhoods: string[];
  selectedNeighbourhood: string | null;
  onNeighbourhoodChange: (neighbourhood: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MobileCentresFilterDrawer({
  open,
  onOpenChange,
  neighbourhoods,
  selectedNeighbourhood,
  onNeighbourhoodChange,
  searchQuery,
  onSearchChange,
}: MobileCentresFilterDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-80 !bg-white border-r border-gray-200 p-8 overflow-y-auto"
      >
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
                onClick={() => {
                  onNeighbourhoodChange(null);
                  onOpenChange(false);
                }}
                className={
                  selectedNeighbourhood === null
                    ? "sidebar-link sidebar-link-active w-full text-left"
                    : "sidebar-link w-full text-left"
                }
              >
                All Areas
              </button>
              {neighbourhoods.map((neighbourhood) => (
                <button
                  key={neighbourhood}
                  onClick={() => {
                    onNeighbourhoodChange(neighbourhood);
                    onOpenChange(false);
                  }}
                  className={
                    selectedNeighbourhood === neighbourhood
                      ? "sidebar-link sidebar-link-active w-full text-left"
                      : "sidebar-link w-full text-left"
                  }
                >
                  {neighbourhood}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
