import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Cloud, CloudOff } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <TanStackRouterDevtools />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <div className="relative">
        <Cloud className="size-24 text-primary/20" />
        <CloudOff className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-primary" />
      </div>
      <h1 className="mt-6 font-mono text-5xl font-bold text-primary">404</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Looks like this page got lost in the clouds.
      </p>
      <Link to="/" className="mt-8">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});
