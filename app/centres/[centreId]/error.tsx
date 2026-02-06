'use client';

import Link from 'next/link';

export default function CentreError({
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
          Error Loading Centre
        </h2>
        <p className="text-stone-600 mb-6">
          We couldn't load this centre. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#8b7360] text-white rounded-full font-medium hover:bg-[#6a5340] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-stone-300 text-stone-700 rounded-full font-medium hover:bg-stone-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
