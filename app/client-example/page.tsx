"use client";

import { useCentres } from "@/lib/hooks";

export default function ClientExamplePage() {
  const { data: centres, isLoading, error } = useCentres();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading centres...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-red-600">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <main className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-4xl font-bold text-black dark:text-white">
          Client Component Example
        </h1>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          This page uses React Query hooks for client-side data fetching
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {centres?.map((centre) => (
            <div
              key={centre.id}
              className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
                {centre.name}
              </h2>

              <p className="mb-1 text-sm text-zinc-600 dark:text-zinc-400">
                {centre.address}
              </p>

              <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                {centre.neighbourhood}
              </p>

              <div className="mt-3 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <span>{centre.total_activities} activities</span>
                {centre.lat && centre.lng && (
                  <span className="text-xs">
                    {centre.lat.toFixed(4)}, {centre.lng.toFixed(4)}
                  </span>
                )}
              </div>

              {centre.example_activities.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                    Example activities:
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {centre.example_activities.slice(0, 3).map((activity, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Showing {centres?.length || 0} recreation centres (React Query)
          </p>
        </div>
      </main>
    </div>
  );
}
