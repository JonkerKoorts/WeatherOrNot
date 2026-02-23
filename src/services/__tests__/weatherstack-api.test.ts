import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchCurrentWeather } from "@/services/weatherstack-api";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { clearAllCache } from "@/lib/cache";
import type { AppSettings, WeatherStackResponse } from "@/types/weather";

const mockResponse: WeatherStackResponse = {
  request: { type: "City", query: "Pretoria, South Africa", language: "en", unit: "m" },
  location: {
    name: "Pretoria",
    country: "South Africa",
    region: "Gauteng",
    lat: "-25.747",
    lon: "28.188",
    timezone_id: "Africa/Johannesburg",
    localtime: "2026-02-23 14:30",
    localtime_epoch: 1771937400,
    utc_offset: "2.0",
  },
  current: {
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
  },
};

const settings: AppSettings = { ...DEFAULT_SETTINGS };

function clearLocalStorage() {
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    localStorage.removeItem(key);
  }
}

beforeEach(() => {
  clearLocalStorage();
  clearAllCache();
  vi.stubGlobal("fetch", vi.fn());
  vi.stubEnv("VITE_WEATHERSTACK_ACCESS_KEY", "test-key");
  vi.stubEnv("VITE_WEATHERSTACK_BASE_URL", "http://api.weatherstack.com");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("fetchCurrentWeather", () => {
  it("calls fetch with correct URL including access_key, query, and units", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchCurrentWeather("Pretoria", settings);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("access_key=test-key");
    expect(url).toContain("query=Pretoria");
    expect(url).toContain("units=m");
  });

  it("normalizes WeatherStack response to CurrentWeather type correctly", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await fetchCurrentWeather("Pretoria", settings);
    expect(result.current.temperature).toBe(21);
    expect(result.current.description).toBe("Partly Cloudy");
    expect(result.current.isDay).toBe(true);
    expect(result.location.name).toBe("Pretoria");
    expect(result.location.region).toBe("Gauteng");
  });

  it("returns cached data when available (avoids API call)", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    vi.stubGlobal("fetch", mockFetch);

    // First call — hits API
    await fetchCurrentWeather("Pretoria", settings);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Second call — should use cache
    await fetchCurrentWeather("Pretoria", settings);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("handles WeatherStack error responses (success: false)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            error: { code: 615, type: "request_failed", info: "Your API request failed." },
          }),
      }),
    );

    await expect(fetchCurrentWeather("InvalidCity", settings)).rejects.toThrow(
      "WeatherStack error (615)",
    );
  });

  it("handles network failures gracefully", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    await expect(fetchCurrentWeather("Pretoria", settings)).rejects.toThrow("Network error");
  });

  it("throws when access key env var is missing", async () => {
    vi.stubEnv("VITE_WEATHERSTACK_ACCESS_KEY", "");

    await expect(fetchCurrentWeather("Pretoria", settings)).rejects.toThrow(
      "WeatherStack access key is not configured",
    );
  });
});
