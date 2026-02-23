import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <div>{/* Here is where the home page components need to come */}</div>;
}
