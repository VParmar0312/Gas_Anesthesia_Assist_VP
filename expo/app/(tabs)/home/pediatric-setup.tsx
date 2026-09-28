import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Screen,
  Txt,
  Notice,
  Field,
  Check,
  AsyncButton,
  Button,
  CitationPanel,
} from "../../../components/ui";
import { Panel, Badge, Progress } from "../../../components/ui/clinical";
import { pediatricStore, useStore } from "../../../services/data";
import {
  parsePediatricContext,
  ageContext,
  pediatricChecks,
  pediatricModules,
  newPediatricSession,
  PediatricSession,
} from "../../../content/pediatric";
function PediatricForm({ session }: { session: PediatricSession }) {
  const router = useRouter(),
    { data, error } = useStore(pediatricStore);
  const [age, setAge] = useState(
      session.ageMonths === null ? "" : String(session.ageMonths),
    ),
    [weight, setWeight] = useState(
      session.weightKg === null ? "" : String(session.weightKg),
    ),
    [checks, setChecks] = useState(session.checked),
    [reset, setReset] = useState(false),
    [dirty, setDirty] = useState(false),
    [saved, setSaved] = useState(false);
  const change = (set: (s: string) => void) => (value: string) => {
    set(value);
    setChecks([]);
    setDirty(true);
    setSaved(false);
  };
  const stale =
    new Date(session.startedAt).toDateString() !== new Date().toDateString();
  return (
    <Screen
      title="Pediatric preparation"
      subtitle="An explicit context. A carefully prepared workspace."
      back
    >
      <Badge label="DEVICE & DRUG OUTPUTS PENDING REVIEW" tone="blue" />
      <Notice>
        No pediatric dose or size recommendations are published. Use an approved
        pediatric reference and the exact device/product instructions.
      </Notice>
      {error && <Notice error>{error}</Notice>}
      {stale && (
        <Notice>
          Previous-day session. Start a new session before preparing for another
          case. Saved values are shown for review, not automatically reused.
        </Notice>
      )}
      <Panel
        title="Preparation context"
        subtitle={
          session.savedAt
            ? `Saved ${new Date(session.savedAt).toLocaleString()}`
            : "No saved measurements"
        }
        tone="blue"
        icon="baby"
      >
        <Field
          label="Age"
          unit="completed months"
          keyboard="decimal-pad"
          value={age}
          onChange={change(setAge)}
        />
        <Field
          label="Confirmed measured weight"
          unit="kg"
          keyboard="decimal-pad"
          value={weight}
          onChange={change(setWeight)}
        />
        <Txt muted size={13}>
          Zero months is valid. No patient identifiers. Values remain on this
          device until the session is reset; verify before reuse.
        </Txt>
        {!dirty && data.savedAt && (
          <Badge label={ageContext(data.ageMonths)} tone="blue" />
        )}
      </Panel>
      <Panel title="Preparation review" tone="teal" icon="check">
        <Progress
          label="Checks acknowledged"
          value={checks.length}
          total={pediatricChecks.length}
        />
        {pediatricChecks.map((label) => (
          <Check
            key={label}
            label={label}
            checked={checks.includes(label)}
            disabled={stale}
            onPress={() => {
              setChecks((v) =>
                v.includes(label)
                  ? v.filter((x) => x !== label)
                  : [...v, label],
              );
              setDirty(true);
              setSaved(false);
            }}
          />
        ))}
        <AsyncButton
          title="Save preparation session"
          action={async () => {
            if (stale)
              throw Error(
                "Start a new session before saving current preparation.",
              );
            const parsed = parsePediatricContext(age, weight);
            await pediatricStore.update((v) => ({
              ...v,
              ...parsed,
              savedAt: new Date().toISOString(),
              checked: checks,
            }));
            setDirty(false);
            setSaved(true);
          }}
        />
        {dirty && (
          <Txt muted>
            Unsaved changes. Context edits clear prior checkmarks.
          </Txt>
        )}
        {saved && <Txt>Preparation saved on this device.</Txt>}
      </Panel>
      {pediatricModules.map((m) => (
        <Panel key={m.title} title={m.title} tone={m.tone} icon={m.icon}>
          <Badge label="PENDING PEDIATRIC / DEVICE REVIEW" tone="amber" />
          <Txt>{m.text}</Txt>
        </Panel>
      ))}
      <Panel title="Crisis preparation" tone="rose" icon="crisis">
        <Txt>
          Locate the institution’s pediatric emergency resources and agree on
          escalation. The bundled crisis collection has its own population
          limits and must not be assumed to supply pediatric regimens.
        </Txt>
        <Button
          title="Open crisis references and check scope"
          danger
          onPress={() => router.push("/(tabs)/crisis")}
        />
      </Panel>
      <Button
        title="Start new pediatric session"
        subtle
        onPress={() => setReset(true)}
      />
      {reset && (
        <Notice>
          <Txt>Clear saved age, weight and checkmarks for a new session?</Txt>
          <AsyncButton
            title="Confirm new pediatric session"
            action={async () => {
              await pediatricStore.update(() => newPediatricSession());
              setAge("");
              setWeight("");
              setChecks([]);
              setDirty(false);
              setSaved(false);
              setReset(false);
            }}
          />
          <Button
            title="Keep pediatric session"
            subtle
            onPress={() => setReset(false)}
          />
        </Notice>
      )}
      <CitationPanel ids={[]} />
    </Screen>
  );
}
export default function Pediatrics() {
  const { data, loaded } = useStore(pediatricStore);
  return loaded ? (
    <PediatricForm key={data.startedAt} session={data} />
  ) : (
    <Screen title="Pediatric preparation" back>
      <Txt>Loading local preparation session…</Txt>
    </Screen>
  );
}
