import { test } from "node:test";
import assert from "node:assert/strict";
import { catalog } from "../content/catalog";
import { sources } from "../content/sources";
import { toolDefinitions, calculateTool } from "../content/tools";
import { searchEntries } from "../services/search";
import { crises } from "../content/crises";
import { redirectSystemPath } from "../app/+native-intent";
test("catalog identifiers, sources, related entries and tool/crisis links resolve", () => {
  const ids = catalog.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const entry of catalog) {
    for (const id of entry.sources)
      assert.ok(sources[id], `${entry.id}: missing source ${id}`);
    for (const id of entry.related)
      assert.ok(ids.includes(id), `${entry.id}: broken related ${id}`);
    if (entry.kind === "tool")
      assert.ok(
        ["airway", "preflight"].includes(entry.id) ||
          toolDefinitions.some((t) => t.id === entry.id),
      );
    if (entry.kind === "crisis")
      assert.ok(crises.some((c) => c.id === entry.id));
  }
  for (const source of Object.values(sources))
    assert.equal(new URL(source.url).protocol, "https:");
});
test("search ranks exact aliases, handles a typo and filters content type", () => {
  assert.equal(searchEntries(catalog, "Bridion")[0].id, "drug-17");
  assert.equal(searchEntries(catalog, "propfol")[0].id, "drug-1");
  assert.ok(
    searchEntries(catalog, "", "procedure").every(
      (e) => e.kind === "procedure",
    ),
  );
  assert.deepEqual(searchEntries(catalog, "zzzzzzzzzz"), []);
});
test("each calculator rejects an empty form and never supplies a dosing weight", () => {
  for (const tool of toolDefinitions)
    assert.throws(() => calculateTool(tool, {}, false), tool.id);
});
test("infusion units, scenario confirmation, result ranges and gradients are enforced", () => {
  const infusion = toolDefinitions.find((t) => t.id === "infusion")!;
  assert.deepEqual(
    calculateTool(
      infusion,
      {
        weight: "70",
        amount: "0.1",
        concentration: "16",
        direction: "mcg/kg/min → mL/h",
      },
      false,
    ),
    [{ label: "Converted value", value: "26.25 mL/h" }],
  );
  const la = toolDefinitions.find((t) => t.id === "lidocaine")!;
  assert.throws(() =>
    calculateTool(la, { weight: "70", percent: "1", epi: "No" }, false),
  );
  assert.equal(
    calculateTool(la, { weight: "70", percent: "1", epi: "No" }, true)[0].value,
    "300 mg",
  );
  const vent = toolDefinitions.find((t) => t.id === "ventilation")!;
  assert.throws(() =>
    calculateTool(
      vent,
      { vt: "500", rr: "12", pao2: "100", fio2: "0.5" },
      false,
    ),
  );
  assert.equal(
    calculateTool(
      vent,
      { vt: "500", rr: "12", pao2: "100", fio2: "50" },
      false,
    )[1].value,
    "200 mmHg",
  );
});
test("cold and warm deep links preserve destinations and query parameters", () => {
  assert.equal(
    redirectSystemPath({
      path: "gas-anesthesia://tool/lidocaine?source=home",
      initial: true,
    }),
    "/tool/lidocaine?source=home",
  );
  assert.equal(
    redirectSystemPath({ path: "/library/drug-1", initial: false }),
    "/library/drug-1",
  );
});

test("clinical release cannot silently treat a draft or expired review as approved", async () => {
  const { releaseBlockers, reviewRecords } = await import("../content/review");
  assert.equal(releaseBlockers(reviewRecords).length, catalog.length);
  assert.deepEqual(
    releaseBlockers(
      [
        {
          contentId: "x",
          version: "1",
          status: "approved",
          clinicalReviewer: "Reviewer",
          reviewedAt: "2026-01-01",
          reviewDue: "2027-01-01",
          acceptanceFixtureIds: ["fixture"],
        },
      ],
      new Date("2026-09-25"),
      {
        fixture: {
          contentId: "x",
          version: "1",
          description: "Acceptance",
          expected: "Verified result",
          verifiedBy: "Reviewer",
        },
      },
      ["Reviewer"],
    ),
    [],
  );
  assert.deepEqual(
    releaseBlockers(
      [
        {
          contentId: "x",
          version: "1",
          status: "approved",
          clinicalReviewer: "Reviewer",
          reviewedAt: "2026-01-01",
          reviewDue: "2026-01-02",
        },
      ],
      new Date("2026-09-25"),
    ),
    ["x"],
  );
});

test("small positive arithmetic outputs are not rounded to a false zero", () => {
  const tool = toolDefinitions.find((t) => t.id === "infusion")!;
  const [result] = calculateTool(
    tool,
    {
      weight: "1",
      amount: "0.000001",
      concentration: "100000",
      direction: "mcg/kg/min → mL/h",
    },
    false,
  );
  assert.notEqual(result.value, "0 mL/h");
  assert.match(result.value, /0\.0000000006 mL\/h/);
});
