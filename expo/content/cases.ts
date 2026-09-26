export interface CaseRecord {
  id: string;
  month: string;
  ageMonths: number;
  asa: number;
  emergency: boolean;
  procedure: string;
  techniques: string[];
  credits: string[];
  note: string;
  legacy?: boolean;
  procedureCounts?: Partial<Record<"epidural" | "spinal" | "block", number>>;
  intracerebralOpen?: boolean;
}
export const requirements = [
  ["p12", "Children under 12 years", 100],
  ["p3", "Children under 3 years", 20],
  ["p3m", "Infants under 3 months", 5],
  ["vaginal", "Vaginal deliveries", 40],
  ["cesarean", "Cesarean deliveries", 20],
  ["cardiac", "Cardiac surgery", 20],
  ["bypass", "Cardiopulmonary bypass", 10],
  ["vascular", "Major vascular (excluding access)", 20],
  ["thoracic", "Noncardiac thoracic", 20],
  ["brain", "Intracerebral procedures", 20],
  ["epidural", "Epidural anesthesia", 40],
  ["spinal", "Spinal anesthesia", 40],
  ["block", "Peripheral nerve blocks", 40],
  ["critical", "Life-threatening pathology", 20],
  ["pain", "Initial pain evaluations", 20],
] as const;
export const creditOptions = requirements.filter(
  ([id]) => !["p12", "p3", "p3m", "epidural", "spinal", "block"].includes(id),
);
export function isCases(value: unknown): value is CaseRecord[] {
  if (!Array.isArray(value)) return false;
  const ids = new Set<string>();
  return value.every((c) => {
    if (!c || typeof c.id !== "string" || !c.id || ids.has(c.id)) return false;
    ids.add(c.id);
    return (
      typeof c.month === "string" &&
      /^\d{4}-(0[1-9]|1[0-2])$/.test(c.month) &&
      Number.isInteger(c.ageMonths) &&
      c.ageMonths >= 0 &&
      c.ageMonths <= 1440 &&
      Number.isInteger(c.asa) &&
      c.asa >= 1 &&
      c.asa <= 6 &&
      typeof c.emergency === "boolean" &&
      typeof c.procedure === "string" &&
      c.procedure.trim().length > 0 &&
      c.procedure.length <= 120 &&
      typeof c.note === "string" &&
      c.note.length <= 1000 &&
      Array.isArray(c.techniques) &&
      c.techniques.every(
        (t: unknown) =>
          typeof t === "string" &&
          ["general", "sedation", "epidural", "spinal", "block"].includes(t),
      ) &&
      (c.legacy === undefined || typeof c.legacy === "boolean") &&
      (c.intracerebralOpen === undefined ||
        typeof c.intracerebralOpen === "boolean") &&
      (c.procedureCounts === undefined ||
        (c.procedureCounts &&
          typeof c.procedureCounts === "object" &&
          !Array.isArray(c.procedureCounts) &&
          Object.entries(c.procedureCounts).every(
            ([k, n]) =>
              ["epidural", "spinal", "block"].includes(k) &&
              Number.isInteger(n) &&
              (n as number) >= 0 &&
              (n as number) <= 20 &&
              c.techniques.includes(k),
          ))) &&
      Array.isArray(c.credits) &&
      c.credits.every((t: unknown) => creditOptions.some(([id]) => id === t))
    );
  });
}
export function caseCredits(c: CaseRecord): Set<string> {
  const credits = new Set(c.credits);
  // Legacy ages may have been defaulted by the old form; require reconciliation.
  if (!c.legacy) {
    if (c.ageMonths < 144) credits.add("p12");
    if (c.ageMonths < 36) credits.add("p3");
    if (c.ageMonths < 3) credits.add("p3m");
  }
  for (const t of c.techniques)
    if (["epidural", "spinal", "block"].includes(t)) credits.add(t);
  if (credits.has("bypass")) credits.add("cardiac");
  return credits;
}
export function deriveRequirements(cases: CaseRecord[]) {
  return requirements.map(([id, title, minimum]) => ({
    id,
    title,
    minimum,
    completed: cases.reduce(
      (sum, c) =>
        sum +
        (caseCredits(c).has(id)
          ? ["epidural", "spinal", "block"].includes(id)
            ? (c.procedureCounts?.[id as "epidural" | "spinal" | "block"] ?? 1)
            : 1
          : 0),
      0,
    ),
  }));
}
export function migrateCases(raw: string | null): CaseRecord[] {
  if (!raw) return [];
  const old = JSON.parse(raw);
  if (!Array.isArray(old))
    throw new Error("Legacy case log is invalid; original data preserved.");
  return old.map((c) => {
    if (
      !c ||
      typeof c.id !== "string" ||
      !Number.isFinite(c.patientAge) ||
      !Number.isFinite(Date.parse(c.date))
    )
      throw new Error("Legacy case needs manual recovery.");
    return {
      id: c.id,
      month: c.date.slice(0, 7),
      ageMonths: Math.round(c.patientAge * 12),
      asa: c.asaClass,
      emergency: Boolean(c.isEmergency),
      procedure: c.procedureType || "Legacy case",
      techniques: [],
      credits: [],
      note: typeof c.notes === "string" ? c.notes : "",
      legacy: true,
    };
  });
}
export function mergeCases(
  current: CaseRecord[],
  incoming: unknown,
): CaseRecord[] {
  if (!isCases(incoming)) throw new Error("Backup contains invalid records.");
  const map = new Map(current.map((c) => [c.id, c]));
  for (const c of incoming) {
    const prior = map.get(c.id);
    if (prior && JSON.stringify(prior) !== JSON.stringify(c))
      throw new Error(
        `Conflicting case ${c.id}. Nothing imported; reconcile the records first.`,
      );
    map.set(c.id, c);
  }
  return [...map.values()].sort((a, b) => b.month.localeCompare(a.month));
}
export function casesCsv(cases: CaseRecord[]) {
  const quote = (value: unknown) => {
    const str = String(value);
    return (
      '"' +
      (/^[=+@\-\t\r]/.test(str) ? "'" : "") +
      str.replace(/"/g, '""') +
      '"'
    );
  };
  return [
    [
      "id",
      "month",
      "age_months",
      "asa",
      "emergency",
      "procedure",
      "techniques",
      "credits",
      "note",
      "needs_reconciliation",
      "procedure_counts",
      "intracerebral_open",
    ],
    ...cases.map((c) => [
      c.id,
      c.month,
      c.ageMonths,
      c.asa,
      c.emergency,
      c.procedure,
      c.techniques.join(";"),
      [...caseCredits(c)].join(";"),
      c.note,
      !!c.legacy,
      JSON.stringify(c.procedureCounts ?? {}),
      c.intracerebralOpen ?? "",
    ]),
  ]
    .map((row) => row.map(quote).join(","))
    .join("\r\n");
}
