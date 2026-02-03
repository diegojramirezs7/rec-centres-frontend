"use client";

interface CentreDetailsSidebarProps {
  ageFilter: string;
  onAgeFilterChange: (age: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  showAvailableOnly: boolean;
  onShowAvailableOnlyChange: (show: boolean) => void;
}

export function CentreDetailsSidebar({
  ageFilter,
  onAgeFilterChange,
  dateRange,
  onDateRangeChange,
  showAvailableOnly,
  onShowAvailableOnlyChange,
}: CentreDetailsSidebarProps) {
  return (
    <aside className="w-80 flex-shrink-0 max-h-[calc(100vh-77px)] sticky top-[77px] border-r border-gray-200 bg-white/50 p-8 overflow-y-auto">
      <div className="space-y-8">
        {/* Age Filter */}
        <div>
          <label
            className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3"
            htmlFor="age-filter"
          >
            Your Age
          </label>
          <div className="relative">
            <input
              id="age-filter"
              type="number"
              min="0"
              max="120"
              value={ageFilter}
              onChange={(e) => onAgeFilterChange(e.target.value)}
              className="w-full pl-3 pr-14 py-2.5 rounded-xl bg-white border-gray-200 focus:ring-2 focus:ring-[#8b7360] text-sm"
              placeholder="Enter age..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <span className="text-xs font-medium">years</span>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label
            className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3"
            htmlFor="date-range"
          >
            Date Range
          </label>
          <select
            id="date-range"
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white border-gray-200 focus:ring-2 focus:ring-[#8b7360] text-sm"
          >
            <option value="all">All Dates</option>
            <option value="next-7-days">Next 7 Days</option>
            <option value="this-month">This Month</option>
            <option value="next-month">Next Month</option>
          </select>
        </div>

        {/* Show Available Only Toggle */}
        <div>
          <label className="relative inline-flex items-center cursor-pointer w-full justify-between">
            <span className="text-sm font-medium">Show only available</span>
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showAvailableOnly}
              onChange={(e) => onShowAvailableOnlyChange(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8b7360] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b7360]"></div>
          </label>
        </div>

        {/* Clear Filters */}
        {(ageFilter || dateRange !== 'all' || showAvailableOnly) && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onAgeFilterChange('');
                onDateRangeChange('all');
                onShowAvailableOnlyChange(false);
              }}
              className="text-[#8b7360] hover:text-[#6b5340] text-sm font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
