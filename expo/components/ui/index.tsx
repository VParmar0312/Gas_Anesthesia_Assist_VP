import React, { PropsWithChildren, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  useColorScheme,
  StyleSheet,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useStore, preferencesStore } from "../../services/data";
import { sources, reviewStatus, contentVersion } from "../../content/sources";
import { palettes, metrics, Tone } from "../../constants/theme";
export function useTheme() {
  const { data } = useStore(preferencesStore);
  const system = useColorScheme();
  return palettes[
    data.theme === "system"
      ? system === "dark"
        ? "dark"
        : "light"
      : data.theme
  ];
}
export function Txt({
  children,
  muted = false,
  size = 16,
  bold = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
  size?: number;
  bold?: boolean;
}) {
  const t = useTheme();
  return (
    <Text
      style={{
        color: muted ? t.muted : t.text,
        fontSize: size,
        lineHeight: size * 1.45,
        fontWeight: bold ? "700" : "400",
      }}
    >
      {children}
    </Text>
  );
}
export function Screen({
  title,
  subtitle,
  children,
  back = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  back?: boolean;
}) {
  const t = useTheme(),
    router = useRouter();
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: t.bg }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.screen}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Text
              style={{
                color: t.accent,
                fontSize: 13,
                fontWeight: "800",
                letterSpacing: 3,
              }}
            >
              GAS / COMPANION
            </Text>
            {back && (
              <Button
                title="Crisis"
                danger
                onPress={() => router.push("/(tabs)/crisis")}
              />
            )}
          </View>
          {back && (
            <Button
              title="‹ Back"
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/")
              }
              subtle
            />
          )}
          <Text
            accessibilityRole="header"
            style={{
              fontSize: 30,
              lineHeight: 38,
              color: t.text,
              fontWeight: "700",
              letterSpacing: -0.7,
            }}
          >
            {title}
          </Text>
          {subtitle && <Txt muted>{subtitle}</Txt>}
          {children}
          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function Card({ children, tone }: PropsWithChildren<{ tone?: Tone }>) {
  const t = useTheme();
  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: t.surface,
          borderColor: tone ? t.tones[tone].line : t.line,
          borderLeftWidth: tone ? 4 : 1,
        },
      ]}
    >
      {children}
    </View>
  );
}
export function Heading({ children }: PropsWithChildren) {
  const t = useTheme();
  return (
    <Text
      accessibilityRole="header"
      style={{
        fontSize: 20,
        lineHeight: 28,
        fontWeight: "700",
        color: t.text,
        marginTop: 12,
      }}
    >
      {children}
    </Text>
  );
}
export function Button({
  title,
  onPress,
  subtle = false,
  danger = false,
  disabled = false,
  selected,
}: {
  title: string;
  onPress: () => void;
  subtle?: boolean;
  danger?: boolean;
  disabled?: boolean;
  selected?: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      aria-pressed={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        {
          opacity: disabled ? 0.5 : pressed ? 0.75 : 1,
          backgroundColor: subtle
            ? selected
              ? t.tones.teal.fill
              : t.surface
            : danger
              ? t.danger
              : t.accent,
          borderColor: selected ? t.accent : subtle ? t.line : "transparent",
          borderWidth: selected ? 2 : 1,
        },
      ]}
    >
      <Text
        style={{
          color: subtle ? t.text : danger ? t.bg : t.onAccent,
          fontSize: 16,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function Field({
  label,
  value,
  onChange,
  unit,
  keyboard = "default",
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  keyboard?: "default" | "decimal-pad";
  multiline?: boolean;
}) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Txt bold>
        {label}
        {unit ? ` (${unit})` : ""}
      </Txt>
      <TextInput
        accessibilityLabel={`${label}${unit ? ` in ${unit}` : ""}`}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChangeText={onChange}
        keyboardType={keyboard}
        autoCapitalize="none"
        autoCorrect={false}
        multiline={multiline}
        style={[
          s.input,
          {
            color: t.text,
            borderColor: focused ? t.accent : t.line,
            borderWidth: focused ? 2 : 1,
            backgroundColor: t.surface,
            minHeight: multiline ? 110 : 50,
          },
        ]}
        placeholderTextColor={t.muted}
      />
    </View>
  );
}
export function Choice({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Txt bold>{label}</Txt>
      <View style={s.wrap}>
        {options.map((option) => (
          <Button
            key={option}
            title={option}
            subtle
            selected={value === option}
            onPress={() => onChange(option)}
          />
        ))}
      </View>
    </View>
  );
}
export function Check({
  label,
  checked,
  onPress,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      aria-checked={checked}
      aria-disabled={disabled}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={[
        s.check,
        {
          borderColor: checked ? t.accent : t.line,
          backgroundColor: t.surface,
        },
      ]}
    >
      <Text style={{ color: checked ? t.accent : t.muted, fontSize: 24 }}>
        {checked ? "☑" : "☐"}
      </Text>
      <View style={{ flex: 1 }}>
        <Txt>{label}</Txt>
      </View>
    </Pressable>
  );
}
export function Notice({
  children,
  error = false,
}: PropsWithChildren<{ error?: boolean }>) {
  const t = useTheme();
  return (
    <View
      accessibilityRole={error ? "alert" : undefined}
      style={{
        borderLeftWidth: 3,
        borderLeftColor: error ? t.danger : t.warning,
        padding: 14,
        borderRadius: 14,
        gap: 10,
        backgroundColor: error ? t.tones.rose.fill : t.tones.amber.fill,
      }}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Txt>{children}</Txt>
      ) : (
        children
      )}
    </View>
  );
}
export function Result({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  const t = useTheme();
  return (
    <Card tone="teal">
      <Txt muted>{label}</Txt>
      <Text
        selectable
        style={{
          color: t.accent,
          fontSize: 28,
          lineHeight: 38,
          fontWeight: "700",
          fontVariant: ["tabular-nums"],
        }}
      >
        {value}
      </Text>
      {detail && <Txt>{detail}</Txt>}
    </Card>
  );
}
export function Accordion({
  title,
  children,
  tone = "blue",
}: PropsWithChildren<{ title: string; tone?: Tone }>) {
  const [open, setOpen] = useState(false);
  const t = useTheme();
  return (
    <View style={{ gap: 10 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        aria-expanded={open}
        onPress={() => setOpen(!open)}
        style={[
          s.button,
          {
            borderWidth: 1,
            borderColor: t.tones[tone].line,
            backgroundColor: t.tones[tone].fill,
          },
        ]}
      >
        <Txt bold>
          {open ? "−" : "+"} {title}
        </Txt>
      </Pressable>
      {open && children}
    </View>
  );
}
export function CitationPanel({ ids }: { ids: string[] }) {
  return (
    <Accordion title="Sources & review status">
      <Txt>{reviewStatus}</Txt>
      <Txt muted>
        Content {contentVersion}. This build is for review; local adoption is
        not implied.
      </Txt>
      {ids.length === 0 && (
        <Txt>
          Editorial or arithmetic content. Independent review and named clinical
          ownership are pending.
        </Txt>
      )}
      {ids.map((id) => {
        const source = sources[id];
        return source ? (
          <Card key={id}>
            <Txt bold>{source.title}</Txt>
            <Txt>{source.version}</Txt>
            <Txt muted>
              {source.scope}. Source checked {source.checked}.
            </Txt>
            <Button
              title="Open authoritative source ↗"
              subtle
              onPress={() => void Linking.openURL(source.url)}
            />
          </Card>
        ) : null;
      })}
    </Accordion>
  );
}
export function AsyncButton({
  title,
  action,
  danger = false,
}: {
  title: string;
  action: () => Promise<void>;
  danger?: boolean;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <>
      {error && <Notice error>{error}</Notice>}
      <Button
        title={busy ? "Saving…" : title}
        danger={danger}
        disabled={busy}
        onPress={() => {
          setBusy(true);
          setError("");
          action()
            .catch((e) =>
              setError(e instanceof Error ? e.message : "Action failed"),
            )
            .finally(() => setBusy(false));
        }}
      />
    </>
  );
}
const s = StyleSheet.create({
  screen: {
    padding: 20,
    gap: 16,
    maxWidth: metrics.contentWidth,
    width: "100%",
    alignSelf: "center",
  },
  card: {
    padding: 18,
    gap: 12,
    borderRadius: metrics.radius.card,
    borderWidth: 1,
  },
  button: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
  },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 18 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  check: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 56,
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
  },
});
