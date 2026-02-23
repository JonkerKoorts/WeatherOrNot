import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DayTile } from "@/components/weather/DayTile";
import type { DayWeather } from "@/types/weather";

interface ForecastGridProps {
  forecast: DayWeather[];
  location: string;
  selectedDay: DayWeather | null;
  onSelectDay: (day: DayWeather) => void;
}

export function ForecastGrid({
  forecast,
  location,
  selectedDay,
  onSelectDay,
}: ForecastGridProps) {
  if (forecast.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          3-Day Forecast
        </h2>
        <Link
          to="/forecast/$location"
          params={{ location: encodeURIComponent(location) }}
          className="flex items-center gap-1 text-xs text-primary transition-colors hover:underline"
        >
          View All
          <ArrowRight className="size-3" />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {forecast.map((day) => (
          <DayTile
            key={day.date}
            day={day}
            isSelected={selectedDay?.date === day.date}
            onClick={onSelectDay}
          />
        ))}
      </div>
    </div>
  );
}
