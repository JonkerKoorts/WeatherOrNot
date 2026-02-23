import { createFileRoute } from "@tanstack/react-router";
import { Settings, Trash2, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/use-settings";
import {
  LANGUAGES,
  LOCATION_TYPE_LABELS,
  CACHE_TTL_OPTIONS,
  UNIT_LABELS,
} from "@/lib/constants";
import { clearAllCache, getCacheSize } from "@/lib/cache";
import type { LanguageCode, LocationType, UnitSystem } from "@/types/weather";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [cacheCount, setCacheCount] = useState(getCacheSize);

  const handleClearCache = () => {
    clearAllCache();
    setCacheCount(0);
  };

  return (
    <div className="container mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Settings className="size-6 text-primary" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Units */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Temperature & Measurement Units
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={settings.units}
            onValueChange={(v) => updateSettings({ units: v as UnitSystem })}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="m" id="unit-m" />
              <Label htmlFor="unit-m" className="flex-1 cursor-pointer">
                <span className="font-medium">Metric</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  — {UNIT_LABELS.m.temp}, {UNIT_LABELS.m.wind},{" "}
                  {UNIT_LABELS.m.precip}, {UNIT_LABELS.m.pressure}
                </span>
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="s" id="unit-s" />
              <Label htmlFor="unit-s" className="flex-1 cursor-pointer">
                <span className="font-medium">Scientific</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  — {UNIT_LABELS.s.temp}, {UNIT_LABELS.s.wind},{" "}
                  {UNIT_LABELS.s.precip}, {UNIT_LABELS.s.pressure}
                </span>
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="f" id="unit-f" />
              <Label htmlFor="unit-f" className="flex-1 cursor-pointer">
                <span className="font-medium">Fahrenheit</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  — {UNIT_LABELS.f.temp}, {UNIT_LABELS.f.wind},{" "}
                  {UNIT_LABELS.f.precip}, {UNIT_LABELS.f.pressure}
                </span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Weather Description Language
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select
            value={settings.language}
            onValueChange={(v) =>
              updateSettings({ language: v as LanguageCode })
            }
          >
            <SelectTrigger>
              <SelectValue />
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
            Affects weather condition descriptions from the Weatherbit API.
            WeatherStack free tier does not support language selection.
          </p>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Search Type</Label>
            <Select
              value={settings.locationType}
              onValueChange={(v) =>
                updateSettings({ locationType: v as LocationType })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.entries(LOCATION_TYPE_LABELS) as [
                    LocationType,
                    string,
                  ][]
                ).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Default Location</Label>
            <Input
              value={settings.defaultLocation}
              onChange={(e) =>
                updateSettings({ defaultLocation: e.target.value })
              }
              placeholder="Enter default location..."
            />
          </div>

          <Separator />

          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <strong>City Name:</strong> Enter a city name (e.g.
              &quot;Pretoria&quot;)
            </p>
            <p>
              <strong>ZIP Code:</strong> Enter a postal code (e.g.
              &quot;10001&quot;)
            </p>
            <p>
              <strong>Coordinates:</strong> Enter as lat,lon (e.g.
              &quot;-25.74,28.19&quot;)
            </p>
            <p>
              <strong>IP Address:</strong> Enter an IP address or leave empty
            </p>
            <p>
              <strong>Auto-detect:</strong> Your IP-based location is used
              automatically
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cache */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cache</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Cache Duration</Label>
            <Select
              value={String(settings.cacheTtlMinutes)}
              onValueChange={(v) =>
                updateSettings({ cacheTtlMinutes: Number(v) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CACHE_TTL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Currently cached:{" "}
              <span className="font-mono font-medium">{cacheCount}</span> items
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              disabled={cacheCount === 0}
            >
              <Trash2 className="mr-1.5 size-3.5" />
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset */}
      <div className="flex justify-end">
        <Button variant="ghost" onClick={resetSettings}>
          <RotateCcw className="mr-1.5 size-3.5" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
