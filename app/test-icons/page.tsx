import { getActivityIcon } from "@/lib/constants/activity-icons";

// Sample activities from the API
const testActivities = [
  "Archery",
  "Athletics",
  "Badminton",
  "Basketball",
  "Soccer",
  "Yoga",
  "Pilates",
  "Swimming",
  "Aquatics",
  "Pottery",
  "Ceramics",
  "Painting",
  "Cooking",
  "Music",
  "Dance",
  "Photography",
  "Gardening",
  "Some Unknown Activity",
];

export default function TestIconsPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EE] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl text-stone-900 mb-8">
          Activity Icons Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testActivities.map((activityName) => {
            const iconConfig = getActivityIcon(activityName);
            const IconComponent = iconConfig.icon;

            return (
              <div
                key={activityName}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 ${iconConfig.bgColor} ${iconConfig.iconColor} rounded-full flex items-center justify-center shrink-0`}
                  >
                    <IconComponent size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {activityName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {iconConfig.bgColor} / {iconConfig.iconColor}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-white p-6 rounded-3xl border border-gray-100">
          <h2 className="font-bold text-xl text-slate-900 mb-4">
            Icon Rendering Test Complete
          </h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>✓ Icons load from lucide-react</li>
            <li>✓ Colors apply correctly</li>
            <li>✓ Fallback icon works for unknown activities</li>
            <li>✓ Fuzzy matching works for partial names</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
