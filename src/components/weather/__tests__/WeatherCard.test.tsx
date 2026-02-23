import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { mockCurrentWeather, mockLocation, mockForecastDay } from "@/test/mocks/weather-data";

describe("WeatherCard", () => {
  it("renders location name", () => {
    render(
      <WeatherCard
        current={mockCurrentWeather}
        location={mockLocation}
        selectedDay={null}
        onClearSelection={() => {}}
      />,
    );
    expect(screen.getByText(/Pretoria, Gauteng, South Africa/)).toBeInTheDocument();
  });

  it("renders temperature with correct unit formatting", () => {
    render(
      <WeatherCard
        current={mockCurrentWeather}
        location={mockLocation}
        selectedDay={null}
        onClearSelection={() => {}}
      />,
    );
    expect(screen.getByText("21°C")).toBeInTheDocument();
  });

  it("renders temperature in Fahrenheit when units=f", () => {
    render(
      <WeatherCard
        current={mockCurrentWeather}
        location={mockLocation}
        selectedDay={null}
        onClearSelection={() => {}}
      />,
      { settings: { units: "f" } },
    );
    expect(screen.getByText("21°F")).toBeInTheDocument();
  });

  it("renders weather description", () => {
    render(
      <WeatherCard
        current={mockCurrentWeather}
        location={mockLocation}
        selectedDay={null}
        onClearSelection={() => {}}
      />,
    );
    expect(screen.getByText("Partly Cloudy")).toBeInTheDocument();
  });

  it("renders wind, precip, pressure, humidity", () => {
    render(
      <WeatherCard
        current={mockCurrentWeather}
        location={mockLocation}
        selectedDay={null}
        onClearSelection={() => {}}
      />,
    );
    expect(screen.getByText("12 km/h NNE")).toBeInTheDocument();
    expect(screen.getByText("0 mm")).toBeInTheDocument();
    expect(screen.getByText("1017 mb")).toBeInTheDocument();
    expect(screen.getByText("64%")).toBeInTheDocument();
  });

  it("shows 'Simulated Data' badge when displaying a simulated day", () => {
    render(
      <WeatherCard
        current={mockCurrentWeather}
        location={mockLocation}
        selectedDay={mockForecastDay}
        onClearSelection={() => {}}
      />,
    );
    expect(screen.getByText("Simulated Data")).toBeInTheDocument();
  });

  it("shows 'Back to Current' button only when a day is selected", () => {
    const { rerender } = render(
      <WeatherCard
        current={mockCurrentWeather}
        location={mockLocation}
        selectedDay={null}
        onClearSelection={() => {}}
      />,
    );
    expect(screen.queryByText("Back to Current")).not.toBeInTheDocument();

    rerender(
      <WeatherCard
        current={mockCurrentWeather}
        location={mockLocation}
        selectedDay={mockForecastDay}
        onClearSelection={() => {}}
      />,
    );
    expect(screen.getByText("Back to Current")).toBeInTheDocument();
  });

  it("shows selected day data instead of current weather", () => {
    render(
      <WeatherCard
        current={mockCurrentWeather}
        location={mockLocation}
        selectedDay={{ ...mockForecastDay, temperature: 30 }}
        onClearSelection={() => {}}
      />,
    );
    expect(screen.getByText("30°C")).toBeInTheDocument();
  });
});
