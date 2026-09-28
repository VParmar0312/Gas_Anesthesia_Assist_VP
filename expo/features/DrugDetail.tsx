import React, { useState } from "react";
import { View } from "react-native";
import { DrugReference } from "../content/drugs";
import {
  drugDetails,
  DrugSection,
  propofolDoses,
} from "../content/drugDetails";
import { categoryTone, Tone } from "../constants/theme";
import {
  Screen,
  Txt,
  Choice,
  Notice,
  Accordion,
  CitationPanel,
  AsyncButton,
  Heading,
} from "../components/ui";
import { Panel, Badge, SymbolName } from "../components/ui/clinical";
import { preferencesStore, useStore, toggleFavorite } from "../services/data";
import { catalog } from "../content/catalog";
import { EntryRow } from "./Discovery";
const sections: {
  id: DrugSection;
  title: string;
  tone: Tone;
  icon: SymbolName;
}[] = [
  { id: "mechanism", title: "Mechanism", tone: "purple", icon: "mechanism" },
  { id: "onset", title: "Onset", tone: "blue", icon: "clock" },
  { id: "duration", title: "Duration & recovery", tone: "teal", icon: "clock" },
  {
    id: "contraindications",
    title: "Contraindications",
    tone: "rose",
    icon: "crisis",
  },
  {
    id: "interactions",
    title: "Key interactions",
    tone: "amber",
    icon: "layers",
  },
  {
    id: "effects",
    title: "Hemodynamic & respiratory effects",
    tone: "rose",
    icon: "heart",
  },
  { id: "pediatrics", title: "Pediatric context", tone: "blue", icon: "baby" },
  {
    id: "preparation",
    title: "Preparation & administration",
    tone: "teal",
    icon: "check",
  },
  { id: "monitoring", title: "Monitoring", tone: "green", icon: "activity" },
  {
    id: "specialPopulations",
    title: "Pregnancy, lactation & organ function",
    tone: "purple",
    icon: "book",
  },
  { id: "pearls", title: "Clinical pearls", tone: "amber", icon: "book" },
];
export default function DrugDetail({ drug }: { drug: DrugReference }) {
  const { data: p } = useStore(preferencesStore),
    [mode, setMode] = useState(p.mode);
  const id = `drug-${drug.id}`,
    tone = categoryTone(drug.category),
    facts = drugDetails[drug.id] ?? {};
  return (
    <Screen title={drug.name} subtitle={drug.aliases.join(" · ")} back>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Badge label={drug.category} tone={tone} />
        <Badge label="INDEPENDENT REVIEW PENDING" tone="amber" />
      </View>
      <Notice>
        Selected source-confirmed facts, not complete prescribing information.
        This is a clinical review draft.
      </Notice>
      <Choice
        label="Reading depth"
        options={["quick", "learn"]}
        value={mode}
        onChange={(v) => setMode(v as "quick" | "learn")}
      />
      <Panel
        title="Dosing context"
        subtitle={drug.scope}
        tone={tone}
        icon="pill"
      >
        {drug.id === "1" ? (
          propofolDoses.map((d) => (
            <View key={d.population} style={{ gap: 6 }}>
              <Txt bold>{d.text}</Txt>
              <Txt bold size={23}>
                {d.amount} {d.unit} · {d.route}
              </Txt>
              <Txt size={14}>{d.titration}</Txt>
              {mode === "learn" && (
                <Txt muted size={13}>
                  {d.formulation} · {d.indication} · Weight basis:{" "}
                  {d.weightBasis}. Label §{d.sourceSection}.
                </Txt>
              )}
            </View>
          ))
        ) : (
          <Txt>{drug.dose}</Txt>
        )}
        {drug.id === "1" && (
          <Txt muted size={13}>
            Induction only. Maintenance, MAC and ICU sedation have separate
            label instructions. No universal regimen or cap is supplied.
          </Txt>
        )}
      </Panel>
      <Notice error>{drug.warning}</Notice>
      {sections.map((section, i) => {
        const fact = facts[section.id];
        const body = (
          <>
            <Txt>
              {fact?.text ??
                "This field is awaiting source reconciliation and independent review. No value is supplied; use the exact product information."}
            </Txt>
            {mode === "learn" && fact && (
              <Txt muted size={12}>
                {fact.formulation} · {fact.route} · {fact.context}. Label §
                {fact.sourceSection}; checked {fact.checked}. Source
                reconciliation only.
              </Txt>
            )}
          </>
        );
        return i < 3 ? (
          <Panel
            key={section.id}
            title={section.title}
            tone={section.tone}
            icon={section.icon}
          >
            {body}
          </Panel>
        ) : (
          <Accordion key={section.id} title={section.title} tone={section.tone}>
            {body}
          </Accordion>
        );
      })}
      {mode === "learn" && (
        <Panel title="Why the context matters" tone="teal" icon="book">
          <Txt>{drug.learn}</Txt>
        </Panel>
      )}
      <AsyncButton
        title={
          p.favorites.includes(id) ? "★ Remove favorite" : "☆ Save favorite"
        }
        action={() => toggleFavorite(id)}
      />
      <Heading>Related references</Heading>
      {drug.related
        .map((id) => catalog.find((e) => e.id === id))
        .filter((e) => !!e)
        .map((e) => (
          <EntryRow key={e.id} entry={e} />
        ))}
      <CitationPanel ids={[drug.source]} />
    </Screen>
  );
}
