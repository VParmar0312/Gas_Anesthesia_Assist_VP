import { Panel, Badge } from "../../../components/ui/clinical";
import React from "react";
import { Screen, Notice, Txt } from "../../../components/ui";
import { crisisEntries } from "../../../content/catalog";
import { EntryRow } from "../../../features/Discovery";
import {
  preferencesStore,
  crisisStore,
  useStore,
} from "../../../services/data";
export default function Crisis() {
  const { data: p } = useStore(preferencesStore);
  const { data: events, error } = useStore(crisisStore);
  return (
    <Screen
      title="Crisis references"
      subtitle="Call for help. Use the locally adopted emergency pathway."
    >
      <Badge label="CRISIS WORKSPACE" tone="rose" />
      {!!events.length && (
        <Panel title="Active events" tone="rose" icon="clock">
          <Txt>
            Resume progress below. Elapsed time is not a medication alarm.
          </Txt>
          {events.map((event) => {
            const entry = crisisEntries.find((e) => e.id === event.protocol);
            return entry ? <EntryRow key={entry.id} entry={entry} /> : null;
          })}
        </Panel>
      )}
      {error && <Notice error>{error}</Notice>}
      <Notice>
        Review build. Source-reconciled summaries are not a substitute for
        complete algorithms, training or the emergency team.
      </Notice>
      {p.emergencyContact && (
        <Txt bold>Local emergency contact: {p.emergencyContact}</Txt>
      )}
      {crisisEntries.map((entry) => (
        <EntryRow entry={entry} key={entry.id} />
      ))}
    </Screen>
  );
}
