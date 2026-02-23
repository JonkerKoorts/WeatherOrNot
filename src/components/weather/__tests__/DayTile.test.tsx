import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/test-utils";
import { DayTile } from "@/components/weather/DayTile";
import { mockForecastDay } from "@/test/mocks/weather-data";

describe("DayTile", () => {
  it("renders day of week, label, temperature, and description", () => {
    render(
      <DayTile day={mockForecastDay} isSelected={false} onClick={() => {}} />,
    );
    expect(screen.getByText("TUE")).toBeInTheDocument();
    expect(screen.getByText("Tomorrow")).toBeInTheDocument();
    expect(screen.getByText("23°C")).toBeInTheDocument();
    expect(screen.getByText("Partly Cloudy")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(
      <DayTile day={mockForecastDay} isSelected={false} onClick={onClick} />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledWith(mockForecastDay);
  });

  it("calls onClick when Enter is pressed", async () => {
    const onClick = vi.fn();
    render(
      <DayTile day={mockForecastDay} isSelected={false} onClick={onClick} />,
    );
    screen.getByRole("button").focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledWith(mockForecastDay);
  });

  it("calls onClick when Space is pressed", async () => {
    const onClick = vi.fn();
    render(
      <DayTile day={mockForecastDay} isSelected={false} onClick={onClick} />,
    );
    screen.getByRole("button").focus();
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledWith(mockForecastDay);
  });

  it("applies selected visual state when isSelected is true", () => {
    render(
      <DayTile day={mockForecastDay} isSelected={true} onClick={() => {}} />,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button.className).toContain("ring-2");
  });

  it("does not apply selected state when isSelected is false", () => {
    render(
      <DayTile day={mockForecastDay} isSelected={false} onClick={() => {}} />,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button.className).not.toContain("ring-2");
  });

  it("shows '(simulated)' label when day.isSimulated is true", () => {
    render(
      <DayTile day={mockForecastDay} isSelected={false} onClick={() => {}} />,
    );
    expect(screen.getByText("(simulated)")).toBeInTheDocument();
  });

  it("has role='button' and aria-pressed attribute", () => {
    render(
      <DayTile day={mockForecastDay} isSelected={false} onClick={() => {}} />,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed");
  });
});
