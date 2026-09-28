import { numberInput } from "./calculations";
export const compensationModes = ["No model selected", "Metabolic acidosis", "Metabolic alkalosis", "Respiratory acidosis — acute", "Respiratory acidosis — chronic", "Respiratory alkalosis — acute", "Respiratory alkalosis — chronic"] as const;
export type AcidBaseInputs = Record<string, string>;
export interface AcidBaseResult { title: string; value: string; explanation: string }
const rounded = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2, useGrouping: false });
/** Educational adult arithmetic, not a diagnosis engine. Models are explicitly selected. */
export function analyzeAcidBase(v: AcidBaseInputs, model: string): AcidBaseResult[] {
  const read = (id: string, min: number, max: number, zero = false) => numberInput(v[id] ?? "", id, min, max, zero);
  const ph = read("ph", 6.5, 8), co2 = read("paco2", 5, 200), hco3 = read("hco3", 1, 80);
  if (!(compensationModes as readonly string[]).includes(model)) throw Error("Select a supported compensation model.");
  const results: AcidBaseResult[] = [
    { title: "1 / pH", value: ph < 7.35 ? "Acidemia" : ph > 7.45 ? "Alkalemia" : "Within the reference interval", explanation: "Adult arterial reference: 7.35–7.45. A near-normal pH does not exclude a mixed process." },
    { title: "2 / Components", value: `PaCO₂ ${co2} mmHg · HCO₃⁻ ${hco3} mmol/L`, explanation: "CO₂ is the respiratory component; bicarbonate is the metabolic component. Establish the primary process from clinical context before selecting a compensation model." },
  ];
  if (model !== "No model selected") {
    let low: number, high: number, measured: number, unit: string, formula: string;
    if (model === "Metabolic acidosis") {
      if (hco3 >= 24) throw Error("This metabolic-acidosis model requires bicarbonate below its 24 mmol/L reference baseline.");
      low = 1.5 * hco3 + 6; high = low + 4; measured = co2; unit = "mmHg"; formula = "Winter: expected PaCO₂ = 1.5 × HCO₃⁻ + 8 ± 2.";
    } else if (model === "Metabolic alkalosis") {
      if (hco3 <= 24) throw Error("This model requires bicarbonate above its 24 mmol/L reference baseline.");
      low = 40 + 0.6 * (hco3 - 24); high = 40 + 0.75 * (hco3 - 24); measured = co2; unit = "mmHg"; formula = "PaCO₂ reference 40 + 0.6–0.75 × (HCO₃⁻ − 24). Values above 55 mmHg exceed the simple compensation scope; no clamping.";
    } else {
      const acidosis = model.includes("acidosis"), chronic = model.includes("chronic");
      if ((acidosis && co2 <= 40) || (!acidosis && co2 >= 40)) throw Error("PaCO₂ direction does not match the selected respiratory model (reference 40 mmHg).");
      const delta = Math.abs(co2 - 40) / 10;
      const a = chronic ? acidosis ? 3 : 4 : 1, b = chronic ? acidosis ? 4 : 5 : 2;
      low = acidosis ? 24 + a * delta : 24 - b * delta;
      high = acidosis ? 24 + b * delta : 24 - a * delta;
      measured = hco3; unit = "mmol/L";
      formula = `HCO₃⁻ reference 24 ${acidosis ? "+" : "−"} ${a}–${b} per 10 mmHg PaCO₂ ${acidosis ? "rise" : "fall"} from 40. Timing is supplied by the user, not inferred.`;
      if (low <= 0) throw Error("Selected model extrapolates to nonpositive bicarbonate; no result is supported.");
    }
    results.push({ title: "3 / Selected compensation model", value: `${rounded(low)}–${rounded(high)} ${unit}`, explanation: `${model}. ${formula} Measured value is ${measured < low ? "below" : measured > high ? "above" : "within"} this approximate range. ${measured < low || measured > high ? "Recheck timing and consider a mixed process with the clinical team." : "Agreement does not exclude a mixed process."}` });
  } else results.push({ title: "3 / Compensation", value: "Model not selected", explanation: "Choose a primary-process model explicitly. Acute/chronic respiratory context cannot be established from one sample." });
  const any = (keys: string[]) => keys.some(k => (v[k] ?? "").trim());
  let gap: number | undefined;
  if (any(["sodium", "chloride", "serumCO2", "albumin", "normalAlbumin", "normalGap", "normalHco3"])) {
    const na = read("sodium", 80, 200), cl = read("chloride", 40, 160), serum = read("serumCO2", 1, 80);
    gap = na - cl - serum;
    results.push({ title: "4 / Anion gap", value: `${rounded(gap)} mmol/L`, explanation: "Na − (Cl + serum total CO₂), excluding potassium. Use contemporaneous chemistry samples and the reporting laboratory’s interval; negative results are shown without clamping." });
    if (any(["albumin", "normalAlbumin"])) {
      const albumin = read("albumin", 0.1, 7), reference = read("normalAlbumin", 0.1, 7);
      results.push({ title: "Albumin-adjusted gap", value: `${rounded(gap + 2.5 * (reference - albumin))} mmol/L`, explanation: "Observed gap + 2.5 × (entered reference albumin − measured albumin), with albumin in g/dL. Figge observational correction; not a diagnosis." });
    }
    if (any(["normalGap", "normalHco3"])) {
      const referenceGap = read("normalGap", 0, 30, true), referenceHco3 = read("normalHco3", 15, 35);
      if (referenceHco3 <= serum || gap <= referenceGap) throw Error("Delta ratio requires a raised uncorrected gap and bicarbonate below the entered reference. No ratio generated.");
      results.push({ title: "Delta analysis — uncorrected gap", value: rounded((gap - referenceGap) / (referenceHco3 - serum)), explanation: "(Observed gap − entered reference gap) / (entered reference bicarbonate − serum total CO₂). No diagnostic bands assigned; albumin adjustment is displayed separately." });
    }
  }
  if (any(["pao2", "fio2"])) results.push({ title: "5 / Oxygenation arithmetic", value: `${rounded(read("pao2", 1, 700) / (read("fio2", 21, 100) / 100))} mmHg`, explanation: "P/F = PaO₂ / (FiO₂ percent / 100). Confirm oxygen-delivery conditions; this is not an ARDS classification or a ventilation recommendation." });
  return results;
}
