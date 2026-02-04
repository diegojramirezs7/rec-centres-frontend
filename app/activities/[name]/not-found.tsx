import Link from "next/link";

export default function ActivityNotFound() {
  return (
    <main className="min-h-screen bg-background-light flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="material-symbols-outlined text-[#8b7360] text-6xl mb-4 block">
          search_off
        </span>
        <h1 className="text-4xl font-serif text-stone-900 mb-4">
          Activity Not Found
        </h1>
        <p className="text-stone-600 mb-8">
          The activity you're looking for doesn't exist or is no longer
          available. It may have been removed or the name might be incorrect.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#8b7360] hover:bg-[#6a5340] text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-sm">home</span>
          <span>Back to Activities</span>
        </Link>
      </div>
    </main>
  );
}
