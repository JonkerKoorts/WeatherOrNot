import { useState, useCallback, useMemo } from "react";
import type { DayWeather, SelectedDayState } from "@/types/weather";
import { useWeather } from "@/hooks/use-weather";

interface UseWeatherDataReturn {
  current: ReturnType<typeof useWeather>["current"];
  location: ReturnType<typeof useWeather>["location"];
  forecast: DayWeather[];
  history: DayWeather[];
  today: DayWeather | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  selectedDay: SelectedDayState;
  selectDay: (day: DayWeather) => void;
  clearSelection: () => void;
  allDays: DayWeather[];
  displayedWeather: DayWeather | null;
}

const INITIAL_SELECTION: SelectedDayState = {
  day: null,
  source: "current",
};

export function useWeatherData(locationQuery: string): UseWeatherDataReturn {
  const weather = useWeather(locationQuery);
  const [selectedDay, setSelectedDay] =
    useState<SelectedDayState>(INITIAL_SELECTION);

  const selectDay = useCallback((day: DayWeather) => {
    setSelectedDay({ day, source: day.type === "current" ? "current" : day.type });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedDay(INITIAL_SELECTION);
  }, []);

  const allDays = useMemo(() => {
    const days: DayWeather[] = [];
    if (weather.history.length > 0) days.push(...weather.history);
    if (weather.today) days.push(weather.today);
    if (weather.forecast.length > 0) days.push(...weather.forecast);
    return days;
  }, [weather.history, weather.today, weather.forecast]);

  const displayedWeather = useMemo(() => {
    if (selectedDay.day) return selectedDay.day;
    return weather.today;
  }, [selectedDay.day, weather.today]);

  return {
    ...weather,
    selectedDay,
    selectDay,
    clearSelection,
    allDays,
    displayedWeather,
  };
}
