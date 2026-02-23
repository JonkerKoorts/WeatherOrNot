import { useState, useEffect, useCallback, useRef } from "react";
import type {
  CurrentWeather,
  LocationInfo,
  DayWeather,
} from "@/types/weather";
import { useSettings } from "@/hooks/use-settings";
import { fetchCurrentWeather } from "@/services/weatherstack-api";
import { fetchForecast } from "@/services/weatherbit-api";
import { generateHistory, currentToDay } from "@/services/weather-simulator";

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
      // Fetch current weather and forecast in parallel
      const [currentResult, forecastResult] = await Promise.allSettled([
        fetchCurrentWeather(locationQuery, settings, controller.signal),
        fetchForecast(locationQuery, settings, 3, controller.signal),
      ]);

      // If aborted, don't update state
      if (controller.signal.aborted) return;

      // Current weather is required
      if (currentResult.status === "rejected") {
        throw new Error(
          currentResult.reason instanceof Error
            ? currentResult.reason.message
            : "Failed to fetch current weather.",
        );
      }

      const { current: currentData, location: locationData } =
        currentResult.value;
      setCurrent(currentData);
      setLocation(locationData);
      setToday(currentToDay(currentData));

      // Generate simulated history from current data
      const historyData = generateHistory(currentData, locationData.name);
      setHistory(historyData);

      // Forecast is optional — degrade gracefully
      if (forecastResult.status === "fulfilled") {
        setForecast(forecastResult.value);
      } else {
        setForecast([]);
        if (!controller.signal.aborted) {
          console.warn("Forecast fetch failed:", forecastResult.reason);
        }
      }
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
