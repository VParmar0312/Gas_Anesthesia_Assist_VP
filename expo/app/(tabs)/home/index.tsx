import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Search, ChevronRight, ShieldAlert } from "lucide-react-native";
import {
  Screen,
  Txt,
  Card,
  Heading,
  Button,
  Notice,
  useTheme,
} from "../../../components/ui";
import {
  Grid,
  Tile,
  Progress,
  Badge,
  EmptyState,
} from "../../../components/ui/clinical";
import {
  caseStore,
  checklistStore,
  preferencesStore,
  useStore,
} from "../../../services/data";
import { deriveRequirements } from "../../../content/cases";
import { checklistProgress } from "../../../content/preparation";
import { catalog } from "../../../content/catalog";
import { EntryRow } from "../../../features/Discovery";
export default function Home() {
  const router = useRouter(),
    t = useTheme();
  const { data: p, error } = useStore(preferencesStore),
    cases = useStore(caseStore),
    setup = useStore(checklistStore);
  const progress = checklistProgress(setup.data);
  const gaps = deriveRequirements(cases.data)
    .filter((r) => r.completed < r.minimum)
    .slice(0, 3);
  return (
    <Screen
      title="Your day, prepared."
      subtitle="Anesthesia reference, thoughtfully within reach."
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Search the whole library"
        onPress={() => router.push("/(tabs)/library")}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          borderWidth: 1,
          borderColor: t.line,
          borderRadius: 18,
          padding: 17,
          backgroundColor: t.surface,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Search color={t.muted} size={22} />
        <View style={{ flex: 1 }}>
          <Txt muted>Search drugs, tools, labs…</Txt>
        </View>
        <ChevronRight size={18} color={t.muted} />
      </Pressable>
      <View
        style={{
          padding: 22,
          gap: 18,
          borderRadius: 26,
          backgroundColor: t.hero,
        }}
      >
        <Text
          style={{
            color: t.heroMuted,
            fontWeight: "700",
            fontSize: 12,
            letterSpacing: 2,
          }}
        >
          PREPARATION SESSION
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <View style={{ flex: 1, minWidth: 170, gap: 6 }}>
            <Text
              style={{
                color: t.onHero,
                fontWeight: "700",
                fontSize: 25,
                lineHeight: 32,
              }}
            >
              {!setup.loaded
                ? "Loading your checklist…"
                : setup.error
                  ? "Checklist needs recovery"
                  : progress.stale
                    ? "A fresh start for today"
                    : progress.done === progress.total
                      ? "Your checks are complete"
                      : "Make room for a good start"}
            </Text>
            <Text style={{ color: t.heroMuted, fontSize: 14, lineHeight: 21 }}>
              {setup.loaded && !setup.error
                ? `${progress.done} of ${progress.total} checks · ${new Date(setup.data.startedAt).toLocaleDateString()}`
                : "Stored locally on this device"}
            </Text>
          </View>
          <Button
            title={progress.stale ? "Review session" : "Open checklist"}
            onPress={() => router.push("/preflight")}
          />
        </View>
        <Text style={{ color: t.heroMuted, fontSize: 12, lineHeight: 18 }}>
          Checklist completion records your checks; it does not certify
          readiness.
        </Text>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Badge label="BUNDLED OFFLINE" tone="teal" />
        <Badge label="CLINICAL REVIEW BUILD" tone="amber" />
      </View>
      {(error || cases.error || setup.error) && (
        <Notice error>{error || cases.error || setup.error}</Notice>
      )}
      <Heading>Go straight to what matters</Heading>
      <Grid>
        <Tile
          title="Pediatric setup"
          subtitle="Age-aware preparation"
          icon="baby"
          tone="blue"
          onPress={() => router.push("/pediatric-setup")}
        />
        <Tile
          title="Airway"
          subtitle="Observations & OSA"
          icon="airway"
          tone="amber"
          onPress={() => router.push("/airway-assessment")}
        />
        <Tile
          title="Tools"
          subtitle="Transparent arithmetic"
          icon="calculator"
          tone="purple"
          onPress={() => router.push("/(tabs)/tools")}
        />
        <Tile
          title="Drug library"
          subtitle="Classes, context & sources"
          icon="pill"
          tone="teal"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/library",
              params: { kind: "drug" },
            })
          }
        />
        <Tile
          title="Labs & ABG"
          subtitle="A stepwise perspective"
          icon="lab"
          tone="blue"
          onPress={() => router.push("/library/labs")}
        />
        <Tile
          title="Log a case"
          subtitle="Your experience, recorded"
          icon="progress"
          tone="green"
          onPress={() => router.push("/new-case")}
        />
      </Grid>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open crisis references"
        onPress={() => router.push("/(tabs)/crisis")}
        style={({ pressed }) => ({
          backgroundColor: t.tones.rose.fill,
          borderColor: t.tones.rose.line,
          borderWidth: 1,
          padding: 18,
          borderRadius: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          opacity: pressed ? 0.75 : 1,
        })}
      >
        <ShieldAlert color={t.danger} size={27} />
        <View style={{ flex: 1 }}>
          <Txt bold size={20}>
            Crisis references
          </Txt>
          <Txt muted size={13}>
            Immediate access · resumable events
          </Txt>
        </View>
        <ChevronRight color={t.danger} size={20} />
      </Pressable>
      <Heading>
        {p.role === "resident"
          ? "Your resident workspace"
          : "Your case workspace"}
      </Heading>
      <Card tone="green">
        <Txt bold size={24}>
          {!cases.loaded
            ? "Loading records…"
            : cases.error
              ? "Records unavailable"
              : `${cases.data.length} cases logged`}
        </Txt>
        <Txt muted size={13}>
          Local case facts · educational experience tracking
        </Txt>
        {cases.loaded &&
          !cases.error &&
          p.role === "resident" &&
          gaps.map((r, i) => (
            <Progress
              key={r.id}
              label={r.title}
              value={r.completed}
              total={r.minimum}
              tone={(["blue", "purple", "teal"] as const)[i]}
            />
          ))}
        <Button
          title="Case history & requirements"
          subtle
          onPress={() => router.push("/(tabs)/cases")}
        />
        <Txt muted size={12}>
          Program verification required. Counts overlap across experience
          categories and are not a competency score.
        </Txt>
      </Card>
      <Heading>Keep close</Heading>
      {p.favorites.length ? (
        catalog
          .filter((e) => p.favorites.includes(e.id))
          .map((e) => <EntryRow entry={e} key={e.id} />)
      ) : (
        <EmptyState
          title="Your favorites belong here"
          detail="Save a reference from its detail page to reach it faster next time."
        />
      )}
      {!!p.recents.length && <Heading>Recently opened</Heading>}
      {p.recents
        .slice(0, 4)
        .map((id) => catalog.find((e) => e.id === id))
        .filter((e) => !!e)
        .map((e) => (
          <EntryRow entry={e} key={e.id} />
        ))}
      <Button
        title="Explore procedure preparation"
        subtle
        onPress={() => router.push("/(tabs)/prepare")}
      />
      <Button
        title="Preferences, backups & about"
        subtle
        onPress={() => router.push("/about")}
      />
    </Screen>
  );
}
