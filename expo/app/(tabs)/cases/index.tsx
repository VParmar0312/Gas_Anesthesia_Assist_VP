import { Progress, Panel } from "../../../components/ui/clinical";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Screen,
  Txt,
  Card,
  Heading,
  Button,
  AsyncButton,
  Notice,
  Field,
  CitationPanel,
  Accordion,
} from "../../../components/ui";
import { caseStore, useStore } from "../../../services/data";
import { CaseRecord, deriveRequirements } from "../../../content/cases";
export default function Cases() {
  const router = useRouter();
  const { data, loaded, error } = useStore(caseStore);
  const [query, setQuery] = useState(""),
    [pending, setPending] = useState(""),
    [deleted, setDeleted] = useState<CaseRecord | null>(null);
  const requirements = deriveRequirements(data);
  const filtered = data
    .filter((c) =>
      `${c.month} ${c.procedure} ${c.techniques.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort((a, b) => b.month.localeCompare(a.month));
  return (
    <Screen
      title="Resident case log"
      subtitle="All locally stored records • derived experience counts"
      back
    >
      {error && <Notice error>{error}</Notice>}
      <Button
        title="Log a case"
        disabled={!loaded || !!error}
        onPress={() => router.push("/(tabs)/cases/new-case")}
      />
      <Panel
        title={`${loaded && !error ? data.length : "—"} recorded cases`}
        subtitle="Personal experience · not an official program log"
        tone="green"
        icon="progress"
      >
        <Button
          title="Export, import & backups"
          subtle
          onPress={() => router.push("/about")}
        />
      </Panel>
      <Notice>
        US ACGME minimum experiences, effective July 2026. Program verification
        is required. This is not the official ACGME log or a competency score.
        No “600 total cases” requirement is asserted. Intracerebral experience
        must also meet the majority-open condition; months of ICU training are
        tracked by your program.
      </Notice>
      <Accordion title="Experience progress & requirements">
        {requirements.map((r) => (
          <Card key={r.id}>
            <Progress
              label={r.title}
              value={r.completed}
              total={r.minimum}
              tone="purple"
            />
          </Card>
        ))}
        <Txt muted>
          Open intracerebral procedures:{" "}
          {
            data.filter(
              (c) => c.credits.includes("brain") && c.intracerebralOpen,
            ).length
          }{" "}
          / {data.filter((c) => c.credits.includes("brain")).length}. Confirm
          the majority-open requirement and any unclassified imported cases with
          your program.
        </Txt>
        <CitationPanel ids={["acgme"]} />
      </Accordion>
      <Heading>History ({data.length})</Heading>
      <Field
        label="Filter by month, procedure or technique"
        value={query}
        onChange={setQuery}
      />
      {deleted && (
        <Card>
          <Txt>Record deleted.</Txt>
          <AsyncButton
            title="Undo deletion"
            action={async () => {
              const record = deleted;
              await caseStore.update((v) =>
                v.some((c) => c.id === record.id) ? v : [record, ...v],
              );
              setDeleted(null);
            }}
          />
        </Card>
      )}
      {!filtered.length && (
        <Txt muted>
          {data.length
            ? "No matching cases."
            : "No cases recorded yet. Add your first case to begin."}
        </Txt>
      )}
      {filtered.map((c) => (
        <Card key={c.id}>
          <Txt bold>{c.procedure}</Txt>
          <Txt>
            {c.month} • {c.ageMonths} months • ASA {c.asa}
            {c.emergency ? " E" : ""}
          </Txt>
          <Txt muted>{c.techniques.join(", ") || "No techniques recorded"}</Txt>
          {c.legacy && (
            <Notice>
              Legacy record needs reconciliation before credits are assigned.
            </Notice>
          )}
          {c.note && <Txt>{c.note}</Txt>}
          <Button
            title="Edit record"
            subtle
            onPress={() =>
              router.push({
                pathname: "/(tabs)/cases/new-case",
                params: { id: c.id },
              })
            }
          />
          {pending !== c.id ? (
            <Button
              title="Delete record"
              subtle
              onPress={() => setPending(c.id)}
            />
          ) : (
            <>
              <Txt>Delete this record and recompute its credits?</Txt>
              <AsyncButton
                title="Confirm deletion"
                danger
                action={async () => {
                  await caseStore.update((v) => v.filter((x) => x.id !== c.id));
                  setDeleted(c);
                  setPending("");
                }}
              />
              <Button title="Cancel" subtle onPress={() => setPending("")} />
            </>
          )}
        </Card>
      ))}
    </Screen>
  );
}
