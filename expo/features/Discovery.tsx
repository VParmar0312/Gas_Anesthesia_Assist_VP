import React, { useEffect, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams, Href } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { catalog, Entry } from "../content/catalog";
import { categoryTone } from "../constants/theme";
import { searchEntries } from "../services/search";
import {
  preferencesStore,
  recordRecent,
  useStore,
  searchStore,
  recordSearch,
} from "../services/data";
import {
  Screen,
  Choice,
  Txt,
  Heading,
  useTheme,
  Button,
} from "../components/ui";
import {
  IconBox,
  SymbolName,
  Badge,
  SearchField,
  EmptyState,
  Grid,
  Tile,
} from "../components/ui/clinical";
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
const icons: Record<string, SymbolName> = {
  drug: "pill",
  tool: "calculator",
  procedure: "check",
  crisis: "crisis",
  topic: "book",
  lab: "lab",
};
export function EntryRow({
  entry,
  onOpen,
}: {
  entry: Entry;
  onOpen?: () => void;
}) {
  const router = useRouter(),
    t = useTheme(),
    tone = categoryTone(
      entry.kind === "drug"
        ? entry.summary
        : entry.kind === "tool"
          ? entry.title
          : entry.kind,
    );
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${entry.title}`}
      onPress={() => {
        onOpen?.();
        void recordRecent(entry.id).catch(() => {});
        router.push(entryRoute(entry));
      }}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderLeftWidth: 4,
        borderColor: t.tones[tone].line,
        backgroundColor: pressed ? t.tones[tone].fill : t.surface,
        borderRadius: 19,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        minHeight: 82,
      })}
    >
      <IconBox icon={icons[entry.kind] ?? "book"} tone={tone} />
      <View style={{ flex: 1, gap: 4 }}>
        <Txt size={12} muted>
          {entry.id.startsWith("review-")
            ? "DRUG · MONOGRAPH PENDING"
            : entry.kind.toUpperCase()}
        </Txt>
        <Txt size={18} bold>
          {entry.title}
        </Txt>
        <Txt size={13} muted>
          {entry.summary}
        </Txt>
      </View>
      <ChevronRight size={18} color={t.tones[tone].ink} />
    </Pressable>
  );
}
export default function Discovery({
  initialKind = "all",
  title = "Library",
}: {
  initialKind?: string;
  title?: string;
}) {
  const params = useLocalSearchParams<{ kind?: string }>(),
    router = useRouter();
  const [query, setQuery] = useState(""),
    [kind, setKind] = useState(
      initialKind === "all" && params.kind === "drug" ? "drug" : initialKind,
    ),
    [category, setCategory] = useState("All classes");
  useEffect(() => {
    if (initialKind === "all" && params.kind === "drug") {
      setKind("drug");
      setCategory("All classes");
      setQuery("");
    }
  }, [initialKind, params.kind]);
  const { data: p } = useStore(preferencesStore);
  const { data: searches } = useStore(searchStore);
  const entries = searchEntries(catalog, query, kind).filter(
    (e) =>
      kind !== "drug" || category === "All classes" || e.summary === category,
  );
  const categories = [
    "All classes",
    ...new Set(catalog.filter((e) => e.kind === "drug").map((e) => e.summary)),
  ];
  return (
    <Screen
      title={title}
      subtitle={
        title === "Tools"
          ? "See the inputs. Understand the result."
          : title === "Prepare"
            ? "Equipment, context and a shared plan."
            : "Clinical context, a little easier to find."
      }
    >
      <SearchField value={query} onChange={setQuery} />
      {!query && searches.length > 0 && (
        <>
          <Txt muted size={13}>
            RECENT SEARCHES · NO PATIENT DETAILS
          </Txt>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {searches.map((q) => (
              <Button
                key={q}
                title={q}
                subtle
                onPress={() => {
                  setQuery(q);
                  setKind("all");
                }}
              />
            ))}
            <Button
              title="Clear recent searches"
              subtle
              onPress={() => {
                void searchStore.update(() => []).catch(() => {});
              }}
            />
          </View>
        </>
      )}
      <Choice
        label="Browse by type"
        value={kind}
        onChange={(v) => {
          setKind(v);
          setCategory("All classes");
        }}
        options={["all", "procedure", "drug", "lab", "topic", "tool", "crisis"]}
      />
      {kind === "drug" && (
        <>
          <Txt bold size={14}>
            Drug class
          </Txt>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {categories.map((c) => (
              <Button
                key={c}
                title={c}
                subtle
                selected={c === category}
                onPress={() => setCategory(c)}
              />
            ))}
          </ScrollView>
        </>
      )}
      {!query && title === "Prepare" && (
        <Grid>
          <Tile
            title="Room setup"
            subtitle="Resume your preparation"
            icon="check"
            tone="teal"
            onPress={() => router.push("/preflight")}
          />
          <Tile
            title="Pediatric setup"
            subtitle="Age & equipment context"
            icon="baby"
            tone="blue"
            onPress={() => router.push("/pediatric-setup")}
          />
          <Tile
            title="Airway review"
            subtitle="Observations & screening"
            icon="airway"
            tone="amber"
            onPress={() => router.push("/airway-assessment")}
          />
        </Grid>
      )}
      {!query && kind === "all" && (
        <>
          <Grid>
            <Tile
              title="Pharmacology"
              subtitle="Source-linked drug cards"
              tone="purple"
              icon="pill"
              onPress={() => setKind("drug")}
            />
            <Tile
              title="Labs & ABG"
              subtitle="Interpretation & arithmetic"
              tone="blue"
              icon="lab"
              onPress={() => router.push("/library/labs")}
            />
            <Tile
              title="Anticoagulation"
              subtitle="Match the exact scenario"
              tone="amber"
              icon="clock"
              onPress={() => router.push("/library/anticoag")}
            />
          </Grid>
          <Heading>Favorites</Heading>
          {p.favorites.length ? (
            catalog
              .filter((e) => p.favorites.includes(e.id))
              .map((e) => <EntryRow entry={e} key={e.id} />)
          ) : (
            <Txt muted size={14}>
              Save useful references from their detail pages.
            </Txt>
          )}
        </>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <Txt muted>{entries.length} references</Txt>
        <Badge label="OFFLINE COLLECTION" />
      </View>
      {entries.map((e) => (
        <EntryRow
          key={e.id}
          entry={e}
          onOpen={() => {
            void recordSearch(query).catch(() => {});
          }}
        />
      ))}
      {!entries.length && (
        <>
          <EmptyState
            title="No matching references"
            detail="Try a generic name, abbreviation, or a different content type."
            icon="book"
          />
          <Button
            title="Clear search and filters"
            subtle
            onPress={() => {
              setQuery("");
              setKind(initialKind);
              setCategory("All classes");
            }}
          />
        </>
      )}
      <Txt muted size={12}>
        Content is bundled for offline access. External sources require a
        connection. Review states are shown within each reference.
      </Txt>
    </Screen>
  );
}
