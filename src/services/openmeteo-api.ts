import type { DayWeather, UnitSystem } from "@/types/weather";
import { getDayOfWeek, getDateLabel } from "@/lib/weather-utils";
import { getCached, setCache } from "@/lib/cache";

// ============================================================
// WMO Weather Code → WeatherStack Code Mapping
// ============================================================

const WMO_TO_WEATHERSTACK: Record<number, number> = {
  0: 113, // Clear sky → Sunny
  1: 113, // Mainly clear → Sunny
  2: 116, // Partly cloudy
  3: 119, // Overcast → Cloudy
  45: 143, // Fog
  48: 143, // Depositing rime fog
  51: 176, // Light drizzle → Light rain
  53: 176, // Moderate drizzle
  55: 266, // Dense drizzle
  56: 185, // Light freezing drizzle → Sleet
  57: 185, // Dense freezing drizzle
  61: 176, // Slight rain → Light rain
  63: 299, // Moderate rain
  65: 308, // Heavy rain
  66: 311, // Light freezing rain
  67: 314, // Heavy freezing rain
  71: 227, // Slight snow fall
  73: 329, // Moderate snow fall
  75: 338, // Heavy snow fall
  77: 227, // Snow grains
  80: 176, // Slight rain showers
  81: 299, // Moderate rain showers
  82: 308, // Violent rain showers
  85: 227, // Slight snow showers
  86: 338, // Heavy snow showers
  95: 200, // Thunderstorm
  96: 200, // Thunderstorm with slight hail
  99: 200, // Thunderstorm with heavy hail
};

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Rime Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  56: "Light Freezing Drizzle",
  57: "Dense Freezing Drizzle",
  61: "Light Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Light Freezing Rain",
  67: "Heavy Freezing Rain",
  71: "Light Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Light Showers",
  81: "Moderate Showers",
  82: "Heavy Showers",
  85: "Light Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Hail",
  99: "Heavy Thunderstorm with Hail",
};

// ============================================================
// Helpers
// ============================================================

function degreesToDirection(degrees: number): string {
  const directions = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// ============================================================
// Open-Meteo Response Types
// ============================================================

interface OpenMeteoDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
  wind_direction_10m_dominant: number[];
  weather_code: number[];
  uv_index_max: number[];
}

interface OpenMeteoHourly {
  time: string[];
  surface_pressure: number[];
  relative_humidity_2m: number[];
  cloud_cover: number[];
}

interface OpenMeteoResponse {
  daily: OpenMeteoDaily;
  hourly: OpenMeteoHourly;
}

// ============================================================
// Compute daily averages from hourly data
// ============================================================

function computeDailyAverages(
  hourly: OpenMeteoHourly,
  dates: string[],
): { pressure: number[]; humidity: number[]; cloudCover: number[] } {
  const pressure: number[] = [];
  const humidity: number[] = [];
  const cloudCover: number[] = [];

  for (const date of dates) {
    let pSum = 0;
    let hSum = 0;
    let cSum = 0;
    let count = 0;

    for (let i = 0; i < hourly.time.length; i++) {
      if (hourly.time[i].startsWith(date)) {
        if (hourly.surface_pressure[i] != null) pSum += hourly.surface_pressure[i];
        if (hourly.relative_humidity_2m[i] != null) hSum += hourly.relative_humidity_2m[i];
        if (hourly.cloud_cover[i] != null) cSum += hourly.cloud_cover[i];
        count++;
      }
    }

    pressure.push(count > 0 ? Math.round(pSum / count) : 1013);
    humidity.push(count > 0 ? Math.round(hSum / count) : 50);
    cloudCover.push(count > 0 ? Math.round(cSum / count) : 0);
  }

  return { pressure, humidity, cloudCover };
}

// ============================================================
// Cache key builder
// ============================================================

function buildCacheKey(lat: number, lon: number, units: UnitSystem): string {
  return `om_${lat.toFixed(2)}_${lon.toFixed(2)}_${units}`;
}

// ============================================================
// Main fetch function
// ============================================================

export interface OpenMeteoResult {
  today: DayWeather;
  forecast: DayWeather[];
  history: DayWeather[];
}

export async function fetchOpenMeteoWeather(
  lat: number,
  lon: number,
  units: UnitSystem,
  cacheTtlMs: number,
  signal?: AbortSignal,
): Promise<OpenMeteoResult> {
  // Check cache first
  const cacheKey = buildCacheKey(lat, lon, units);
  const cached = getCached<OpenMeteoResult>(cacheKey);
  if (cached) return cached;

  const baseUrl =
    import.meta.env.VITE_OPENMETEO_FORECAST_URL ||
    "https://api.open-meteo.com/v1/forecast";

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant,weather_code,uv_index_max",
    hourly: "surface_pressure,relative_humidity_2m,cloud_cover",
    past_days: "3",
    forecast_days: "4", // today + 3 future days
    timezone: "auto",
  });

  // Match units to user preference
  if (units === "f") {
    params.set("temperature_unit", "fahrenheit");
    params.set("wind_speed_unit", "mph");
    params.set("precipitation_unit", "inch");
  }

  const url = `${baseUrl}?${params.toString()}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(
      `Open-Meteo API error: ${response.status} ${response.statusText}`,
    );
  }

  const data: OpenMeteoResponse = await response.json();
  const { daily, hourly } = data;

  const averages = computeDailyAverages(hourly, daily.time);
  const todayStr = new Date().toISOString().split("T")[0];

  const allDays: DayWeather[] = daily.time.map((date, i) => {
    const wmoCode = daily.weather_code[i];
    const wsCode = WMO_TO_WEATHERSTACK[wmoCode] ?? 119;
    const isToday = date === todayStr;
    const isFuture = date > todayStr;

    let tempHigh = Math.round(daily.temperature_2m_max[i]);
    let tempLow = Math.round(daily.temperature_2m_min[i]);
    let temperature = Math.round((tempHigh + tempLow) / 2);

    // Convert to Kelvin if scientific units (Open-Meteo doesn't support Kelvin)
    if (units === "s") {
      temperature = Math.round(temperature + 273.15);
      tempHigh = Math.round(tempHigh + 273.15);
      tempLow = Math.round(tempLow + 273.15);
    }

    return {
      date,
      dayOfWeek: getDayOfWeek(date),
      label: getDateLabel(date),
      temperature,
      tempHigh,
      tempLow,
      description: WMO_DESCRIPTIONS[wmoCode] ?? "Unknown",
      weatherCode: wsCode,
      windSpeed: Math.round(daily.wind_speed_10m_max[i]),
      windDirection: degreesToDirection(daily.wind_direction_10m_dominant[i]),
      pressure: averages.pressure[i],
      precipitation: Math.round(daily.precipitation_sum[i] * 10) / 10,
      humidity: averages.humidity[i],
      cloudCover: averages.cloudCover[i],
      uvIndex: Math.round(daily.uv_index_max[i]),
      isSimulated: false,
      type: isToday ? ("current" as const) : isFuture ? ("forecast" as const) : ("history" as const),
    };
  });

  const today = allDays.find((d) => d.date === todayStr) ?? allDays[3];
  const historyDays = allDays.filter((d) => d.type === "history");
  const forecastDays = allDays.filter((d) => d.type === "forecast");

  const result: OpenMeteoResult = {
    today,
    forecast: forecastDays,
    history: historyDays,
  };

  // Cache the result
  if (cacheTtlMs > 0) {
    setCache(cacheKey, result, cacheTtlMs);
  }

  return result;
}
