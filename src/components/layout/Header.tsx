import { useState, useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Cloud, Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "./Navigation";
import { QuickSettings } from "@/components/settings/QuickSettings";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  // Close mobile menu on route change
  useEffect(() => {
    const unsubscribe = router.subscribe("onBeforeNavigate", () => {
      setMobileOpen(false);
    });
    return unsubscribe;
  }, [router]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Cloud className="size-6 text-primary" />
          <span className="font-mono text-lg font-bold text-primary">
            WeatherOrNot
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-2 md:flex">
          <Navigation orientation="horizontal" />
          <QuickSettings>
            <Button variant="ghost" size="icon-sm" aria-label="Quick settings">
              <Settings className="size-4" />
            </Button>
          </QuickSettings>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-1 md:hidden">
          <QuickSettings>
            <Button variant="ghost" size="icon-sm" aria-label="Quick settings">
              <Settings className="size-4" />
            </Button>
          </QuickSettings>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t bg-background px-4 py-3 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <Navigation
            orientation="vertical"
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      )}
    </header>
  );
}
