import Link from "next/link";
import type { CommunityCentre } from "@/lib/schemas/centre";

interface CentreCardProps {
  centre: CommunityCentre;
}

export function CentreCard({ centre }: CentreCardProps) {
  return (
    <Link
      href={`/centres/${centre.id}`}
      className="group cursor-pointer bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md block"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#8b7360]/10 text-[#8b7360] rounded">
              {centre.neighbourhood}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
              {centre.total_activities} activities available
            </span>
          </div>
          <h2 className="font-serif text-3xl text-slate-900 mb-2">
            {centre.name}
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            {centre.address}
          </p>
          {centre.example_activities.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {centre.example_activities.slice(0, 3).map((activity, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-50 text-slate-600 px-3 py-1 rounded-full border border-gray-100"
                >
                  {activity}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end md:justify-start">
          <span className="material-symbols-outlined text-slate-300 group-hover:text-[#8b7360] transition-colors text-3xl">
            arrow_forward_ios
          </span>
        </div>
      </div>
    </Link>
  );
}
