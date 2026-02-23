import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";

export const Route = createFileRoute("/history/$location")({
  component: HistoryPage,
});

function HistoryPage() {
  const { location } = Route.useParams();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <History className="size-16 text-primary" />
      <h1 className="mt-4 text-2xl font-bold">
        3-Day History: {decodeURIComponent(location)}
      </h1>
      <p className="mt-2 text-muted-foreground">
        History detail coming in Commit 6.
      </p>
    </div>
  );
}
