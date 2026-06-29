import type { ThemeSettings } from "./tokens";
import { DEFAULT_THEME } from "./tokens";

export function themeToCSS(settings?: Partial<ThemeSettings>): string {
  const t = { ...DEFAULT_THEME, ...settings };
  return [
    `--color-primary: ${t.primaryColor}`,
    `--color-secondary: ${t.secondaryColor}`,
    `--color-background: ${t.backgroundColor}`,
    `--color-text: ${t.textColor}`,
    `--color-accent: ${t.accentColor}`,
    `--color-surface: ${t.surfaceColor}`,
    `--color-border: ${t.borderColor}`,
    `--color-muted: ${t.mutedColor}`,
    `--font-heading: '${t.headingFont}', serif`,
    `--font-body: '${t.bodyFont}', serif`,
    `--font-size-base: ${t.baseFontSize}px`,
    `--radius: ${t.borderRadius}`,
  ].join("; ");
}

export function themeRowToSettings(row: Record<string, unknown>): ThemeSettings {
  return {
    primaryColor: (row.primary_color as string) ?? DEFAULT_THEME.primaryColor,
    secondaryColor: (row.secondary_color as string) ?? DEFAULT_THEME.secondaryColor,
    backgroundColor: (row.background_color as string) ?? DEFAULT_THEME.backgroundColor,
    textColor: (row.text_color as string) ?? DEFAULT_THEME.textColor,
    accentColor: (row.accent_color as string) ?? DEFAULT_THEME.accentColor,
    surfaceColor: (row.surface_color as string) ?? DEFAULT_THEME.surfaceColor,
    borderColor: (row.border_color as string) ?? DEFAULT_THEME.borderColor,
    mutedColor: (row.muted_color as string) ?? DEFAULT_THEME.mutedColor,
    headingFont: (row.heading_font as string) ?? DEFAULT_THEME.headingFont,
    bodyFont: (row.body_font as string) ?? DEFAULT_THEME.bodyFont,
    baseFontSize: (row.base_font_size as number) ?? DEFAULT_THEME.baseFontSize,
    borderRadius: (row.border_radius as string) ?? DEFAULT_THEME.borderRadius,
  };
}
