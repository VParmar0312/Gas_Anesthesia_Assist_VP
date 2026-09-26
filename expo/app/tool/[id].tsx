import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { toolDefinitions, calculateTool } from "../../content/tools";
import {
  Screen,
  Txt,
  Field,
  Choice,
  Check,
  Button,
  Notice,
  Result,
  CitationPanel,
  Accordion,
} from "../../components/ui";
export default function Tool() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tool = toolDefinitions.find((t) => t.id === id);
  const [values, setValues] = useState<Record<string, string>>({}),
    [confirmed, setConfirmed] = useState(false),
    [error, setError] = useState(""),
    [results, setResults] = useState<{ label: string; value: string }[]>([]);
  if (!tool)
    return (
      <Screen title="Tool unavailable" back>
        <Txt>Check the link or search the library.</Txt>
      </Screen>
    );
  const change = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setResults([]);
    setError("");
    setConfirmed(false);
  };
  return (
    <Screen title={tool.title} back>
      <Notice>{tool.scope}</Notice>
      {tool.choices?.map((c) => (
        <Choice
          key={c.id}
          label={c.label}
          value={values[c.id] ?? ""}
          onChange={(v) => change(c.id, v)}
          options={c.values}
        />
      ))}
      {tool.fields.map((f) => (
        <Field
          key={f.id}
          label={f.label}
          unit={
            f.id === "amount" || tool.id === "units"
              ? (values.direction?.split(" → ")[0] ?? f.unit)
              : f.unit
          }
          keyboard="decimal-pad"
          value={values[f.id] ?? ""}
          onChange={(v) => change(f.id, v)}
        />
      ))}
      {tool.confirm && (
        <Check
          label={tool.confirm}
          checked={confirmed}
          onPress={() => {
            setConfirmed(!confirmed);
            setResults([]);
          }}
        />
      )}
      <Button
        title="Calculate"
        onPress={() => {
          try {
            setResults(calculateTool(tool, values, confirmed));
            setError("");
          } catch (e) {
            setResults([]);
            setError((e as Error).message);
          }
        }}
      />
      {error && <Notice error>{error}</Notice>}
      {results.map((r) => (
        <Result key={r.label} {...r} />
      ))}
      <Accordion title="Formula & assumptions">
        <Txt>{tool.formula}</Txt>
        <Txt muted>
          Displayed results are rounded for readability. Verify precision for
          the intended use.
        </Txt>
      </Accordion>
      <CitationPanel ids={tool.sources} />
    </Screen>
  );
}
