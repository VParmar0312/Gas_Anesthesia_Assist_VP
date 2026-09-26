import React from "react";
import { Screen, Notice, Txt } from "../../../components/ui";
import { crisisEntries } from "../../../content/catalog";
import { EntryRow } from "../../../features/Discovery";
import { preferencesStore, useStore } from "../../../services/data";
export default function Crisis() {
  const { data: p } = useStore(preferencesStore);
  return (
    <Screen
      title="Crisis references"
      subtitle="Call for help. Use the locally adopted emergency pathway."
    >
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
