/** Context inventory only: no timing values until exact-source and independent approval. */
export const antithrombotics = [
  { name: "Apixaban", aliases: "Eliquis", class: "Direct factor Xa inhibitor" },
  {
    name: "Rivaroxaban",
    aliases: "Xarelto",
    class: "Direct factor Xa inhibitor",
  },
  { name: "Edoxaban", aliases: "Savaysa", class: "Direct factor Xa inhibitor" },
  {
    name: "Dabigatran",
    aliases: "Pradaxa",
    class: "Direct thrombin inhibitor",
  },
  {
    name: "Enoxaparin",
    aliases: "Lovenox",
    class: "Low molecular weight heparin",
  },
  { name: "Heparin", aliases: "UFH", class: "Unfractionated heparin" },
  { name: "Warfarin", aliases: "Coumadin", class: "Vitamin K antagonist" },
  { name: "Clopidogrel", aliases: "Plavix", class: "P2Y12 inhibitor" },
  { name: "Prasugrel", aliases: "Effient", class: "P2Y12 inhibitor" },
  { name: "Ticagrelor", aliases: "Brilinta", class: "P2Y12 inhibitor" },
  {
    name: "Fondaparinux",
    aliases: "Arixtra",
    class: "Indirect factor Xa inhibitor",
  },
  { name: "Aspirin", aliases: "ASA", class: "Antiplatelet" },
  { name: "NSAID", aliases: "Nonsteroidal anti-inflammatory", class: "NSAID" },
] as const;
export interface AnticoagScenario {
  drug: string;
  dose: string;
  doseClass: string;
  renal: string;
  lastDose: string;
  event: string;
  technique: string;
  catheter: string;
  modifiers: string;
}
export const emptyScenario: AnticoagScenario = {
  drug: "",
  dose: "",
  doseClass: "",
  renal: "",
  lastDose: "",
  event: "",
  technique: "",
  catheter: "",
  modifiers: "",
};
export function scenarioMissing(s: AnticoagScenario) {
  return Object.entries(s)
    .filter(([, value]) => !value.trim())
    .map(([key]) => key);
}
export const anticoagEvents = [
  "Needle / catheter placement",
  "Catheter removal",
  "Postoperative restart",
];
