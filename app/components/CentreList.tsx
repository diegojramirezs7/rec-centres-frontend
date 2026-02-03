"use client";

import { useState, useMemo } from "react";
import type { CommunityCentre } from "@/lib/schemas/centre";
import { CentreCard } from "./CentreCard";
import { Sidebar } from "./Sidebar";

interface CentreListProps {
  centres: CommunityCentre[];
}

export function CentreList({ centres }: CentreListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<
    string | null
  >(null);

  // Extract unique neighbourhoods from centres
  const neighbourhoods = useMemo(() => {
    const unique = new Set(centres.map((c) => c.neighbourhood));
    return Array.from(unique).sort();
  }, [centres]);

  // Filter centres based on search and neighbourhood
  const filteredCentres = useMemo(() => {
    return centres.filter((centre) => {
      const matchesSearch =
        searchQuery === "" ||
        centre.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNeighbourhood =
        selectedNeighbourhood === null ||
        centre.neighbourhood === selectedNeighbourhood;
      return matchesSearch && matchesNeighbourhood;
    });
  }, [centres, searchQuery, selectedNeighbourhood]);

  return (
    // LAYOUT PATTERN: Sidebar + Content
    // This breaks out of parent's max-w-7xl to be wider (max-w-screen-2xl)
    // Parent has px-6, so we DON'T add -mx-6 here (it's at root level in HomeContent)
    // Note: No overflow-x-hidden here as it breaks sticky positioning
    // mt-8: Creates space between Hero section and this content area
    <div className="flex max-w-screen-2xl mx-auto mt-8">
      <Sidebar
        neighbourhoods={neighbourhoods}
        selectedNeighbourhood={selectedNeighbourhood}
        onNeighbourhoodChange={setSelectedNeighbourhood}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="flex-1 min-w-0 px-8">
        {filteredCentres.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">
              search_off
            </span>
            <h3 className="font-serif text-2xl text-slate-900 mb-2">
              No centres found
            </h3>
            <p className="text-slate-500 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedNeighbourhood(null);
              }}
              className="text-[#8b7360] hover:text-[#6b5340] text-sm font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCentres.map((centre) => (
              <CentreCard key={centre.id} centre={centre} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
