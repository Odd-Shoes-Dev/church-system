"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { THEME_PRESETS } from "@/lib/theme/presets";
import { DEFAULT_THEME, type ThemeSettings } from "@/lib/theme/tokens";
import { themeRowToSettings } from "@/lib/theme/apply";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-[var(--radius)] border border-[var(--color-border)] cursor-pointer p-0.5"
      />
      <div className="flex-1">
        <label className="text-sm text-[var(--color-text)]">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full text-xs text-[var(--color-muted)] mt-0.5 bg-transparent border-none outline-none"
        />
      </div>
    </div>
  );
}

const FONT_OPTIONS = [
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Crimson Text", label: "Crimson Text" },
  { value: "Lora", label: "Lora" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "EB Garamond", label: "EB Garamond" },
  { value: "Libre Baskerville", label: "Libre Baskerville" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond" },
];

const RADIUS_OPTIONS = [
  { value: "0px", label: "None" },
  { value: "2px", label: "Subtle" },
  { value: "4px", label: "Small" },
  { value: "8px", label: "Medium" },
  { value: "12px", label: "Large" },
];

export function ThemeEditor() {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/settings/theme")
      .then((r) => r.json())
      .then((d) => {
        if (d.theme) {
          setTheme(themeRowToSettings(d.theme));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primaryColor);
    root.style.setProperty("--color-secondary", theme.secondaryColor);
    root.style.setProperty("--color-background", theme.backgroundColor);
    root.style.setProperty("--color-text", theme.textColor);
    root.style.setProperty("--color-accent", theme.accentColor);
    root.style.setProperty("--color-surface", theme.surfaceColor);
    root.style.setProperty("--color-border", theme.borderColor);
    root.style.setProperty("--color-muted", theme.mutedColor);
    root.style.setProperty("--font-heading", `'${theme.headingFont}', serif`);
    root.style.setProperty("--font-body", `'${theme.bodyFont}', serif`);
    root.style.setProperty("--font-size-base", `${theme.baseFontSize}px`);
    root.style.setProperty("--radius", theme.borderRadius);
  }, [theme]);

  function update(key: keyof ThemeSettings, value: string | number) {
    setTheme((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function applyPreset(index: number) {
    setTheme({ ...THEME_PRESETS[index].settings });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/admin/settings/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(theme),
    });
    setSaving(false);
    setSaved(true);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-[var(--font-heading)] text-[var(--color-text)] mb-3">
          Theme Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {THEME_PRESETS.map((preset, i) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(i)}
              className="text-left p-4 rounded-[var(--radius)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors cursor-pointer"
              style={{
                backgroundColor: preset.settings.surfaceColor,
                borderColor: preset.settings.borderColor,
              }}
            >
              <div className="flex gap-1 mb-2">
                {[
                  preset.settings.primaryColor,
                  preset.settings.secondaryColor,
                  preset.settings.accentColor,
                  preset.settings.backgroundColor,
                ].map((c) => (
                  <div
                    key={c}
                    className="w-5 h-5 rounded-full border"
                    style={{
                      backgroundColor: c,
                      borderColor: preset.settings.borderColor,
                    }}
                  />
                ))}
              </div>
              <p
                className="text-sm font-medium"
                style={{ color: preset.settings.textColor }}
              >
                {preset.name}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: preset.settings.mutedColor }}
              >
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle className="mb-4">Colors</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorField label="Primary" value={theme.primaryColor} onChange={(v) => update("primaryColor", v)} />
            <ColorField label="Secondary" value={theme.secondaryColor} onChange={(v) => update("secondaryColor", v)} />
            <ColorField label="Background" value={theme.backgroundColor} onChange={(v) => update("backgroundColor", v)} />
            <ColorField label="Text" value={theme.textColor} onChange={(v) => update("textColor", v)} />
            <ColorField label="Accent" value={theme.accentColor} onChange={(v) => update("accentColor", v)} />
            <ColorField label="Surface" value={theme.surfaceColor} onChange={(v) => update("surfaceColor", v)} />
            <ColorField label="Border" value={theme.borderColor} onChange={(v) => update("borderColor", v)} />
            <ColorField label="Muted" value={theme.mutedColor} onChange={(v) => update("mutedColor", v)} />
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-4">Typography and Shape</CardTitle>
          <div className="flex flex-col gap-4">
            <Select
              label="Heading Font"
              options={FONT_OPTIONS}
              value={theme.headingFont}
              onChange={(e) => update("headingFont", e.target.value)}
            />
            <Select
              label="Body Font"
              options={FONT_OPTIONS}
              value={theme.bodyFont}
              onChange={(e) => update("bodyFont", e.target.value)}
            />
            <Input
              label="Base Font Size (px)"
              type="number"
              value={String(theme.baseFontSize)}
              onChange={(e) => update("baseFontSize", parseInt(e.target.value) || 16)}
              min={12}
              max={24}
            />
            <Select
              label="Border Radius"
              options={RADIUS_OPTIONS}
              value={theme.borderRadius}
              onChange={(e) => update("borderRadius", e.target.value)}
            />
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle className="mb-3">Preview</CardTitle>
        <div className="p-6 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)]">
          <h2 className="text-xl font-[var(--font-heading)] text-[var(--color-text)] mb-2">
            Welcome to Our Church
          </h2>
          <p className="text-[var(--color-text)] mb-4">
            This is how your registration pages will look with the current theme settings.
          </p>
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-[var(--radius)] bg-[var(--color-primary)] text-[var(--color-background)] text-sm">
              Primary Button
            </div>
            <div className="px-4 py-2 rounded-[var(--radius)] border border-[var(--color-border)] text-[var(--color-text)] text-sm">
              Outline Button
            </div>
          </div>
          <div className="mt-4 p-4 rounded-[var(--radius)] bg-[var(--color-surface)] border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-muted)]">
              This is a surface card with muted text
            </p>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Theme"}
        </Button>
        {saved && (
          <span className="text-sm text-[var(--color-muted)]">
            Theme saved successfully
          </span>
        )}
      </div>
    </div>
  );
}
