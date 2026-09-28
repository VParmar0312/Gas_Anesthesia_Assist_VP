import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Screen,
  Txt,
  Field,
  Choice,
  Check,
  Heading,
  Accordion,
  AsyncButton,
  Notice,
} from "../../../components/ui";
import { caseStore, useStore } from "../../../services/data";
import { CaseRecord, creditOptions, isCases } from "../../../content/cases";
import { numberInput } from "../../../utils/calculations";
function Form({ existing }: { existing?: CaseRecord }) {
  const router = useRouter();
  const [month, setMonth] = useState(
      existing?.month ?? new Date().toISOString().slice(0, 7),
    ),
    [age, setAge] = useState(existing ? String(existing.ageMonths) : ""),
    [asa, setAsa] = useState(existing ? String(existing.asa) : ""),
    [procedure, setProcedure] = useState(existing?.procedure ?? ""),
    [note, setNote] = useState(existing?.note ?? ""),
    [emergency, setEmergency] = useState(existing?.emergency ?? false),
    [techniques, setTechniques] = useState(existing?.techniques ?? []),
    [credits, setCredits] = useState(existing?.credits ?? []),
    [reviewed, setReviewed] = useState(false);
  const [counts, setCounts] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(existing?.procedureCounts ?? {}).map(([k, n]) => [
        k,
        String(n),
      ]),
    ),
  );
  const [openBrain, setOpenBrain] = useState(
    existing?.intracerebralOpen === undefined
      ? ""
      : existing.intracerebralOpen
        ? "Yes"
        : "No",
  );
  const toggle = (v: string, list: string[], set: (v: string[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  return (
    <Screen title={existing ? "Edit case" : "Log a case"} back>
      <Notice>
        Do not enter patient names, MRNs, dates of birth or identifying clinical
        narratives. Month-level dates reduce detail but do not guarantee
        de-identification.
      </Notice>
      {existing?.legacy && (
        <Notice>
          Legacy record: confirm age, techniques and qualifying experiences
          before saving. Old counter values are not imported as official credit.
        </Notice>
      )}
      <Field
        label="Case month"
        unit="YYYY-MM"
        value={month}
        onChange={setMonth}
      />
      <Field
        label="Age at procedure"
        unit="completed months; 0 is valid"
        value={age}
        onChange={setAge}
        keyboard="decimal-pad"
      />
      <Choice
        label="ASA physical status"
        value={asa}
        options={["1", "2", "3", "4", "5", "6"]}
        onChange={setAsa}
      />
      <Check
        label="Emergency case"
        checked={emergency}
        onPress={() => setEmergency(!emergency)}
      />
      <Field
        label="Procedure category (no identifying details)"
        value={procedure}
        onChange={setProcedure}
      />
      <Heading>Techniques</Heading>
      {["general", "sedation", "epidural", "spinal", "block"].map((t) => (
        <Check
          key={t}
          label={t}
          checked={techniques.includes(t)}
          onPress={() => toggle(t, techniques, setTechniques)}
        />
      ))}
      {["epidural", "spinal", "block"]
        .filter((t) => techniques.includes(t))
        .map((t) => (
          <Field
            key={t}
            label={`Number of distinct ${t} procedures`}
            unit="procedures, not attempts"
            keyboard="decimal-pad"
            value={counts[t] ?? "1"}
            onChange={(v) => setCounts((c) => ({ ...c, [t]: v }))}
          />
        ))}
      <Accordion title="Specialty experiences (optional)">
        <Txt muted>
          Select only what this record represents. Pediatric and technique
          credits are derived automatically. Each case category is counted once;
          technique procedure counts are entered separately.
        </Txt>
        {creditOptions.map(([id, title]) => (
          <Check
            key={id}
            label={title}
            checked={credits.includes(id)}
            onPress={() => toggle(id, credits, setCredits)}
          />
        ))}
        {credits.includes("brain") && (
          <Choice
            label="Was the intracerebral procedure open?"
            options={["Yes", "No"]}
            value={openBrain}
            onChange={setOpenBrain}
          />
        )}
      </Accordion>
      <Accordion title="Personal learning note (optional)">
        <Field
          label="Optional learning note (no patient details)"
          value={note}
          onChange={setNote}
          multiline
        />
      </Accordion>
      <Check
        label="I verified these facts and removed identifying details."
        checked={reviewed}
        onPress={() => setReviewed(!reviewed)}
      />
      <AsyncButton
        title="Save case"
        action={async () => {
          if (!reviewed) throw Error("Confirm the record before saving.");
          const ageMonths = numberInput(age, "Age in months", 0, 1440, true);
          if (!Number.isInteger(ageMonths))
            throw Error("Enter whole completed months.");
          const procedureCounts: CaseRecord["procedureCounts"] = {};
          for (const t of ["epidural", "spinal", "block"] as const)
            if (techniques.includes(t)) {
              const n = numberInput(
                counts[t] ?? "1",
                `${t} procedure count`,
                0,
                20,
                true,
              );
              if (!Number.isInteger(n))
                throw Error("Procedure counts must be whole numbers.");
              procedureCounts[t] = n;
            }
          if (credits.includes("brain") && !openBrain)
            throw Error(
              "Confirm whether the intracerebral procedure was open.",
            );
          const record: CaseRecord = {
            id:
              existing?.id ??
              `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            month,
            ageMonths,
            asa: Number(asa),
            procedure: procedure.trim(),
            note: note.trim(),
            emergency,
            techniques,
            credits,
            procedureCounts,
            ...(credits.includes("brain")
              ? { intracerebralOpen: openBrain === "Yes" }
              : {}),
          };
          if (!isCases([record]))
            throw Error(
              "Check month, ASA, procedure and note length (maximum 1,000 characters).",
            );
          await caseStore.update((current) =>
            existing
              ? current.map((c) => (c.id === record.id ? record : c))
              : [record, ...current],
          );
          router.replace("/(tabs)/cases");
        }}
      />
    </Screen>
  );
}
export default function NewCase() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data, loaded, error } = useStore(caseStore);
  if (!loaded)
    return (
      <Screen title="Loading case log" back>
        <Txt>Please wait.</Txt>
      </Screen>
    );
  if (error)
    return (
      <Screen title="Case log needs recovery" back>
        <Notice error>{error}</Notice>
      </Screen>
    );
  const existing = data.find((c) => c.id === id);
  if (id && !existing)
    return (
      <Screen title="Case not found" back>
        <Txt>The record may have been removed.</Txt>
      </Screen>
    );
  return <Form key={id ?? "new"} existing={existing} />;
}
