import type {
  WeatherStackCurrent,
  WeatherStackLocation,
  WeatherbitDayData,
  CurrentWeather,
  LocationInfo,
  DayWeather,
  UnitSystem,
  LocationType,
} from "@/types/weather";
import { UNIT_LABELS } from "@/lib/constants";

// ============================================================
// WeatherStack Normalizers
// ============================================================

export function normalizeLocation(raw: WeatherStackLocation): LocationInfo {
  return {
    name: raw.name,
    region: raw.region,
    country: raw.country,
    lat: parseFloat(raw.lat),
    lon: parseFloat(raw.lon),
    timezone: raw.timezone_id,
    localtime: raw.localtime,
  };
}

export function normalizeCurrentWeather(
  raw: WeatherStackCurrent,
): CurrentWeather {
  return {
    temperature: raw.temperature,
    feelsLike: raw.feelslike,
    description: raw.weather_descriptions[0] ?? "Unknown",
    weatherCode: raw.weather_code,
    windSpeed: raw.wind_speed,
    windDirection: raw.wind_dir,
    windDegree: raw.wind_degree,
    pressure: raw.pressure,
    precipitation: raw.precip,
    humidity: raw.humidity,
    cloudCover: raw.cloudcover,
    uvIndex: raw.uv_index,
    visibility: raw.visibility,
    isDay: raw.is_day === "yes",
    observationTime: raw.observation_time,
    iconUrl: raw.weather_icons[0] ?? "",
  };
}

// ============================================================
// Weatherbit Normalizer
// ============================================================

export function normalizeWeatherbitDay(raw: WeatherbitDayData): DayWeather {
  return {
    date: raw.datetime,
    dayOfWeek: getDayOfWeek(raw.datetime),
    label: getDateLabel(raw.datetime),
    temperature: Math.round(raw.temp),
    tempHigh: Math.round(raw.max_temp),
    tempLow: Math.round(raw.min_temp),
    description: raw.weather.description,
    weatherCode: raw.weather.code,
    windSpeed: Math.round(raw.wind_spd * 3.6), // m/s → km/h
    windDirection: raw.wind_cdir,
    pressure: Math.round(raw.pres),
    precipitation: Math.round(raw.precip * 10) / 10,
    humidity: Math.round(raw.rh),
    cloudCover: raw.clouds,
    uvIndex: Math.round(raw.uv),
    isSimulated: false,
    type: "forecast",
  };
}

// ============================================================
// Formatting Utilities
// ============================================================

export function formatTemp(temp: number, unit: UnitSystem = "m"): string {
  const rounded = Math.round(temp);
  return `${rounded}${UNIT_LABELS[unit].temp}`;
}

export function formatWind(
  speed: number,
  dir: string,
  unit: UnitSystem = "m",
): string {
  return `${Math.round(speed)} ${UNIT_LABELS[unit].wind} ${dir}`;
}

export function formatPrecip(precip: number, unit: UnitSystem = "m"): string {
  return `${precip} ${UNIT_LABELS[unit].precip}`;
}

export function formatPressure(
  pressure: number,
  unit: UnitSystem = "m",
): string {
  return `${pressure} ${UNIT_LABELS[unit].pressure}`;
}

// ============================================================
// Date Utilities
// ============================================================

export function getDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
}

export function getDateLabel(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr + "T12:00:00");
  date.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function getDateOffset(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

// ============================================================
// Weather Icon Mapping
// ============================================================

/**
 * Maps WeatherStack weather_code to a Lucide icon name.
 * Grouped by weather condition category.
 */
export function getWeatherIconName(code: number, isDay: boolean): string {
  // Clear / Sunny
  if (code === 113) return isDay ? "Sun" : "Moon";
  // Partly cloudy
  if (code === 116) return isDay ? "CloudSun" : "CloudMoon";
  // Cloudy / Overcast
  if (code === 119 || code === 122) return "Cloud";
  // Mist / Fog
  if ([143, 248, 260].includes(code)) return "CloudFog";
  // Light rain / drizzle
  if ([176, 263, 266, 293, 296, 353].includes(code)) return "CloudDrizzle";
  // Moderate / heavy rain
  if ([299, 302, 305, 308, 356, 359].includes(code)) return "CloudRain";
  // Snow
  if (
    [179, 227, 230, 323, 326, 329, 332, 335, 338, 368, 371].includes(code)
  )
    return "Snowflake";
  // Sleet / freezing
  if (
    [182, 185, 281, 284, 311, 314, 317, 320, 350, 362, 365, 374, 377].includes(
      code,
    )
  )
    return "CloudSnow";
  // Thunder
  if ([200, 386, 389, 392, 395].includes(code)) return "CloudLightning";

  return "Cloud";
}

/**
 * Maps Weatherbit weather codes to Lucide icon names.
 * Weatherbit uses a different code range (200-900).
 */
export function getWeatherbitIconName(code: number): string {
  // Thunderstorm (200-233)
  if (code >= 200 && code <= 233) return "CloudLightning";
  // Drizzle (300-302)
  if (code >= 300 && code <= 302) return "CloudDrizzle";
  // Rain (500-522)
  if (code >= 500 && code <= 522) return "CloudRain";
  // Snow (600-623)
  if (code >= 600 && code <= 623) return "Snowflake";
  // Mist / Fog / Haze (700-751)
  if (code >= 700 && code <= 751) return "CloudFog";
  // Clear (800)
  if (code === 800) return "Sun";
  // Few clouds (801-802)
  if (code === 801 || code === 802) return "CloudSun";
  // Broken / overcast clouds (803-804)
  if (code === 803 || code === 804) return "Cloud";
  // Freezing (900)
  if (code === 900) return "Snowflake";

  return "Cloud";
}

// ============================================================
// Location Query Builder
// ============================================================

/**
 * Builds the query value based on location type.
 * - city: raw input string (e.g. "Pretoria")
 * - zip: raw input (e.g. "10001")
 * - coordinates: raw input expected as "lat,lon" (e.g. "40.71,-74.00")
 * - ip: raw input IP address (e.g. "153.65.8.20")
 * - auto: returns "fetch:ip" for WeatherStack auto-detection
 */
export function buildLocationQuery(
  input: string,
  type: LocationType,
): string {
  const trimmed = input.trim();

  switch (type) {
    case "auto":
      return "fetch:ip";
    case "city":
    case "zip":
    case "ip":
      return trimmed;
    case "coordinates":
      return trimmed;
    default:
      return trimmed;
  }
}
