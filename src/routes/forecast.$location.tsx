import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";

export const Route = createFileRoute("/forecast/$location")({
  component: ForecastPage,
});

function ForecastPage() {
  const { location } = Route.useParams();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <CalendarDays className="size-16 text-primary" />
      <h1 className="mt-4 text-2xl font-bold">
        3-Day Forecast: {decodeURIComponent(location)}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Forecast detail coming in Commit 6.
      </p>
    </div>
  );
}
