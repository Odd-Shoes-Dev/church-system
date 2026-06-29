import type { ThemeSettings } from "./tokens";

export interface ThemePreset {
  name: string;
  description: string;
  settings: ThemeSettings;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: "Classic Parchment",
    description: "Warm browns and cream tones inspired by aged manuscripts",
    settings: {
      primaryColor: "#6b5344",
      secondaryColor: "#a89279",
      backgroundColor: "#faf6f1",
      textColor: "#2c2420",
      accentColor: "#8c7355",
      surfaceColor: "#f0ebe4",
      borderColor: "#d4c9bb",
      mutedColor: "#8a7e72",
      headingFont: "Playfair Display",
      bodyFont: "Lora",
      baseFontSize: 16,
      borderRadius: "4px",
    },
  },
  {
    name: "Midnight Chapel",
    description: "Deep charcoal with ivory and muted gold accents",
    settings: {
      primaryColor: "#c4a96a",
      secondaryColor: "#8a7d5a",
      backgroundColor: "#1c1b19",
      textColor: "#e8e4dc",
      accentColor: "#b89d5e",
      surfaceColor: "#2a2826",
      borderColor: "#3d3a36",
      mutedColor: "#8c877e",
      headingFont: "Playfair Display",
      bodyFont: "Lora",
      baseFontSize: 16,
      borderRadius: "4px",
    },
  },
  {
    name: "Stone Cathedral",
    description: "Cool greys and slate with burgundy accents",
    settings: {
      primaryColor: "#7a3b3b",
      secondaryColor: "#9c7a6e",
      backgroundColor: "#f4f2ef",
      textColor: "#2d2d2d",
      accentColor: "#8b4f4f",
      surfaceColor: "#eae7e3",
      borderColor: "#d1ccc6",
      mutedColor: "#8c8680",
      headingFont: "Crimson Text",
      bodyFont: "Lora",
      baseFontSize: 16,
      borderRadius: "2px",
    },
  },
];
