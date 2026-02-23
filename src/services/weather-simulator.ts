import type { CurrentWeather, DayWeather } from "@/types/weather";
import { getDateOffset, getDayOfWeek, getDateLabel } from "@/lib/weather-utils";
import { SIMULATION_VARIANCE } from "@/lib/constants";

/**
 * Simple seeded PRNG based on a string hash.
 * Produces deterministic values so simulated data is stable across re-renders.
 */
function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Simple linear congruential generator seeded from a hash.
 * Returns a function that produces values in [0, 1).
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

function vary(base: number, variance: number, random: number): number {
  return base + (random * 2 - 1) * variance;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Shifts a WeatherStack weather code slightly for simulated days.
 * Keeps changes within ±1 condition group for realism.
 */
function shiftWeatherCode(code: number, random: number): number {
  const groups = [113, 116, 119, 176, 299, 227, 200];
  const idx = groups.indexOf(code);

  if (idx === -1) return code;

  const shift = random < 0.33 ? -1 : random > 0.66 ? 1 : 0;
  const newIdx = clamp(idx + shift, 0, groups.length - 1);
  return groups[newIdx];
}

const CONDITION_MAP: Record<number, string> = {
  113: "Sunny",
  116: "Partly Cloudy",
  119: "Cloudy",
  176: "Light Rain",
  299: "Moderate Rain",
  227: "Light Snow",
  200: "Thunderstorm",
};

/**
 * Wraps the current weather as a DayWeather entry representing today.
 * Not simulated — uses real API data.
 */
export function currentToDay(current: CurrentWeather): DayWeather {
  const today = getDateOffset(0);
  return {
    date: today,
    dayOfWeek: getDayOfWeek(today),
    label: "Today",
    temperature: current.temperature,
    tempHigh: current.temperature + 3,
    tempLow: current.temperature - 3,
    description: current.description,
    weatherCode: current.weatherCode,
    windSpeed: current.windSpeed,
    windDirection: current.windDirection,
    pressure: current.pressure,
    precipitation: current.precipitation,
    humidity: current.humidity,
    cloudCover: current.cloudCover,
    uvIndex: current.uvIndex,
    isSimulated: false,
    type: "current",
  };
}

/**
 * Generates 3 simulated past-day weather entries based on current conditions.
 * Uses a seeded PRNG so values are deterministic for the same date + location.
 * Returns days ordered oldest to newest: [-3, -2, -1].
 */
export function generateHistory(
  current: CurrentWeather,
  locationName: string,
): DayWeather[] {
  const days: DayWeather[] = [];

  for (let i = -3; i <= -1; i++) {
    const dateStr = getDateOffset(i);
    const seed = hashSeed(`${locationName}_${dateStr}_history`);
    const rng = seededRandom(seed);

    const temp = Math.round(
      clamp(vary(current.temperature, SIMULATION_VARIANCE.TEMP, rng()), -40, 55),
    );
    const wind = Math.round(
      clamp(vary(current.windSpeed, SIMULATION_VARIANCE.WIND, rng()), 0, 120),
    );
    const pressure = Math.round(
      clamp(
        vary(current.pressure, SIMULATION_VARIANCE.PRESSURE, rng()),
        950,
        1060,
      ),
    );
    const precip =
      Math.round(
        clamp(
          vary(current.precipitation, SIMULATION_VARIANCE.PRECIP, rng()),
          0,
          50,
        ) * 10,
      ) / 10;
    const humidity = Math.round(
      clamp(
        vary(current.humidity, SIMULATION_VARIANCE.HUMIDITY, rng()),
        0,
        100,
      ),
    );
    const cloudCover = Math.round(clamp(vary(current.cloudCover, 20, rng()), 0, 100));
    const uvIndex = Math.round(clamp(vary(current.uvIndex, 2, rng()), 0, 11));
    const weatherCode = shiftWeatherCode(current.weatherCode, rng());

    days.push({
      date: dateStr,
      dayOfWeek: getDayOfWeek(dateStr),
      label: getDateLabel(dateStr),
      temperature: temp,
      tempHigh: temp + Math.round(rng() * 4 + 1),
      tempLow: temp - Math.round(rng() * 4 + 1),
      description: CONDITION_MAP[weatherCode] ?? current.description,
      weatherCode,
      windSpeed: wind,
      windDirection: current.windDirection,
      pressure,
      precipitation: precip,
      humidity,
      cloudCover,
      uvIndex,
      isSimulated: true,
      type: "history",
    });
  }

  return days;
}
