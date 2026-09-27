import React, { useState } from "react";
import {
  Screen,
  Txt,
  Field,
  Choice,
  Button,
  Notice,
  Accordion,
  CitationPanel,
} from "../components/ui";
import { Panel, Badge } from "../components/ui/clinical";
import {
  analyzeAcidBase,
  compensationModes,
  AcidBaseResult,
} from "../utils/acidBase";
const fields = {
  gas: [
    ["ph", "Arterial pH", "pH units"],
    ["paco2", "Arterial CO₂ partial pressure", "mmHg"],
    ["hco3", "Blood-gas bicarbonate", "mmol/L"],
  ],
  gap: [
    ["sodium", "Serum sodium", "mmol/L"],
    ["chloride", "Serum chloride", "mmol/L"],
    ["serumCO2", "Serum total CO₂", "mmol/L"],
    ["albumin", "Measured albumin (optional pair)", "g/dL"],
    ["normalAlbumin", "Reference albumin for correction", "g/dL"],
    [
      "normalGap",
      "Reference anion gap for delta ratio (optional pair)",
      "mmol/L",
    ],
    ["normalHco3", "Reference bicarbonate for delta ratio", "mmol/L"],
  ],
  oxygen: [
    ["pao2", "Arterial oxygen partial pressure", "mmHg"],
    ["fio2", "Inspired oxygen", "%"],
  ],
};
export default function AcidBase() {
  const [values, setValues] = useState<Record<string, string>>({}),
    [model, setModel] = useState<string>(compensationModes[0]),
    [results, setResults] = useState<AcidBaseResult[]>([]),
    [error, setError] = useState("");
  const change = (id: string, value: string) => {
    setValues((v) => ({ ...v, [id]: value }));
    setResults([]);
    setError("");
  };
  const inputs = (rows: string[][]) =>
    rows.map(([id, label, unit]) => (
      <Field
        key={id}
        label={label}
        unit={unit}
        keyboard="decimal-pad"
        value={values[id] ?? ""}
        onChange={(v) => change(id, v)}
      />
    ));
  return (
    <Screen
      title="ABG interpretation"
      subtitle="An educational worksheet, not an autonomous diagnosis."
      back
    >
      <Badge label="ADULT ARTERIAL SAMPLES · REVIEW PENDING" tone="amber" />
      <Notice>
        Confirm sample type, timing, units and clinical context. Input limits
        are app restrictions, not validated physiologic limits. This tool
        supplies arithmetic and prompts; it does not choose treatment.
      </Notice>
      <Panel title="1 / Enter the gas" tone="teal" icon="activity">
        {inputs(fields.gas)}
      </Panel>
      <Panel
        title="2 / Select a model, if appropriate"
        tone="purple"
        icon="layers"
      >
        <Choice
          label="Primary process being assessed"
          options={compensationModes}
          value={model}
          onChange={(v) => {
            setModel(v);
            setResults([]);
            setError("");
          }}
        />
        <Txt muted size={13}>
          No process is selected automatically. Respiratory models use explicit
          40 mmHg CO₂ and 24 mmol/L bicarbonate reference constants; acute
          versus chronic is a clinical judgment.
        </Txt>
      </Panel>
      <Accordion
        title="Optional / Anion gap, albumin & delta analysis"
        tone="blue"
      >
        <Txt>
          Use contemporaneous chemistry values. If any gap input is entered,
          sodium, chloride and serum total CO₂ are required. Corrections require
          both members of each optional pair.
        </Txt>
        {inputs(fields.gap)}
      </Accordion>
      <Accordion title="Optional / Oxygenation" tone="blue">
        {inputs(fields.oxygen)}
      </Accordion>
      <Button
        title="Review arithmetic step by step"
        onPress={() => {
          try {
            setResults(analyzeAcidBase(values, model));
            setError("");
          } catch (e) {
            setResults([]);
            setError((e as Error).message);
          }
        }}
      />
      <Button
        title="Reset all inputs"
        subtle
        onPress={() => {
          setValues({});
          setResults([]);
          setError("");
          setModel(compensationModes[0]);
        }}
      />
      {error && <Notice error>{error}</Notice>}
      {results.map((r) => (
        <Panel key={r.title} title={r.title} tone="blue" icon="lab">
          <Txt size={23} bold>
            {r.value}
          </Txt>
          <Txt>{r.explanation}</Txt>
        </Panel>
      ))}
      {!!results.length && (
        <Notice>
          Mixed processes, sampling errors and clinical instability need direct
          assessment. Values within an approximate range do not establish normal
          physiology. Results clear whenever inputs or the selected model
          change.
        </Notice>
      )}
      <Accordion title="Formulas, rounding & limitations">
        <Txt>
          Displayed arithmetic rounds to two decimal places; calculations retain
          precision. Gap excludes potassium. Albumin adjustment uses 2.5 mmol/L
          per g/dL difference from your entered reference. Delta analysis uses
          the uncorrected gap and your reference values, without diagnostic
          bands. P/F divides PaO₂ by fractional FiO₂. Compensation is
          approximate; see the selected result for its formula.
        </Txt>
        <Txt muted>
          Venous samples, pediatric interpretation, automated etiologic
          diagnosis, treatment advice and A–a gradient are outside scope.
        </Txt>
      </Accordion>
      <CitationPanel ids={["acid-base", "figge"]} />
    </Screen>
  );
}
