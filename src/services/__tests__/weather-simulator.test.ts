import { describe, it, expect } from "vitest";
import {
  generateHistory,
  generateForecast,
  currentToDay,
} from "@/services/weather-simulator";
import { mockCurrentWeather } from "@/test/mocks/weather-data";
import { SIMULATION_VARIANCE } from "@/lib/constants";
import { getDateOffset } from "@/lib/weather-utils";

describe("generateHistory", () => {
  it("returns exactly 3 DayWeather objects", () => {
    const result = generateHistory(mockCurrentWeather, "Pretoria");
    expect(result).toHaveLength(3);
  });

  it("history dates are -3, -2, -1 days from today (ordered oldest first)", () => {
    const result = generateHistory(mockCurrentWeather, "Pretoria");
    expect(result[0].date).toBe(getDateOffset(-3));
    expect(result[1].date).toBe(getDateOffset(-2));
    expect(result[2].date).toBe(getDateOffset(-1));
  });

  it('all generated days have isSimulated: true and type: "history"', () => {
    const result = generateHistory(mockCurrentWeather, "Pretoria");
    for (const day of result) {
      expect(day.isSimulated).toBe(true);
      expect(day.type).toBe("history");
    }
  });

  it("generated temperatures are within SIMULATION_VARIANCE.TEMP of base", () => {
    const result = generateHistory(mockCurrentWeather, "Pretoria");
    for (const day of result) {
      const diff = Math.abs(day.temperature - mockCurrentWeather.temperature);
      // Allow for rounding and clamping — variance is applied then clamped
      expect(diff).toBeLessThanOrEqual(SIMULATION_VARIANCE.TEMP + 1);
    }
  });

  it("generated wind speeds are non-negative", () => {
    const result = generateHistory(mockCurrentWeather, "Pretoria");
    for (const day of result) {
      expect(day.windSpeed).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("generateForecast", () => {
  it("returns exactly 3 DayWeather objects", () => {
    const result = generateForecast(mockCurrentWeather, "Pretoria");
    expect(result).toHaveLength(3);
  });

  it("forecast dates are +1, +2, +3 days from today", () => {
    const result = generateForecast(mockCurrentWeather, "Pretoria");
    expect(result[0].date).toBe(getDateOffset(1));
    expect(result[1].date).toBe(getDateOffset(2));
    expect(result[2].date).toBe(getDateOffset(3));
  });

  it('all generated days have isSimulated: true and type: "forecast"', () => {
    const result = generateForecast(mockCurrentWeather, "Pretoria");
    for (const day of result) {
      expect(day.isSimulated).toBe(true);
      expect(day.type).toBe("forecast");
    }
  });
});

describe("currentToDay", () => {
  it("wraps current weather as today with isSimulated: false", () => {
    const result = currentToDay(mockCurrentWeather);
    expect(result.temperature).toBe(mockCurrentWeather.temperature);
    expect(result.description).toBe(mockCurrentWeather.description);
    expect(result.windSpeed).toBe(mockCurrentWeather.windSpeed);
    expect(result.label).toBe("Today");
    expect(result.isSimulated).toBe(false);
    expect(result.type).toBe("current");
  });

  it("sets today's date", () => {
    const result = currentToDay(mockCurrentWeather);
    expect(result.date).toBe(getDateOffset(0));
  });

  it("computes tempHigh and tempLow from temperature", () => {
    const result = currentToDay(mockCurrentWeather);
    expect(result.tempHigh).toBe(mockCurrentWeather.temperature + 3);
    expect(result.tempLow).toBe(mockCurrentWeather.temperature - 3);
  });
});

describe("determinism", () => {
  it("same seed produces identical results", () => {
    const result1 = generateHistory(mockCurrentWeather, "Pretoria");
    const result2 = generateHistory(mockCurrentWeather, "Pretoria");

    for (let i = 0; i < 3; i++) {
      expect(result1[i].temperature).toBe(result2[i].temperature);
      expect(result1[i].windSpeed).toBe(result2[i].windSpeed);
      expect(result1[i].pressure).toBe(result2[i].pressure);
      expect(result1[i].precipitation).toBe(result2[i].precipitation);
    }
  });

  it("different locations produce different results", () => {
    const result1 = generateHistory(mockCurrentWeather, "Pretoria");
    const result2 = generateHistory(mockCurrentWeather, "Tokyo");

    // At least one value should differ
    const allSame = result1.every(
      (day, i) =>
        day.temperature === result2[i].temperature &&
        day.windSpeed === result2[i].windSpeed,
    );
    expect(allSame).toBe(false);
  });
});
