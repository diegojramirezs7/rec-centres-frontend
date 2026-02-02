"use client";

export type ViewMode = "centre" | "activity";

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function Header({ viewMode, onViewModeChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#8b7360] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">
              home_work
            </span>
          </div>
          <span className="font-bold text-lg text-slate-900">
            Third Places Vancouver
          </span>
        </div>

        {/* Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-full border border-gray-200">
          <button
            onClick={() => onViewModeChange("centre")}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === "centre"
                ? "bg-[#8b7360] text-white shadow-sm"
                : "text-slate-500"
            }`}
          >
            By Community Centre
          </button>
          <button
            onClick={() => onViewModeChange("activity")}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === "activity"
                ? "bg-[#8b7360] text-white shadow-sm"
                : "text-slate-500"
            }`}
          >
            Find Activity
          </button>
        </div>

        {/* Spacer for center alignment */}
        <div className="w-8"></div>
      </div>
    </header>
  );
}
