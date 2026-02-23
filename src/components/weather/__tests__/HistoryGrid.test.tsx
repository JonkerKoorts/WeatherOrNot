import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { HistoryGrid } from "@/components/weather/HistoryGrid";
import { createMockHistory } from "@/test/mocks/weather-data";

// Mock TanStack Router's Link
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: { children: React.ReactNode; to: string }) => (
    <a href={props.to}>{children}</a>
  ),
}));

describe("HistoryGrid", () => {
  const history = createMockHistory();

  it("renders exactly 3 history DayTiles", () => {
    render(
      <HistoryGrid
        history={history}
        location="Pretoria"
        selectedDay={null}
        onSelectDay={() => {}}
      />,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("renders '3-Day History' heading", () => {
    render(
      <HistoryGrid
        history={history}
        location="Pretoria"
        selectedDay={null}
        onSelectDay={() => {}}
      />,
    );
    expect(screen.getByText("3-Day History")).toBeInTheDocument();
  });

  it("tiles show correct day names", () => {
    render(
      <HistoryGrid
        history={history}
        location="Pretoria"
        selectedDay={null}
        onSelectDay={() => {}}
      />,
    );
    expect(screen.getByText("FRI")).toBeInTheDocument();
    expect(screen.getByText("SAT")).toBeInTheDocument();
    expect(screen.getByText("SUN")).toBeInTheDocument();
  });

  it("shows View All link", () => {
    render(
      <HistoryGrid
        history={history}
        location="Pretoria"
        selectedDay={null}
        onSelectDay={() => {}}
      />,
    );
    expect(screen.getByText("View All")).toBeInTheDocument();
  });

  it("returns null when history is empty", () => {
    const { container } = render(
      <HistoryGrid
        history={[]}
        location="Pretoria"
        selectedDay={null}
        onSelectDay={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
