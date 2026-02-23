import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { useSettings } from "@/hooks/use-settings";
import {
  formatTemp,
  formatWind,
  formatPrecip,
  formatPressure,
} from "@/lib/weather-utils";
import type { CurrentWeather, DayWeather, LocationInfo } from "@/types/weather";
import { ArrowLeft } from "lucide-react";

interface WeatherCardProps {
  current: CurrentWeather;
  location: LocationInfo;
  selectedDay: DayWeather | null;
  onClearSelection: () => void;
}

export function WeatherCard({
  current,
  location,
  selectedDay,
  onClearSelection,
}: WeatherCardProps) {
  const { settings } = useSettings();

  // Show selected day data or current weather
  const isShowingDay = selectedDay !== null;
  const temp = isShowingDay ? selectedDay.temperature : current.temperature;
  const description = isShowingDay
    ? selectedDay.description
    : current.description;
  const weatherCode = isShowingDay
    ? selectedDay.weatherCode
    : current.weatherCode;
  const windSpeed = isShowingDay ? selectedDay.windSpeed : current.windSpeed;
  const windDir = isShowingDay
    ? selectedDay.windDirection
    : current.windDirection;
  const precip = isShowingDay
    ? selectedDay.precipitation
    : current.precipitation;
  const pressure = isShowingDay ? selectedDay.pressure : current.pressure;
  const humidity = isShowingDay ? selectedDay.humidity : current.humidity;
  const cloudCover = isShowingDay ? selectedDay.cloudCover : current.cloudCover;
  const uvIndex = isShowingDay ? selectedDay.uvIndex : current.uvIndex;
  const isSimulated = isShowingDay && selectedDay.isSimulated;

  const iconSource =
    isShowingDay && selectedDay.type === "forecast"
      ? "weatherbit"
      : "weatherstack";

  return (
    <Card className="animate-in fade-in duration-300">
      <CardContent className="p-6 md:p-8">
        <p className="mb-6 text-center text-lg font-semibold text-muted-foreground">
          {location.name}, {location.region}, {location.country}
        </p>

        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          {/* Icon + description */}
          <div className="flex flex-col items-center gap-2">
            <WeatherIcon
              weatherCode={weatherCode}
              isDay={current.isDay}
              source={iconSource}
              className="size-16 text-primary"
            />
            <span className="text-xl font-medium">{description}</span>
            {isShowingDay && (
              <span className="text-sm text-muted-foreground">
                {selectedDay.label} — {selectedDay.dayOfWeek}
              </span>
            )}
          </div>

          {/* Temperature */}
          <div className="flex flex-col items-center">
            <span
              className="font-mono text-6xl font-bold md:text-7xl"
              data-weather-value
            >
              {formatTemp(temp, settings.units)}
            </span>
            {!isShowingDay && (
              <span className="mt-1 text-sm text-muted-foreground">
                Feels like{" "}
                <span data-weather-value>
                  {formatTemp(current.feelsLike, settings.units)}
                </span>
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <DetailRow
              label="Wind"
              value={formatWind(windSpeed, windDir, settings.units)}
            />
            <DetailRow
              label="Precip"
              value={formatPrecip(precip, settings.units)}
            />
            <DetailRow
              label="Pressure"
              value={formatPressure(pressure, settings.units)}
            />
            <DetailRow label="Humidity" value={`${humidity}%`} />
            <DetailRow label="UV Index" value={String(uvIndex)} />
            <DetailRow label="Cloud Cover" value={`${cloudCover}%`} />
            {!isShowingDay && (
              <DetailRow
                label="Visibility"
                value={`${current.visibility} km`}
              />
            )}
          </div>
        </div>

        {/* Badges and back button */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {isSimulated && (
            <Badge variant="secondary" className="text-xs">
              Simulated Data
            </Badge>
          )}
          {isShowingDay && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-xs"
            >
              <ArrowLeft className="mr-1 size-3" />
              Back to Current
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 md:justify-start">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-mono font-medium" data-weather-value>
        {value}
      </span>
    </div>
  );
}
