import { createFileRoute } from "@tanstack/react-router";
import { CloudSun } from "lucide-react";

export const Route = createFileRoute("/weather/$location")({
  component: WeatherDashboard,
});

function WeatherDashboard() {
  const { location } = Route.useParams();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <CloudSun className="size-16 text-primary" />
      <h1 className="mt-4 text-2xl font-bold">
        Weather for {decodeURIComponent(location)}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Dashboard coming in Commit 5.
      </p>
    </div>
  );
}
