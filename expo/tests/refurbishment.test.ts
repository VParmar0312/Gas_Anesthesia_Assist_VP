import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeAcidBase, compensationModes } from "../utils/acidBase";
import {
  isPediatricSession,
  parsePediatricContext,
  newPediatricSession,
  ageContext,
} from "../content/pediatric";
import { Store } from "../services/store";
import { contentProblems } from "../content/validate";
import { factProblems, propofolDoses } from "../content/drugDetails";
import { emptyScenario, scenarioMissing } from "../content/anticoagulation";
import { releaseBlockers, ReviewRecord } from "../content/review";
import { checklistProgress } from "../content/preparation";
import { palettes } from "../constants/theme";
const gas = { ph: "7.25", paco2: "26", hco3: "12" };
test("ABG starts empty, validates bounds and never interprets an incomplete optional group", () => {
  assert.throws(() => analyzeAcidBase({}, compensationModes[0]));
  for (const ph of ["", "0", "6.49", "8.01", "NaN", "7.4foo"])
    assert.throws(() => analyzeAcidBase({ ...gas, ph }, compensationModes[0]));
  assert.throws(() =>
    analyzeAcidBase({ ...gas, sodium: "140" }, compensationModes[0]),
  );
  assert.throws(() =>
    analyzeAcidBase({ ...gas, pao2: "100", fio2: "0.5" }, compensationModes[0]),
  );
  assert.throws(() => analyzeAcidBase(gas, "unknown"));
});
test("ABG identifies pH state without choosing a primary process or treatment", () => {
  for (const [ph, expected] of [
    ["7.34", "Acidemia"],
    ["7.35", "Within the reference interval"],
    ["7.45", "Within the reference interval"],
    ["7.46", "Alkalemia"],
  ]) {
    const r = analyzeAcidBase({ ...gas, ph }, compensationModes[0]);
    assert.equal(r[0].value, expected);
    assert.equal(r[2].value, "Model not selected");
  }
});
test("Winter arithmetic and mixed-process prompts use independently hand-calculated examples", () => {
  const r = analyzeAcidBase(gas, "Metabolic acidosis");
  assert.equal(r[2].value, "24–28 mmHg");
  assert.match(r[2].explanation, /within/);
  assert.match(
    analyzeAcidBase({ ...gas, paco2: "40" }, "Metabolic acidosis")[2]
      .explanation,
    /above/,
  );
  assert.match(
    analyzeAcidBase({ ...gas, paco2: "20" }, "Metabolic acidosis")[2]
      .explanation,
    /below/,
  );
  assert.throws(() =>
    analyzeAcidBase({ ...gas, hco3: "24" }, "Metabolic acidosis"),
  );
});
test("respiratory models preserve acute/chronic range differences and reject extrapolated negatives", () => {
  const acid = { ph: "7.3", paco2: "60", hco3: "26" };
  assert.equal(
    analyzeAcidBase(acid, "Respiratory acidosis — acute")[2].value,
    "26–28 mmol/L",
  );
  assert.equal(
    analyzeAcidBase(acid, "Respiratory acidosis — chronic")[2].value,
    "30–32 mmol/L",
  );
  const alk = { ph: "7.5", paco2: "30", hco3: "22" };
  assert.equal(
    analyzeAcidBase(alk, "Respiratory alkalosis — acute")[2].value,
    "22–23 mmol/L",
  );
  assert.equal(
    analyzeAcidBase(alk, "Respiratory alkalosis — chronic")[2].value,
    "19–20 mmol/L",
  );
  assert.throws(() => analyzeAcidBase(acid, "Respiratory alkalosis — acute"));
  assert.equal(
    analyzeAcidBase(
      { ph: "7.5", paco2: "46", hco3: "34" },
      "Metabolic alkalosis",
    )[2].value,
    "46–47.5 mmHg",
  );
});
test("anion gap uses chemistry CO2, explicit albumin reference, delta denominator and oxygen percentage", () => {
  const v = {
    ...gas,
    sodium: "140",
    chloride: "100",
    serumCO2: "16",
    albumin: "2",
    normalAlbumin: "4",
    normalGap: "12",
    normalHco3: "24",
    pao2: "100",
    fio2: "50",
  };
  const r = analyzeAcidBase(v, compensationModes[0]);
  assert.equal(r.find((x) => x.title === "4 / Anion gap")?.value, "24 mmol/L");
  assert.equal(
    r.find((x) => x.title === "Albumin-adjusted gap")?.value,
    "29 mmol/L",
  );
  assert.equal(r.find((x) => x.title.includes("Delta analysis"))?.value, "1.5");
  assert.equal(
    r.find((x) => x.title.includes("Oxygenation"))?.value,
    "200 mmHg",
  );
  assert.throws(() =>
    analyzeAcidBase({ ...v, normalHco3: "16" }, compensationModes[0]),
  );
  assert.throws(() =>
    analyzeAcidBase({ ...v, normalAlbumin: "" }, compensationModes[0]),
  );
  const negative = analyzeAcidBase(
    { ...gas, sodium: "100", chloride: "110", serumCO2: "24" },
    compensationModes[0],
  );
  assert.equal(negative[3].value, "-34 mmol/L");
});
test("zero-month pediatric session survives envelope save/reload and bad values cannot replace it", async () => {
  const values = new Map<string, string>();
  const kv = {
    getItem: async (k: string) => values.get(k) ?? null,
    setItem: async (k: string, v: string) => {
      values.set(k, v);
    },
  };
  const initial = newPediatricSession();
  const store = new Store(kv, "pediatric", initial, isPediatricSession);
  await store.update((v) => ({
    ...v,
    ...parsePediatricContext("0", "3.2"),
    savedAt: "2026-09-26T12:00:00Z",
  }));
  const restored = new Store(kv, "pediatric", initial, isPediatricSession);
  await restored.load();
  assert.equal(restored.snapshot().data.ageMonths, 0);
  assert.match(
    ageContext(restored.snapshot().data.ageMonths),
    /Zero completed months/,
  );
  await assert.rejects(restored.update((v) => ({ ...v, ageMonths: -1 })));
  assert.equal(restored.snapshot().data.ageMonths, 0);
  for (const age of ["", "0.5", "217", "-1"])
    assert.throws(() => parsePediatricContext(age, "3.2"));
  assert.throws(() => parsePediatricContext("0", "0"));
  assert.equal(isPediatricSession({ ...initial, ageMonths: 0 }), false);
});
test("catalog and new field-level schema require source, population, route, formulation and unit", () => {
  assert.deepEqual(contentProblems(), []);
  assert.deepEqual(factProblems(propofolDoses[0], true), []);
  for (const key of [
    "route",
    "population",
    "formulation",
    "sourceId",
    "context",
    "unit",
    "weightBasis",
  ])
    assert.ok(
      factProblems({ ...propofolDoses[0], [key]: "" }, true).length,
      key,
    );
});
test("anticoagulation cannot summarize missing timing, modifiers or an event", () => {
  assert.equal(scenarioMissing(emptyScenario).length, 9);
  const complete = {
    ...emptyScenario,
    ...Object.fromEntries(
      Object.keys(emptyScenario).map((k) => [k, "unknown"]),
    ),
  };
  assert.deepEqual(scenarioMissing(complete as typeof emptyScenario), []);
  assert.deepEqual(
    scenarioMissing({ ...complete, lastDose: "" } as typeof emptyScenario),
    ["lastDose"],
  );
  // Completeness never produces a number or permission: no numeric recommendation API exists.
});
test("release requires authorized reviewer, matching fixture/version, valid dates and future review", () => {
  const r: ReviewRecord = {
    contentId: "x",
    version: "1",
    status: "approved",
    clinicalReviewer: "Reviewer",
    reviewedAt: "2026-09-01",
    reviewDue: "2027-01-01",
    acceptanceFixtureIds: ["f"],
  };
  const fixtures = {
    f: {
      contentId: "x",
      version: "1",
      description: "Boundary acceptance",
      expected: "Explicit expected outcome",
      verifiedBy: "Reviewer",
    },
  };
  const now = new Date("2026-09-26");
  assert.deepEqual(releaseBlockers([r], now, fixtures, ["Reviewer"]), []);
  for (const patch of [
    { acceptanceFixtureIds: [] },
    { version: "2" },
    { reviewedAt: "2028-01-01" },
    { reviewDue: "2026-09-25" },
  ])
    assert.deepEqual(
      releaseBlockers([{ ...r, ...patch }], now, fixtures, ["Reviewer"]),
      ["x"],
    );
  assert.deepEqual(releaseBlockers([r], now, fixtures, []), ["x"]);
});
test("dashboard counts only known checklist IDs once and distinguishes an older session", () => {
  const p = checklistProgress(
    {
      checked: ["machine", "machine", "unknown", "custom-0"],
      custom: ["Local item"],
      startedAt: "2026-09-25T12:00:00Z",
    },
    new Date("2026-09-26T12:00:00Z"),
  );
  assert.deepEqual(p, { done: 2, total: 9, stale: true });
});
function luminance(hex: string) {
  const rgb = hex
    .slice(1)
    .match(/../g)!
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
test("semantic text pairs meet WCAG AA normal-text contrast in both appearances", () => {
  for (const p of Object.values(palettes)) {
    for (const surface of [p.bg, p.surface, p.raised])
      for (const ink of [p.text, p.muted])
        assert.ok(contrast(ink, surface) >= 4.5, `${ink} on ${surface}`);
    for (const tone of Object.values(p.tones))
      assert.ok(
        contrast(tone.ink, tone.fill) >= 4.5,
        `${tone.ink} on ${tone.fill}`,
      );
    assert.ok(contrast(p.onAccent, p.accent) >= 4.5);
    assert.ok(contrast(p.heroMuted, p.hero) >= 4.5);
  }
});
