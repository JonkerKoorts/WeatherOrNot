import type {
  AppSettings,
  DayWeather,
  UnitSystem,
  WeatherbitForecastResponse,
} from "@/types/weather";
import { normalizeWeatherbitDay } from "@/lib/weather-utils";
import { getCached, setCache } from "@/lib/cache";

function mapUnits(unit: UnitSystem): string {
  switch (unit) {
    case "m":
    case "s":
      return "M"; // Weatherbit Metric
    case "f":
      return "I"; // Weatherbit Imperial
    default:
      return "M";
  }
}

function buildCacheKey(
  location: string,
  days: number,
  settings: AppSettings,
): string {
  return `wb_${location}_${days}_${settings.units}_${settings.language}`;
}

export async function fetchForecast(
  location: string,
  settings: AppSettings,
  days: number = 3,
  signal?: AbortSignal,
): Promise<DayWeather[]> {
  const apiKey = import.meta.env.VITE_WEATHERBIT_API_KEY;
  if (!apiKey) {
    throw new Error("Weatherbit API key is not configured.");
  }

  const cacheKey = buildCacheKey(location, days, settings);
  const cached = getCached<DayWeather[]>(cacheKey);
  if (cached) return cached;

  const baseUrl =
    import.meta.env.VITE_WEATHERBIT_BASE_URL ||
    "https://api.weatherbit.io/v2.0";

  const params = new URLSearchParams({
    key: apiKey,
    city: location,
    days: String(days),
    units: mapUnits(settings.units),
    lang: settings.language,
  });

  const url = `${baseUrl}/forecast/daily?${params.toString()}`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(
      `Weatherbit API error: ${response.status} ${response.statusText}`,
    );
  }

  const data: WeatherbitForecastResponse = await response.json();

  if (!data.data || data.data.length === 0) {
    throw new Error("Weatherbit returned no forecast data.");
  }

  // Skip today (index 0) and take the next `days` entries
  const forecastDays = data.data.slice(1, days + 1).map(normalizeWeatherbitDay);

  const ttlMs = settings.cacheTtlMinutes * 60 * 1000;
  setCache(cacheKey, forecastDays, ttlMs);

  return forecastDays;
}
