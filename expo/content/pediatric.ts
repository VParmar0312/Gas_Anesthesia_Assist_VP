import { numberInput } from "../utils/calculations";
export interface PediatricSession {
  startedAt: string;
  savedAt: string | null;
  ageMonths: number | null;
  weightKg: number | null;
  checked: string[];
}
export const pediatricChecks = [
  "Confirm completed-month age, gestational history where relevant, and measured weight",
  "Verify primary airway device, adjacent sizes and rescue equipment",
  "Confirm circuit, ventilation, monitoring, suction and warming resources",
  "Independently verify each prescription, concentration and administration route",
  "Discuss fluids, fasting and glucose monitoring with the pediatric team",
  "Agree on emergence, apnea monitoring and postoperative destination",
];
export const newPediatricSession = (): PediatricSession => ({
  startedAt: new Date().toISOString(),
  savedAt: null,
  ageMonths: null,
  weightKg: null,
  checked: [],
});
export function isPediatricSession(value: unknown): value is PediatricSession {
  const s = value as PediatricSession;
  return (
    !!s &&
    typeof s.startedAt === "string" &&
    Number.isFinite(Date.parse(s.startedAt)) &&
    (s.savedAt === null ||
      (typeof s.savedAt === "string" &&
        Number.isFinite(Date.parse(s.savedAt)))) &&
    (s.ageMonths === null ||
      (Number.isInteger(s.ageMonths) &&
        s.ageMonths >= 0 &&
        s.ageMonths <= 216)) &&
    (s.weightKg === null ||
      (Number.isFinite(s.weightKg) &&
        s.weightKg >= 0.1 &&
        s.weightKg <= 200)) &&
    ((s.ageMonths === null && s.weightKg === null && s.savedAt === null) ||
      (s.ageMonths !== null && s.weightKg !== null && s.savedAt !== null)) &&
    Array.isArray(s.checked) &&
    s.checked.every((id) => pediatricChecks.includes(id)) &&
    new Set(s.checked).size === s.checked.length
  );
}
export function parsePediatricContext(age: string, weight: string) {
  const ageMonths = numberInput(age, "Age in completed months", 0, 216, true);
  if (!Number.isInteger(ageMonths))
    throw Error("Enter age in whole completed months; zero is valid.");
  return {
    ageMonths,
    weightKg: numberInput(weight, "Measured weight (kg)", 0.1, 200),
  };
}
export function ageContext(months: number | null) {
  if (months === null) return "Age not entered";
  if (months === 0)
    return "Zero completed months — verify neonatal and gestational context";
  if (months < 12) return "Infant preparation context";
  if (months < 144) return "Child preparation context";
  return "Adolescent preparation context";
}
export const pediatricModules = [
  {
    title: "Airway equipment",
    text: "ETT cuffed/uncuffed size and depth, LMA, blade and suction catheter: exact device, age/gestation, measured weight and pediatric review required. No size estimates published.",
    tone: "blue" as const,
    icon: "airway" as const,
  },
  {
    title: "Circuit & monitoring",
    text: "Confirm circuit, ventilation, warming and age-specific vital-sign references using your approved pediatric resources. Values remain unavailable pending source review.",
    tone: "teal" as const,
    icon: "activity" as const,
  },
  {
    title: "Fluids & glucose",
    text: "Pediatric fluid prescribing remains unavailable. The separate 4–2–1 tool is limited educational arithmetic, not a neonatal or perioperative fluid order.",
    tone: "amber" as const,
    icon: "drop" as const,
  },
  {
    title: "Medication preparation",
    text: "Anesthesia and resuscitation prescriptions require verified age/weight limits, route, formulation and independent pediatric acceptance. No drug output is generated from this session.",
    tone: "purple" as const,
    icon: "pill" as const,
  },
];
