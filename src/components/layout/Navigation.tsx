import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface NavigationProps {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
}

const baseLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/settings", label: "Settings" },
] as const;

export function Navigation({
  orientation = "horizontal",
  onNavigate,
}: NavigationProps) {
  const isVertical = orientation === "vertical";

  return (
    <nav
      className={cn(
        "flex gap-1",
        isVertical ? "flex-col" : "flex-row items-center",
      )}
    >
      {baseLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "text-muted-foreground hover:text-foreground hover:bg-accent",
            isVertical && "w-full",
          )}
          activeProps={{
            className: "text-primary font-semibold bg-primary/5",
          }}
          activeOptions={{ exact: link.to === "/" }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
