import { describe, it, expect } from "vitest";
import { render, screen, userEvent } from "@/test/test-utils";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { DayTile } from "@/components/weather/DayTile";
import {
  mockCurrentWeather,
  mockLocation,
  mockForecastDay,
  mockHistoryDay,
} from "@/test/mocks/weather-data";
import { useState } from "react";
import type { DayWeather } from "@/types/weather";

/**
 * Integration test: verifies interactive day selection between
 * WeatherCard and DayTile components together.
 */
function InteractiveHarness() {
  const [selectedDay, setSelectedDay] = useState<DayWeather | null>(null);

  const forecastDay = { ...mockForecastDay, temperature: 30, label: "Forecast Day" };
  const historyDay = { ...mockHistoryDay, temperature: 15, label: "History Day" };

  return (
    <div>
      <WeatherCard
        current={mockCurrentWeather}
        location={mockLocation}
        selectedDay={selectedDay}
        onClearSelection={() => setSelectedDay(null)}
      />
      <DayTile
        day={forecastDay}
        isSelected={selectedDay?.date === forecastDay.date}
        onClick={setSelectedDay}
      />
      <DayTile
        day={historyDay}
        isSelected={selectedDay?.date === historyDay.date}
        onClick={setSelectedDay}
      />
    </div>
  );
}

describe("InteractiveSelection", () => {
  it("initially shows current weather data in WeatherCard", () => {
    render(<InteractiveHarness />);
    // The main card shows current temp 21°C
    const mainTemp = screen.getByText("21°C");
    expect(mainTemp).toBeInTheDocument();
    expect(mainTemp.className).toContain("text-6xl");
    expect(screen.queryByText("Back to Current")).not.toBeInTheDocument();
  });

  it("clicking a forecast DayTile updates WeatherCard to show that day's data", async () => {
    render(<InteractiveHarness />);
    const buttons = screen.getAllByRole("button");
    const forecastTile = buttons.find((b) => b.textContent?.includes("Forecast Day"));
    await userEvent.click(forecastTile!);

    // The large temperature display should now show 30°C
    const allTemps = screen.getAllByText("30°C");
    // At least one should be the large hero temp in WeatherCard
    const heroTemp = allTemps.find((el) => el.className.includes("text-6xl"));
    expect(heroTemp).toBeDefined();
    expect(screen.getByText("Back to Current")).toBeInTheDocument();
  });

  it("clicking a history DayTile updates WeatherCard to show that day's data", async () => {
    render(<InteractiveHarness />);
    const buttons = screen.getAllByRole("button");
    const historyTile = buttons.find((b) => b.textContent?.includes("History Day"));
    await userEvent.click(historyTile!);

    // The large temperature display should now show 15°C
    const allTemps = screen.getAllByText("15°C");
    const heroTemp = allTemps.find((el) => el.className.includes("text-6xl"));
    expect(heroTemp).toBeDefined();
  });

  it("clicking 'Back to Current' returns WeatherCard to current weather", async () => {
    render(<InteractiveHarness />);
    const buttons = screen.getAllByRole("button");
    const forecastTile = buttons.find((b) => b.textContent?.includes("Forecast Day"));
    await userEvent.click(forecastTile!);

    const allTemps = screen.getAllByText("30°C");
    expect(allTemps.find((el) => el.className.includes("text-6xl"))).toBeDefined();

    await userEvent.click(screen.getByText("Back to Current"));
    expect(screen.getByText("21°C")).toBeInTheDocument();
    expect(screen.queryByText("Back to Current")).not.toBeInTheDocument();
  });

  it("clicking a different tile switches the displayed data", async () => {
    render(<InteractiveHarness />);
    const buttons = screen.getAllByRole("button");
    const forecastTile = buttons.find((b) => b.textContent?.includes("Forecast Day"));
    const historyTile = buttons.find((b) => b.textContent?.includes("History Day"));

    await userEvent.click(forecastTile!);
    let heroTemps = screen.getAllByText("30°C");
    expect(heroTemps.find((el) => el.className.includes("text-6xl"))).toBeDefined();

    await userEvent.click(historyTile!);
    heroTemps = screen.getAllByText("15°C");
    expect(heroTemps.find((el) => el.className.includes("text-6xl"))).toBeDefined();
  });

  it("the previously selected tile loses its selected state when a new one is clicked", async () => {
    render(<InteractiveHarness />);
    const buttons = screen.getAllByRole("button");
    const forecastTile = buttons.find((b) => b.textContent?.includes("Forecast Day"))!;
    const historyTile = buttons.find((b) => b.textContent?.includes("History Day"))!;

    await userEvent.click(forecastTile);
    expect(forecastTile).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(historyTile);
    expect(forecastTile).toHaveAttribute("aria-pressed", "false");
    expect(historyTile).toHaveAttribute("aria-pressed", "true");
  });
});
