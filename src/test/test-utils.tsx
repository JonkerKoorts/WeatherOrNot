import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";
import { SettingsContext, type SettingsContextValue } from "@/contexts/settings-context";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import type { AppSettings } from "@/types/weather";

interface TestProviderProps {
  children: ReactNode;
  settings?: Partial<AppSettings>;
}

function TestProvider({ children, settings = {} }: TestProviderProps) {
  const value: SettingsContextValue = {
    settings: { ...DEFAULT_SETTINGS, ...settings },
    updateSettings: () => {},
    resetSettings: () => {},
  };

  return (
    <SettingsContext value={value}>
      {children}
    </SettingsContext>
  );
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { settings?: Partial<AppSettings> },
) {
  const { settings, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => (
      <TestProvider settings={settings}>{children}</TestProvider>
    ),
    ...renderOptions,
  });
}

export { customRender as render };
export { default as userEvent } from "@testing-library/user-event";
export { screen, within, waitFor } from "@testing-library/react";
