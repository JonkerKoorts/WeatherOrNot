import type { KeyboardEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { useSettings } from "@/hooks/use-settings";
import { formatTemp } from "@/lib/weather-utils";
import type { DayWeather } from "@/types/weather";

interface DayTileProps {
  day: DayWeather;
  isSelected: boolean;
  onClick: (day: DayWeather) => void;
}

export function DayTile({ day, isSelected, onClick }: DayTileProps) {
  const { settings } = useSettings();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(day);
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onClick(day)}
      onKeyDown={handleKeyDown}
      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
        isSelected
          ? "scale-[1.02] bg-primary/5 shadow-md ring-2 ring-primary"
          : ""
      }`}
    >
      <CardContent className="flex flex-col items-center gap-1 p-4">
        <span className="text-xs font-medium text-muted-foreground">
          {day.dayOfWeek}
        </span>
        <span className="text-sm font-semibold">{day.label}</span>
        <WeatherIcon
          weatherCode={day.weatherCode}
          className="my-1 size-8 text-primary"
        />
        <span
          className="font-mono text-lg font-bold"
          data-weather-value
        >
          {formatTemp(day.temperature, settings.units)}
        </span>
        <span className="max-w-full truncate text-center text-xs text-muted-foreground">
          {day.description}
        </span>
        {day.isSimulated && (
          <span className="mt-0.5 text-[10px] text-muted-foreground/60 italic">
            (simulated)
          </span>
        )}
      </CardContent>
    </Card>
  );
}
