/** Concise source reconciliations, not complete prescribing information. */
export interface DrugReference {
  id: string;
  name: string;
  category: string;
  aliases: string[];
  source: string;
  url?: string;
  scope: string;
  dose: string;
  warning: string;
  learn: string;
  related: string[];
}
const dm = (id: string) =>
  `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${id}`;
export const drugReferences: DrugReference[] = [
  {
    id: "1",
    name: "Propofol",
    category: "Induction / sedation",
    aliases: ["Diprivan"],
    source: "label-propofol",
    url: dm("10272dc1-657d-4798-a34a-b6341b92e560"),
    scope: "Selected US label; adult IV induction of general anesthesia.",
    dose: "Healthy adults under 65, ASA I–II: 2–2.5 mg/kg titrated to response. Elderly, debilitated or ASA III–IV patients: approximately 1–1.5 mg/kg with slower titration. These are induction contexts, not interchangeable sedation regimens.",
    warning:
      "Apnea and cardiovascular depression require monitoring and immediate ventilatory support capability. Maintain strict aseptic handling. Check the exact formulation and its contraindications, including the label’s component/hypersensitivity restrictions.",
    learn:
      "The old single range concealed population and indication differences. Do not extrapolate induction values to ICU or procedural sedation.",
    related: ["infusion", "dilution"],
  },
  {
    id: "2",
    name: "Etomidate",
    category: "Induction",
    aliases: ["Amidate"],
    source: "label-etomidate",
    url: "https://www.dailymed.nlm.nih.gov/dailymed/getFile.cfm?setid=4312e3c3-34de-4cb3-8abd-c24d24a4bea1&type=pdf",
    scope: "US label; IV induction in adults and children over 10 years.",
    dose: "Usual induction dose in the label: 0.3 mg/kg IV over 30–60 seconds, individualized to response. See the full label for the permitted range and population limits.",
    warning:
      "Review adrenal effects and the complete product warnings. A hemodynamically favorable profile is not a guarantee of stability.",
    learn:
      "Dose, injection rate, co-administered agents and patient physiology all need explicit review.",
    related: ["infusion"],
  },
  {
    id: "3",
    name: "Ketamine",
    category: "Induction",
    aliases: ["Ketalar"],
    source: "label-ketamine",
    url: dm("bb912318-2e22-4469-b0a2-774803ee1bb8"),
    scope: "Selected US label; induction of general anesthesia.",
    dose: "IV induction label range: 1–4.5 mg/kg slowly over 60 seconds; an alternative label regimen is 1–2 mg/kg at 0.5 mg/kg/min. The IM induction range is 6.5–13 mg/kg. These are not analgesia or procedural-sedation instructions.",
    warning:
      "Do not give the 100 mg/mL product IV without appropriate dilution. Contraindicated when a substantial blood-pressure rise would be hazardous. Respiratory depression and emergence reactions can occur.",
    learn:
      "Route and indication materially change the regimen. Confirm the exact product, monitoring and rescue resources.",
    related: ["dilution", "infusion"],
  },
  {
    id: "4",
    name: "Midazolam",
    category: "Sedation",
    aliases: ["Versed"],
    source: "label-midazolam",
    url: dm("5e85e477-d483-4345-8d7b-d7dcdc3e0652"),
    scope: "Selected US injection label; adult sedation.",
    dose: "The initial adult IV sedation dose may be as low as 1 mg and should not exceed 2.5 mg in a normal healthy adult. Titrate slowly, allowing time to assess effect; use the full label for injection timing, increments and age/comorbidity adjustments.",
    warning:
      "Respiratory depression and arrest are possible, particularly with other depressants. Monitoring and immediate airway/resuscitation capability are required.",
    learn:
      "A universal mg/kg dose is insufficient for sedation. Review concurrent opioids, age, health status and cumulative dosing.",
    related: ["drug-18"],
  },
  {
    id: "5",
    name: "Fentanyl",
    category: "Opioid",
    aliases: ["Sublimaze"],
    source: "label-fentanyl",
    url: dm("aacf276b-e133-4199-ad3f-67b894744c04"),
    scope: "Selected US injectable product label.",
    dose: "Choose the indication-specific regimen from the full label or local formulary. The former universal 1–3 mcg/kg range is not presented as a complete dosing rule.",
    warning:
      "Titrate and monitor for respiratory depression, cardiovascular depression and skeletal-muscle rigidity. Co-administered depressants and interacting drugs can change risk.",
    learn:
      "Plan ventilation, monitoring and postoperative analgesia; onset and duration are not fixed guarantees.",
    related: ["drug-19", "infusion"],
  },
  {
    id: "6",
    name: "Sufentanil",
    category: "Opioid",
    aliases: ["Sufenta"],
    source: "label-sufentanil",
    url: dm("20293943-46ff-4345-1aa4-929b4e017a25"),
    scope:
      "US label; intravenous and epidural routes have different indications.",
    dose: "Use the route- and indication-specific label regimen. No generic bolus is calculated here.",
    warning:
      "Only personnel trained in potent-opioid respiratory effects should administer it. Check CYP3A4 interactions. An epidural preparation or dose must not be treated as an intrathecal regimen.",
    learn:
      "Confirm route, exact preparation, intended anesthetic role and postoperative monitoring. Potency comparisons are not dose-conversion instructions.",
    related: ["drug-19", "anticoag"],
  },
  {
    id: "7",
    name: "Remifentanil",
    category: "Opioid",
    aliases: ["Ultiva"],
    source: "label-remifentanil",
    url: "https://dailymed.nlm.nih.gov/dailymed/getFile.cfm?setid=9d289052-1eb6-4ba2-a3ca-d2e542a052ae",
    scope: "US IV product label; regimen depends on anesthetic setting.",
    dose: "Use the appropriate label infusion table with the co-administered anesthetic and patient population. This card does not prescribe a universal bolus or infusion.",
    warning:
      "Monitor for respiratory depression. Analgesic effect subsides rapidly after stopping; the label describes loss of analgesia within approximately 5–10 minutes.",
    learn:
      "Plan an appropriate transition to postoperative analgesia before discontinuation. Verify preparation and pump concentration.",
    related: ["infusion", "dilution"],
  },
  {
    id: "8",
    name: "Succinylcholine",
    category: "Neuromuscular blocker",
    aliases: ["sux", "suxamethonium", "Anectine"],
    source: "label-succinylcholine",
    url: dm("690a0231-dbba-4695-a843-842a14c6587c"),
    scope: "US label revised June 2026; IV adult intubation context.",
    dose: "Label average for adult IV intubation is 0.6 mg/kg, with an individualized range of 0.3–1.1 mg/kg. This card does not substitute for a reviewed rapid-sequence protocol.",
    warning:
      "Boxed warning: pediatric hyperkalemic rhabdomyolysis, dysrhythmia, arrest and death. Pediatric use is reserved for emergency airway indications specified by the label. Review contraindications and MH susceptibility before use.",
    learn:
      "Paralysis does not provide anesthesia. Confirm ventilation capability, exact formulation and dilution instructions; pediatric and IM doses are not inferred from the adult regimen.",
    related: ["mh", "failed-airway"],
  },
  {
    id: "9",
    name: "Rocuronium",
    category: "Neuromuscular blocker",
    aliases: ["Zemuron"],
    source: "label-rocuronium",
    url: dm("309aeb1b-8022-4df7-8194-ae6529e3395c"),
    scope: "US injection label; adult IV tracheal intubation.",
    dose: "Label initial routine-intubation dose: 0.6 mg/kg IV. Rapid-sequence label range: 0.6–1.2 mg/kg. Individualize and assess neuromuscular response.",
    warning:
      "Medication-selection errors with neuromuscular blockers can be fatal. Ensure anesthesia, ventilation and monitoring. Additional dosing and recovery assessment require neuromuscular monitoring.",
    learn:
      "Recovery time varies with patient factors and anesthetic technique. Reversal depends on measured depth, agent and renal context.",
    related: ["reversal", "drug-17"],
  },
  {
    id: "10",
    name: "Cisatracurium",
    category: "Neuromuscular blocker",
    aliases: ["Nimbex"],
    source: "label-cisatracurium",
    url: dm("1c6a8b98-deac-4e25-b4a0-5d0af5090281"),
    scope:
      "US label; adult IV intubation under specified anesthetic techniques.",
    dose: "Adult label initial bolus: 0.15–0.2 mg/kg IV with the anesthetic techniques described in the label. Pediatric regimens are separate.",
    warning:
      "Not recommended for rapid-sequence intubation because of onset time. Ensure anesthesia, ventilation and neuromuscular monitoring.",
    learn:
      "An elimination mechanism does not eliminate the need to monitor block depth and recovery.",
    related: ["reversal"],
  },
  {
    id: "11",
    name: "Epinephrine",
    category: "Vasopressor / resuscitation",
    aliases: ["adrenaline"],
    source: "rcuk",
    scope:
      "Indication-specific references; UK perioperative anaphylaxis and AHA adult arrest are separate algorithms.",
    dose: "Open the relevant crisis reference. Anaphylaxis, adult arrest and LAST use different routes, preparations and dosing contexts; no universal “push-dose” value is shown.",
    warning:
      "Verify concentration and units at every step. Do not interchange mg and mcg or copy an arrest dose into another indication.",
    learn:
      "Use the locally adopted algorithm and exact product preparation. LAST can require modified resuscitation.",
    related: ["anaphylaxis", "arrest", "last", "dilution"],
  },
  {
    id: "12",
    name: "Phenylephrine",
    category: "Vasopressor",
    aliases: ["Neo-Synephrine"],
    source: "label-phenylephrine",
    url: dm("5788f8c6-f868-4b83-81dc-dc485d8716c0"),
    scope:
      "Selected US concentrate label; vasodilatory hypotension during anesthesia.",
    dose: "This label uses an initial IV bolus of 40–100 mcg, repeated every 1–2 minutes as needed, with a total bolus limit of 200 mcg before moving to its infusion pathway. Do not generalize these instructions to every product.",
    warning:
      "The cited concentrate requires dilution. Correct volume depletion and assess response. Check the available product rather than assuming a syringe concentration.",
    learn:
      "Product labels can differ. Match the source to the vial or premixed product and local protocol.",
    related: ["dilution", "infusion"],
  },
  {
    id: "13",
    name: "Ephedrine sulfate",
    category: "Vasopressor",
    aliases: ["Akovaz", "ephedrine"],
    source: "label-ephedrine",
    url: dm("552c341b-4892-4dc7-8b9f-cb6be914b0d1"),
    scope:
      "Selected US concentrate label; clinically important hypotension during anesthesia.",
    dose: "Initial IV bolus 5–10 mg ephedrine sulfate, with further boluses as needed up to a total of 50 mg according to the label.",
    warning:
      "The 50 mg/mL concentrate requires dilution. Ready-to-use preparations differ; verify the product and whether the stated amount is sulfate or base.",
    learn:
      "Titrate to the intended hemodynamic response and review the full label for precautions and interactions.",
    related: ["dilution"],
  },
  {
    id: "14",
    name: "Vasopressin",
    category: "Vasopressor",
    aliases: ["Vasostrict"],
    source: "label-vasopressin",
    url: dm("b1147beb-743e-4c62-8927-91192447f8b8"),
    scope: "Selected US label; adult vasodilatory shock.",
    dose: "Label IV infusion ranges differ by context: post-cardiotomy shock 0.03–0.1 units/min; septic shock 0.01–0.07 units/min. Consult the label for initiation, titration and tapering.",
    warning:
      "Verify dilution and units/min. The former generic 1–4 unit IV bolus is not presented as a labeled universal regimen.",
    learn:
      "Match the indication and product; these ranges do not replace a local shock pathway.",
    related: ["hemodynamics"],
  },
  {
    id: "15",
    name: "Norepinephrine",
    category: "Vasopressor",
    aliases: ["noradrenaline", "Levophed"],
    source: "label-norepinephrine",
    url: "https://www.dailymed.nlm.nih.gov/dailymed/getFile.cfm?setid=cc9ecec5-3bd7-4132-9745-7666bac8ceac&type=pdf",
    scope: "Selected US concentrate label; IV infusion.",
    dose: "The cited label starts at 8–12 mcg/min IV infusion and adjusts to the hemodynamic response. This is not the same unit as mcg/kg/min.",
    warning:
      "Verify the exact product, dilution, line and monitoring requirements in the full label. The former generic IV bolus has been removed.",
    learn:
      "Record final concentration before converting a prescribed dose to a pump rate. Weight-normalized protocols require a separate explicit weight.",
    related: ["infusion", "dilution"],
  },
  {
    id: "16",
    name: "Neostigmine",
    category: "Reversal",
    aliases: ["Bloxiverz"],
    source: "label-neostigmine",
    url: dm("088f96eb-20b8-48f8-ac83-329f75a44ce1"),
    scope: "US label; IV reversal of nondepolarizing block.",
    dose: "Label range 0.03–0.07 mg/kg IV according to block and agent context; maximum is the lower of 0.07 mg/kg and 5 mg. Administer the indicated anticholinergic before or with it.",
    warning:
      "Use quantitative neuromuscular assessment and the locally adopted reversal guideline. “More than two twitches” alone does not establish appropriate use or adequate recovery.",
    learn:
      "Label dose ranges and professional guidance on when to select a reversal strategy answer different questions.",
    related: ["reversal"],
  },
  {
    id: "17",
    name: "Sugammadex",
    category: "Reversal",
    aliases: ["Bridion"],
    source: "bridion",
    scope: "Merck US prescribing information, March 2026.",
    dose: "See the linked reversal reference for agent- and depth-specific 2, 4 and 16 mg/kg contexts. Use actual body weight as specified by the label.",
    warning:
      "Do not apply immediate rocuronium reversal instructions to every agent, population or block depth. Review renal function and contraindications.",
    learn:
      "Document quantitative recovery; reversal drug administration is not proof of readiness for extubation.",
    related: ["reversal"],
  },
  {
    id: "18",
    name: "Flumazenil",
    category: "Reversal",
    aliases: ["Romazicon"],
    source: "label-flumazenil",
    url: dm("53d9144a-b7ee-b52a-e063-6294a90a09c5"),
    scope: "Selected US label; benzodiazepine sedation reversal in adults.",
    dose: "Initial label dose for conscious-sedation reversal: 0.2 mg IV over 15 seconds. Use the complete indication-specific titration instructions; overdose and sedation-reversal regimens differ.",
    warning:
      "Seizures and resedation are important risks. Assess dependence, withdrawal, seizure history and possible mixed overdose before use.",
    learn:
      "A generic 3–5 mg maximum obscures indication differences and has been removed. Continue monitoring after initial improvement.",
    related: ["drug-4"],
  },
  {
    id: "19",
    name: "Naloxone",
    category: "Reversal",
    aliases: ["Narcan"],
    source: "label-naloxone",
    url: dm("21d20dff-6efe-481e-a5a0-9c80ded73ca9"),
    scope:
      "Selected US injectable label; postoperative adult opioid respiratory depression.",
    dose: "Label postoperative IV titration uses 0.1–0.2 mg increments every 2–3 minutes to adequate ventilation and alertness without excessive pain. Community overdose products and regimens differ.",
    warning:
      "Recurrent depression, abrupt withdrawal and cardiovascular/pulmonary adverse effects require monitoring and an ongoing airway/ventilation plan.",
    learn:
      "The opioid can outlast the antagonist. A single response does not establish durable recovery.",
    related: ["drug-5"],
  },
  {
    id: "20",
    name: "Sevoflurane",
    category: "Inhaled anesthetic",
    aliases: ["Ultane"],
    source: "label-sevoflurane",
    url: dm("22700993-851a-48aa-941e-1d2b6b04081f"),
    scope: "US inhaled product labeling.",
    dose: "Use the age-specific MAC table and the exact product’s administration instructions. A single adult MAC or emergence-time estimate is not universal.",
    warning:
      "Review fresh-gas flow, absorbent compatibility, contraindications and MH susceptibility using the complete product label.",
    learn:
      "MAC changes with age and co-administered agents. End-tidal concentration is not a guaranteed individual response.",
    related: ["mh", "ventilation"],
  },
  {
    id: "21",
    name: "Desflurane",
    category: "Inhaled anesthetic",
    aliases: ["Suprane"],
    source: "label-desflurane",
    url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=21ba0e18-3dbc-4feb-a3a4-f6470c00910a&type=display",
    scope: "Selected US inhaled product label.",
    dose: "Use age- and context-specific label concentrations with the required delivery equipment; no fixed emergence time is asserted.",
    warning:
      "Contraindicated for inhalational induction in pediatric patients because of upper-airway adverse events. Pediatric maintenance has separate conditions, including prior induction with another agent and intubation.",
    learn:
      "Review airway reactivity, patient suitability and the complete contraindications before choosing an inhaled agent.",
    related: ["mh", "ventilation"],
  },
  {
    id: "22",
    name: "Isoflurane",
    category: "Inhaled anesthetic",
    aliases: ["Forane"],
    source: "label-isoflurane",
    url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=525a2467-548d-4b10-b181-91b90e99ae1b&type=display",
    scope: "US inhaled product label.",
    dose: "Use the age- and anesthetic-context-specific label table. No universal MAC value or emergence time is shown.",
    warning:
      "Contraindications include known or suspected genetic MH susceptibility and specified prior hepatic reactions to halogenated anesthetics. Review the complete label.",
    learn:
      "Assess patient factors, co-administered drugs and monitoring rather than relying on a fixed duration.",
    related: ["mh", "ventilation"],
  },
  {
    id: "23",
    name: "Nitrous oxide",
    category: "Inhaled anesthetic adjunct",
    aliases: ["N2O", "laughing gas"],
    source: "nitrous",
    url: "https://www.gov.uk/drug-safety-update/nitrous-oxide-neurological-and-haematological-toxic-effects",
    scope: "MHRA safety communication; not a complete product monograph.",
    dose: "No dosing or MAC recommendation is supplied by this safety reference. Consult the exact medical-gas product information and local practice.",
    warning:
      "Nitrous oxide can inactivate vitamin B12 and cause neurological or hematological toxicity; consider susceptibility and exposure history.",
    learn:
      "This entry is a safety reference. The current local medical-gas monograph must supply additional contraindications, administration and occupational precautions.",
    related: ["ventilation"],
  },
];
