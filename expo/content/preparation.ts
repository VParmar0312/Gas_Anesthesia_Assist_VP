import { Tone } from "../constants/theme";
export const preparationItems: {
  id: string;
  label: string;
  group: string;
  tone: Tone;
}[] = [
  {
    id: "machine",
    label:
      "Machine checkout completed according to manufacturer and local requirements",
    group: "Machine & monitoring",
    tone: "teal",
  },
  {
    id: "monitors",
    label: "Monitoring equipment checked and appropriate to the case",
    group: "Machine & monitoring",
    tone: "teal",
  },
  {
    id: "suction",
    label: "Suction tested and immediately available",
    group: "Suction & airway",
    tone: "blue",
  },
  {
    id: "airway",
    label: "Primary and backup airway equipment confirmed",
    group: "Suction & airway",
    tone: "blue",
  },
  {
    id: "iv",
    label: "IV access, fluid plan and delivery equipment confirmed",
    group: "Access & medications",
    tone: "purple",
  },
  {
    id: "drugs",
    label: "Required drugs, concentrations and labels independently checked",
    group: "Access & medications",
    tone: "purple",
  },
  {
    id: "special",
    label: "Positioning, special equipment and case-specific needs discussed",
    group: "Special equipment & rescue",
    tone: "amber",
  },
  {
    id: "emergency",
    label: "Emergency medications and rescue resources located and checked",
    group: "Special equipment & rescue",
    tone: "amber",
  },
];
export function checklistProgress(
  session: { checked: string[]; custom: string[]; startedAt: string },
  now = new Date(),
) {
  const ids = [
    ...preparationItems.map((i) => i.id),
    ...session.custom.map((_, i) => `custom-${i}`),
  ];
  return {
    done: new Set(session.checked.filter((id) => ids.includes(id))).size,
    total: ids.length,
    stale: new Date(session.startedAt).toDateString() !== now.toDateString(),
  };
}
