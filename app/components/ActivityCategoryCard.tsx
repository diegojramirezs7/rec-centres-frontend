"use client";

import { useState } from "react";
import type { NormalizedActivity } from "@/lib/schemas/activity";
import { getActivityIcon } from "@/lib/constants/activity-icons";

interface ActivityCategoryCardProps {
  activity: NormalizedActivity;
}

export function ActivityCategoryCard({ activity }: ActivityCategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const iconConfig = getActivityIcon(activity.name);
  const Icon = iconConfig.icon;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Accordion Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between group hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Activity Icon */}
          <div
            className={`w-14 h-14 rounded-xl ${iconConfig.bgColor} ${iconConfig.iconColor} flex items-center justify-center flex-shrink-0`}
          >
            <Icon size={32} />
          </div>

          {/* Activity Info */}
          <div className="text-left">
            <h2 className="font-serif text-2xl text-stone-900 mb-1">
              {activity.name}
            </h2>
            <p className="text-stone-500 text-sm">
              {activity.total} {activity.total === 1 ? 'session' : 'sessions'} available • {activity.category}
            </p>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <span
          className={`material-symbols-outlined text-stone-400 group-hover:text-[#8b7360] transition-all text-3xl ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Accordion Content - Shows when Expanded */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-6 bg-stone-50/50">
          <p className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4">
            Example Activities
          </p>

          {activity.examples.length > 0 ? (
            <ul className="space-y-3">
              {activity.examples.map((example, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#8b7360] text-lg mt-0.5 flex-shrink-0">
                    check_circle
                  </span>
                  <span className="text-stone-700">{example}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-stone-500 text-sm italic">
              No example activities available
            </p>
          )}
        </div>
      )}
    </div>
  );
}
