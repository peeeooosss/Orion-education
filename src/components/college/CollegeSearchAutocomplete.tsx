"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, BadgeCheck, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchCollege {
  id: string;
  name: string;
  city: string;
  region: string;
  isPartnered: boolean;
  source: "static" | "db";
}

interface CollegeSearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (college: { id: string; name: string }) => void;
  placeholder?: string;
  className?: string;
}

export function CollegeSearchAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Search by college, program or city...",
  className,
}: CollegeSearchAutocompleteProps) {
  const router = useRouter();
  const [suggestions, setSuggestions] = React.useState<SearchCollege[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 250);
    return () => clearTimeout(timer);
  }, [value]);

  // Fetch suggestions
  React.useEffect(() => {
    if (!debouncedValue) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/colleges/search?q=${encodeURIComponent(debouncedValue)}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.colleges) setSuggestions(data.colleges);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [debouncedValue]);

  // Open/close logic
  React.useEffect(() => {
    if (suggestions.length > 0) setIsOpen(true);
    else setIsOpen(false);
    setHighlightedIndex(-1);
  }, [suggestions.length]);

  // Click outside to close
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        (e.target as HTMLInputElement).blur();
        break;
    }
  }

  function handleSelect(college: SearchCollege) {
    if (onSelect) {
      onSelect({ id: college.id, name: college.name });
    } else {
      router.push(`/college/${college.id}`);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  function handleClear() {
    onChange("");
    setSuggestions([]);
    setIsOpen(false);
  }

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onClick={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="h-12 pl-10 pr-12 border-0 bg-transparent text-surface-900 placeholder:text-surface-400 focus-visible:ring-0"
          aria-label="Search colleges"
          aria-autocomplete="list"
          aria-controls="college-suggestions"
          aria-expanded={isOpen}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          id="college-suggestions"
          className="absolute z-50 mt-1.5 w-full max-h-80 overflow-auto rounded-2xl border border-surface-200 bg-white shadow-lg ring-1 ring-surface-100"
          role="listbox"
        >
          {suggestions.map((college, idx) => (
            <button
              key={college.id}
              type="button"
              onClick={() => handleSelect(college)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={cn(
                "w-full px-4 py-3 text-left transition-colors",
                highlightedIndex === idx
                  ? "bg-gold-50"
                  : "hover:bg-surface-50"
              )}
              role="option"
              aria-selected={highlightedIndex === idx}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-surface-900 truncate">{college.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-surface-500">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span>{college.city}</span>
                    {college.region && college.region !== "Others" && (
                      <>
                        <span className="text-surface-300">·</span>
                        <span>{college.region}</span>
                      </>
                    )}
                  </div>
                </div>
                {college.isPartnered && (
                  <Badge variant="secondary" className="shrink-0 bg-blue-50 text-blue-700 border-blue-200">
                    <BadgeCheck className="h-3 w-3 mr-1" /> Partner
                  </Badge>
                )}
              </div>
            </button>
          ))}
          <div className="px-4 py-2 border-t border-surface-100 text-center text-xs text-surface-500">
            Press Enter to select · Esc to close
          </div>
        </div>
      )}

      {isOpen && suggestions.length === 0 && value && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-surface-200 bg-white px-4 py-3 shadow-lg ring-1 ring-surface-100 text-center text-sm text-surface-500">
          No colleges found for "<span className="font-semibold text-surface-700">{value}</span>"
        </div>
      )}
    </div>
  );
}