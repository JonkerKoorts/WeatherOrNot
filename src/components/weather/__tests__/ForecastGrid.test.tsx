import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { ForecastGrid } from "@/components/weather/ForecastGrid";
import { createMockForecast } from "@/test/mocks/weather-data";

// Mock TanStack Router's Link
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: { children: React.ReactNode; to: string }) => (
    <a href={props.to}>{children}</a>
  ),
}));

describe("ForecastGrid", () => {
  const forecast = createMockForecast();

  it("renders exactly 3 forecast DayTiles", () => {
    render(
      <ForecastGrid
        forecast={forecast}
        location="Pretoria"
        selectedDay={null}
        onSelectDay={() => {}}
      />,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("renders '3-Day Forecast' heading", () => {
    render(
      <ForecastGrid
        forecast={forecast}
        location="Pretoria"
        selectedDay={null}
        onSelectDay={() => {}}
      />,
    );
    expect(screen.getByText("3-Day Forecast")).toBeInTheDocument();
  });

  it("shows correct temperatures for each tile", () => {
    render(
      <ForecastGrid
        forecast={forecast}
        location="Pretoria"
        selectedDay={null}
        onSelectDay={() => {}}
      />,
    );
    expect(screen.getByText("23°C")).toBeInTheDocument();
    expect(screen.getByText("25°C")).toBeInTheDocument();
    expect(screen.getByText("20°C")).toBeInTheDocument();
  });

  it("shows View All link", () => {
    render(
      <ForecastGrid
        forecast={forecast}
        location="Pretoria"
        selectedDay={null}
        onSelectDay={() => {}}
      />,
    );
    expect(screen.getByText("View All")).toBeInTheDocument();
  });

  it("returns null when forecast is empty", () => {
    const { container } = render(
      <ForecastGrid
        forecast={[]}
        location="Pretoria"
        selectedDay={null}
        onSelectDay={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
