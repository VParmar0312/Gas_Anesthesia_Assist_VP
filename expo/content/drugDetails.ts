/** New clinical fields carry provenance; a reconciled fact is never clinical approval. */
export type FactStatus = "pending" | "source-reconciled";
export type DrugSection =
  | "mechanism"
  | "onset"
  | "duration"
  | "pediatrics"
  | "contraindications"
  | "interactions"
  | "effects"
  | "preparation"
  | "monitoring"
  | "specialPopulations"
  | "pearls";
export interface ClinicalFact {
  text: string;
  status: FactStatus;
  sourceId: string;
  sourceSection: string;
  population: string;
  route: string;
  formulation: string;
  context: string;
  checked: string;
}
export interface DoseFact extends ClinicalFact {
  indication: string;
  unit: "mg/kg" | "mcg/kg/min" | "mg" | "mcg" | "units";
  weightBasis: string;
  titration: string;
  amount: string;
}
const propofol = (
  text: string,
  sourceSection: string,
  context: string,
): ClinicalFact => ({
  text,
  sourceSection,
  context,
  status: "source-reconciled",
  sourceId: "label-propofol",
  population: "Selected US label; population depends on indication",
  route: "IV",
  formulation: "Avet propofol injectable emulsion 10 mg/mL with EDTA",
  checked: "2026-09-26",
});
export const propofolDoses: DoseFact[] = [
  {
    ...propofol(
      "Healthy adults younger than 65, ASA I–II",
      "2.2",
      "Adult induction only",
    ),
    population: "Adults under 65; ASA I–II",
    indication: "Induction of general anesthesia",
    amount: "2–2.5",
    unit: "mg/kg",
    weightBasis:
      "kg of patient weight; no alternative scalar specified in this label excerpt",
    titration:
      "Individualize and titrate to clinical response; premedication changes requirements.",
  },
  {
    ...propofol(
      "Elderly, debilitated or ASA III–IV",
      "2.2",
      "Adult induction only",
    ),
    population: "Elderly, debilitated or ASA III–IV adults",
    indication: "Induction of general anesthesia",
    amount: "approximately 1–1.5",
    unit: "mg/kg",
    weightBasis:
      "kg of patient weight; no alternative scalar specified in this label excerpt",
    titration:
      "Titrate to response; rapid bolus increases cardiorespiratory depression risk.",
  },
];
export const drugDetails: Record<
  string,
  Partial<Record<DrugSection, ClinicalFact>>
> = {
  "1": {
    mechanism: propofol(
      "Thought to enhance inhibitory GABA-A receptor activity. The full anesthetic mechanism remains incompletely understood.",
      "12.1",
      "Mechanism",
    ),
    onset: propofol(
      "Usually within 40 seconds after starting an IV therapeutic induction injection; not a guaranteed individual onset.",
      "12",
      "IV induction",
    ),
    duration: propofol(
      "Recovery depends on dose and infusion duration. Tissue accumulation after prolonged infusion can delay awakening; no universal duration is asserted.",
      "12.3",
      "Bolus versus infusion",
    ),
    pediatrics: propofol(
      "Label indications distinguish induction from age 3 years and maintenance from age 2 months. Pediatric MAC and ICU sedation are not indicated. Pediatric dose outputs remain unavailable pending independent review.",
      "1; 8.4",
      "Age- and indication-specific use; not a pediatric regimen",
    ),
    contraindications: propofol(
      "This product’s label contraindicates hypersensitivity to propofol/components and a history of anaphylaxis to eggs/egg products or soybeans/soy products. Verify the exact formulation and full label.",
      "4",
      "Product-specific contraindications",
    ),
    interactions: propofol(
      "Opioids, sedatives and inhaled agents can amplify sedation and cardiorespiratory effects. Valproate can increase propofol exposure. Concomitant fentanyl in children has a serious bradycardia warning.",
      "7",
      "Selected interactions; incomplete list",
    ),
    effects: propofol(
      "Hypotension, depressed cardiac output, apnea and airway obstruction require continuous assessment. Rapid boluses and susceptible patients can have more pronounced effects.",
      "2.1; 12.2",
      "Hemodynamic and respiratory effects",
    ),
    preparation: propofol(
      "Use strict asepsis, single-patient handling and product-specific discard instructions. Inspect the emulsion. Consult the exact label before dilution, mixing, filter use or coadministration.",
      "2.1; 5.2",
      "Administration; no mixing recipe provided",
    ),
    monitoring: propofol(
      "For anesthesia/MAC, an appropriately trained practitioner separate from the procedure must administer it; continuously monitor and have airway, ventilation and cardiovascular rescue equipment immediately available.",
      "2.1",
      "Anesthesia / adult MAC",
    ),
    specialPopulations: propofol(
      "Acute renal or hepatic failure pharmacokinetics were not studied in this label. Review the complete pregnancy/lactation sections and patient-specific risk with the responsible team; no automatic adjustment is supplied.",
      "8.1; 8.2; 12.3",
      "Special populations; no dose recommendation",
    ),
    pearls: propofol(
      "Induction, maintenance, MAC and adult ventilated ICU sedation are different contexts. The selected induction rows do not supply a sedation protocol.",
      "1; 2",
      "Scope separation",
    ),
  },
};
export function factProblems(fact: ClinicalFact, dose = false): string[] {
  const required = [
    "text",
    "sourceId",
    "sourceSection",
    "population",
    "route",
    "formulation",
    "context",
    "checked",
  ] as const;
  const problems = required
    .filter((k) => !fact[k]?.trim())
    .map((k) => `Missing ${k}`);
  if (!["pending", "source-reconciled"].includes(fact.status))
    problems.push("Invalid status");
  if (!Number.isFinite(Date.parse(fact.checked)))
    problems.push("Invalid checked date");
  if (dose) {
    const d = fact as DoseFact;
    for (const k of [
      "indication",
      "weightBasis",
      "titration",
      "amount",
    ] as const)
      if (!d[k]?.trim()) problems.push(`Missing ${k}`);
    if (!["mg/kg", "mcg/kg/min", "mg", "mcg", "units"].includes(d.unit))
      problems.push("Invalid dose unit");
  }
  return problems;
}
