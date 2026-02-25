import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Clock, X, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/hooks/use-settings";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { RecentSearch } from "@/types/weather";
import { RECENT_SEARCHES_KEY, MAX_RECENT_SEARCHES, LOCATION_TYPE_LABELS } from "@/lib/constants";

interface LocationSearchProps {
  size?: "default" | "large";
  placeholder?: string;
  autoFocus?: boolean;
}

export function LocationSearch({
  size = "default",
  placeholder,
  autoFocus = false,
}: LocationSearchProps) {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [recentSearches, setRecentSearches] = useLocalStorage<RecentSearch[]>(
    RECENT_SEARCHES_KEY,
    [],
  );

  const defaultPlaceholder =
    placeholder ??
    (size === "large"
      ? "Search for a city, ZIP code, or coordinates..."
      : "Search another location...");

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addRecentSearch = useCallback(
    (location: string) => {
      setRecentSearches((prev) => {
        const filtered = prev.filter(
          (s) => s.location.toLowerCase() !== location.toLowerCase(),
        );
        const newSearch: RecentSearch = {
          location,
          displayName: location,
          timestamp: Date.now(),
          locationType: settings.locationType,
        };
        return [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      });
    },
    [settings.locationType, setRecentSearches],
  );

  const removeRecentSearch = useCallback(
    (location: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setRecentSearches((prev) =>
        prev.filter((s) => s.location.toLowerCase() !== location.toLowerCase()),
      );
    },
    [setRecentSearches],
  );

  const clearAllRecent = useCallback(() => {
    setRecentSearches([]);
    setShowDropdown(false);
  }, [setRecentSearches]);

  const handleSubmit = useCallback(
    (locationValue?: string) => {
      const value = (locationValue ?? query).trim();
      if (!value) return;

      addRecentSearch(value);
      setQuery("");
      setShowDropdown(false);
      navigate({ to: "/weather/$location", params: { location: encodeURIComponent(value) } });
    },
    [query, addRecentSearch, navigate],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < recentSearches.length) {
        handleSubmit(recentSearches[highlightIndex].location);
      } else {
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setHighlightIndex(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < recentSearches.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }
  };

  const isLarge = size === "large";

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${isLarge ? "size-5" : "size-4"}`}
        />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlightIndex(-1);
          }}
          onFocus={() => {
            if (recentSearches.length > 0) setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={defaultPlaceholder}
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={showDropdown && recentSearches.length > 0}
          aria-controls="recent-searches-listbox"
          aria-activedescendant={
            highlightIndex >= 0 ? `recent-search-${highlightIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-label="Search location"
          className={`transition-shadow focus:shadow-md ${
            isLarge
              ? "h-14 pl-11 pr-4 text-lg"
              : "h-10 pl-10 pr-4 text-sm"
          }`}
        />
      </div>

      {showDropdown && recentSearches.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-lg border bg-card shadow-lg">
          <ul id="recent-searches-listbox" role="listbox" aria-label="Recent searches" className="py-1">
            {recentSearches.map((search, index) => (
              <li
                id={`recent-search-${index}`}
                key={`${search.location}-${search.timestamp}`}
                role="option"
                aria-selected={index === highlightIndex}
                className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent ${
                  index === highlightIndex ? "bg-accent" : ""
                }`}
                onClick={() => handleSubmit(search.location)}
                onMouseEnter={() => setHighlightIndex(index)}
              >
                <Clock className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{search.displayName}</span>
                <Badge variant="secondary" className="shrink-0 text-[10px]">
                  {LOCATION_TYPE_LABELS[search.locationType]}
                </Badge>
                <button
                  onClick={(e) => removeRecentSearch(search.location, e)}
                  className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Remove ${search.displayName}`}
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t px-3 py-2">
            <button
              onClick={clearAllRecent}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="size-3" />
              Clear recent searches
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
