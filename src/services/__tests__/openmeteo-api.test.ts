import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchOpenMeteoWeather } from "@/services/openmeteo-api";
import { clearAllCache } from "@/lib/cache";

function clearLocalStorage() {
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    localStorage.removeItem(key);
  }
}

// Build a realistic Open-Meteo response
function buildOpenMeteoResponse(todayStr: string) {
  const dates: string[] = [];
  const today = new Date(todayStr);
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  // Build hourly timestamps (24 per day)
  const hourlyTimes: string[] = [];
  const pressures: number[] = [];
  const humidities: number[] = [];
  const clouds: number[] = [];

  for (const date of dates) {
    for (let h = 0; h < 24; h++) {
      hourlyTimes.push(`${date}T${String(h).padStart(2, "0")}:00`);
      pressures.push(1013);
      humidities.push(60);
      clouds.push(30);
    }
  }

  return {
    daily: {
      time: dates,
      temperature_2m_max: [25, 26, 27, 28, 29, 30, 31],
      temperature_2m_min: [15, 16, 17, 18, 19, 20, 21],
      precipitation_sum: [0, 0.5, 1.0, 0, 0.2, 0, 0],
      wind_speed_10m_max: [10, 12, 15, 8, 11, 14, 9],
      wind_direction_10m_dominant: [180, 90, 270, 45, 135, 225, 315],
      weather_code: [0, 2, 61, 3, 1, 51, 95],
      uv_index_max: [5, 6, 3, 4, 7, 2, 8],
    },
    hourly: {
      time: hourlyTimes,
      surface_pressure: pressures,
      relative_humidity_2m: humidities,
      cloud_cover: clouds,
    },
  };
}

beforeEach(() => {
  clearLocalStorage();
  clearAllCache();
  vi.stubGlobal("fetch", vi.fn());
  // Mock today's date for consistent test results
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-02-25T12:00:00Z"));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("fetchOpenMeteoWeather", () => {
  it("fetches and returns today, forecast, and history arrays", async () => {
    const todayStr = "2026-02-25";
    const mockData = buildOpenMeteoResponse(todayStr);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const result = await fetchOpenMeteoWeather(-25.74, 28.19, "m", 1800000);

    expect(result.today).toBeDefined();
    expect(result.today.type).toBe("current");
    expect(result.forecast).toHaveLength(3);
    expect(result.history).toHaveLength(3);

    // All forecast days should have type "forecast"
    for (const day of result.forecast) {
      expect(day.type).toBe("forecast");
      expect(day.isSimulated).toBe(false);
    }

    // All history days should have type "history"
    for (const day of result.history) {
      expect(day.type).toBe("history");
      expect(day.isSimulated).toBe(false);
    }
  });

  it("builds correct URL with metric units", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(buildOpenMeteoResponse("2026-02-25")),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchOpenMeteoWeather(-25.74, 28.19, "m", 1800000);

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("latitude=-25.74");
    expect(url).toContain("longitude=28.19");
    expect(url).toContain("past_days=3");
    expect(url).toContain("forecast_days=4");
    expect(url).not.toContain("temperature_unit=fahrenheit");
  });

  it("adds Fahrenheit units when units=f", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(buildOpenMeteoResponse("2026-02-25")),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchOpenMeteoWeather(-25.74, 28.19, "f", 1800000);

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("temperature_unit=fahrenheit");
    expect(url).toContain("wind_speed_unit=mph");
    expect(url).toContain("precipitation_unit=inch");
  });

  it("converts to Kelvin when units=s", async () => {
    const mockData = buildOpenMeteoResponse("2026-02-25");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const result = await fetchOpenMeteoWeather(-25.74, 28.19, "s", 1800000);

    // Scientific units add 273.15 to Celsius values
    // Today is index 3 in the 7-day array: max=28, min=18, avg=23 → 296K
    expect(result.today.temperature).toBeGreaterThan(270);
    expect(result.today.tempHigh).toBeGreaterThan(270);
    expect(result.today.tempLow).toBeGreaterThan(270);
  });

  it("returns cached data when available", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(buildOpenMeteoResponse("2026-02-25")),
    });
    vi.stubGlobal("fetch", mockFetch);

    // First call — hits API
    await fetchOpenMeteoWeather(-25.74, 28.19, "m", 1800000);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Second call — should use cache
    await fetchOpenMeteoWeather(-25.74, 28.19, "m", 1800000);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("skips caching when cacheTtlMs is 0", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(buildOpenMeteoResponse("2026-02-25")),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchOpenMeteoWeather(-25.74, 28.19, "m", 0);
    await fetchOpenMeteoWeather(-25.74, 28.19, "m", 0);

    // Both calls should hit the API since caching is disabled
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("throws on non-OK response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      }),
    );

    await expect(
      fetchOpenMeteoWeather(-25.74, 28.19, "m", 1800000),
    ).rejects.toThrow("Open-Meteo API error: 500 Internal Server Error");
  });

  it("maps WMO weather codes to descriptions", async () => {
    const mockData = buildOpenMeteoResponse("2026-02-25");
    // WMO code 0 at index 0 → "Clear Sky"
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const result = await fetchOpenMeteoWeather(-25.74, 28.19, "m", 1800000);

    // History days should have mapped descriptions
    const allDescriptions = [
      ...result.history.map((d) => d.description),
      result.today.description,
      ...result.forecast.map((d) => d.description),
    ];

    // All descriptions should be non-empty strings
    for (const desc of allDescriptions) {
      expect(desc).toBeTruthy();
      expect(typeof desc).toBe("string");
    }
  });

  it("computes daily averages from hourly data", async () => {
    const mockData = buildOpenMeteoResponse("2026-02-25");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const result = await fetchOpenMeteoWeather(-25.74, 28.19, "m", 1800000);

    // All days should have pressure, humidity, and cloudCover
    for (const day of [...result.history, result.today, ...result.forecast]) {
      expect(day.pressure).toBeDefined();
      expect(day.humidity).toBeDefined();
      expect(day.cloudCover).toBeDefined();
      expect(typeof day.pressure).toBe("number");
      expect(typeof day.humidity).toBe("number");
      expect(typeof day.cloudCover).toBe("number");
    }
  });

  it("populates dayOfWeek and label for each day", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(buildOpenMeteoResponse("2026-02-25")),
      }),
    );

    const result = await fetchOpenMeteoWeather(-25.74, 28.19, "m", 1800000);

    expect(result.today.label).toBe("Today");

    for (const day of [...result.history, result.today, ...result.forecast]) {
      expect(day.dayOfWeek).toMatch(/^[A-Z]{3}$/);
      expect(day.label).toBeTruthy();
      expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("supports abort signal", async () => {
    const controller = new AbortController();
    controller.abort();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError")),
    );

    await expect(
      fetchOpenMeteoWeather(-25.74, 28.19, "m", 1800000, controller.signal),
    ).rejects.toThrow();
  });
});
