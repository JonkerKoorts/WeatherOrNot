import { useState, useEffect, useCallback, useRef } from "react";
import type {
  CurrentWeather,
  LocationInfo,
  DayWeather,
} from "@/types/weather";
import { useSettings } from "@/hooks/use-settings";
import { fetchCurrentWeather } from "@/services/weatherstack-api";
import { fetchOpenMeteoWeather } from "@/services/openmeteo-api";

interface UseWeatherReturn {
  current: CurrentWeather | null;
  location: LocationInfo | null;
  forecast: DayWeather[];
  history: DayWeather[];
  today: DayWeather | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWeather(locationQuery: string): UseWeatherReturn {
  const { settings } = useSettings();
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [forecast, setForecast] = useState<DayWeather[]>([]);
  const [history, setHistory] = useState<DayWeather[]>([]);
  const [today, setToday] = useState<DayWeather | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!locationQuery) return;

    // Abort any in-flight request (handles StrictMode double-fire)
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch current weather from WeatherStack (also gives us lat/lon)
      const result = await fetchCurrentWeather(
        locationQuery,
        settings,
        controller.signal,
      );

      if (controller.signal.aborted) return;

      const { current: currentData, location: locationData } = result;
      setCurrent(currentData);
      setLocation(locationData);

      // 2. Fetch real forecast + history from Open-Meteo using lat/lon
      const cacheTtlMs = settings.cacheTtlMinutes * 60 * 1000;
      const openMeteo = await fetchOpenMeteoWeather(
        locationData.lat,
        locationData.lon,
        settings.units,
        cacheTtlMs,
        controller.signal,
      );

      if (controller.signal.aborted) return;

      setToday(openMeteo.today);
      setHistory(openMeteo.history);
      setForecast(openMeteo.forecast);
    } catch (err) {
      // Ignore abort errors — they're expected from cleanup
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (controller.signal.aborted) return;

      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
      setCurrent(null);
      setLocation(null);
      setForecast([]);
      setHistory([]);
      setToday(null);
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [locationQuery, settings]);

  useEffect(() => {
    fetchData();

    // Cleanup: abort in-flight requests when effect re-runs or unmounts
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);

  return {
    current,
    location,
    forecast,
    history,
    today,
    isLoading,
    error,
    refetch: fetchData,
  };
}
