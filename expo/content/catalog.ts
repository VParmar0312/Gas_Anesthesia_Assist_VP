import { drugReferences } from "./drugs";
export type ContentKind = "procedure" | "drug" | "topic" | "crisis" | "tool" | "lab";
export interface Section {
  title: string;
  body: string;
}
export interface Entry {
  id: string;
  kind: ContentKind;
  title: string;
  summary: string;
  aliases: string[];
  sources: string[];
  quick: Section[];
  learn: Section[];
  related: string[];
}
function procedure(
  id: string,
  title: string,
  summary: string,
  details: string[],
  source: string,
  related: string[],
): Entry {
  return {
    id,
    kind: "procedure",
    title,
    summary,
    aliases: [],
    sources: [source, "monitor"],
    quick: [
      { title: "Before the case", body: details[0] },
      { title: "Equipment and access", body: details[1] },
      { title: "Emergence and handoff", body: details[2] },
    ],
    learn: [
      { title: "Discuss with the team", body: details[3] },
      {
        title: "Build your plan",
        body: "Identify the patient-specific risks, alternatives, rescue plan and postoperative destination. These prompts do not prescribe a technique or dose. Confirm the plan with your supervisor or procedural team.",
      },
    ],
    related,
  };
}
export const procedures: Entry[] = [
  procedure(
    "lap-chole",
    "Laparoscopic cholecystectomy",
    "Pneumoperitoneum • positioning • recovery",
    [
      "Review aspiration considerations, cardiopulmonary reserve and anticipated surgical difficulty.",
      "Plan access before positioning; discuss insufflation tolerance and an airway/ventilation response plan.",
      "Discuss analgesia, nausea prevention and criteria for discharge or escalation.",
      "How will pneumoperitoneum and positioning change your monitoring priorities?",
    ],
    "monitor",
    ["body", "infusion", "airway"],
  ),
  procedure(
    "hip",
    "Hip arthroplasty",
    "Regional options • blood loss • mobility",
    [
      "Review cardiopulmonary reserve, antithrombotics and proposed surgical approach.",
      "Agree on positioning, access, blood availability and technique alternatives.",
      "Discuss postoperative analgesia, mobilization, anticoagulant timing and destination.",
      "If neuraxial or a deep block is considered, which drug, dose, renal function and procedural event determine the guideline branch?",
    ],
    "asra",
    ["anticoag", "blood", "lidocaine"],
  ),
  procedure(
    "cesarean",
    "Cesarean delivery",
    "Urgency • neuraxial assessment • hemorrhage",
    [
      "Clarify urgency, airway concerns, existing neuraxial function and hemorrhage risk.",
      "Agree on the primary technique, assessment of block adequacy, backup airway and hemorrhage resources.",
      "Plan pain control, maternal monitoring, neonatal handoff and follow-up of neuraxial complications.",
      "How will inadequate anesthesia or pain during delivery be recognized, discussed and managed?",
    ],
    "ob",
    ["airway", "anticoag", "hemorrhage"],
  ),
  procedure(
    "robotic",
    "Robotic pelvic surgery",
    "Limited access • steep positioning • ventilation",
    [
      "Discuss expected duration, position, insufflation and cardiopulmonary reserve.",
      "Check airway and line security, padding and access before docking; agree on an emergency undocking plan.",
      "Reassess airway and respiratory status after returning supine; plan recovery monitoring.",
      "How do positioning, insufflation and restricted patient access affect contingency planning?",
    ],
    "robotic",
    ["body", "ventilation", "hypoxia"],
  ),
  procedure(
    "craniotomy",
    "Awake craniotomy",
    "Mapping • cooperation • rescue planning",
    [
      "Clarify mapping goals, suitability for cooperation and the airway plan with the multidisciplinary team.",
      "Discuss access, positioning, scalp analgesia, communication and conversion/rescue contingencies.",
      "Agree on neurologic assessment, pain/nausea management and postoperative destination.",
      "Which parts of the procedure require cooperation, and how will you rehearse communication?",
    ],
    "brain",
    ["airway", "last", "lidocaine"],
  ),
  procedure(
    "thoracic",
    "Thoracic surgery preparation",
    "Lung isolation • oxygenation • postoperative care",
    [
      "Review respiratory reserve, planned resection and the requested isolation technique.",
      "Confirm device availability, verification equipment and a shared response plan for loss of oxygenation.",
      "Discuss analgesia, ventilation needs and the monitored postoperative destination.",
      "Which causes of oxygenation change will you assess first during lung isolation?",
    ],
    "monitor",
    ["hypoxia", "ventilation", "blood"],
  ),
  procedure(
    "spine",
    "Spine surgery preparation",
    "Prone position • monitoring • blood availability",
    [
      "Clarify neurologic baseline, planned monitoring, procedure extent and blood-loss risk.",
      "Discuss positioning checks, airway access, pressure protection and rescue from the prone position.",
      "Plan reassessment after repositioning, postoperative neurologic examination and destination.",
      "How will monitoring requirements influence your anesthetic plan and communication?",
    ],
    "monitor",
    ["blood", "infusion", "hypoxia"],
  ),
  procedure(
    "cardiac",
    "Cardiac surgery preparation",
    "Procedure goals • bypass • team coordination",
    [
      "Clarify lesion physiology, procedure goals and perioperative support requirements with the cardiac team.",
      "Confirm invasive monitoring, access, perfusion coordination and local anticoagulation/reversal protocols.",
      "Agree on handoff, hemodynamic priorities, ventilation and the destination of care.",
      "What are the patient-specific failure modes before, during and after the procedure?",
    ],
    "monitor",
    ["hemodynamics", "infusion", "hemorrhage"],
  ),
];
export const toolsCatalog: Entry[] = [
  [
    "body",
    "Body size",
    "BMI, predicted weight, lean body weight and BSA",
    ["pbw", "lbw"],
  ],
  ["infusion", "Infusion conversion", "mcg/kg/min ↔ mL/hour", []],
  [
    "dilution",
    "Concentration & dilution",
    "Percent to mg/mL and stock dilution",
    [],
  ],
  [
    "blood",
    "Allowable blood loss",
    "Explicit EBV and hematocrit assumptions",
    [],
  ],
  [
    "lidocaine",
    "Lidocaine label ceiling",
    "Normal healthy adults; capped single-dose label values",
    ["lidocaine"],
  ],
  [
    "hemodynamics",
    "Hemodynamic arithmetic",
    "MAP, cardiac index, SVR and PVR",
    [],
  ],
  [
    "ventilation",
    "Ventilation arithmetic",
    "Minute ventilation and P/F ratio",
    [],
  ],
  [
    "fluid",
    "4–2–1 arithmetic",
    "Educational maintenance formula; no NPO replacement",
    [],
  ],
].map(([id, title, summary, sources]) => ({
  id: id as string,
  title: title as string,
  summary: summary as string,
  sources: sources as string[],
  kind: "tool",
  aliases: [],
  quick: [],
  learn: [],
  related: [],
}));
export const topics: Entry[] = [
  {
    id: "anticoag",
    kind: "topic",
    title: "Anticoagulation & regional anesthesia",
    summary: "Drug, dose, renal function and event must all match.",
    aliases: ["neuraxial", "DOAC", "apixaban", "rivaroxaban", "enoxaparin"],
    sources: ["asra"],
    quick: [
      {
        title: "Choose the applicable branch",
        body: "Record the antithrombotic, indication and dose, last administration, renal function, planned block, catheter status and event (placement, removal or restart). Intervals for these events are not interchangeable.",
      },
      {
        title: "Timing table withheld",
        body: "The old generic restart table was removed. A complete scenario-specific rule set needs independent clinical review before release. Open the fifth-edition guideline and follow the locally adopted protocol; do not infer timing from another drug or dose.",
      },
    ],
    learn: [
      {
        title: "Additional context",
        body: "Document concurrent antithrombotics, traumatic puncture, bleeding risk and planned postoperative dosing. Discuss exceptions with the responsible specialist.",
      },
    ],
    related: ["hip", "cesarean"],
  },
  {
    id: "reversal",
    kind: "topic",
    title: "Neuromuscular reversal",
    summary: "Use measured block depth and product-specific context.",
    aliases: ["sugammadex", "TOF", "neostigmine"],
    sources: ["bridion"],
    quick: [
      {
        title: "Sugammadex label context",
        body: "US labeling uses actual body weight: 2 mg/kg at return of T2, or 4 mg/kg at 1–2 post-tetanic counts with no TOF twitches. The 16 mg/kg immediate reversal regimen is specific to approximately 3 minutes after 1.2 mg/kg rocuronium; do not generalize it to vecuronium or pediatric immediate reversal.",
      },
      {
        title: "Before selecting a regimen",
        body: "Verify quantitative neuromuscular monitoring, the blocking agent, timing, renal function and contraindications. The label does not recommend use in severe renal impairment. Counsel about additional nonhormonal contraception for 7 days when applicable.",
      },
    ],
    learn: [
      {
        title: "Recovery assessment",
        body: "A drug administration does not establish recovery. Continue ventilation and quantitative monitoring through documented recovery under the locally adopted guideline.",
      },
    ],
    related: ["infusion"],
  },
];
export const drugEntries: Entry[] = drugReferences.map((d) => ({
  id: `drug-${d.id}`,
  kind: "drug",
  title: d.name,
  summary: d.category,
  aliases: d.aliases,
  sources: [d.source],
  quick: [
    { title: "Scope", body: d.scope },
    { title: "Selected label context", body: d.dose },
    { title: "Key cautions", body: d.warning },
  ],
  learn: [
    { title: "Clinical context", body: d.learn },
    {
      title: "Review limits",
      body: "This concise reconciliation is not complete prescribing information. Check the source for contraindications, interactions, preparation, dose adjustments and monitoring. Independent clinical review is pending.",
    },
  ],
  related: d.related,
}));
export const crisisEntries: Entry[] = [
  [
    "mh",
    "Malignant hyperthermia",
    "Rising CO₂ • rigidity • temperature change",
    ["mh"],
    ["MH", "dantrolene"],
  ],
  [
    "last",
    "Local anesthetic systemic toxicity",
    "Seizure or cardiovascular instability after local anesthetic",
    ["last"],
    ["lipid", "LAST"],
  ],
  [
    "anaphylaxis",
    "Perioperative anaphylaxis",
    "Call for help • stop suspected trigger • resuscitate",
    ["rcuk"],
    ["allergy"],
  ],
  [
    "failed-airway",
    "Difficult / failed airway",
    "Call for expert help • prioritize oxygenation",
    ["das"],
    ["CICO", "cannot intubate"],
  ],
  [
    "hemorrhage",
    "Major hemorrhage",
    "Activate the local hemorrhage protocol",
    [],
    ["MTP", "bleeding"],
  ],
  [
    "hypoxia",
    "Unexpected hypoxia",
    "Escalate • assess oxygen delivery and ventilation",
    ["monitor"],
    ["desaturation"],
  ],
  [
    "arrest",
    "Cardiac arrest",
    "Activate resuscitation • follow rhythm-specific algorithm",
    ["cpr"],
    ["CPR", "ACLS"],
  ],
].map(([id, title, summary, sources, aliases]) => ({
  id: id as string,
  title: title as string,
  summary: summary as string,
  sources: sources as string[],
  aliases: aliases as string[],
  kind: "crisis",
  quick: [],
  learn: [],
  related: [],
}));
export const assessmentEntries: Entry[] = [
  {
    id: "airway",
    kind: "tool",
    title: "Airway & OSA assessment",
    summary: "Unassessed states and adult STOP-Bang screening",
    aliases: ["STOP BANG", "Mallampati"],
    sources: ["stop", "das"],
    quick: [],
    learn: [],
    related: [],
  },
  {
    id: "pediatric",
    kind: "topic",
    title: "Pediatric preparation",
    summary: "Age-aware preparation checklist and explicit sizing limits",
    aliases: ["peds", "child", "neonate"],
    sources: [],
    quick: [],
    learn: [],
    related: [],
  },
  {
    id: "preflight",
    kind: "tool",
    title: "Room preparation checklist",
    summary: "Session-based equipment and preparation checks",
    aliases: ["MSMAIDS", "equipment"],
    sources: [],
    quick: [],
    learn: [],
    related: [],
  },
];
export const catalog: Entry[] = [
  ...procedures,
  ...toolsCatalog,
  {
    id: "percent",
    kind: "tool",
    title: "Percent concentration",
    summary: "Convert percent w/v to mg/mL",
    aliases: ["concentration", "mg/ml"],
    sources: [],
    quick: [],
    learn: [],
    related: ["dilution"],
  },
  {
    id: "units",
    kind: "tool",
    title: "Measurement conversion",
    summary: "Weight and height unit conversion",
    aliases: ["pounds", "inches", "lb", "cm"],
    sources: [],
    quick: [],
    learn: [],
    related: ["body"],
  },
  ...topics,
  ...drugEntries,
  ...crisisEntries,
  ...assessmentEntries,
];
