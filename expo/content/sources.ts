import { drugReferences } from "./drugs";
export const contentVersion = "2026.09.26-rc2";
export interface Source {
  id: string;
  title: string;
  version: string;
  url: string;
  checked: string;
  scope: string;
}
export const sources: Record<string, Source> = Object.fromEntries(
  [
    [
      "lidocaine",
      "DailyMed • Lidocaine injection",
      "Label accessed September 2026",
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2c58deba-dbb2-4e73-a173-36053536f03e",
      "Normal healthy adults; specific product labeling",
    ],
    [
      "mh",
      "MHAUS • Managing a crisis",
      "Online guidance, September 2026",
      "https://www.mhaus.org/healthcare-professionals/managing-a-crisis/",
      "Suspected malignant hyperthermia; US",
    ],
    [
      "last",
      "ASRA • LAST checklist",
      "2020, version 1.1",
      "https://asra.com/docs/default-source/guidelines-articles/local-anesthetic-systemic-toxicity-rgb.pdf",
      "Local anesthetic systemic toxicity; US",
    ],
    [
      "asra",
      "ASRA • Antithrombotic guidelines",
      "Fifth edition, October 2025",
      "https://rapm.bmj.com/content/early/2025/10/16/rapm-2024-105766",
      "Neuraxial and deep plexus/peripheral blocks; US",
    ],
    [
      "stop",
      "STOP-Bang • Screening algorithm",
      "Chest 2016",
      "https://www.stopbang.ca/publication/pdf/pubchest1.pdf",
      "Adult obstructive sleep apnea screening, not difficult-airway prediction",
    ],
    [
      "acgme",
      "ACGME • Anesthesiology requirements",
      "Effective July 1, 2026",
      "https://www.acgme.org/globalassets/pfassets/programrequirements/2026-prs/040_anesthesiology_2026.pdf",
      "US anesthesiology residency; program verification required",
    ],
    [
      "bridion",
      "Merck • BRIDION prescribing information",
      "March 2026",
      "https://www.merck.com/product/usa/pi_circulars/b/bridion/bridion_pi.pdf",
      "Sugammadex; US product labeling",
    ],
    [
      "rcuk",
      "Resuscitation Council UK • Perioperative anaphylaxis",
      "2024",
      "https://www.resus.org.uk/sites/default/files/2024-01/2526%20AAP%20RCUK%20periop%20anaphylaxis-8C.pdf",
      "UK perioperative specialist algorithm",
    ],
    [
      "das",
      "Difficult Airway Society • Algorithms",
      "2025 guideline collection",
      "https://das.uk.com/algorithms/",
      "Adult difficult airway; use current local adopted algorithm",
    ],
    [
      "monitor",
      "ASA • Basic anesthetic monitoring",
      "Amended October 15, 2025",
      "https://www.asahq.org/standards-and-practice-parameters/standards-for-basic-anesthetic-monitoring",
      "General monitoring; US",
    ],
    [
      "ob",
      "ASA • Obstetric anesthesia",
      "2016 practice guideline",
      "https://www.asahq.org/~/media/sites/asahq/files/public/resources/standards-guidelines/practice-guidelines-for-obstetric-anesthesia.pdf",
      "Obstetric anesthesia; US",
    ],
    [
      "robotic",
      "APSF • Obesity and robotic surgery",
      "2018",
      "https://www.apsf.org/article/obesity-and-robotic-surgery/",
      "Positioning and respiratory considerations",
    ],
    [
      "brain",
      "OpenAnesthesia • Awake craniotomy",
      "2026",
      "https://www.openanesthesia.org/keywords/anesthesia-for-awake-craniotomy/",
      "Awake craniotomy preparation",
    ],
    [
      "pbw",
      "ARDS Network • Lower tidal volume trial",
      "NEJM 2000 trial",
      "https://www.nejm.org/doi/abs/10.1056/NEJM200005043421801",
      "Adult predicted body weight; not a universal drug dosing weight",
    ],
    [
      "lbw",
      "Janmahasatian et al. • Lean body weight",
      "Clinical Pharmacokinetics 2005",
      "https://doi.org/10.2165/00003088-200544100-00004",
      "Adult population model; extremes require separate assessment",
    ],
    [
      "cpr",
      "AHA • Adult advanced life support",
      "2025",
      "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support",
      "Adult resuscitation; cause-specific modifications apply",
    ],
  ].map(([id, title, version, url, scope]) => [
    id,
    { id, title, version, url, scope, checked: "2026-09-24" },
  ]),
);
export const reviewStatus =
  "Source reconciliation draft — independent clinical review pending";

for (const drug of drugReferences) {
  if (drug.url)
    sources[drug.source] = {
      id: drug.source,
      title: drug.name + " • Selected primary source",
      version: "Source accessed September 25, 2026; exact product applies",
      url: drug.url,
      checked: "2026-09-25",
      scope: drug.scope,
    };
}

sources.lbwMethod = {
  id: "lbwMethod",
  title: "Primary cohort study • Janmahasatian equations in methods",
  version: "2021",
  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8617769/",
  checked: "2026-09-25",
  scope: "Confirms equations used; not anesthesia dosing validation",
};
sources.bsa = {
  id: "bsa",
  title: "Mosteller BSA • Adult comparison study",
  version: "2006",
  url: "https://pubmed.ncbi.nlm.nih.gov/16546483/",
  checked: "2026-09-25",
  scope: "Adult BSA formula comparison; not a dosing recommendation",
};

// Exact label selected for the representative monograph. Reconciliation is not approval.
sources["label-propofol"] = {
  ...sources["label-propofol"],
  title: "Avet / Heritage • Propofol injectable emulsion (DailyMed)",
  version: "SPL version 14; effective 2025-05-26; label revised May 2025",
  checked: "2026-09-26",
  scope:
    "US; IV emulsion 10 mg/mL with EDTA; selected indication-specific facts, not complete prescribing information",
};

Object.assign(sources, {
  "acid-base": {
    id: "acid-base",
    title: "Merck Manual Professional • Acid-Base Disorders",
    version: "Reviewed March 2025; updated April 2025",
    url: "https://www.merckmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/acid-base-disorders",
    checked: "2026-09-26",
    scope:
      "Adult educational acid-base interpretation; approximate compensation models; no treatment recommendations",
  },
  figge: {
    id: "figge",
    title: "Figge et al. • Anion gap and hypoalbuminemia",
    version: "Critical Care Medicine 1998;26:1807–1810. PMID 9824071",
    url: "https://pubmed.ncbi.nlm.nih.gov/9824071/",
    checked: "2026-09-26",
    scope:
      "Observational ICU study; albumin adjustment of gap, not a standalone diagnosis",
  },
  "mayo-renal": {
    id: "mayo-renal",
    title: "Mayo Clinic Laboratories • RFAMA serum renal panel",
    version: "Live test catalog; revision date not stated",
    url: "https://renal.testcatalog.org/show/RFAMA",
    checked: "2026-09-26",
    scope:
      "Selected adult serum reference intervals from this laboratory; not universal cutoffs",
  },
  "mayo-cbc": {
    id: "mayo-cbc",
    title: "Mayo Clinic Laboratories • CBC with differential",
    version: "Live test catalog; revision date not stated",
    url: "https://www.mayocliniclabs.com/test-catalog/overview/9109",
    checked: "2026-09-26",
    scope: "Blood CBC; laboratory and population-specific interpretation",
  },
});
