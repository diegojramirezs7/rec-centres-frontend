import type { ViewMode } from "./Header";
import type { GeolocationError } from "@/lib/types/geolocation";

interface HeroProps {
  viewMode: ViewMode;
  closeToMe: boolean;
  setCloseToMe: (value: boolean) => void;
  loading?: boolean;
  error?: GeolocationError | null;
}

export function Hero({
  viewMode,
  closeToMe,
  setCloseToMe,
  loading,
  error,
}: HeroProps) {
  const isCentreView = viewMode === "centre";

  // Determine button state for accessibility and styling
  const getAriaLabel = () => {
    if (loading) return "Requesting your location...";
    if (error) return "Location access failed";
    if (closeToMe) return "Currently showing nearest centres first";
    return "Sort centres by proximity";
  };

  const getButtonIcon = () => {
    if (loading) return "progress_activity";
    if (closeToMe) return "location_on";
    return "near_me";
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-stone-900 mb-4">
          {isCentreView ? "Explore Community Centres" : "Explore Activities"}
        </h1>
        <p className="text-stone-500 text-lg">
          {isCentreView
            ? "Find your community centre and explore its activities and programs."
            : "Discover activities and programs across all community centres."}
        </p>
      </div>
      {isCentreView && (
        <button
          onClick={() => !loading && setCloseToMe(!closeToMe)}
          disabled={loading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
            error
              ? "bg-red-50 border-red-300 text-red-700"
              : closeToMe
                ? "bg-[#8b7360] border-[#8b7360] text-white"
                : "bg-white border-gray-200 text-stone-700 hover:border-[#8b7360]"
          } ${loading ? "cursor-wait opacity-75" : "cursor-pointer"}`}
          aria-label={getAriaLabel()}
          aria-checked={closeToMe}
          aria-disabled={loading}
          role="switch"
        >
          <span
            className={`material-symbols-outlined text-sm ${loading ? "animate-spin" : ""}`}
          >
            {getButtonIcon()}
          </span>
          <span>Close to Me</span>
        </button>
      )}
    </div>
  );
}
