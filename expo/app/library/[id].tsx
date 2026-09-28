import Labs from "../../features/Labs";
import AcidBase from "../../features/AcidBase";
import DrugDetail from "../../features/DrugDetail";
import { drugReferences } from "../../content/drugs";
import { Panel } from "../../components/ui/clinical";
import Anticoagulation from "../../features/Anticoagulation";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { catalog } from "../../content/catalog";
import {
  Screen,
  Txt,
  Heading,
  Choice,
  Check,
  AsyncButton,
  CitationPanel,
  Notice,
} from "../../components/ui";
import {
  preferencesStore,
  useStore,
  toggleFavorite,
} from "../../services/data";
import { EntryRow } from "../../features/Discovery";
export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const entry = catalog.find((e) => e.id === id);
  const { data: p } = useStore(preferencesStore);
  const [mode, setMode] = useState(p.mode),
    [checked, setChecked] = useState<string[]>([]);
  const drug = drugReferences.find((d) => `drug-${d.id}` === id);
  if (drug) return <DrugDetail key={id} drug={drug} />;
  if (id === "labs") return <Labs />;
  if (id === "abg") return <AcidBase />;
  if (id === "anticoag") return <Anticoagulation />;
  if (!entry)
    return (
      <Screen title="Reference unavailable" back>
        <Txt>Search the library for the current title.</Txt>
      </Screen>
    );
  return (
    <Screen title={entry.title} subtitle={entry.summary} back>
      <Notice>
        {entry.kind === "procedure"
          ? "Preparation prompts for discussion; not a patient-specific plan. Independent clinical review pending."
          : "Reference draft; independent clinical review pending."}
      </Notice>
      <AsyncButton
        title={
          p.favorites.includes(entry.id)
            ? "★ Remove favorite"
            : "☆ Save favorite"
        }
        action={() => toggleFavorite(entry.id)}
      />
      <Choice
        label="Reading depth"
        value={mode}
        options={["quick", "learn"]}
        onChange={(v) => setMode(v as "quick" | "learn")}
      />
      {[...entry.quick, ...(mode === "learn" ? entry.learn : [])].map((s) => (
        <Panel
          key={s.title}
          title={s.title}
          tone={entry.kind === "procedure" ? "teal" : "blue"}
        >
          <Txt>{s.body}</Txt>
        </Panel>
      ))}
      {entry.kind === "procedure" && (
        <>
          <Heading>Personal preparation checklist</Heading>
          <Txt muted>
            Checks last only while this page is open. No patient details are
            stored.
          </Txt>
          {[
            "Discussed primary and rescue plans",
            "Confirmed equipment and access",
            "Reviewed relevant medications and references",
            "Agreed on handoff and postoperative destination",
          ].map((label) => (
            <Check
              key={label}
              label={label}
              checked={checked.includes(label)}
              onPress={() =>
                setChecked((v) =>
                  v.includes(label)
                    ? v.filter((x) => x !== label)
                    : [...v, label],
                )
              }
            />
          ))}
        </>
      )}
      <Heading>Related resources</Heading>
      {entry.related
        .map((id) => catalog.find((e) => e.id === id))
        .filter((e) => !!e)
        .map((e) => (
          <EntryRow key={e.id} entry={e} />
        ))}
      <CitationPanel ids={entry.sources} />
    </Screen>
  );
}
