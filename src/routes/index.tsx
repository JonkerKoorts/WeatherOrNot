import { createFileRoute } from "@tanstack/react-router";
import { Cloud } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <Cloud className="size-16 text-primary" />
      <h1 className="mt-4 font-mono text-4xl font-bold text-primary">
        WeatherOrNot
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Your retro weather dashboard — coming in Commit 4.
      </p>
    </div>
  );
}
