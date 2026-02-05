"use client";

import { useState, useRef, useEffect } from "react";

interface CentreDetailsFiltersProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  ageFilter: string;
  onAgeFilterChange: (age: string) => void;
  showAvailableOnly: boolean;
  onShowAvailableOnlyChange: (show: boolean) => void;
}

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "Any Date" },
  { value: "next-7-days", label: "Next 7 Days" },
  { value: "this-month", label: "This Month" },
  { value: "next-month", label: "Next Month" },
];

export function CentreDetailsFilters({
  dateRange,
  onDateRangeChange,
  ageFilter,
  onAgeFilterChange,
  showAvailableOnly,
  onShowAvailableOnlyChange,
}: CentreDetailsFiltersProps) {
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isAgeInputOpen, setIsAgeInputOpen] = useState(false);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const ageDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDateDropdownOpen(false);
      }
      if (
        ageDropdownRef.current &&
        !ageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAgeInputOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDateLabel =
    DATE_RANGE_OPTIONS.find((opt) => opt.value === dateRange)?.label ||
    "Any Date";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Date Range Filter */}
      <div className="relative" ref={dateDropdownRef}>
        <button
          onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
          className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-full hover:border-[#8b7360] transition-all text-sm font-medium"
          aria-label="Filter by date range"
          aria-expanded={isDateDropdownOpen}
        >
          <span className="material-symbols-outlined text-sm">
            calendar_today
          </span>
          <span>{selectedDateLabel}</span>
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </button>

        {/* Dropdown Menu */}
        {isDateDropdownOpen && (
          <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-lg z-10 min-w-[180px] overflow-hidden">
            {DATE_RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onDateRangeChange(option.value);
                  setIsDateDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                  dateRange === option.value
                    ? "bg-[#8b7360]/10 text-[#8b7360] font-medium"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Age Filter */}
      <div className="relative" ref={ageDropdownRef}>
        <button
          onClick={() => setIsAgeInputOpen(!isAgeInputOpen)}
          className={`flex items-center space-x-2 bg-white border px-4 py-2 rounded-full transition-all text-sm font-medium ${
            ageFilter
              ? "border-[#8b7360] bg-[#8b7360]/10"
              : "border-gray-200 hover:border-[#8b7360]"
          }`}
          aria-label="Filter by age"
          aria-expanded={isAgeInputOpen}
        >
          <span className="material-symbols-outlined text-sm">person</span>
          <span>{ageFilter || "All Ages"}</span>
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </button>

        {/* Age Input Dropdown */}
        {isAgeInputOpen && (
          <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4 min-w-[200px]">
            <label
              htmlFor="age-filter-input"
              className="block text-sm font-semibold text-stone-900 mb-2"
            >
              Enter your age
            </label>
            <input
              id="age-filter-input"
              type="number"
              min="0"
              max="120"
              value={ageFilter}
              onChange={(e) => onAgeFilterChange(e.target.value)}
              placeholder="e.g., 25"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8b7360] focus:border-transparent"
              autoFocus
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  onAgeFilterChange("");
                  setIsAgeInputOpen(false);
                }}
                className="flex-1 px-3 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setIsAgeInputOpen(false)}
                className="flex-1 px-3 py-2 text-sm font-medium bg-[#8b7360] text-white rounded-lg hover:bg-[#7a6354] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Has Openings Toggle */}
      <button
        onClick={() => onShowAvailableOnlyChange(!showAvailableOnly)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
          showAvailableOnly
            ? "bg-[#8b7360] border-[#8b7360] text-white"
            : "bg-white border-gray-200 text-stone-700 hover:border-[#8b7360]"
        }`}
        aria-label="Show only sessions with openings"
        aria-checked={showAvailableOnly}
        role="switch"
      >
        <span className="material-symbols-outlined text-sm">
          {showAvailableOnly ? "check_circle" : "radio_button_unchecked"}
        </span>
        <span>Has Openings</span>
      </button>
    </div>
  );
}
