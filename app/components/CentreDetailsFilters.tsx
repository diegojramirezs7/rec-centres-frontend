"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { Activity } from "@/lib/schemas/activity";

interface CentreDetailsFiltersProps {
  activities: Activity[];
  activityTypeFilter: string[];
  onActivityTypeFilterChange: (types: string[]) => void;
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
  activities,
  activityTypeFilter,
  onActivityTypeFilterChange,
  dateRange,
  onDateRangeChange,
  ageFilter,
  onAgeFilterChange,
  showAvailableOnly,
  onShowAvailableOnlyChange,
}: CentreDetailsFiltersProps) {
  const [isActivityTypeDropdownOpen, setIsActivityTypeDropdownOpen] =
    useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isAgeInputOpen, setIsAgeInputOpen] = useState(false);
  const [activityTypeInput, setActivityTypeInput] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [localAgeValue, setLocalAgeValue] = useState(ageFilter);
  const activityTypeDropdownRef = useRef<HTMLDivElement>(null);
  const activityTypeInputRef = useRef<HTMLInputElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const ageDropdownRef = useRef<HTMLDivElement>(null);

  // Extract unique activity types
  const availableActivityTypes = useMemo(() => {
    const types = new Set<string>();
    activities.forEach((activity) => {
      if (activity.normalized_activity_type) {
        types.add(activity.normalized_activity_type);
      }
    });
    return Array.from(types).sort();
  }, [activities]);

  // Filter available options based on input and already selected
  const filteredOptions = useMemo(() => {
    const searchTerm = activityTypeInput.toLowerCase();
    return availableActivityTypes.filter(
      (type) =>
        !activityTypeFilter.includes(type) &&
        type.toLowerCase().includes(searchTerm)
    );
  }, [availableActivityTypes, activityTypeFilter, activityTypeInput]);

  // Sync local age value with prop when it changes externally
  useEffect(() => {
    setLocalAgeValue(ageFilter);
  }, [ageFilter]);

  // Debounce age filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onAgeFilterChange(localAgeValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localAgeValue, onAgeFilterChange]);

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        activityTypeDropdownRef.current &&
        !activityTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsActivityTypeDropdownOpen(false);
        setActivityTypeInput("");
      }
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

  // Activity type handlers
  const handleAddActivityType = (type: string) => {
    if (!activityTypeFilter.includes(type)) {
      onActivityTypeFilterChange([...activityTypeFilter, type]);
      setActivityTypeInput("");
      setHighlightedIndex(0);
      activityTypeInputRef.current?.focus();
    }
  };

  const handleRemoveActivityType = (type: string) => {
    onActivityTypeFilterChange(
      activityTypeFilter.filter((t) => t !== type)
    );
  };

  const handleActivityTypeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && filteredOptions.length > 0) {
      e.preventDefault();
      handleAddActivityType(filteredOptions[highlightedIndex]);
    } else if (e.key === "Backspace" && activityTypeInput === "") {
      e.preventDefault();
      if (activityTypeFilter.length > 0) {
        handleRemoveActivityType(
          activityTypeFilter[activityTypeFilter.length - 1]
        );
      }
    } else if (e.key === "Escape") {
      setIsActivityTypeDropdownOpen(false);
      setActivityTypeInput("");
    }
  };

  const selectedDateLabel =
    DATE_RANGE_OPTIONS.find((opt) => opt.value === dateRange)?.label ||
    "Any Date";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Activity Type Filter */}
      <div className="relative" ref={activityTypeDropdownRef}>
        <button
          onClick={() => {
            setIsActivityTypeDropdownOpen(!isActivityTypeDropdownOpen);
            if (!isActivityTypeDropdownOpen) {
              setTimeout(() => activityTypeInputRef.current?.focus(), 0);
            }
          }}
          className={`flex items-center space-x-2 bg-white border px-4 py-2 rounded-full transition-all text-sm font-medium ${
            activityTypeFilter.length > 0
              ? "border-[#8b7360] bg-[#8b7360]/10"
              : "border-gray-200 hover:border-[#8b7360]"
          }`}
          aria-label="Filter by activity type"
          aria-expanded={isActivityTypeDropdownOpen}
        >
          <span className="material-symbols-outlined text-sm">category</span>
          <span>
            {activityTypeFilter.length > 0
              ? `Activity Types (${activityTypeFilter.length})`
              : "Activity Types"}
          </span>
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </button>

        {/* Activity Type Dropdown */}
        {isActivityTypeDropdownOpen && (
          <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4 min-w-[300px]">
            <label
              htmlFor="activity-type-filter-input"
              className="block text-sm font-semibold text-stone-900 mb-2"
            >
              Select activity types
            </label>

            {/* Chips + Input Container */}
            <div className="flex flex-wrap gap-2 items-center px-3 py-2 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-[#8b7360] focus-within:border-transparent">
              {/* Render chips */}
              {activityTypeFilter.map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-1 bg-[#8b7360] text-white px-2 py-1 rounded-full text-xs"
                >
                  <span>{type}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveActivityType(type);
                    }}
                    className="hover:bg-[#7a6354] rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${type}`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      close
                    </span>
                  </button>
                </div>
              ))}

              {/* Input field */}
              <input
                ref={activityTypeInputRef}
                id="activity-type-filter-input"
                type="text"
                value={activityTypeInput}
                onChange={(e) => setActivityTypeInput(e.target.value)}
                onKeyDown={handleActivityTypeKeyDown}
                placeholder={
                  activityTypeFilter.length === 0 ? "Type to search..." : ""
                }
                className="flex-1 min-w-[120px] outline-none text-sm bg-transparent text-stone-900"
              />
            </div>

            {/* Options List */}
            {filteredOptions.length > 0 && (
              <div className="mt-2 max-h-[200px] overflow-y-auto border border-gray-200 rounded-lg">
                {filteredOptions.map((type, index) => (
                  <button
                    key={type}
                    onClick={() => handleAddActivityType(type)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      index === highlightedIndex
                        ? "bg-[#8b7360]/10 text-[#8b7360]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}

            {/* No results message */}
            {activityTypeInput && filteredOptions.length === 0 && (
              <div className="mt-2 text-sm text-gray-500 text-center py-2">
                No matching activity types
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  onActivityTypeFilterChange([]);
                  setActivityTypeInput("");
                  setIsActivityTypeDropdownOpen(false);
                }}
                className="flex-1 px-3 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  setIsActivityTypeDropdownOpen(false);
                  setActivityTypeInput("");
                }}
                className="flex-1 px-3 py-2 text-sm font-medium bg-[#8b7360] text-white rounded-lg hover:bg-[#7a6354] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

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
              value={localAgeValue}
              onChange={(e) => setLocalAgeValue(e.target.value)}
              placeholder="e.g., 25"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8b7360] focus:border-transparent"
              autoFocus
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  setLocalAgeValue("");
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
