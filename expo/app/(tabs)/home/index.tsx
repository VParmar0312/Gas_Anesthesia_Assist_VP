import React from "react";
import { useRouter } from "expo-router";
import {
  Screen,
  Txt,
  Card,
  Heading,
  Button,
  Notice,
} from "../../../components/ui";
import { caseStore, preferencesStore, useStore } from "../../../services/data";
import { deriveRequirements } from "../../../content/cases";
import { catalog } from "../../../content/catalog";
import { EntryRow } from "../../../features/Discovery";
export default function Home() {
  const router = useRouter();
  const { data: p, error } = useStore(preferencesStore),
    { data: cases } = useStore(caseStore);
  const gaps = deriveRequirements(cases)
    .filter((r) => r.completed < r.minimum)
    .slice(0, 3);
  return (
    <Screen
      title="Gas Anesthesia"
      subtitle="Prepare thoughtfully. Find what matters."
    >
      <Notice>
        Clinical review build • Source-linked content and calculation tools for
        trained professionals. Verify clinical use against the current product
        label and locally adopted guidance.
      </Notice>
      {error && <Notice error>{error}</Notice>}
      <Button
        title="Search the whole library"
        onPress={() => router.push("/(tabs)/library")}
      />
      <Card>
        <Txt size={22} bold>
          Start your preparation
        </Txt>
        <Txt muted>
          Procedure prompts, equipment checks and supporting references in one
          place.
        </Txt>
        <Button
          title="Explore case preparation"
          onPress={() => router.push("/(tabs)/prepare")}
        />
        <Button
          title="Room preparation checklist"
          subtle
          onPress={() => router.push("/(tabs)/home/preflight")}
        />
        <Button
          title="Airway & OSA assessment"
          subtle
          onPress={() => router.push("/(tabs)/home/airway-assessment")}
        />
        <Button
          title="Pediatric preparation"
          subtle
          onPress={() => router.push("/(tabs)/home/pediatric-setup")}
        />
      </Card>
      <Button
        title="Open crisis references"
        danger
        onPress={() => router.push("/(tabs)/crisis")}
      />
      {p.role === "resident" && (
        <>
          <Heading>Resident workspace</Heading>
          <Card>
            <Txt bold>{cases.length} locally recorded cases</Txt>
            <Txt muted>
              Experience counts are derived from confirmed facts. This does not
              replace the official program log.
            </Txt>
            <Button
              title="Case history & requirements"
              onPress={() => router.push("/(tabs)/cases")}
            />
            {gaps.map((r) => (
              <Txt key={r.id}>
                {r.title}: {r.completed} / {r.minimum}
              </Txt>
            ))}
          </Card>
        </>
      )}
      <Heading>Favorites</Heading>
      {p.favorites.length ? (
        catalog
          .filter((e) => p.favorites.includes(e.id))
          .map((e) => <EntryRow entry={e} key={e.id} />)
      ) : (
        <Txt muted>Save references from their detail pages.</Txt>
      )}
      <Heading>Recently opened</Heading>
      {p.recents
        .slice(0, 4)
        .map((id) => catalog.find((e) => e.id === id))
        .filter((e) => !!e)
        .map((e) => (
          <EntryRow entry={e} key={e.id} />
        ))}
      <Button
        title="Preferences, backups & about"
        subtle
        onPress={() => router.push("/(tabs)/home/about")}
      />
    </Screen>
  );
}
