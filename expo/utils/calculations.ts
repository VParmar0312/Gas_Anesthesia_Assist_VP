/** Pure arithmetic. Clinical scope and citations live in content/tools.ts. */
export class InputError extends Error {}

export function numberInput(
  text: string,
  label: string,
  min: number,
  max: number,
  allowZero = false,
): number {
  if (!/^\d+(\.\d+)?$/.test(text.trim()))
    throw new InputError(`${label}: enter a number with the displayed unit.`);
  const value = Number(text);
  if (
    !Number.isFinite(value) ||
    value < min ||
    value > max ||
    (!allowZero && value === 0)
  ) {
    throw new InputError(`${label}: enter ${min}–${max}.`);
  }
  return value;
}

function positive(value: number, name: string) {
  if (!Number.isFinite(value) || value <= 0)
    throw new InputError(`${name} must be a positive finite number.`);
}

export function percentToMgMl(percent: number) {
  positive(percent, "Concentration");
  return percent * 10;
}

export function infusionRate(
  doseMcgKgMin: number,
  weightKg: number,
  concentrationMcgMl: number,
) {
  [doseMcgKgMin, weightKg, concentrationMcgMl].forEach((x) =>
    positive(x, "Input"),
  );
  return (doseMcgKgMin * weightKg * 60) / concentrationMcgMl;
}

export function infusionDose(
  rateMlHr: number,
  weightKg: number,
  concentrationMcgMl: number,
) {
  [rateMlHr, weightKg, concentrationMcgMl].forEach((x) => positive(x, "Input"));
  return (rateMlHr * concentrationMcgMl) / (weightKg * 60);
}

export function dilution(
  stockMgMl: number,
  targetMgMl: number,
  finalMl: number,
) {
  [stockMgMl, targetMgMl, finalMl].forEach((x) => positive(x, "Input"));
  if (targetMgMl > stockMgMl)
    throw new InputError(
      "Target concentration cannot exceed the stock concentration.",
    );
  const stockMl = (targetMgMl * finalMl) / stockMgMl;
  return {
    stockMl,
    diluentMl: finalMl - stockMl,
    totalMg: targetMgMl * finalMl,
  };
}

export function predictedBodyWeight(heightCm: number, sex: "male" | "female") {
  if (!Number.isFinite(heightCm) || heightCm < 152.4 || heightCm > 220) {
    throw new InputError(
      "This adult predicted-body-weight tool supports heights 152.4–220 cm. Do not extrapolate.",
    );
  }
  return (sex === "male" ? 50 : 45.5) + 0.91 * (heightCm - 152.4);
}

export function bodyMetrics(
  weightKg: number,
  heightCm: number,
  sex: "male" | "female",
) {
  positive(weightKg, "Weight");
  positive(heightCm, "Height");
  const bmi = weightKg / (heightCm / 100) ** 2;
  if (weightKg < 30 || weightKg > 250 || bmi < 14 || bmi > 60) {
    throw new InputError(
      "Outside this adult tool’s supported weight/BMI domain (30–250 kg; BMI 14–60).",
    );
  }
  return {
    bmi,
    pbw: predictedBodyWeight(heightCm, sex),
    lbw:
      (9270 * weightKg) /
      (sex === "male" ? 6680 + 216 * bmi : 8780 + 244 * bmi),
    bsa: Math.sqrt((heightCm * weightKg) / 3600),
  };
}

export function bloodLoss(
  ebvMl: number,
  initialHct: number,
  targetHct: number,
) {
  positive(ebvMl, "Estimated blood volume");
  if (
    ![initialHct, targetHct].every(
      (x) => Number.isFinite(x) && x > 0 && x <= 100,
    )
  )
    throw new InputError(
      "Hematocrit must be greater than zero and at most 100%.",
    );
  if (targetHct >= initialHct)
    throw new InputError(
      "Target hematocrit must be below the starting hematocrit.",
    );
  return (ebvMl * (initialHct - targetHct)) / initialHct;
}

export function lidocaineCeiling(
  weightKg: number,
  epinephrine: boolean,
  priorMg = 0,
) {
  if (!Number.isFinite(weightKg) || weightKg < 30 || weightKg > 200)
    throw new InputError(
      "This reference is restricted to confirmed healthy adults, 30–200 kg.",
    );
  if (!Number.isFinite(priorMg) || priorMg < 0)
    throw new InputError("Prior dose must be a non-negative finite number.");
  const ceilingMg = Math.min(
    weightKg * (epinephrine ? 7 : 4.5),
    epinephrine ? 500 : 300,
  );
  if (priorMg > 0)
    throw new InputError(
      "Repeated or prior local-anesthetic exposure requires an individualized plan. A new maximum cannot be calculated here.",
    );
  return ceilingMg;
}

export function dantroleneBolus(
  weightKg: number,
  formulation: "20mg" | "250mg",
) {
  if (!Number.isFinite(weightKg) || weightKg < 1 || weightKg > 300)
    throw new InputError(
      "Confirm weight between 1 and 300 kg; outside this range use the source and MH hotline.",
    );
  const doseMg = 2.5 * weightKg;
  const vialMg = formulation === "20mg" ? 20 : 250;
  return {
    doseMg,
    vials: Math.ceil(doseMg / vialMg),
    diluentPerVialMl: formulation === "20mg" ? 60 : 5,
  };
}

export function maintenance421(weightKg: number) {
  if (!Number.isFinite(weightKg) || weightKg < 10 || weightKg > 80)
    throw new InputError(
      "This educational example supports 10–80 kg; it is not a fluid prescription.",
    );
  return weightKg <= 20 ? 40 + (weightKg - 10) * 2 : 60 + weightKg - 20;
}

export function stopBang(answers: (boolean | null)[]) {
  if (answers.length !== 8 || answers.some((a) => a === null)) return null;
  const score = answers.filter(Boolean).length;
  const stopScore = answers.slice(0, 4).filter(Boolean).length;
  const highCombination =
    stopScore >= 2 && (answers[4] || answers[6] || answers[7]);
  return {
    score,
    risk:
      score >= 5 || highCombination
        ? "High screening risk"
        : score >= 3
          ? "Intermediate screening risk"
          : "Low screening risk",
  };
}

export function roundDown(value: number, decimals = 2) {
  return Math.floor(value * 10 ** decimals + 1e-9) / 10 ** decimals;
}
