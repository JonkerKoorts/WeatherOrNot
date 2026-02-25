import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { SettingsProvider } from "@/contexts/settings-context";
import { useSettings } from "@/hooks/use-settings";
import { DEFAULT_SETTINGS, SETTINGS_KEY } from "@/lib/constants";
import type { ReactNode } from "react";

function clearLocalStorage() {
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    localStorage.removeItem(key);
  }
}

function wrapper({ children }: { children: ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>;
}

beforeEach(() => {
  clearLocalStorage();
});

describe("SettingsContext", () => {
  it("provides default settings when no stored settings exist", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
  });

  it("loads stored settings from localStorage", () => {
    const stored = { ...DEFAULT_SETTINGS, units: "f" as const };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.settings.units).toBe("f");
  });

  it("merges stored settings with defaults (handles partial stored data)", () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ units: "s" }));

    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.settings.units).toBe("s");
    expect(result.current.settings.language).toBe("en");
    expect(result.current.settings.cacheTtlMinutes).toBe(30);
  });

  it("updates settings and persists to localStorage", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.updateSettings({ units: "f" });
    });

    expect(result.current.settings.units).toBe("f");
    expect(result.current.settings.language).toBe("en"); // Unchanged

    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY)!);
    expect(stored.units).toBe("f");
  });

  it("supports partial updates (only changes specified fields)", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.updateSettings({ language: "fr" });
    });

    expect(result.current.settings.language).toBe("fr");
    expect(result.current.settings.units).toBe("m"); // Unchanged
  });

  it("resets settings to defaults", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.updateSettings({ units: "f", language: "de" });
    });

    expect(result.current.settings.units).toBe("f");

    act(() => {
      result.current.resetSettings();
    });

    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);

    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY)!);
    expect(stored).toEqual(DEFAULT_SETTINGS);
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem(SETTINGS_KEY, "corrupted-json{{{");

    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
  });

  it("throws when useSettings is used outside SettingsProvider", () => {
    expect(() => {
      renderHook(() => useSettings());
    }).toThrow();
  });
});
