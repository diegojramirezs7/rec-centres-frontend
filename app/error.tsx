"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <span className="material-symbols-outlined text-6xl text-red-500 mb-4 block">
          error
        </span>
        <h2 className="text-3xl font-serif text-stone-900 mb-4">
          Something went wrong
        </h2>
        <p className="text-stone-600 mb-6">
          We encountered an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#8b7360] text-white rounded-full font-medium hover:bg-[#6a5340] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
