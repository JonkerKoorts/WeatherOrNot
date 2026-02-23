import { createFileRoute, Link } from "@tanstack/react-router";
import { Cloud, Thermometer, CalendarDays, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LocationSearch } from "@/components/search/LocationSearch";
import { useSettings } from "@/hooks/use-settings";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  LOCATION_TYPE_LABELS,
  UNIT_LABELS,
  LANGUAGES,
  RECENT_SEARCHES_KEY,
} from "@/lib/constants";
import type { RecentSearch } from "@/types/weather";

export const Route = createFileRoute("/")({
  component: Index,
});

const FEATURES = [
  {
    icon: Thermometer,
    title: "Current Weather",
    description:
      "Real-time weather data for any city, ZIP code, or coordinates worldwide.",
  },
  {
    icon: CalendarDays,
    title: "3-Day Forecast",
    description:
      "Plan ahead with accurate daily forecasts including temperature, wind, and precipitation.",
  },
  {
    icon: History,
    title: "3-Day History",
    description:
      "Review recent weather patterns with simulated historical data based on current conditions.",
  },
] as const;

function Index() {
  const { settings } = useSettings();
  const [recentSearches] = useLocalStorage<RecentSearch[]>(
    RECENT_SEARCHES_KEY,
    [],
  );

  const currentLang = LANGUAGES.find((l) => l.code === settings.language);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-linear-to-b from-primary/5 to-background px-4 py-16 md:py-24"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.623 0.214 259.815 / 0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="container mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Cloud className="mx-auto size-14 text-primary md:size-16" />
            <h1 className="mt-4 font-mono text-4xl font-bold text-primary md:text-5xl">
              WeatherOrNot
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Your window to the skies.
              <br />
              Check weather, rain or shine.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 mt-8 w-full max-w-lg duration-500 [animation-delay:150ms]">
            <LocationSearch size="large" autoFocus />
          </div>

          <div className="animate-in fade-in mt-4 flex flex-wrap items-center justify-center gap-2 duration-500 [animation-delay:300ms]">
            <Link to="/settings">
              <Badge
                variant="secondary"
                className="cursor-pointer transition-colors hover:bg-primary/10"
              >
                {LOCATION_TYPE_LABELS[settings.locationType]}
              </Badge>
            </Link>
            <span className="text-xs text-muted-foreground">•</span>
            <Link to="/settings">
              <Badge
                variant="secondary"
                className="cursor-pointer transition-colors hover:bg-primary/10"
              >
                {settings.units === "m"
                  ? "Metric"
                  : settings.units === "f"
                    ? "Fahrenheit"
                    : "Scientific"}{" "}
                ({UNIT_LABELS[settings.units].temp})
              </Badge>
            </Link>
            <span className="text-xs text-muted-foreground">•</span>
            <Link to="/settings">
              <Badge
                variant="secondary"
                className="cursor-pointer transition-colors hover:bg-primary/10"
              >
                {currentLang?.name ?? "English"}
              </Badge>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Card
              key={feature.title}
              className="animate-in fade-in slide-in-from-bottom-4 border bg-card transition-shadow duration-500 hover:shadow-md"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <feature.icon className="size-10 text-primary" />
                <h2 className="mt-3 text-lg font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Recent Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <Link
                key={`${search.location}-${search.timestamp}`}
                to="/weather/$location"
                params={{ location: encodeURIComponent(search.location) }}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-primary/10 hover:border-primary"
                >
                  {search.displayName}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
