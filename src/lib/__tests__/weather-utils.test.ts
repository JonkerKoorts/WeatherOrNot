import { describe, it, expect } from "vitest";
import {
  normalizeLocation,
  normalizeCurrentWeather,
  formatTemp,
  formatWind,
  formatPrecip,
  formatPressure,
  getDayOfWeek,
  getDateLabel,
  formatDate,
  getDateOffset,
  getWeatherIconName,
  buildLocationQuery,
} from "@/lib/weather-utils";
import type { WeatherStackCurrent, WeatherStackLocation } from "@/types/weather";

describe("normalizeLocation", () => {
  it("maps all WeatherStack fields correctly", () => {
    const raw: WeatherStackLocation = {
      name: "Pretoria",
      country: "South Africa",
      region: "Gauteng",
      lat: "-25.747",
      lon: "28.188",
      timezone_id: "Africa/Johannesburg",
      localtime: "2026-02-23 14:30",
      localtime_epoch: 1771937400,
      utc_offset: "2.0",
    };

    const result = normalizeLocation(raw);
    expect(result.name).toBe("Pretoria");
    expect(result.region).toBe("Gauteng");
    expect(result.country).toBe("South Africa");
    expect(result.lat).toBe(-25.747);
    expect(result.lon).toBe(28.188);
    expect(result.timezone).toBe("Africa/Johannesburg");
    expect(result.localtime).toBe("2026-02-23 14:30");
  });
});

describe("normalizeCurrentWeather", () => {
  it("maps all fields and converts is_day string to boolean", () => {
    const raw: WeatherStackCurrent = {
      observation_time: "12:30 PM",
      temperature: 21,
      weather_code: 116,
      weather_icons: ["https://example.com/icon.png"],
      weather_descriptions: ["Partly Cloudy"],
      wind_speed: 12,
      wind_degree: 30,
      wind_dir: "NNE",
      pressure: 1017,
      precip: 0,
      humidity: 64,
      cloudcover: 25,
      feelslike: 20,
      uv_index: 4,
      visibility: 10,
      is_day: "yes",
    };

    const result = normalizeCurrentWeather(raw);
    expect(result.temperature).toBe(21);
    expect(result.feelsLike).toBe(20);
    expect(result.description).toBe("Partly Cloudy");
    expect(result.weatherCode).toBe(116);
    expect(result.windSpeed).toBe(12);
    expect(result.windDirection).toBe("NNE");
    expect(result.windDegree).toBe(30);
    expect(result.pressure).toBe(1017);
    expect(result.precipitation).toBe(0);
    expect(result.humidity).toBe(64);
    expect(result.cloudCover).toBe(25);
    expect(result.uvIndex).toBe(4);
    expect(result.visibility).toBe(10);
    expect(result.isDay).toBe(true);
    expect(result.observationTime).toBe("12:30 PM");
    expect(result.iconUrl).toBe("https://example.com/icon.png");
  });

  it("converts is_day 'no' to false", () => {
    const raw: WeatherStackCurrent = {
      observation_time: "10:00 PM",
      temperature: 15,
      weather_code: 113,
      weather_icons: [],
      weather_descriptions: ["Clear"],
      wind_speed: 5,
      wind_degree: 180,
      wind_dir: "S",
      pressure: 1020,
      precip: 0,
      humidity: 70,
      cloudcover: 0,
      feelslike: 14,
      uv_index: 0,
      visibility: 10,
      is_day: "no",
    };

    const result = normalizeCurrentWeather(raw);
    expect(result.isDay).toBe(false);
    expect(result.description).toBe("Clear");
  });
});

describe("formatTemp", () => {
  it('returns "17°C" for metric', () => {
    expect(formatTemp(17, "m")).toBe("17°C");
  });

  it('returns "63°F" for fahrenheit', () => {
    expect(formatTemp(63, "f")).toBe("63°F");
  });

  it('returns "290K" for scientific', () => {
    expect(formatTemp(290, "s")).toBe("290K");
  });

  it("rounds fractional temperatures", () => {
    expect(formatTemp(17.6, "m")).toBe("18°C");
    expect(formatTemp(17.3, "m")).toBe("17°C");
  });
});

describe("formatWind", () => {
  it("includes speed + direction with correct unit", () => {
    expect(formatWind(12, "N", "m")).toBe("12 km/h N");
    expect(formatWind(12, "N", "f")).toBe("12 mph N");
  });
});

describe("formatPrecip", () => {
  it("formats with correct unit", () => {
    expect(formatPrecip(0, "m")).toBe("0 mm");
    expect(formatPrecip(1.5, "f")).toBe("1.5 in");
  });
});

describe("formatPressure", () => {
  it("formats with mb unit", () => {
    expect(formatPressure(1017, "m")).toBe("1017 mb");
  });
});

describe("getDayOfWeek", () => {
  it("returns 3-letter uppercase abbreviation", () => {
    // 2026-02-23 is a Monday
    expect(getDayOfWeek("2026-02-23")).toBe("MON");
    // 2026-02-24 is a Tuesday
    expect(getDayOfWeek("2026-02-24")).toBe("TUE");
  });
});

describe("getDateLabel", () => {
  it("returns 'Today' for today's date", () => {
    const today = getDateOffset(0);
    expect(getDateLabel(today)).toBe("Today");
  });

  it("returns 'Tomorrow' for tomorrow's date", () => {
    const tomorrow = getDateOffset(1);
    expect(getDateLabel(tomorrow)).toBe("Tomorrow");
  });

  it("returns 'Yesterday' for yesterday's date", () => {
    const yesterday = getDateOffset(-1);
    expect(getDateLabel(yesterday)).toBe("Yesterday");
  });

  it("returns full day name for other dates", () => {
    const farDate = getDateOffset(5);
    const result = getDateLabel(farDate);
    // Should be a day name like "Monday", "Tuesday", etc.
    expect(result).toMatch(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/);
  });
});

describe("formatDate", () => {
  it("returns formatted date string", () => {
    const result = formatDate("2026-02-23");
    // Should be something like "Mon, Feb 23"
    expect(result).toContain("Mon");
    expect(result).toContain("Feb");
    expect(result).toContain("23");
  });
});

describe("getDateOffset", () => {
  it("returns ISO date string for today when offset is 0", () => {
    const result = getDateOffset(0);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("returns correct date for positive offset", () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const expected = tomorrow.toISOString().split("T")[0];
    expect(getDateOffset(1)).toBe(expected);
  });

  it("returns correct date for negative offset", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const expected = yesterday.toISOString().split("T")[0];
    expect(getDateOffset(-1)).toBe(expected);
  });
});

describe("getWeatherIconName", () => {
  it("maps clear day (113) to Sun", () => {
    expect(getWeatherIconName(113, true)).toBe("Sun");
  });

  it("maps clear night (113) to Moon", () => {
    expect(getWeatherIconName(113, false)).toBe("Moon");
  });

  it("maps partly cloudy day (116) to CloudSun", () => {
    expect(getWeatherIconName(116, true)).toBe("CloudSun");
  });

  it("maps partly cloudy night (116) to CloudMoon", () => {
    expect(getWeatherIconName(116, false)).toBe("CloudMoon");
  });

  it("maps cloudy (119) to Cloud", () => {
    expect(getWeatherIconName(119, true)).toBe("Cloud");
  });

  it("maps thunder (200) to CloudLightning", () => {
    expect(getWeatherIconName(200, true)).toBe("CloudLightning");
  });

  it("maps snow (227) to Snowflake", () => {
    expect(getWeatherIconName(227, true)).toBe("Snowflake");
  });

  it('returns "Cloud" fallback for unknown codes', () => {
    expect(getWeatherIconName(999, true)).toBe("Cloud");
  });
});

describe("buildLocationQuery", () => {
  it('returns "fetch:ip" for auto', () => {
    expect(buildLocationQuery("anything", "auto")).toBe("fetch:ip");
  });

  it("returns raw string for city", () => {
    expect(buildLocationQuery("Pretoria", "city")).toBe("Pretoria");
  });

  it("returns trimmed string for zip", () => {
    expect(buildLocationQuery("  10001  ", "zip")).toBe("10001");
  });

  it("returns raw coordinates for coordinates", () => {
    expect(buildLocationQuery("40.71,-74.00", "coordinates")).toBe("40.71,-74.00");
  });

  it("returns IP string for ip type", () => {
    expect(buildLocationQuery("153.65.8.20", "ip")).toBe("153.65.8.20");
  });
});
