import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Thermometer,
  Wind,
  Droplets,
  Gauge,
  CloudRain,
  Sun,
  Cloud,
  ThermometerSnowflake,
} from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import {
  formatTemp,
  formatWind,
  formatPrecip,
  formatPressure,
  formatDate,
} from "@/lib/weather-utils";
import type { DayWeather } from "@/types/weather";

interface WeatherDetailProps {
  day: DayWeather;
}

export const WeatherDetail = memo(function WeatherDetail({ day }: WeatherDetailProps) {
  const { settings } = useSettings();

  const metrics = [
    {
      icon: Thermometer,
      label: "High",
      value: formatTemp(day.tempHigh, settings.units),
    },
    {
      icon: ThermometerSnowflake,
      label: "Low",
      value: formatTemp(day.tempLow, settings.units),
    },
    {
      icon: Wind,
      label: "Wind",
      value: formatWind(day.windSpeed, day.windDirection, settings.units),
    },
    {
      icon: CloudRain,
      label: "Precip",
      value: formatPrecip(day.precipitation, settings.units),
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: formatPressure(day.pressure, settings.units),
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${day.humidity}%`,
    },
    {
      icon: Cloud,
      label: "Clouds",
      value: `${day.cloudCover}%`,
    },
    {
      icon: Sun,
      label: "UV Index",
      value: String(day.uvIndex),
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
        Day Details: {formatDate(day.date)}
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border">
            <CardContent className="flex flex-col items-center gap-1 p-3">
              <metric.icon className="size-4 text-primary" />
              <span className="text-xs text-muted-foreground">
                {metric.label}
              </span>
              <span className="font-mono text-sm font-semibold" data-weather-value>
                {metric.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});
