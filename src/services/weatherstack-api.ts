import type {
  AppSettings,
  CurrentWeather,
  LocationInfo,
  WeatherStackError,
  WeatherStackResponse,
} from "@/types/weather";
import { WEATHERSTACK_PROXY_PATH } from "@/lib/constants";
import {
  normalizeCurrentWeather,
  normalizeLocation,
  buildLocationQuery,
} from "@/lib/weather-utils";
import { getCached, setCache } from "@/lib/cache";

interface WeatherStackResult {
  current: CurrentWeather;
  location: LocationInfo;
}

function buildCacheKey(location: string, settings: AppSettings): string {
  return `ws_${location}_${settings.units}_${settings.language}`;
}

export async function fetchCurrentWeather(
  location: string,
  settings: AppSettings,
): Promise<WeatherStackResult> {
  const accessKey = import.meta.env.VITE_WEATHERSTACK_ACCESS_KEY;
  if (!accessKey) {
    throw new Error("WeatherStack access key is not configured.");
  }

  const cacheKey = buildCacheKey(location, settings);
  const cached = getCached<WeatherStackResult>(cacheKey);
  if (cached) return cached;

  const query = buildLocationQuery(location, settings.locationType);
  const isDev = import.meta.env.DEV;

  const baseUrl = isDev
    ? WEATHERSTACK_PROXY_PATH
    : import.meta.env.VITE_WEATHERSTACK_BASE_URL;

  const params = new URLSearchParams({
    access_key: accessKey,
    query,
    units: settings.units,
    language: settings.language,
  });

  const url = `${baseUrl}/current?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WeatherStack API error: ${response.status} ${response.statusText}`);
  }

  const data: WeatherStackResponse | WeatherStackError = await response.json();

  if ("success" in data && data.success === false) {
    const err = data as WeatherStackError;
    throw new Error(
      `WeatherStack error (${err.error.code}): ${err.error.info}`,
    );
  }

  const result: WeatherStackResult = {
    current: normalizeCurrentWeather((data as WeatherStackResponse).current),
    location: normalizeLocation((data as WeatherStackResponse).location),
  };

  const ttlMs = settings.cacheTtlMinutes * 60 * 1000;
  setCache(cacheKey, result, ttlMs);

  return result;
}
