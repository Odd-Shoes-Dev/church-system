export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  surfaceColor: string;
  borderColor: string;
  mutedColor: string;
  headingFont: string;
  bodyFont: string;
  baseFontSize: number;
  borderRadius: string;
}

export const DEFAULT_THEME: ThemeSettings = {
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
};
