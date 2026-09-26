import React, { PropsWithChildren } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  useWindowDimensions,
} from "react-native";
import {
  Activity,
  Baby,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Droplets,
  FlaskConical,
  HeartPulse,
  Layers,
  Pill,
  Search,
  ShieldAlert,
  Stethoscope,
  TrendingUp,
  Zap,
  LucideIcon,
} from "lucide-react-native";
import { useTheme, Txt } from ".";
import { Tone } from "../../constants/theme";
export const symbols = {
  activity: Activity,
  baby: Baby,
  book: BookOpen,
  calculator: Calculator,
  check: ClipboardCheck,
  clock: Clock,
  drop: Droplets,
  lab: FlaskConical,
  heart: HeartPulse,
  layers: Layers,
  pill: Pill,
  crisis: ShieldAlert,
  airway: Stethoscope,
  progress: TrendingUp,
  mechanism: Zap,
  done: CheckCircle2,
};
export type SymbolName = keyof typeof symbols;
export function Badge({
  label,
  tone = "teal",
}: {
  label: string;
  tone?: Tone;
}) {
  const c = useTheme().tones[tone];
  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 9,
        backgroundColor: c.fill,
      }}
    >
      <Text
        style={{
          color: c.ink,
          fontSize: 12,
          fontWeight: "700",
          lineHeight: 18,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
export function IconBox({
  icon,
  tone,
  small = false,
}: {
  icon: SymbolName;
  tone: Tone;
  small?: boolean;
}) {
  const c = useTheme().tones[tone],
    Icon: LucideIcon = symbols[icon];
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width: small ? 36 : 46,
        height: small ? 36 : 46,
        borderRadius: small ? 11 : 15,
        backgroundColor: c.fill,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={small ? 19 : 23} color={c.ink} strokeWidth={1.8} />
    </View>
  );
}
export function Panel({
  title,
  subtitle,
  tone = "blue",
  icon = "book",
  children,
}: PropsWithChildren<{
  title: string;
  subtitle?: string;
  tone?: Tone;
  icon?: SymbolName;
}>) {
  const t = useTheme(),
    c = t.tones[tone];
  return (
    <View
      style={{
        borderRadius: 22,
        borderWidth: 1,
        borderColor: c.line,
        backgroundColor: t.surface,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
          backgroundColor: c.fill,
          padding: 16,
        }}
      >
        <IconBox icon={icon} tone={tone} small />
        <View style={{ flex: 1, gap: 3 }}>
          <Text
            accessibilityRole="header"
            style={{
              color: t.text,
              fontSize: 18,
              lineHeight: 25,
              fontWeight: "700",
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Txt size={13} muted>
              {subtitle}
            </Txt>
          )}
        </View>
      </View>
      <View style={{ padding: 18, gap: 12 }}>{children}</View>
    </View>
  );
}
export function Tile({
  title,
  subtitle,
  icon,
  tone,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: SymbolName;
  tone: Tone;
  onPress: () => void;
}) {
  const t = useTheme(),
    c = t.tones[tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      onPress={onPress}
      style={({ pressed }) => ({
        flexGrow: 1,
        flexBasis: 145,
        minWidth: 140,
        padding: 17,
        borderRadius: 22,
        gap: 10,
        borderWidth: 1,
        borderColor: c.line,
        backgroundColor: pressed ? c.fill : t.surface,
        minHeight: 153,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconBox icon={icon} tone={tone} />
        <ChevronRight size={17} color={c.ink} />
      </View>
      <Txt bold size={18}>
        {title}
      </Txt>
      <Txt muted size={13}>
        {subtitle}
      </Txt>
    </Pressable>
  );
}
export function Grid({ children }: PropsWithChildren) {
  const { fontScale } = useWindowDimensions();
  return (
    <View
      style={{
        flexDirection: fontScale > 1.4 ? "column" : "row",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      {children}
    </View>
  );
}
export function Progress({
  label,
  value,
  total,
  tone = "teal",
}: {
  label: string;
  value: number;
  total: number;
  tone?: Tone;
}) {
  const t = useTheme(),
    pct = total > 0 ? Math.max(0, Math.min(value / total, 1)) : 0;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{
        min: 0,
        max: total,
        now: Math.min(value, total),
        text: `${value} of ${total}`,
      }}
      style={{ gap: 8 }}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <View style={{ flexShrink: 1 }}>
          <Txt size={14} bold>
            {label}
          </Txt>
        </View>
        <Text
          style={{
            color: t.tones[tone].ink,
            fontSize: 14,
            fontWeight: "700",
            fontVariant: ["tabular-nums"],
          }}
        >
          {value} / {total}
        </Text>
      </View>
      <View
        style={{
          height: 7,
          backgroundColor: t.raised,
          borderRadius: 9,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: 7,
            width: `${pct * 100}%`,
            backgroundColor: t.tones[tone].ink,
            borderRadius: 9,
          }}
        />
      </View>
    </View>
  );
}
export function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  const t = useTheme();
  return (
    <View
      style={{
        backgroundColor: t.surface,
        borderWidth: 1,
        borderColor: t.line,
        borderRadius: 18,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
      }}
    >
      <Search color={t.muted} size={22} />
      <TextInput
        accessibilityLabel="Search names, aliases or topics"
        placeholder="Search drugs, tools, labs…"
        placeholderTextColor={t.muted}
        value={value}
        onChangeText={onChange}
        autoCorrect={false}
        autoCapitalize="none"
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 56,
          fontSize: 17,
          color: t.text,
          paddingVertical: 14,
        }}
      />
    </View>
  );
}
export function EmptyState({
  title,
  detail,
  icon = "book",
}: {
  title: string;
  detail: string;
  icon?: SymbolName;
}) {
  return (
    <View style={{ padding: 20, gap: 10, alignItems: "flex-start" }}>
      <IconBox icon={icon} tone="blue" />
      <Txt bold>{title}</Txt>
      <Txt muted size={14}>
        {detail}
      </Txt>
    </View>
  );
}
