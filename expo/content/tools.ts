import {
  bodyMetrics,
  infusionRate,
  infusionDose,
  dilution,
  bloodLoss,
  lidocaineCeiling,
  maintenance421,
  numberInput,
  percentToMgMl,
  roundDown,
} from "../utils/calculations";
export interface ToolField {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  zero?: boolean;
}
export interface ToolDefinition {
  id: string;
  title: string;
  scope: string;
  formula: string;
  fields: ToolField[];
  choices?: { id: string; label: string; values: string[] }[];
  confirm?: string;
  sources: string[];
  calculate: (v: Record<string, string>) => { label: string; value: string }[];
}
const field = (
  id: string,
  label: string,
  unit: string,
  min: number,
  max: number,
  zero = false,
) => ({ id, label, unit, min, max, zero });
const weight = field("weight", "Confirmed measured weight", "kg", 1, 300);
const read = (v: Record<string, string>, f: ToolField) =>
  numberInput(v[f.id] ?? "", f.label, f.min, f.max, f.zero);
const n = (v: Record<string, string>, id: string) => Number(v[id]);
const fmt = (value: number, unit: string) =>
  `${value.toLocaleString("en-US", { maximumSignificantDigits: 6, useGrouping: false })} ${unit}`;
export const toolDefinitions: ToolDefinition[] = [
  {
    id: "percent",
    title: "Percent concentration",
    scope:
      "Arithmetic for percentage weight/volume (grams per 100 mL). Not appropriate for volume/volume percentage or a product expressed by a different convention.",
    formula: "mg/mL = percent w/v × 10.",
    fields: [field("percent", "Concentration", "% w/v", 0.00001, 100)],
    sources: [],
    calculate: (v) => [
      {
        label: "Concentration",
        value: fmt(percentToMgMl(n(v, "percent")), "mg/mL"),
      },
    ],
  },
  {
    id: "units",
    title: "Measurement conversion",
    scope:
      "Arithmetic only. Confirm the source measurement and enter the correct unit; no clinical weight or dose is inferred.",
    formula: "1 lb = 0.45359237 kg exactly. 1 inch = 2.54 cm exactly.",
    fields: [
      field("value", "Measured value", "selected input unit", 0.00001, 100000),
    ],
    choices: [
      {
        id: "direction",
        label: "Conversion",
        values: ["lb → kg", "kg → lb", "in → cm", "cm → in"],
      },
    ],
    sources: [],
    calculate: (v) => {
      const factor: Record<string, number> = {
        "lb → kg": 0.45359237,
        "kg → lb": 1 / 0.45359237,
        "in → cm": 2.54,
        "cm → in": 1 / 2.54,
      };
      return [
        {
          label: "Converted measurement",
          value: fmt(
            n(v, "value") * factor[v.direction],
            v.direction.split(" → ")[1],
          ),
        },
      ];
    },
  },

  {
    id: "body",
    title: "Adult body size",
    scope:
      "Adults only. App input domain: height 152.4–220 cm, weight 30–250 kg, BMI 14–60. These bounds are product restrictions, not a validated range. Do not substitute one weight scalar for another in dosing.",
    formula:
      "BMI = kg / m². PBW = 50 (male) or 45.5 (female) + 0.91 × (cm − 152.4). LBW uses the Janmahasatian model. Mosteller BSA = √(cm × kg / 3600).",
    fields: [
      { ...weight, min: 30, max: 250 },
      field("height", "Measured height", "cm", 152.4, 220),
    ],
    choices: [
      {
        id: "sex",
        label: "Sex coefficient used by the published formula",
        values: ["male", "female"],
      },
    ],
    sources: ["pbw", "lbw", "lbwMethod", "bsa"],
    calculate: (v) => {
      const r = bodyMetrics(
        n(v, "weight"),
        n(v, "height"),
        v.sex as "male" | "female",
      );
      return [
        { label: "Body mass index", value: fmt(r.bmi, "kg/m²") },
        { label: "Predicted body weight", value: fmt(r.pbw, "kg") },
        { label: "Estimated lean body weight", value: fmt(r.lbw, "kg") },
        { label: "Body surface area", value: fmt(r.bsa, "m²") },
      ];
    },
  },
  {
    id: "infusion",
    title: "Infusion conversion",
    scope:
      "Arithmetic only. Verify the prescribed dose, final concentration and pump precision independently. No drug-specific dosing recommendation.",
    formula:
      "mL/h = (mcg/kg/min × kg × 60) / mcg/mL. Reverse: mcg/kg/min = mL/h × mcg/mL / (kg × 60).",
    fields: [
      weight,
      field(
        "amount",
        "Dose or rate (select direction first)",
        "see direction",
        0.000001,
        10000,
      ),
      field("concentration", "Final concentration", "mcg/mL", 0.000001, 100000),
    ],
    choices: [
      {
        id: "direction",
        label: "Input → output",
        values: ["mcg/kg/min → mL/h", "mL/h → mcg/kg/min"],
      },
    ],
    sources: [],
    calculate: (v) => [
      {
        label: "Converted value",
        value:
          v.direction === "mcg/kg/min → mL/h"
            ? fmt(
                infusionRate(
                  n(v, "amount"),
                  n(v, "weight"),
                  n(v, "concentration"),
                ),
                "mL/h",
              )
            : fmt(
                infusionDose(
                  n(v, "amount"),
                  n(v, "weight"),
                  n(v, "concentration"),
                ),
                "mcg/kg/min",
              ),
      },
    ],
  },
  {
    id: "dilution",
    title: "Concentration & dilution",
    scope:
      "For compatible solutions only; confirm diluent, stability, aseptic preparation and final labeling with pharmacy. Percent refers to grams per 100 mL (w/v).",
    formula:
      "1% w/v = 10 mg/mL. C₁V₁ = C₂V₂; diluent volume = final volume − stock volume.",
    fields: [
      field("stock", "Stock concentration", "mg/mL", 0.0001, 1000),
      field("target", "Target concentration", "mg/mL", 0.0001, 1000),
      field("volume", "Final volume", "mL", 0.01, 10000),
    ],
    sources: [],
    calculate: (v) => {
      const r = dilution(n(v, "stock"), n(v, "target"), n(v, "volume"));
      return [
        { label: "Stock solution volume", value: fmt(r.stockMl, "mL") },
        { label: "Diluent volume", value: fmt(r.diluentMl, "mL") },
        { label: "Total drug in final container", value: fmt(r.totalMg, "mg") },
        {
          label: "Percent conversion example",
          value: `0.5% = ${percentToMgMl(0.5)} mg/mL`,
        },
      ];
    },
  },
  {
    id: "blood",
    title: "Allowable blood loss model",
    scope:
      "Mathematical estimate using an explicitly supplied estimated blood volume (EBV). Not a transfusion threshold or a prediction of tolerated hemorrhage. No hidden age/sex blood-volume coefficient.",
    formula:
      "EBV × (initial Hct − target Hct) / initial Hct. This simplified model assumes homogeneous volume replacement and does not model ongoing physiologic changes.",
    fields: [
      field("ebv", "Clinician-estimated blood volume", "mL", 1, 20000),
      field("initial", "Initial hematocrit", "%", 0.1, 100),
      field("target", "Target hematocrit", "%", 0.1, 100),
    ],
    sources: [],
    calculate: (v) => [
      {
        label: "Model estimate",
        value: fmt(
          bloodLoss(n(v, "ebv"), n(v, "initial"), n(v, "target")),
          "mL",
        ),
      },
    ],
  },
  {
    id: "lidocaine",
    title: "Lidocaine single-dose label ceiling",
    scope:
      "Normal healthy adults only, app domain 30–200 kg. This is a labeled ceiling, not a recommended dose or assurance against toxicity. Not for children, pregnancy, frailty, organ dysfunction, infusion, repeated dosing or mixed local anesthetics.",
    formula:
      "Without epinephrine: lower of 4.5 mg/kg and 300 mg. With epinephrine: lower of 7 mg/kg and 500 mg. Concentration (%) × 10 = mg/mL. Volume rounded downward to 0.01 mL.",
    confirm:
      "I confirmed a normal healthy adult, single-agent single-dose use, no prior local anesthetic exposure and the exact product/formulation.",
    fields: [
      { ...weight, min: 30, max: 200 },
      field("percent", "Verified lidocaine concentration", "% w/v", 0.1, 4),
    ],
    choices: [
      {
        id: "epi",
        label: "Product contains epinephrine",
        values: ["No", "Yes"],
      },
    ],
    sources: ["lidocaine"],
    calculate: (v) => {
      const mg = lidocaineCeiling(n(v, "weight"), v.epi === "Yes");
      return [
        { label: "Label ceiling (not a target dose)", value: fmt(mg, "mg") },
        {
          label: "Equivalent volume at entered concentration",
          value: `${roundDown(mg / percentToMgMl(n(v, "percent")))} mL`,
        },
      ];
    },
  },
  {
    id: "hemodynamics",
    title: "Hemodynamic arithmetic",
    scope:
      "Adult arithmetic with measured inputs. Estimated MAP assumes a conventional arterial waveform. SVR/PVR require appropriate measured pressures and cardiac output; they do not establish a diagnosis.",
    formula:
      "MAP ≈ (SBP + 2 × DBP)/3. CI = CO/BSA. SVR = 80 × (MAP − CVP)/CO. PVR = 80 × (mPAP − PAWP)/CO.",
    fields: [
      field("sbp", "Systolic pressure", "mmHg", 1, 350),
      field("dbp", "Diastolic pressure", "mmHg", 0, 250, true),
      field("cvp", "Central venous pressure", "mmHg", 0, 60, true),
      field("co", "Cardiac output", "L/min", 0.1, 30),
      field("bsa", "Body surface area", "m²", 0.2, 4),
      field("mpap", "Mean pulmonary artery pressure", "mmHg", 1, 150),
      field("pawp", "Pulmonary artery wedge pressure", "mmHg", 0, 100, true),
    ],
    sources: [],
    calculate: (v) => {
      if (n(v, "sbp") <= n(v, "dbp"))
        throw Error("Systolic pressure must exceed diastolic pressure.");
      const map = (n(v, "sbp") + 2 * n(v, "dbp")) / 3;
      if (map <= n(v, "cvp") || n(v, "mpap") < n(v, "pawp"))
        throw Error(
          "Check pressure gradients; values are outside this tool’s supported domain.",
        );
      return [
        { label: "Estimated MAP", value: fmt(map, "mmHg") },
        {
          label: "Cardiac index",
          value: fmt(n(v, "co") / n(v, "bsa"), "L/min/m²"),
        },
        {
          label: "SVR",
          value: fmt((80 * (map - n(v, "cvp"))) / n(v, "co"), "dyn·s/cm⁵"),
        },
        {
          label: "PVR",
          value: fmt(
            (80 * (n(v, "mpap") - n(v, "pawp"))) / n(v, "co"),
            "dyn·s/cm⁵",
          ),
        },
      ];
    },
  },
  {
    id: "ventilation",
    title: "Ventilation arithmetic",
    scope:
      "Arithmetic only. No automatic ventilator prescription, recruitment recommendation or ARDS classification. P/F depends on oxygen delivery and measurement conditions.",
    formula:
      "Minute ventilation (L/min) = tidal volume (mL) × respiratory rate / 1000. P/F = PaO₂ / (FiO₂ percent / 100).",
    fields: [
      field("vt", "Tidal volume", "mL", 1, 1500),
      field("rr", "Respiratory rate", "breaths/min", 1, 100),
      field("pao2", "Arterial oxygen partial pressure", "mmHg", 1, 700),
      field("fio2", "Inspired oxygen", "%", 21, 100),
    ],
    sources: [],
    calculate: (v) => [
      {
        label: "Minute ventilation",
        value: fmt((n(v, "vt") * n(v, "rr")) / 1000, "L/min"),
      },
      {
        label: "P/F ratio",
        value: fmt(n(v, "pao2") / (n(v, "fio2") / 100), "mmHg"),
      },
    ],
  },
  {
    id: "fluid",
    title: "4–2–1 educational arithmetic",
    scope:
      "Historical maintenance arithmetic, 10–80 kg. This is not a perioperative fluid prescription. NPO deficit and automatic staged replacement have been removed. Individualize fluids to physiology and local guidance.",
    formula:
      "4 mL/kg/h for the first 10 kg + 2 for the next 10 kg + 1 for each kg above 20.",
    fields: [{ ...weight, min: 10, max: 80 }],
    sources: [],
    calculate: (v) => [
      {
        label: "Educational formula result",
        value: fmt(maintenance421(n(v, "weight")), "mL/h"),
      },
    ],
  },
];
export function calculateTool(
  tool: ToolDefinition,
  values: Record<string, string>,
  confirmed: boolean,
) {
  for (const f of tool.fields) read(values, f);
  for (const c of tool.choices ?? [])
    if (!c.values.includes(values[c.id]))
      throw Error(`Select ${c.label.toLowerCase()}.`);
  if (tool.confirm && !confirmed)
    throw Error("Confirm applicability before displaying the label ceiling.");
  const results = tool.calculate(values);
  if (results.some((r) => /NaN|Infinity/.test(r.value)))
    throw Error("Calculation outside supported numeric range.");
  return results;
}
