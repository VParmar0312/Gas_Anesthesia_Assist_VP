import { Badge, Panel } from "../../../components/ui/clinical";
import React, { useEffect, useState } from "react";
import { AppState } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  Screen,
  Txt,
  Heading,
  Card,
  Notice,
  Button,
  Check,
  Field,
  Choice,
  Result,
  CitationPanel,
  AsyncButton,
} from "../../../components/ui";
import { crises } from "../../../content/crises";
import { crisisEntries } from "../../../content/catalog";
import {
  crisisStore,
  preferencesStore,
  useStore,
} from "../../../services/data";
import { dantroleneBolus, numberInput } from "../../../utils/calculations";
const aliases: Record<string, string> = {
  "1": "mh",
  "malignant-hyperthermia": "mh",
  "2": "last",
  "3": "anaphylaxis",
  "4": "failed-airway",
  "difficult-airway": "failed-airway",
  "5": "hemorrhage",
  "massive-transfusion": "hemorrhage",
  "6": "hypoxia",
};
export default function Protocol() {
  const { protocolId } = useLocalSearchParams<{ protocolId: string }>();
  const id = aliases[protocolId] ?? protocolId;
  const guide = crises.find((c) => c.id === id),
    entry = crisisEntries.find((c) => c.id === id);
  const { data, loaded, error } = useStore(crisisStore),
    { data: p } = useStore(preferencesStore);
  const [now, setNow] = useState(Date.now()),
    [reset, setReset] = useState(false),
    [starting, setStarting] = useState(false),
    [ending, setEnding] = useState(false),
    [failure, setFailure] = useState(""),
    [weight, setWeight] = useState(""),
    [form, setForm] = useState(""),
    [confirmed, setConfirmed] = useState(false),
    [dose, setDose] = useState<ReturnType<typeof dantroleneBolus> | null>(null);
  const session = data.find((s) => s.protocol === id);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000),
      sub = AppState.addEventListener("change", () => setNow(Date.now()));
    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, []);
  if (!guide || !entry)
    return (
      <Screen title="Protocol unavailable" back>
        <Txt>Return to the crisis library.</Txt>
      </Screen>
    );
  const elapsed = session
    ? Math.max(0, Math.floor((now - session.startedAt) / 1000))
    : 0;
  const toggle = (step: string) => {
    void crisisStore
      .update((v) =>
        v.map((s) =>
          s.protocol === id
            ? {
                ...s,
                checked: s.checked.includes(step)
                  ? s.checked.filter((x) => x !== step)
                  : [...s.checked, step],
              }
            : s,
        ),
      )
      .catch((e) => setFailure(e.message));
  };
  return (
    <Screen title={entry.title} back>
      <Badge label="CRISIS REFERENCE · CALL FOR HELP" tone="rose" />
      <Notice>{guide.scope}</Notice>
      {p.emergencyContact && (
        <Txt bold>Local contact: {p.emergencyContact}</Txt>
      )}
      {(error || failure) && <Notice error>{error || failure}</Notice>}
      <Heading>Actions</Heading>
      {guide.actions.map((a, i) => (
        <Panel
          key={a.id}
          title={`${i + 1}. ${a.title}`}
          tone="rose"
          icon="crisis"
        >
          <Txt>{a.detail}</Txt>
          {session && (
            <Check
              label="Action acknowledged (clinical reassessment still required)"
              checked={session.checked.includes(a.id)}
              onPress={() => toggle(a.id)}
            />
          )}
        </Panel>
      ))}
      {guide.cautions.map((c) => (
        <Notice key={c}>{c}</Notice>
      ))}
      <Card>
        {session ? (
          <>
            <Txt bold>
              Recorded event started{" "}
              {new Date(session.startedAt).toLocaleString()}
            </Txt>
            <Txt size={26}>
              Elapsed {Math.floor(elapsed / 60)}:
              {String(elapsed % 60).padStart(2, "0")}
            </Txt>
            <Txt muted>
              Elapsed wall-clock time, not a dosing alarm. Verify the event
              start when returning to the app. Device clock changes can affect
              this timer.
            </Txt>
            <Button
              title="End this event"
              subtle
              onPress={() => setEnding(true)}
            />
            {ending && (
              <>
                <Notice>
                  End this event and clear its active progress? The previous
                  saved state remains in local recovery data.
                </Notice>
                <AsyncButton
                  title="Confirm end event"
                  action={async () => {
                    await crisisStore.update((v) =>
                      v.filter((s) => s.protocol !== id),
                    );
                    setEnding(false);
                    setReset(false);
                    setWeight("");
                    setForm("");
                    setConfirmed(false);
                    setDose(null);
                  }}
                />
                <Button
                  title="Continue event"
                  subtle
                  onPress={() => setEnding(false)}
                />
              </>
            )}
            <Button
              title="Reset / start a different event"
              subtle
              onPress={() => setReset(true)}
            />
          </>
        ) : (
          <>
            <Txt>
              Read actions immediately. Starting an event enables saved
              checkmarks and elapsed time.
            </Txt>
            {!starting ? (
              <Button
                title="Start new event"
                onPress={() => setStarting(true)}
              />
            ) : (
              <>
                <Txt>Start a new saved event and elapsed timer?</Txt>
                <AsyncButton
                  title="Confirm start event"
                  action={async () => {
                    if (!loaded)
                      throw Error(
                        "Storage still loading. Actions remain available above.",
                      );
                    await crisisStore.update((v) => [
                      ...v.filter((s) => s.protocol !== id),
                      { protocol: id, startedAt: Date.now(), checked: [] },
                    ]);
                    setWeight("");
                    setForm("");
                    setConfirmed(false);
                    setDose(null);
                    setFailure("");
                    setStarting(false);
                  }}
                />
                <Button
                  title="Read without starting"
                  subtle
                  onPress={() => setStarting(false)}
                />
              </>
            )}
          </>
        )}
        {reset && (
          <>
            <Notice>
              Clear saved progress and restart elapsed time for this protocol?
            </Notice>
            <AsyncButton
              title="Confirm new event"
              action={async () => {
                await crisisStore.update((v) => [
                  ...v.filter((s) => s.protocol !== id),
                  { protocol: id, startedAt: Date.now(), checked: [] },
                ]);
                setReset(false);
                setWeight("");
                setForm("");
                setConfirmed(false);
                setDose(null);
                setFailure("");
              }}
            />
            <Button title="Keep event" subtle onPress={() => setReset(false)} />
          </>
        )}
      </Card>
      {id === "mh" && (
        <>
          <Heading>Dantrolene initial bolus arithmetic</Heading>
          <Field
            label="Confirmed patient weight"
            unit="kg"
            keyboard="decimal-pad"
            value={weight}
            onChange={(v) => {
              setWeight(v);
              setDose(null);
              setConfirmed(false);
            }}
          />
          <Choice
            label="Exact vial formulation"
            value={form}
            onChange={(v) => {
              setForm(v);
              setDose(null);
              setConfirmed(false);
            }}
            options={["Dantrium / Revonto 20 mg", "Ryanodex 250 mg"]}
          />
          <Check
            label="I confirmed measured weight and the available formulation."
            checked={confirmed}
            onPress={() => {
              setConfirmed(!confirmed);
              setDose(null);
            }}
          />
          <Button
            title="Calculate 2.5 mg/kg initial bolus"
            onPress={() => {
              try {
                if (!confirmed || !form)
                  throw Error("Confirm weight and formulation first.");
                setDose(
                  dantroleneBolus(
                    numberInput(weight, "Weight", 1, 300),
                    form.includes("250") ? "250mg" : "20mg",
                  ),
                );
                setFailure("");
              } catch (e) {
                setDose(null);
                setFailure((e as Error).message);
              }
            }}
          />
          {dose && (
            <>
              <Result
                label="Initial bolus amount"
                value={`${dose.doseMg} mg`}
              />
              <Result
                label="Vials required to supply this amount"
                value={`${dose.vials} vial(s)`}
                detail={`Reconstitute each vial with ${dose.diluentPerVialMl} mL sterile water according to the exact product instructions. A vial count is not the dose to administer.`}
              />
            </>
          )}
        </>
      )}
      <CitationPanel ids={entry.sources} />
    </Screen>
  );
}
