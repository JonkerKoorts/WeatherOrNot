import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Built with React, TypeScript &amp; WeatherStack API
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              to="/about"
              className="transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              to="/settings"
              className="transition-colors hover:text-foreground"
            >
              Settings
            </Link>
            <span>&copy; {new Date().getFullYear()} WeatherOrNot</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
