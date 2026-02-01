import type { CommunityCentre } from "@/lib/schemas/centre";

interface CentreCardProps {
  centre: CommunityCentre;
}

export function CentreCard({ centre }: CentreCardProps) {
  return (
    <div className="list-item-hover group py-6 border-b border-stone-100 cursor-pointer flex flex-col md:flex-row md:items-center justify-between px-6 -mx-6">
      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#8b7360]/10 text-[#8b7360] rounded">
            {centre.neighbourhood}
          </span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
            {centre.total_activities} activities available
          </span>
        </div>
        <h2 className="font-serif text-3xl text-stone-900 mb-2">
          {centre.name}
        </h2>
        <p className="text-stone-400 text-sm mb-3">
          {centre.address}
        </p>
        {centre.example_activities.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {centre.example_activities.slice(0, 3).map((activity, idx) => (
              <span
                key={idx}
                className="text-xs bg-stone-50 text-stone-600 px-3 py-1 rounded-full border border-stone-100"
              >
                {activity}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-6 md:mt-0 md:ml-8 flex items-center gap-4">
        <span className="material-symbols-outlined text-stone-300 group-hover:text-[#8b7360] transition-colors text-3xl">
          arrow_forward_ios
        </span>
      </div>
    </div>
  );
}
