import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <Info className="size-16 text-primary" />
      <h1 className="mt-4 text-2xl font-bold">About WeatherOrNot</h1>
      <p className="mt-2 text-muted-foreground">
        About page coming in Commit 6.
      </p>
    </div>
  );
}
