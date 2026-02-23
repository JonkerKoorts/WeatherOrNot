import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, AlertCircle, LayoutGrid, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { useWeather } from "@/hooks/use-weather";
import { useSettings } from "@/hooks/use-settings";
import { WeatherSkeleton } from "@/components/weather/WeatherSkeleton";
import {
  formatTemp,
  formatWind,
  formatPrecip,
  formatPressure,
} from "@/lib/weather-utils";

export const Route = createFileRoute("/forecast/$location")({
  component: ForecastPage,
});

function ForecastPage() {
  const { location: locationParam } = Route.useParams();
  const locationQuery = decodeURIComponent(locationParam);
  const { settings } = useSettings();
  const { forecast, isLoading, error } = useWeather(locationQuery);

  if (isLoading) return <WeatherSkeleton />;

  if (error) {
    return (
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-16">
        <AlertCircle className="size-12 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <Link
        to="/weather/$location"
        params={{ location: locationParam }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">
          3-Day Forecast for {locationQuery}
        </h1>
        <Badge variant="secondary" className="text-xs">
          Simulated Data
        </Badge>
      </div>

      {forecast.length === 0 ? (
        <p className="text-muted-foreground">No forecast data available.</p>
      ) : (
        <Tabs defaultValue="grid">
          <TabsList>
            <TabsTrigger value="grid" className="gap-1.5">
              <LayoutGrid className="size-3.5" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-1.5">
              <List className="size-3.5" />
              List
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {forecast.map((day) => (
                <Card key={day.date}>
                  <CardContent className="flex flex-col items-center gap-2 p-6">
                    <span className="text-sm font-semibold uppercase">
                      {day.label}
                    </span>
                    <WeatherIcon
                      weatherCode={day.weatherCode}
                                            className="size-10 text-primary"
                    />
                    <span className="font-mono text-2xl font-bold" data-weather-value>
                      {formatTemp(day.temperature, settings.units)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {day.description}
                    </span>
                    <div className="mt-2 w-full space-y-1 text-xs">
                      <DetailLine
                        label="H / L"
                        value={`${formatTemp(day.tempHigh, settings.units)} / ${formatTemp(day.tempLow, settings.units)}`}
                      />
                      <DetailLine
                        label="Wind"
                        value={formatWind(day.windSpeed, day.windDirection, settings.units)}
                      />
                      <DetailLine
                        label="Precip"
                        value={formatPrecip(day.precipitation, settings.units)}
                      />
                      <DetailLine label="Humidity" value={`${day.humidity}%`} />
                      <DetailLine
                        label="Pressure"
                        value={formatPressure(day.pressure, settings.units)}
                      />
                      <DetailLine label="UV" value={String(day.uvIndex)} />
                      <DetailLine
                        label="Clouds"
                        value={`${day.cloudCover}%`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-4 space-y-3">
            {forecast.map((day) => (
              <Card key={day.date}>
                <CardContent className="flex items-center gap-4 p-4">
                  <WeatherIcon
                    weatherCode={day.weatherCode}
                                        className="size-8 shrink-0 text-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {day.label} ({day.dayOfWeek})
                      </span>
                      <span className="font-mono text-lg font-bold" data-weather-value>
                        {formatTemp(day.temperature, settings.units)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {day.description}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>
                        H:{formatTemp(day.tempHigh, settings.units)} L:
                        {formatTemp(day.tempLow, settings.units)}
                      </span>
                      <span>
                        Wind:{formatWind(day.windSpeed, day.windDirection, settings.units)}
                      </span>
                      <span>
                        Precip:{formatPrecip(day.precipitation, settings.units)}
                      </span>
                      <span>Humidity:{day.humidity}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium" data-weather-value>
        {value}
      </span>
    </div>
  );
}
