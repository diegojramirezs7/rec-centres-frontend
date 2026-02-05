"use client";

interface MobileFilterButtonProps {
  onClick: () => void;
  activeFiltersCount?: number;
}

export function MobileFilterButton({
  onClick,
  activeFiltersCount = 0,
}: MobileFilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed bottom-6 right-4 z-40 flex items-center gap-2 bg-[#8b7360] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#6b5340] transition-all"
      aria-label="Open filters"
    >
      <span className="material-symbols-outlined text-xl">tune</span>
      <span className="font-medium text-sm">Filters</span>
      {activeFiltersCount > 0 && (
        <span className="bg-white text-[#8b7360] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {activeFiltersCount}
        </span>
      )}
    </button>
  );
}
