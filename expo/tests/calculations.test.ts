import { test } from "node:test";
import assert from "node:assert/strict";
import {
  numberInput,
  percentToMgMl,
  infusionRate,
  infusionDose,
  dilution,
  predictedBodyWeight,
  bodyMetrics,
  bloodLoss,
  lidocaineCeiling,
  dantroleneBolus,
  stopBang,
  roundDown,
} from "../utils/calculations";

test("label ceilings cap both normal and high weights; exposure cannot reset a limit", () => {
  assert.equal(lidocaineCeiling(70, false), 300);
  assert.equal(lidocaineCeiling(200, true), 500);
  assert.equal(lidocaineCeiling(40, false), 180);
  for (const w of [0, -1, 5, NaN, Infinity, 201])
    assert.throws(() => lidocaineCeiling(w, false));
  assert.throws(() => lidocaineCeiling(70, false, 10));
});
test("concentration and infusion dimensional checks use independent examples", () => {
  assert.equal(percentToMgMl(0.5), 5);
  assert.equal(infusionRate(0.1, 70, 16), 26.25);
  assert.equal(infusionDose(26.25, 70, 16), 0.1);
  assert.deepEqual(dilution(10, 1, 50), {
    stockMl: 5,
    diluentMl: 45,
    totalMg: 50,
  });
  assert.throws(() => dilution(1, 10, 50));
  assert.throws(() => infusionRate(1, 70, 0));
});
test("no silent invalid Hct or body metric clamping", () => {
  assert.equal(bloodLoss(4900, 40, 25), 1837.5);
  for (const h of [40, 45, 0, NaN]) assert.throws(() => bloodLoss(4900, 40, h));
  assert.equal(predictedBodyWeight(152.4, "male"), 50);
  assert.throws(() => predictedBodyWeight(100, "male"));
  assert.throws(() => bodyMetrics(200, 100, "male"));
  assert.ok(bodyMetrics(70, 170, "male").lbw > 50);
});
test("strict number parsing distinguishes missing, zero, units and malformed input", () => {
  for (const input of ["", "1e2", "70kg", "-1", "Infinity", "0"])
    assert.throws(() => numberInput(input, "Weight", 1, 200));
  assert.equal(numberInput("0", "Prior dose", 0, 1000, true), 0);
  assert.equal(numberInput("0.5", "Age", 0, 120, true), 0.5);
});
test("MH calculates bolus and product-specific vials without a false maximum", () => {
  assert.deepEqual(dantroleneBolus(70, "20mg"), {
    doseMg: 175,
    vials: 9,
    diluentPerVialMl: 60,
  });
  assert.deepEqual(dantroleneBolus(70, "250mg"), {
    doseMg: 175,
    vials: 1,
    diluentPerVialMl: 5,
  });
  assert.equal(dantroleneBolus(21, "20mg").doseMg, 52.5);
});
test("unanswered screening is not a negative answer; combination pathway preserved", () => {
  assert.equal(stopBang(Array(8).fill(null)), null);
  assert.equal(
    stopBang([true, true, false, false, false, false, false, true])?.risk,
    "High screening risk",
  );
  assert.equal(stopBang(Array(8).fill(false))?.score, 0);
  assert.equal(roundDown(7.999), 7.99);
});
