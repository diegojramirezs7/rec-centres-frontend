"use client";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

interface MobileActivitiesFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MobileActivitiesFilterDrawer({
  open,
  onOpenChange,
  searchQuery,
  onSearchChange,
}: MobileActivitiesFilterDrawerProps) {
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
                placeholder="Search activities..."
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
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

          {/* Placeholder for future filters */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-slate-500 leading-relaxed">
              Additional filters will be available as more data becomes available.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
