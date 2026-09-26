import React, { useState } from "react";
import { Accordion, Txt, Button, AsyncButton, Notice } from "../components/ui";
import {
  caseStore,
  preferencesStore,
  checklistStore,
  crisisStore,
} from "../services/data";
export default function Recovery() {
  const [pending, setPending] = useState<{
      label: string;
      action: () => Promise<void>;
    } | null>(null),
    [message, setMessage] = useState("");
  return (
    <Accordion title="Recover or reset a local store">
      <Txt>
        Restore replaces current data with its previous saved version. Reset
        starts empty/default data. Both preserve the current raw data in a
        recovery copy included in raw export. Export first if you need an
        independent copy.
      </Txt>
      {[
        { name: "case log", store: caseStore },
        { name: "preferences", store: preferencesStore },
        { name: "preparation session", store: checklistStore },
        { name: "crisis progress", store: crisisStore },
      ].map(({ name, store }) => (
        <React.Fragment key={name}>
          <Button
            title={`Restore previous ${name}`}
            subtle
            onPress={() =>
              setPending({
                label: `Restore previous ${name}`,
                action: store.recoverPrevious,
              })
            }
          />
          <Button
            title={`Reset ${name}`}
            subtle
            onPress={() =>
              setPending({ label: `Reset ${name}`, action: store.startFresh })
            }
          />
        </React.Fragment>
      ))}
      {pending && (
        <>
          <Notice>
            {pending.label}? This replaces the active data and keeps a recovery
            copy.
          </Notice>
          <AsyncButton
            title="Confirm recovery action"
            action={async () => {
              await pending.action();
              setMessage(`${pending.label} completed.`);
              setPending(null);
            }}
          />
          <Button title="Cancel" subtle onPress={() => setPending(null)} />
        </>
      )}
      {message && <Notice>{message}</Notice>}
    </Accordion>
  );
}
