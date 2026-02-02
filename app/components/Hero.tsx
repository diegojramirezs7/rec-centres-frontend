import type { ViewMode } from "./Header";

interface HeroProps {
  viewMode: ViewMode;
}

export function Hero({ viewMode }: HeroProps) {
  const isCentreView = viewMode === "centre";

  return (
    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
      <div className="max-w-2xl">
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-stone-900 mb-4">
          {isCentreView ? "Explore Community Centres" : "Explore Activities"}
        </h1>
        <p className="text-stone-500 text-lg">
          {isCentreView
            ? "Find your community centre and explore its activities and programs."
            : "Discover activities and programs across all community centres."}
        </p>
      </div>
      {isCentreView && (
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#8b7360] text-white rounded-full text-sm font-medium hover:bg-stone-700 transition-all shadow-sm">
            <span className="material-symbols-outlined text-lg">near_me</span>
            Find Nearest Centre
          </button>
        </div>
      )}
    </div>
  );
}
