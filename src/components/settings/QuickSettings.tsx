import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Thermometer, Globe, MapPin } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { LANGUAGES, UNIT_LABELS } from "@/lib/constants";
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
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="text-lg">Quick Settings</SheetTitle>
          <SheetDescription>
            Adjust common preferences. Visit All Settings for full
            configuration.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-6 pb-6">
          {/* Units */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Thermometer className="size-4 text-muted-foreground" />
              <Label className="text-sm font-medium">
                Temperature & Units
              </Label>
            </div>
            <RadioGroup
              value={settings.units}
              onValueChange={(v) =>
                updateSettings({ units: v as UnitSystem })
              }
              className="space-y-2"
            >
              <label
                htmlFor="qs-metric"
                className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors has-checked:border-primary has-checked:bg-primary/5"
              >
                <RadioGroupItem value="m" id="qs-metric" className="mt-0.5" />
                <div>
                  <span className="text-sm font-medium">Metric</span>
                  <p className="text-xs text-muted-foreground">
                    {UNIT_LABELS.m.temp}, {UNIT_LABELS.m.wind},{" "}
                    {UNIT_LABELS.m.precip}, {UNIT_LABELS.m.pressure}
                  </p>
                </div>
              </label>
              <label
                htmlFor="qs-scientific"
                className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors has-checked:border-primary has-checked:bg-primary/5"
              >
                <RadioGroupItem
                  value="s"
                  id="qs-scientific"
                  className="mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium">Scientific</span>
                  <p className="text-xs text-muted-foreground">
                    {UNIT_LABELS.s.temp}, {UNIT_LABELS.s.wind},{" "}
                    {UNIT_LABELS.s.precip}, {UNIT_LABELS.s.pressure}
                  </p>
                </div>
              </label>
              <label
                htmlFor="qs-imperial"
                className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors has-checked:border-primary has-checked:bg-primary/5"
              >
                <RadioGroupItem
                  value="f"
                  id="qs-imperial"
                  className="mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium">Imperial</span>
                  <p className="text-xs text-muted-foreground">
                    {UNIT_LABELS.f.temp}, {UNIT_LABELS.f.wind},{" "}
                    {UNIT_LABELS.f.precip}, {UNIT_LABELS.f.pressure}
                  </p>
                </div>
              </label>
            </RadioGroup>
          </div>

          <Separator />

          {/* Language */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-muted-foreground" />
              <Label className="text-sm font-medium">
                Weather Description Language
              </Label>
            </div>
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
            <p className="text-xs text-muted-foreground">
              Language used for weather condition descriptions.
            </p>
          </div>

          <Separator />

          {/* Default Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Default Location</Label>
            </div>
            <Input
              value={settings.defaultLocation}
              onChange={(e) =>
                updateSettings({ defaultLocation: e.target.value })
              }
              placeholder="e.g. Pretoria, 10001, -25.74,28.19"
            />
            <p className="text-xs text-muted-foreground">
              City name, ZIP code, or coordinates used when no location is
              specified.
            </p>
          </div>

          <Separator />

          {/* Link to full settings */}
          <Link
            to="/settings"
            className="flex items-center justify-between rounded-lg border p-3 text-sm font-medium text-primary transition-colors hover:bg-muted/50"
          >
            All Settings
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
