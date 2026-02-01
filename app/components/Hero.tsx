"use client";

export type ViewMode = "centre" | "activity";

interface HeroProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function Hero({ viewMode, onViewModeChange }: HeroProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
      <div className="max-w-2xl">
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-stone-900 mb-4">
          Find Your Community Centre
        </h1>
        <p className="text-stone-500 text-lg">
          Discover local spaces to connect, learn, and grow across Vancouver.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex items-center gap-2 px-6 py-3 bg-[#8b7360] text-white rounded-full text-sm font-medium hover:bg-stone-700 transition-all shadow-sm">
          <span className="material-symbols-outlined text-lg">near_me</span>
          Find Nearest Centre
        </button>
        <div className="inline-flex p-1 bg-stone-100 rounded-full border border-stone-200">
          <button
            onClick={() => onViewModeChange("centre")}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              viewMode === "centre"
                ? "bg-white text-stone-900 shadow-sm ring-1 ring-stone-200/50"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            By Centre
          </button>
          <button
            onClick={() => onViewModeChange("activity")}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              viewMode === "activity"
                ? "bg-white text-stone-900 shadow-sm ring-1 ring-stone-200/50"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            By Activity
          </button>
        </div>
      </div>
    </div>
  );
}
