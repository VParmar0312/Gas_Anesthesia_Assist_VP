export interface CrisisAction {
  id: string;
  title: string;
  detail: string;
}
export interface CrisisGuide {
  id: string;
  scope: string;
  actions: CrisisAction[];
  cautions: string[];
}
const actions = (rows: [string, string][]): CrisisAction[] =>
  rows.map(([title, detail], i) => ({ id: String(i + 1), title, detail }));
export const crises: CrisisGuide[] = [
  {
    id: "mh",
    scope:
      "Suspected malignant hyperthermia. Source-reconciled MHAUS summary; independent clinical review pending. Activate local resources immediately.",
    actions: actions([
      [
        "Call for help and the MH cart",
        "Notify the surgeon; stop volatile anesthetics and succinylcholine. Arrange to halt surgery if feasible.",
      ],
      [
        "Oxygenate and change to non-triggering anesthesia",
        "Hyperventilate with 100% oxygen. Apply activated charcoal filters if available according to their instructions.",
      ],
      [
        "Give dantrolene and reassess",
        "MHAUS initial bolus: 2.5 mg/kg IV rapidly. Repeat according to clinical response. Select and verify the exact formulation below.",
      ],
      [
        "Treat associated derangements",
        "Follow the MH protocol for hyperkalemia, acidosis, rhythm disturbance and cooling. Avoid calcium-channel blockers with dantrolene.",
      ],
      [
        "Continue monitoring and arrange ongoing care",
        "Monitor temperature, ventilation, potassium, blood gases, renal injury and urine output. Arrange monitored post-crisis care.",
      ],
    ]),
    cautions: [
      "10 mg/kg is not a hard maximum: higher cumulative dosing may be needed. Persistent findings should prompt reassessment of the diagnosis with expert help.",
      "Product preparations differ. Use sterile water for injection as specified by the exact formulation.",
    ],
  },
  {
    id: "last",
    scope:
      "Suspected local anesthetic systemic toxicity. ASRA 2020 checklist summary, version 1.1. Resuscitation differs from standard ACLS.",
    actions: actions([
      [
        "Stop local anesthetic and call for help",
        "Get the LAST rescue kit and lipid emulsion. Consider early cardiopulmonary support resources.",
      ],
      [
        "Support airway and control seizures",
        "Ensure oxygenation and ventilation; benzodiazepines are preferred for seizures.",
      ],
      [
        "Administer 20% lipid emulsion",
        "ASRA: over 70 kg, approximately 100 mL bolus over 2–3 minutes, then approximately 250 mL over 15–20 minutes. Under 70 kg: 1.5 mL/kg over 2–3 minutes, then 0.25 mL/kg/min. At the 70 kg boundary, verify the locally adopted dosing convention.",
      ],
      [
        "If unstable, reassess lipid treatment",
        "Repeat the bolus and double the infusion according to the checklist. Continue infusion for more than 15 minutes after stability; maximum total lipid dose 12 mL/kg.",
      ],
      [
        "Use modified resuscitation and monitor",
        "Use smaller epinephrine doses (start below 1 mcg/kg). Avoid vasopressin, beta blockers, calcium-channel blockers and local anesthetic antiarrhythmics. Arrange observation according to the event and checklist.",
      ],
    ]),
    cautions: [
      "Do not substitute propofol for lipid rescue. Confirm 20% lipid formulation.",
      "This summary does not replace the full checklist or specialist support.",
    ],
  },
  {
    id: "anaphylaxis",
    scope:
      "Perioperative anaphylaxis: UK RCUK 2024 specialist algorithm. Local adoption and drug preparation must be verified; this is not a community auto-injector guide.",
    actions: actions([
      [
        "Call for help and stop suspected triggers",
        "Inform the team; manage oxygenation, airway and circulation.",
      ],
      [
        "Use epinephrine through the appropriate route",
        "Follow the locally adopted perioperative algorithm. RCUK specialist IV doses: adult/over 12 years 50 mcg; under 12 years 1 mcg/kg, titrated to response. Verify dilution. If IV access is unavailable, RCUK uses IM 10 mcg/kg (maximum 500 mcg).",
      ],
      [
        "Give fluids and reassess",
        "RCUK initial crystalloid boluses: adults 500–1,000 mL; children 20 mL/kg. Reassess repeatedly; activate resuscitation if needed.",
      ],
      [
        "Plan follow-up once stable",
        "Obtain appropriately timed tryptase samples and document suspected exposures. Arrange specialist allergy referral; a tryptase result alone does not confirm the culprit.",
      ],
    ]),
    cautions: [
      "Epinephrine is time-critical. Antihistamines and corticosteroids do not replace treatment of airway or circulatory compromise.",
      "The former ranitidine instruction has been removed.",
    ],
  },
  {
    id: "failed-airway",
    scope:
      "Adult airway escalation prompts. The previous hybrid algorithm and abbreviated surgical instructions have been removed. Use the current locally adopted difficult-airway algorithm.",
    actions: actions([
      [
        "Call for experienced airway help",
        "State the problem, maintain team communication and obtain rescue equipment.",
      ],
      [
        "Prioritize oxygenation",
        "Assess ventilation and oxygenation continuously; follow the adopted algorithm for attempts, alternatives and escalation.",
      ],
      [
        "Declare failure and escalate explicitly",
        "If unable to oxygenate, declare the emergency and follow the local emergency front-of-neck-access protocol with trained personnel. Do not delay escalation while using this app.",
      ],
    ]),
    cautions: [
      "No numeric global airway-risk score is supported.",
      "This page does not teach a surgical airway technique. The source link opens online guidance; keep the approved full algorithm available offline in the workplace.",
    ],
  },
  {
    id: "hemorrhage",
    scope:
      "General coordination prompts. Product ratios, activation criteria and hemostatic medication regimens must come from the locally adopted protocol.",
    actions: actions([
      [
        "Activate the major hemorrhage protocol",
        "Call for help, alert the blood bank and coordinate source control with the procedural team.",
      ],
      [
        "Confirm delivery and monitoring resources",
        "Verify access, rapid transfusion equipment, warming, product identification and laboratory/point-of-care monitoring.",
      ],
      [
        "Reassess physiology and treatment",
        "Follow the local pathway for component therapy, calcium, temperature and coagulation. Consider cause-specific indications and contraindications for adjuncts.",
      ],
      [
        "Communicate response and deactivation",
        "Document product totals, reassess ongoing bleeding and coordinate handoff and blood-bank updates.",
      ],
    ]),
    cautions: [
      "A universal 1:1:1 ratio, O-negative selection and TXA regimen are not asserted for every hemorrhage.",
    ],
  },
  {
    id: "hypoxia",
    scope:
      "Initial assessment prompts. Causes and treatment depend on the patient, procedure and equipment.",
    actions: actions([
      [
        "Call for help and assess the patient",
        "Escalate immediately for deterioration. Verify the oxygen source and delivery; assess ventilation and circulation.",
      ],
      [
        "Assess the airway, circuit and ventilation",
        "Use capnography, pressure/volume information and clinical examination. Check connections, airway patency and device position.",
      ],
      [
        "Identify and treat the cause",
        "Consider airway, pulmonary, equipment and circulatory causes; use appropriate confirmation and the locally adopted emergency pathway.",
      ],
    ]),
    cautions: [
      "Breath sounds alone do not establish a diagnosis.",
      "The previous generic needle-decompression instruction has been removed; follow trained, context-specific emergency practice.",
    ],
  },
  {
    id: "arrest",
    scope:
      "Adult cardiac arrest. Follow the complete locally adopted rhythm-specific algorithm; cause-specific pathways such as LAST can change drug choices and doses.",
    actions: actions([
      [
        "Activate resuscitation and obtain a defibrillator",
        "Start CPR according to training and assess the rhythm as soon as equipment is available.",
      ],
      [
        "Provide high-quality CPR",
        "AHA 2025 adult targets: 100–120 compressions/minute, depth at least 5 cm while avoiding excessive depth, full recoil and minimal interruption.",
      ],
      [
        "Follow the rhythm-specific pathway",
        "Defibrillation and drug timing depend on shockable versus nonshockable rhythm. Use the full algorithm and reassess reversible causes.",
      ],
      [
        "Coordinate roles and handoff",
        "Assign compressions, airway, defibrillator, drugs and documentation. Plan post-resuscitation care after return of circulation.",
      ],
    ]),
    cautions: [
      "No metronome, automated rhythm interpretation or autonomous drug timer is provided.",
    ],
  },
];
