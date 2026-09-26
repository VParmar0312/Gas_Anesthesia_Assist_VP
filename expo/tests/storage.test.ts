import { test } from "node:test";
import assert from "node:assert/strict";
import { Store } from "../services/store";
import {
  caseCredits,
  deriveRequirements,
  migrateCases,
  mergeCases,
  casesCsv,
  CaseRecord,
} from "../content/cases";
const valid = (v: unknown): v is number[] =>
  Array.isArray(v) && v.every(Number.isFinite);
function memory() {
  const data = new Map<string, string>();
  return {
    data,
    getItem: async (k: string) => data.get(k) ?? null,
    setItem: async (k: string, v: string) => {
      data.set(k, v);
    },
  };
}
test("concurrent updates serialize without dropped changes and preserve previous backup", async () => {
  const kv = memory();
  const s = new Store(kv, "x", [], valid);
  await Promise.all([
    s.update((v) => [...v, 1]),
    s.update((v) => [...v, 2]),
    s.update((v) => [...v, 3]),
  ]);
  assert.deepEqual(s.snapshot().data, [1, 2, 3]);
  assert.deepEqual(JSON.parse(kv.data.get("x:previous")!).data, [1, 2]);
});
test("corruption blocks writes and preserves raw data", async () => {
  const kv = memory();
  kv.data.set("x", "broken");
  const s = new Store(kv, "x", [], valid);
  await s.load();
  await assert.rejects(s.update(() => [1]));
  assert.equal(kv.data.get("x"), "broken");
  assert.ok(s.snapshot().error);
});
test("failed disk write never publishes unsaved result; queue can retry", async () => {
  const kv = memory();
  let fail = true;
  const s = new Store(
    {
      ...kv,
      setItem: async (k, v) => {
        if (fail) throw Error("disk full");
        await kv.setItem(k, v);
      },
    },
    "x",
    [],
    valid,
  );
  await assert.rejects(s.update(() => [1]));
  assert.deepEqual(s.snapshot().data, []);
  fail = false;
  await s.update(() => [2]);
  assert.deepEqual(s.snapshot().data, [2]);
});
test("restoring backup preserves damaged data", async () => {
  const kv = memory();
  kv.data.set("x", "bad");
  kv.data.set("x:previous", JSON.stringify({ version: 1, data: [5] }));
  const s = new Store(kv, "x", [], valid);
  await s.load();
  await s.recoverPrevious();
  assert.deepEqual(s.snapshot().data, [5]);
  assert.ok([...kv.data.keys()].some((k) => k.includes(":recovery:")));
});
const infant: CaseRecord = {
  id: "a",
  month: "2026-09",
  ageMonths: 0,
  asa: 2,
  emergency: false,
  procedure: "Test",
  techniques: ["spinal"],
  credits: ["bypass"],
  note: "",
};
test("facts derive overlapping credits once; delete and edit recalculate", () => {
  assert.deepEqual(
    [...caseCredits(infant)].sort(),
    ["bypass", "cardiac", "p12", "p3", "p3m", "spinal"].sort(),
  );
  assert.equal(
    deriveRequirements([infant]).find((r) => r.id === "p3m")?.completed,
    1,
  );
  assert.equal(
    deriveRequirements([]).find((r) => r.id === "p3m")?.completed,
    0,
  );
  assert.equal(
    deriveRequirements([{ ...infant, ageMonths: 60 }]).find(
      (r) => r.id === "p3m",
    )?.completed,
    0,
  );
});
test("legacy neonate remains zero; uncertain credits await reconciliation", () => {
  const [c] = migrateCases(
    JSON.stringify([
      {
        id: "old",
        date: "2026-01-01",
        patientAge: 0,
        asaClass: 1,
        procedureType: "Legacy",
      },
    ]),
  );
  assert.equal(c.ageMonths, 0);
  assert.equal(c.legacy, true);
  assert.equal(caseCredits(c).size, 0);
});
test("imports deduplicate, reject collisions and escape spreadsheet formulas", () => {
  assert.equal(mergeCases([infant], [infant]).length, 1);
  assert.throws(() => mergeCases([infant], [{ ...infant, asa: 3 }]));
  assert.throws(() => mergeCases([], [{ ...infant, ageMonths: -1 }]));
  assert.match(casesCsv([{ ...infant, note: "=evil()" }]), /"'=evil\(\)"/);
});

test("explicit recovery works without a previous backup and retains corrupt bytes", async () => {
  const kv = memory();
  kv.data.set("x", "broken bytes");
  const s = new Store(kv, "x", [], valid);
  await s.load();
  await s.recoverWith([7]);
  assert.deepEqual(s.snapshot().data, [7]);
  assert.ok(
    [...kv.data.entries()].some(
      ([k, v]) => k.includes(":recovery:") && v === "broken bytes",
    ),
  );
  await s.update((v) => [...v, 8]);
  assert.deepEqual(s.snapshot().data, [7, 8]);
});

test("procedure credits count distinct procedures, not just cases or attempts", () => {
  const record = {
    ...infant,
    techniques: ["spinal", "block"],
    procedureCounts: { spinal: 1, block: 2 },
  };
  assert.equal(
    deriveRequirements([record]).find((r) => r.id === "block")?.completed,
    2,
  );
  assert.equal(
    deriveRequirements([record]).find((r) => r.id === "spinal")?.completed,
    1,
  );
  assert.throws(() =>
    mergeCases([], [{ ...record, procedureCounts: { block: 1.5 } }]),
  );
});
