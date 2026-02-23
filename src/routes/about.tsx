import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Info className="size-6 text-primary" />
        <h1 className="text-2xl font-bold">About WeatherOrNot</h1>
      </div>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">About This Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            WeatherOrNot is a{" "}
            <strong className="text-foreground">
              SecuritEase Frontend Software Engineer
            </strong>{" "}
            take-home project, built to demonstrate production-ready frontend
            development with React and TypeScript.
          </p>
          <p>
            The objective is to build a responsive weather application that
            displays current conditions, a 3-day forecast, and 3-day history
            with interactive day selection — all powered by real weather APIs.
          </p>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Technical Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              "React 19",
              "TypeScript",
              "Vite 7",
              "TanStack Router",
              "Tailwind CSS v4",
              "shadcn/ui",
              "Lucide Icons",
              "Vitest",
              "Native Fetch API",
            ].map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Architecture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Dual API Strategy
            </h3>
            <p>
              The app uses{" "}
              <strong className="text-foreground">WeatherStack</strong> for
              real-time current conditions and{" "}
              <strong className="text-foreground">Weatherbit</strong> for 3-day
              forecast data. This leverages the strengths of each API&apos;s
              free tier to deliver the most complete experience.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Simulated History
            </h3>
            <p>
              Since neither API offers free-tier historical data, the app
              generates deterministic history using a seeded PRNG. Values are
              based on current conditions with realistic variance, and the same
              seed always produces the same result — no flickering on
              re-renders.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Service Layer & Caching
            </h3>
            <p>
              API calls go through a service layer with TTL-based localStorage
              caching. Cache duration is user-configurable (15min, 30min, 1hr,
              or disabled). This reduces API calls on the free tier and improves
              perceived performance.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-1 font-semibold text-foreground">
              Settings Context
            </h3>
            <p>
              User preferences (units, language, location type, default
              location, cache TTL) are persisted in localStorage and provided
              via React Context. Both the full Settings page and the Quick
              Settings sheet modify the same state.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Design */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Design Philosophy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">
              Retro-professional aesthetic
            </strong>{" "}
            — clean white base with vibrant blue primary color (OKLCH color
            space), using Inter for body text and JetBrains Mono for all weather
            data values.
          </p>
          <p>
            Built with{" "}
            <strong className="text-foreground">shadcn/ui components</strong>{" "}
            for accessible, composable, and customizable UI primitives. All
            interactive elements support keyboard navigation and include proper
            ARIA attributes.
          </p>
          <p>
            Fully responsive from mobile (375px) through desktop, with
            thoughtful layout shifts — stacked cards on mobile, side-by-side
            grids on wider screens.
          </p>
        </CardContent>
      </Card>

      {/* Trade-offs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trade-offs & Limitations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong className="text-foreground">Free tier constraints</strong>{" "}
              — WeatherStack free plan is HTTP-only and limited to ~100
              requests/month. A Vite dev proxy bridges the HTTP/HTTPS
              mixed-content issue in development.
            </li>
            <li>
              <strong className="text-foreground">Simulated history</strong> —
              Historical weather data requires paid API plans. The deterministic
              simulator provides consistent, realistic-looking data as a
              practical alternative.
            </li>
            <li>
              <strong className="text-foreground">Language support</strong> —
              WeatherStack free tier does not support the language parameter.
              Language selection affects Weatherbit descriptions only.
            </li>
            <li>
              <strong className="text-foreground">Rate limits</strong> —
              Configurable caching mitigates hitting API rate limits, but heavy
              usage may still exhaust free-tier quotas.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* API Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Every user-facing setting is exposed through both the dedicated
            Settings page and the Quick Settings sheet:
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Units</strong> — Metric (°C),
              Scientific (K), Fahrenheit (°F)
            </li>
            <li>
              <strong className="text-foreground">Language</strong> — 40+
              language options for weather descriptions
            </li>
            <li>
              <strong className="text-foreground">Location Types</strong> — City
              name, ZIP code, coordinates, IP, auto-detect
            </li>
            <li>
              <strong className="text-foreground">Cache Management</strong> —
              Configurable TTL with manual clear
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
