import React, { useState } from "react";
import { useRouter, Href } from "expo-router";
import { catalog, Entry } from "../content/catalog";
import { searchEntries } from "../services/search";
import { preferencesStore, recordRecent, useStore } from "../services/data";
import {
  Screen,
  Field,
  Choice,
  Card,
  Txt,
  Button,
  Heading,
} from "../components/ui";
export function entryRoute(entry: Entry): Href {
  if (entry.id === "airway") return "/(tabs)/home/airway-assessment";
  if (entry.id === "pediatric") return "/(tabs)/home/pediatric-setup";
  if (entry.id === "preflight") return "/(tabs)/home/preflight";
  return entry.kind === "tool"
    ? { pathname: "/tool/[id]", params: { id: entry.id } }
    : entry.kind === "crisis"
      ? {
          pathname: "/(tabs)/crisis/[protocolId]",
          params: { protocolId: entry.id },
        }
      : { pathname: "/library/[id]", params: { id: entry.id } };
}
export function EntryRow({ entry }: { entry: Entry }) {
  const router = useRouter();
  return (
    <Card>
      <Txt muted size={13}>
        {entry.kind.toUpperCase()}
      </Txt>
      <Txt size={20} bold>
        {entry.title}
      </Txt>
      <Txt muted>{entry.summary}</Txt>
      <Button
        title={`Open ${entry.title}`}
        subtle
        onPress={() => {
          void recordRecent(entry.id).catch(() => {});
          router.push(entryRoute(entry));
        }}
      />
    </Card>
  );
}
export default function Discovery({
  initialKind = "all",
  title = "Library",
}: {
  initialKind?: string;
  title?: string;
}) {
  const [query, setQuery] = useState(""),
    [kind, setKind] = useState(initialKind);
  const { data: p } = useStore(preferencesStore);
  const entries = searchEntries(catalog, query, kind);
  return (
    <Screen
      title={title}
      subtitle="Search bundled content. Source links open online."
    >
      <Field
        label="Search names, aliases or topics"
        value={query}
        onChange={setQuery}
      />
      <Choice
        label="Content"
        value={kind}
        onChange={setKind}
        options={["all", "procedure", "drug", "topic", "tool", "crisis"]}
      />
      {!query && kind === "all" && (
        <>
          <Heading>Favorites</Heading>
          {p.favorites.length ? (
            catalog
              .filter((e) => p.favorites.includes(e.id))
              .map((e) => <EntryRow entry={e} key={e.id} />)
          ) : (
            <Txt muted>
              Save a reference from its detail page for quick access.
            </Txt>
          )}
        </>
      )}
      <Txt muted>{entries.length} results</Txt>
      {entries.map((e) => (
        <EntryRow key={e.id} entry={e} />
      ))}
      {!entries.length && (
        <Txt>No matches. Try a generic name or another content type.</Txt>
      )}
    </Screen>
  );
}
