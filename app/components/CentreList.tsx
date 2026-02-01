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
    <div className="flex flex-col lg:flex-row gap-12">
      <Sidebar
        neighbourhoods={neighbourhoods}
        selectedNeighbourhood={selectedNeighbourhood}
        onNeighbourhoodChange={setSelectedNeighbourhood}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="flex-grow">
        {filteredCentres.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-stone-400 dark:text-stone-500 text-lg">
              No centres found matching your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedNeighbourhood(null);
              }}
              className="mt-4 text-brand-brown-700 hover:text-brand-brown-900 text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredCentres.map((centre) => (
              <CentreCard key={centre.id} centre={centre} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
