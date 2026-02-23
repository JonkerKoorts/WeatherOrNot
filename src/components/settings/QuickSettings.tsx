import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/use-settings";
import { LANGUAGES } from "@/lib/constants";
import type { LanguageCode, UnitSystem } from "@/types/weather";

interface QuickSettingsProps {
  children: ReactNode;
}

export function QuickSettings({ children }: QuickSettingsProps) {
  const { settings, updateSettings } = useSettings();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Quick Settings</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Units */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Units</Label>
            <RadioGroup
              value={settings.units}
              onValueChange={(v) =>
                updateSettings({ units: v as UnitSystem })
              }
              className="flex gap-2"
            >
              <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                <RadioGroupItem value="m" id="qs-metric" />
                <Label htmlFor="qs-metric" className="cursor-pointer text-sm">
                  Metric (°C)
                </Label>
              </div>
              <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                <RadioGroupItem value="s" id="qs-scientific" />
                <Label
                  htmlFor="qs-scientific"
                  className="cursor-pointer text-sm"
                >
                  Scientific (K)
                </Label>
              </div>
              <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                <RadioGroupItem value="f" id="qs-fahrenheit" />
                <Label
                  htmlFor="qs-fahrenheit"
                  className="cursor-pointer text-sm"
                >
                  Imperial (°F)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Language */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Language</Label>
            <Select
              value={settings.language}
              onValueChange={(v) =>
                updateSettings({ language: v as LanguageCode })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Default Location */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Default Location</Label>
            <Input
              value={settings.defaultLocation}
              onChange={(e) =>
                updateSettings({ defaultLocation: e.target.value })
              }
              placeholder="e.g. Pretoria"
            />
          </div>

          <Separator />

          {/* Link to full settings */}
          <Link
            to="/settings"
            className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            All Settings
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
