import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationSearch } from "@/components/search/LocationSearch";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { WeatherDetail } from "@/components/weather/WeatherDetail";
import { WeatherSkeleton } from "@/components/weather/WeatherSkeleton";
import { ForecastGrid } from "@/components/weather/ForecastGrid";
import { HistoryGrid } from "@/components/weather/HistoryGrid";
import { useWeatherData } from "@/hooks/use-weather-data";

export const Route = createFileRoute("/weather/$location")({
  component: WeatherDashboard,
});

function WeatherDashboard() {
  const { location: locationParam } = Route.useParams();
  const locationQuery = decodeURIComponent(locationParam);

  const {
    current,
    location,
    forecast,
    history,
    isLoading,
    error,
    refetch,
    selectedDay,
    selectDay,
    clearSelection,
    displayedWeather,
  } = useWeatherData(locationQuery);

  // Show skeleton only on initial load (no data yet)
  if (isLoading && !current) {
    return <WeatherSkeleton />;
  }

  if (error && !current) {
    return (
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-16">
        <AlertCircle className="size-16 text-destructive" />
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="max-w-md text-center text-muted-foreground">
          {error ?? "Unable to fetch weather data. Please try again."}
        </p>
        <div className="flex gap-3">
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="mr-2 size-4" />
            Try Again
          </Button>
        </div>
        <div className="w-full max-w-md">
          <LocationSearch placeholder="Try a different location..." />
        </div>
      </div>
    );
  }

  if (!current || !location) return <WeatherSkeleton />;

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Search bar */}
      <div className="mx-auto max-w-md">
        <LocationSearch />
      </div>

      {/* Refreshing indicator — shown when revalidating with stale data */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
          <Loader2 className="size-4 animate-spin" />
          <span>Updating weather data...</span>
        </div>
      )}

      {/* Stale data error banner */}
      {error && current && (
        <div className="flex items-center justify-center gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>Failed to refresh: {error}</span>
          <Button variant="ghost" size="sm" onClick={refetch} className="ml-2 h-7 text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* Main weather card */}
      <WeatherCard
        current={current}
        location={location}
        selectedDay={selectedDay.day}
        onClearSelection={clearSelection}
      />

      {/* Expanded day detail (shows current day by default) */}
      {displayedWeather && <WeatherDetail day={displayedWeather} />}

      {/* History + Forecast grids */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <HistoryGrid
          history={history}
          location={locationQuery}
          selectedDay={selectedDay.day}
          onSelectDay={selectDay}
        />
        <ForecastGrid
          forecast={forecast}
          location={locationQuery}
          selectedDay={selectedDay.day}
          onSelectDay={selectDay}
        />
      </div>
    </div>
  );
}
