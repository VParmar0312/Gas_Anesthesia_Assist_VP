/** Semantic material tokens. Clinical text always uses opaque surfaces. */
export type Tone = "teal" | "blue" | "purple" | "amber" | "rose" | "green";
export const metrics = {
  space: { xs: 4, sm: 8, md: 12, lg: 20, xl: 28, xxl: 36 },
  radius: { control: 14, card: 22, pill: 999 },
  target: 48,
  contentWidth: 960,
  motion: { pressMs: 90, settleMs: 160 },
};
export const palettes = {
  light: {
    dark: false,
    bg: "#F3F5FA",
    surface: "#FFFFFF",
    raised: "#EAF0F8",
    text: "#18253E",
    muted: "#526078",
    line: "#C8D1DF",
    accent: "#006D66",
    onAccent: "#FFFFFF",
    danger: "#B22943",
    warning: "#825000",
    chrome: "#F9FBFF",
    hero: "#163A4A",
    onHero: "#F1FCFF",
    heroMuted: "#C4DFEA",
    tones: {
      teal: { ink: "#006D66", fill: "#E2F4F0", line: "#A2D3C9" },
      blue: { ink: "#2756B1", fill: "#E9F0FF", line: "#B2C8F1" },
      purple: { ink: "#7541A2", fill: "#F2EAFC", line: "#CFB6E8" },
      amber: { ink: "#825000", fill: "#FFF3DC", line: "#E3C486" },
      rose: { ink: "#B22943", fill: "#FDEBF0", line: "#E5B0BE" },
      green: { ink: "#326C39", fill: "#EAF5E8", line: "#B3D4AD" },
    },
  },
  dark: {
    dark: true,
    bg: "#0C1220",
    surface: "#172134",
    raised: "#202E46",
    text: "#F1F5FF",
    muted: "#AFBFD7",
    line: "#435570",
    accent: "#77DFCB",
    onAccent: "#092B29",
    danger: "#FF9FB0",
    warning: "#F4CD81",
    chrome: "#152034",
    hero: "#183B4B",
    onHero: "#F1FCFF",
    heroMuted: "#C4DFEA",
    tones: {
      teal: { ink: "#77DFCB", fill: "#193A3C", line: "#3E776E" },
      blue: { ink: "#A7C5FF", fill: "#1D3155", line: "#476A9D" },
      purple: { ink: "#D5B2FF", fill: "#332648", line: "#715991" },
      amber: { ink: "#F4CD81", fill: "#3B3020", line: "#80673E" },
      rose: { ink: "#FFABBB", fill: "#402532", line: "#905566" },
      green: { ink: "#AFE0A5", fill: "#243925", line: "#57794F" },
    },
  },
};
export function categoryTone(category: string): Tone {
  if (/opioid|analgesi|timing|fluid/i.test(category)) return "amber";
  if (/sedation|neuromuscular|induction|body|dilution/i.test(category))
    return "purple";
  if (/vasopressor|emergency|hemo|crisis|cardiac|blood/i.test(category))
    return "rose";
  if (/reversal|success/i.test(category)) return "green";
  if (
    /inhaled|volatile|prepare|procedure|infusion|concentration/i.test(category)
  )
    return "teal";
  return "blue";
}
