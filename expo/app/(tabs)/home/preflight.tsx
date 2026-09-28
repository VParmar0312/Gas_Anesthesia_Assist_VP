import React, { useState } from "react";
import {
  Screen,
  Txt,
  Heading,
  Check,
  AsyncButton,
  Notice,
  Field,
  Card,
} from "../../../components/ui";
import {
  checklistStore,
  freshSession,
  preferencesStore,
  useStore,
} from "../../../services/data";
import {
  preparationItems,
  checklistProgress,
} from "../../../content/preparation";
import { Panel, Progress } from "../../../components/ui/clinical";
const items = preparationItems.map((i) => [i.id, i.label]);
export default function Preparation() {
  const { data: s, loaded, error } = useStore(checklistStore),
    { data: p } = useStore(preferencesStore);
  const [custom, setCustom] = useState(""),
    [failure, setFailure] = useState(""),
    [reset, setReset] = useState(false);
  const stale =
    new Date(s.startedAt).toDateString() !== new Date().toDateString();
  const all = [...items, ...s.custom.map((label, i) => [`custom-${i}`, label])];
  const toggle = (id: string) => {
    setFailure("");
    void checklistStore
      .update((v) => ({
        ...v,
        checked: v.checked.includes(id)
          ? v.checked.filter((x) => x !== id)
          : [...v.checked, id],
      }))
      .catch((e) => setFailure(e.message));
  };
  return (
    <Screen
      title="Room preparation"
      subtitle="Checklist state belongs to a preparation session."
      back
    >
      {(error || failure) && <Notice error>{error || failure}</Notice>}
      <Card>
        <Txt bold>Session started {new Date(s.startedAt).toLocaleString()}</Txt>
        <Txt>
          {s.checked.filter((id) => all.some(([key]) => key === id)).length} /{" "}
          {all.length} items checked
        </Txt>
        <Txt muted>
          Completion records your checks; it does not certify room or patient
          readiness.
        </Txt>
      </Card>
      {stale && (
        <Notice>
          Previous-day session. Start a new session before using this checklist
          for current preparation.
        </Notice>
      )}
      <Progress
        label="Session checks"
        value={checklistProgress(s).done}
        total={all.length}
      />
      {[...new Set(preparationItems.map((i) => i.group))].map((group) => {
        const groupItems = preparationItems.filter((i) => i.group === group);
        return (
          <Panel
            key={group}
            title={group}
            tone={groupItems[0].tone}
            icon="check"
          >
            {groupItems.map(({ id, label }) => (
              <Check
                key={id}
                label={label}
                checked={s.checked.includes(id)}
                disabled={!loaded || stale || !!error}
                onPress={() => toggle(id)}
              />
            ))}
          </Panel>
        );
      })}
      {!!s.custom.length && (
        <Panel title="Your local checks" tone="green" icon="check">
          {s.custom.map((label, i) => (
            <Check
              key={i}
              label={label}
              checked={s.checked.includes(`custom-${i}`)}
              disabled={!loaded || stale || !!error}
              onPress={() => toggle(`custom-${i}`)}
            />
          ))}
        </Panel>
      )}
      <Heading>Local preparation notes</Heading>
      <Txt>
        {p.concentrations ||
          "No local concentrations saved. Verify each product and local preparation policy."}
      </Txt>
      <Field
        label="Add a reusable local checklist item (no patient details)"
        value={custom}
        onChange={setCustom}
      />
      <AsyncButton
        title="Add item"
        action={async () => {
          if (!custom.trim()) throw Error("Enter an item.");
          if (custom.length > 160) throw Error("Use 160 characters or fewer.");
          await checklistStore.update((v) => ({
            ...v,
            custom: [...v.custom, custom.trim()],
          }));
          setCustom("");
        }}
      />
      {!reset ? (
        <AsyncButton
          title="Start new preparation session"
          action={async () => setReset(true)}
        />
      ) : (
        <Notice>
          <Txt>
            Clear all checkmarks and start a new session? Custom checklist items
            will be kept.
          </Txt>
          <AsyncButton
            title="Confirm new session"
            action={async () => {
              await checklistStore.update((v) => ({
                ...freshSession(),
                custom: v.custom,
              }));
              setReset(false);
            }}
          />
          <AsyncButton
            title="Keep current session"
            action={async () => setReset(false)}
          />
        </Notice>
      )}
    </Screen>
  );
}
