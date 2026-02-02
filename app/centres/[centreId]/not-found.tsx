import Link from "next/link";

export default function CentreNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <span className="material-symbols-outlined text-6xl text-stone-300">
            location_off
          </span>
        </div>
        <h1 className="font-serif text-4xl font-normal text-stone-900 mb-4">
          Centre Not Found
        </h1>
        <p className="text-stone-500 mb-8">
          The community centre you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#8b7360] text-white rounded-full text-sm font-medium hover:bg-stone-700 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
