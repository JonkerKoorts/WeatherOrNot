import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <Settings className="size-16 text-primary" />
      <h1 className="mt-4 text-2xl font-bold">Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Full settings page coming in Commit 6.
      </p>
    </div>
  );
}
