import type { Entry } from "./catalog";
import type { Tone } from "../constants/theme";
export interface LabGroup {
  id: string;
  title: string;
  tone: Tone;
  sourceIds: string[];
  tests: string;
  range: string;
  interpretation: string;
  limitation: string;
}
/** Concise, explicitly scoped summaries. No universal treatment or critical thresholds. */
export const labGroups: LabGroup[] = [
  {
    id: "electrolytes",
    title: "Electrolytes",
    tone: "teal",
    sourceIds: ["mayo-renal"],
    tests:
      "Sodium · potassium · chloride · bicarbonate · calcium · magnesium · phosphate",
    range:
      "Adult serum examples, Mayo RFAMA: Na 135–145, K 3.6–5.2, Cl 98–107, bicarbonate 22–29 mmol/L. Use the reporting laboratory’s interval.",
    interpretation:
      "Review the panel together with symptoms, trends, sampling conditions and clinical context.",
    limitation:
      "Serum total CO₂ is not interchangeable with a blood-gas measurement. Calcium, magnesium and phosphate require their own assay, unit and population context; no universal urgent cutoffs are supplied.",
  },
  {
    id: "hematology",
    title: "Hematology",
    tone: "rose",
    sourceIds: ["mayo-cbc"],
    tests: "Hemoglobin · hematocrit · platelets · WBC / differential",
    range:
      "Use the reporting laboratory’s age-, sex- and assay-specific CBC intervals.",
    interpretation:
      "Review counts, differential and trends together. This reference does not set a transfusion or neuraxial threshold.",
    limitation:
      "A reference interval is not a treatment trigger. The old single platelet clearance and universal transfusion rules are intentionally withheld.",
  },
  {
    id: "coagulation-labs",
    title: "Coagulation",
    tone: "purple",
    sourceIds: ["asra"],
    tests: "PT / INR · aPTT · fibrinogen · drug-specific testing",
    range:
      "Assay-specific ranges and anticoagulant context required; no universal interval supplied.",
    interpretation:
      "Identify the exact drug, assay, calibration, timing and clinical question before interpreting a result.",
    limitation:
      "No laboratory result here grants permission for neuraxial or deep regional procedures. Open the anticoagulation scenario workflow.",
  },
  {
    id: "renal-labs",
    title: "Renal function",
    tone: "blue",
    sourceIds: ["mayo-renal"],
    tests: "Creatinine · BUN · eGFR · urine output",
    range:
      "Adult serum examples, Mayo RFAMA: creatinine 0.74–1.35 mg/dL (male), 0.59–1.04 mg/dL (female); BUN 8–24 mg/dL (male), 6–21 mg/dL (female).",
    interpretation:
      "A panel alone does not diagnose a cause of kidney dysfunction. Check baseline, trends and measurement context.",
    limitation:
      "No automatic renal drug adjustment, CrCl/eGFR substitution or dialysis threshold is generated.",
  },
  {
    id: "hepatic-labs",
    title: "Hepatic function",
    tone: "amber",
    sourceIds: ["mayo-renal"],
    tests: "AST / ALT · bilirubin · albumin · synthetic-function context",
    range:
      "Adult serum albumin example, Mayo RFAMA: 3.5–5.0 g/dL. Other ranges await exact assay reconciliation.",
    interpretation:
      "Review the reporting laboratory’s intervals and the clinical question with the responsible team.",
    limitation:
      "The former universal hepatic thresholds and automatic dose-reduction statements remain withheld. This is an incomplete reference.",
  },
  {
    id: "cardiac-labs",
    title: "Cardiac biomarkers",
    tone: "rose",
    sourceIds: [],
    tests: "High-sensitivity troponin · BNP / NT-proBNP · CK-MB",
    range:
      "Exact assay, units and population-specific reference limits pending review.",
    interpretation:
      "Record assay identity, serial sample times, symptoms and the local interpretation pathway.",
    limitation:
      "No universal troponin cutoff, myocardial-infarction diagnosis or BNP treatment threshold is supplied.",
  },
];
export const labEntries: Entry[] = [
  {
    id: "labs",
    kind: "lab",
    title: "Labs & interpretation",
    summary: "Six systems · sample and unit context",
    aliases: ["lab values", "reference ranges"],
    sources: ["mayo-renal", "mayo-cbc"],
    quick: [],
    learn: [],
    related: ["abg", "anticoag"],
  },
  {
    id: "abg",
    kind: "lab",
    title: "ABG interpretation",
    summary: "Stepwise adult educational arithmetic",
    aliases: ["acid base", "blood gas", "Winter", "anion gap", "delta ratio"],
    sources: ["acid-base", "figge"],
    quick: [],
    learn: [],
    related: ["ventilation", "labs"],
  },
  ...labGroups.map((g) => ({
    id: g.id,
    kind: "lab" as const,
    title: g.title,
    summary: g.tests,
    aliases: [g.tests],
    sources: g.sourceIds,
    quick: [
      { title: "Reference interval", body: g.range },
      { title: "Interpretation", body: g.interpretation },
    ],
    learn: [{ title: "Limitations", body: g.limitation }],
    related: [
      "labs",
      "abg",
      ...(g.id === "coagulation-labs" ? ["anticoag"] : []),
    ],
  })),
];
