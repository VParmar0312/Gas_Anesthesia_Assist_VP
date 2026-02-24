import { Drug, LocalAnesthetic } from '@/types/anesthesia';

export const inductionAgents: Drug[] = [
  {
    id: '1', name: 'Propofol', category: 'Induction',
    dose: '1.5–2.5 mg/kg IV (induction); 25–75 mcg/kg/min (TIVA)',
    onset: '15–30 sec', duration: '5–10 min',
    mechanism: 'GABA-A receptor potentiation → CNS depression',
    contraindications: 'Egg/soy allergy (controversial), hypovolemia, severe cardiac disease',
    interactions: 'Synergistic with opioids/benzos; avoid rapid bolus in elderly',
    pediatricDose: '2.5–3.5 mg/kg IV',
    notes: 'Pain on injection (lidocaine pretreatment). Reduces BP. Apnea common. Antioxidant, antiemetic properties.'
  },
  {
    id: '2', name: 'Etomidate', category: 'Induction',
    dose: '0.2–0.3 mg/kg IV',
    onset: '15–45 sec', duration: '3–12 min',
    mechanism: 'GABA-A agonist; minimal cardiovascular depression',
    contraindications: 'Septic shock (relative), adrenal insufficiency',
    interactions: 'None significant; does not inhibit CYP enzymes',
    pediatricDose: '0.2–0.3 mg/kg IV',
    notes: 'Hemodynamically stable. Single dose causes transient adrenal suppression (~8h). Myoclonus common.'
  },
  {
    id: '3', name: 'Ketamine', category: 'Induction',
    dose: '1–2 mg/kg IV; 4–6 mg/kg IM (induction); 0.1–0.5 mg/kg IV (analgesia)',
    onset: '30–60 sec IV; 3–8 min IM', duration: '10–20 min',
    mechanism: 'NMDA receptor antagonist → dissociative anesthesia',
    contraindications: 'Uncontrolled hypertension, raised ICP (relative), schizophrenia, active ischemia',
    interactions: 'Benzodiazepines reduce emergence delirium; avoid with MAOIs',
    pediatricDose: '1–2 mg/kg IV; 4–6 mg/kg IM',
    notes: 'Bronchodilator. Preserves airway reflexes. Emergence delirium (midazolam pretreatment). Increases HR/BP/ICP.'
  },
  {
    id: '4', name: 'Midazolam', category: 'Sedation',
    dose: '0.01–0.05 mg/kg IV (premedication); 0.02–0.1 mg/kg IV (sedation)',
    onset: '1–3 min IV; 15 min IM', duration: '15–80 min',
    mechanism: 'Benzodiazepine — GABA-A positive allosteric modulator',
    contraindications: 'Acute narrow-angle glaucoma, severe respiratory depression',
    interactions: 'CYP3A4 substrate — fluconazole/ketoconazole increase levels; opioid synergy',
    pediatricDose: '0.05–0.1 mg/kg IV; 0.3–0.5 mg/kg PO (premedication)',
    notes: 'Anxiolysis, amnesia, anticonvulsant. Respiratory depression dose-dependent. Reversal: Flumazenil.'
  },
  {
    id: '5', name: 'Dexmedetomidine', category: 'Sedation',
    dose: 'Loading: 0.5–1 mcg/kg IV over 10 min; Infusion: 0.2–0.7 mcg/kg/hr',
    onset: '5–10 min', duration: 'Infusion-dependent',
    mechanism: 'Alpha-2 adrenergic agonist → sedation, analgesia, sympatholysis',
    contraindications: 'Severe bradycardia, heart block, hypovolemia',
    interactions: 'Additive with other sedatives/hypnotics; potentiates NMBAs',
    pediatricDose: '0.5–1 mcg/kg load; 0.2–0.5 mcg/kg/hr infusion',
    notes: 'Cooperative sedation — patient arousable. Opioid-sparing. Bradycardia/hypotension common. No respiratory depression.'
  },
  {
    id: '6', name: 'Lorazepam', category: 'Sedation',
    dose: '0.02–0.04 mg/kg IV/IM (max 4 mg per dose)',
    onset: '1–5 min IV', duration: '6–8 hr',
    mechanism: 'Benzodiazepine — GABA-A potentiation',
    contraindications: 'Sleep apnea, severe hepatic impairment, acute angle-closure glaucoma',
    interactions: 'CNS depressants additive; propylene glycol solvent — avoid high-dose infusions',
    pediatricDose: '0.05 mg/kg IV (max 4 mg)',
    notes: 'Longer acting than midazolam. ICU sedation. Status epilepticus. Propylene glycol toxicity with prolonged infusion.'
  },
];

export const opioids: Drug[] = [
  {
    id: '10', name: 'Fentanyl', category: 'Opioid',
    dose: 'Intraop: 1–3 mcg/kg IV; Infusion: 0.5–5 mcg/kg/hr',
    onset: '1–2 min', duration: '30–60 min',
    mechanism: 'Mu-opioid receptor agonist',
    contraindications: 'Avoid concurrent MAOIs (serotonin syndrome risk)',
    interactions: 'CNS depressants additive; CYP3A4 inhibitors increase levels',
    pediatricDose: '1–2 mcg/kg IV; 0.5–1 mcg/kg/hr infusion',
    notes: 'Chest wall rigidity at high doses or rapid injection. Reversal: Naloxone. 100x potency of morphine.'
  },
  {
    id: '11', name: 'Sufentanil', category: 'Opioid',
    dose: '0.1–0.5 mcg/kg IV bolus; Infusion: 0.5–1 mcg/kg/hr',
    onset: '1–3 min', duration: '20–45 min',
    mechanism: 'Mu-opioid receptor agonist (highest mu-selectivity)',
    contraindications: 'Same as fentanyl; avoid MAOIs',
    interactions: 'CYP3A4 substrate; additive CNS/respiratory depression',
    pediatricDose: '0.1–0.3 mcg/kg IV',
    notes: '5–10× potency of fentanyl. Hemodynamically stable. Cardiac anesthesia. Risk of bradycardia.'
  },
  {
    id: '12', name: 'Remifentanil', category: 'Opioid',
    dose: 'Bolus: 0.5–1 mcg/kg; Infusion: 0.05–0.3 mcg/kg/min',
    onset: '1–1.5 min', duration: '3–10 min',
    mechanism: 'Mu-opioid receptor agonist; hydrolyzed by plasma esterases',
    contraindications: 'Not for intrathecal/epidural use (glycine vehicle)',
    interactions: 'Synergistic with propofol for TIVA; avoid epidural administration',
    pediatricDose: '0.05–0.25 mcg/kg/min infusion',
    notes: 'Ultra-short acting — context-sensitive half-time 3–4 min regardless of infusion duration. Opioid-induced hyperalgesia with prolonged use.'
  },
  {
    id: '13', name: 'Morphine', category: 'Opioid',
    dose: '0.05–0.1 mg/kg IV (titrated); PCA: 1–2 mg q8–10min',
    onset: '5–10 min IV', duration: '3–5 hr',
    mechanism: 'Mu > kappa opioid receptor agonist',
    contraindications: 'Renal failure (metabolite M6G accumulates), asthma (histamine release)',
    interactions: 'MAOIs contraindicated; CNS depressants additive',
    pediatricDose: '0.05–0.1 mg/kg IV q2–4hr',
    notes: 'Histamine release → hypotension/bronchospasm. Active metabolite (M6G) accumulates in renal failure. Intrathecal: 0.1–0.3 mg for postop analgesia.'
  },
  {
    id: '14', name: 'Hydromorphone', category: 'Opioid',
    dose: '0.2–1 mg IV q3–4hr; PCA: 0.2–0.4 mg q6–8min',
    onset: '5–15 min IV', duration: '3–4 hr',
    mechanism: 'Mu-opioid receptor agonist (5–7× potency of morphine)',
    contraindications: 'Renal failure (neuroexcitatory metabolite), MAOI use',
    interactions: 'CNS depressant synergy; CYP450 independent',
    pediatricDose: '0.015–0.02 mg/kg IV q3–4hr',
    notes: 'Less histamine release than morphine. Good alternative in morphine-intolerant patients. Neuroexcitatory metabolite H3G in renal failure.'
  },
  {
    id: '15', name: 'Alfentanil', category: 'Opioid',
    dose: 'Induction adjunct: 8–40 mcg/kg IV; Infusion: 0.5–3 mcg/kg/min',
    onset: '45–90 sec', duration: '5–20 min',
    mechanism: 'Mu-opioid receptor agonist; rapid CNS equilibration',
    contraindications: 'MAOI use, severe hepatic impairment',
    interactions: 'CYP3A4 substrate — erythromycin/fluconazole ↑ levels significantly',
    pediatricDose: '10–20 mcg/kg IV bolus',
    notes: '10× shorter context-sensitive half-time vs fentanyl. Metabolized by CYP3A4. Useful for short procedures.'
  },
  {
    id: '16', name: 'Methadone', category: 'Opioid',
    dose: '0.1–0.2 mg/kg IV slow bolus (intraop); Oral: complex conversion (see converter)',
    onset: '5–10 min IV', duration: '24–36 hr',
    mechanism: 'Mu-opioid agonist + NMDA antagonist + serotonin/norepinephrine reuptake inhibition',
    contraindications: 'QTc >500 ms, concurrent QT-prolonging drugs, severe respiratory depression',
    interactions: 'Many CYP3A4/2D6 interactions; MAOIs; QTc-prolonging agents',
    pediatricDose: 'Specialist use only',
    notes: 'Long half-life (24–60 hr) risks accumulation. QTc prolongation. Excellent for opioid-tolerant patients intraop. Non-linear equianalgesic conversion.'
  },
  {
    id: '17', name: 'Meperidine (Demerol)', category: 'Opioid',
    dose: '25–50 mg IV for shivering; Analgesic: 0.5–1 mg/kg IM/IV',
    onset: '5–10 min IV', duration: '2–4 hr',
    mechanism: 'Mu-opioid agonist; also inhibits serotonin/NE reuptake',
    contraindications: 'MAOI use (serotonin syndrome), renal failure, seizure disorder',
    interactions: 'MAOIs — risk of fatal serotonin syndrome; SSRIs',
    pediatricDose: 'Not recommended',
    notes: 'Neurotoxic metabolite normeperidine (seizures in renal failure). Primarily used for postop shivering treatment. Largely replaced by better options.'
  },
];

export const nmbs: Drug[] = [
  {
    id: '20', name: 'Succinylcholine', category: 'Neuromuscular Blocker',
    dose: '1–1.5 mg/kg IV (RSI); 3–4 mg/kg IM',
    onset: '30–60 sec', duration: '5–10 min',
    mechanism: 'Depolarizing NMB — persistent acetylcholine receptor activation',
    contraindications: 'Burns (>48hr old), crush injury, denervation, hyperkalemia, MH susceptibility, pseudocholinesterase deficiency, myopathies',
    interactions: 'Phase II block with high doses; prolonged block with anticholinesterases',
    pediatricDose: '2 mg/kg IV (< 2 yr); 1–2 mg/kg IV (older)',
    notes: 'Fastest onset/offset. Fasciculations → myalgias. K+ rise ~0.5 mEq/L (dangerous if already elevated). Reversal: spontaneous only; no antagonist.'
  },
  {
    id: '21', name: 'Rocuronium', category: 'Neuromuscular Blocker',
    dose: 'Intubation: 0.6–1.2 mg/kg IV; RSI: 1.2 mg/kg; Maintenance: 0.1–0.15 mg/kg',
    onset: '60–90 sec (standard); 60 sec (RSI dose)', duration: '30–60 min',
    mechanism: 'Non-depolarizing NMB — competitive ACh receptor antagonism',
    contraindications: 'Known hypersensitivity to rocuronium',
    interactions: 'Volatile agents potentiate; aminoglycosides potentiate; Sugammadex reverses',
    pediatricDose: '0.6 mg/kg IV',
    notes: 'Preferred for RSI when succinylcholine contraindicated (1.2 mg/kg). Reversal: Sugammadex (any depth). Neostigmine only if TOF ≥2 twitches.'
  },
  {
    id: '22', name: 'Cisatracurium', category: 'Neuromuscular Blocker',
    dose: '0.15–0.2 mg/kg IV; Maintenance: 1–2 mcg/kg/min infusion',
    onset: '2–3 min', duration: '40–60 min',
    mechanism: 'Non-depolarizing NMB — Hofmann elimination (pH/temperature dependent)',
    contraindications: 'Known hypersensitivity',
    interactions: 'Volatile agents potentiate; no organ-dependent metabolism',
    pediatricDose: '0.1–0.15 mg/kg IV',
    notes: 'Organ-independent Hofmann elimination — ideal for hepatic/renal failure. No histamine release. Laudanosine metabolite (CNS stimulation at very high doses).'
  },
  {
    id: '23', name: 'Vecuronium', category: 'Neuromuscular Blocker',
    dose: '0.08–0.1 mg/kg IV; Maintenance: 0.01–0.015 mg/kg',
    onset: '2–3 min', duration: '25–40 min',
    mechanism: 'Non-depolarizing NMB — steroidal compound',
    contraindications: 'Known hypersensitivity',
    interactions: 'Potentiated by volatiles, aminoglycosides; reversed by neostigmine/sugammadex',
    pediatricDose: '0.1 mg/kg IV',
    notes: 'Minimal cardiovascular effects. Hepatically metabolized — prolonged in liver disease. Mainly replaced by rocuronium in modern practice.'
  },
  {
    id: '24', name: 'Pancuronium', category: 'Neuromuscular Blocker',
    dose: '0.08–0.1 mg/kg IV; Maintenance: 0.01–0.02 mg/kg',
    onset: '2–3 min', duration: '60–100 min',
    mechanism: 'Non-depolarizing NMB — vagolytic properties',
    contraindications: 'Renal failure (relative — renally cleared), bradycardia',
    interactions: 'Potentiated by volatile agents; reversed by neostigmine',
    pediatricDose: '0.1 mg/kg IV',
    notes: 'Vagolytic → tachycardia/hypertension. Long duration. Renal excretion — avoid or dose-reduce in renal failure. Historical use in cardiac anesthesia.'
  },
];

export const vasopressors: Drug[] = [
  {
    id: '30', name: 'Epinephrine', category: 'Vasopressor',
    dose: 'Bolus: 10–20 mcg IV; Anaphylaxis: 0.3–0.5 mg IM; ACLS: 1 mg IV q3–5min; Infusion: 0.01–0.3 mcg/kg/min',
    onset: 'Immediate', duration: '1–2 min',
    mechanism: 'Alpha-1 + Beta-1 + Beta-2 adrenergic agonist',
    contraindications: 'No absolute contraindication in emergency; relative: hypertrophic cardiomyopathy, pheochromocytoma',
    interactions: 'MAOIs potentiate effects; beta-blockers antagonize beta effects; cocaine sensitizes myocardium',
    pediatricDose: 'ACLS: 0.01 mg/kg IV; Anaphylaxis: 0.01 mg/kg IM (max 0.5 mg)',
    notes: 'First-line for anaphylaxis and cardiac arrest. Raises HR, BP, and inotropy. Arrhythmogenic at high doses.'
  },
  {
    id: '31', name: 'Phenylephrine', category: 'Vasopressor',
    dose: 'Bolus: 50–200 mcg IV; Infusion: 0.1–0.5 mcg/kg/min',
    onset: 'Immediate', duration: '5–20 min',
    mechanism: 'Pure alpha-1 adrenergic agonist → vasoconstriction',
    contraindications: 'Severe hypertension, ventricular tachycardia (relative)',
    interactions: 'MAOIs potentiate; beta-blockers do not oppose',
    pediatricDose: '1–5 mcg/kg IV bolus',
    notes: 'Pure vasoconstrictor. Reflex bradycardia (treat with atropine/ephedrine). Preferred for spinal hypotension when HR normal/elevated. No cardiac stimulation.'
  },
  {
    id: '32', name: 'Ephedrine', category: 'Vasopressor',
    dose: '5–10 mg IV bolus; repeat q3–5min',
    onset: '1–2 min', duration: '10–15 min',
    mechanism: 'Indirect-acting alpha + beta agonist (releases norepinephrine)',
    contraindications: 'Hyperthyroidism, severe hypertension',
    interactions: 'MAOIs — severe hypertension; tachyphylaxis with repeated doses',
    pediatricDose: '0.1–0.3 mg/kg IV',
    notes: 'Mixed alpha/beta. Increases HR and BP. Tachyphylaxis occurs. Good for spinal hypotension (increases CO + SVR). Crosses placenta (preferred in OB).'
  },
  {
    id: '33', name: 'Vasopressin', category: 'Vasopressor',
    dose: 'Bolus: 1–4 units IV; Infusion: 0.01–0.04 units/min',
    onset: '1–2 min', duration: '10–20 min',
    mechanism: 'V1 receptor agonist → direct vasoconstriction (catecholamine-independent)',
    contraindications: 'Coronary artery disease (relative — can cause myocardial ischemia)',
    interactions: 'Additive with other vasopressors; may cause hyponatremia with high doses',
    pediatricDose: '0.0003–0.002 units/kg/min infusion',
    notes: 'No tachycardia. Effective in catecholamine-resistant shock. ACLS: 40 units IV (replaces first/second dose epi, no longer in 2015 guidelines). Adjunct in septic shock.'
  },
  {
    id: '34', name: 'Norepinephrine', category: 'Vasopressor',
    dose: 'Bolus: 4–12 mcg IV; Infusion: 0.02–0.3 mcg/kg/min',
    onset: 'Immediate', duration: '1–2 min',
    mechanism: 'Potent alpha-1 + moderate beta-1 agonist',
    contraindications: 'Mesenteric/peripheral vascular thrombosis (relative), hypovolemia',
    interactions: 'MAOIs potentiate; tricyclics potentiate',
    pediatricDose: '0.05–0.3 mcg/kg/min infusion',
    notes: 'First-line vasopressor for septic shock (Surviving Sepsis). Marked vasoconstriction + moderate inotropy. Extravasation causes tissue necrosis (central line preferred).'
  },
  {
    id: '35', name: 'Dobutamine', category: 'Inotrope',
    dose: 'Infusion: 2–20 mcg/kg/min',
    onset: '1–2 min', duration: 'Infusion-dependent',
    mechanism: 'Beta-1 > Beta-2 adrenergic agonist → positive inotropy/chronotropy',
    contraindications: 'HOCM, atrial fibrillation with rapid ventricular response, uncorrected hypovolemia',
    interactions: 'Beta-blockers antagonize; MAOIs potentiate',
    pediatricDose: '2–20 mcg/kg/min infusion',
    notes: 'Increases cardiac output with less vasoconstriction than epinephrine. May cause tachycardia and hypotension (beta-2 vasodilation). Useful in cardiogenic shock.'
  },
  {
    id: '36', name: 'Milrinone', category: 'Inotrope',
    dose: 'Loading: 50 mcg/kg IV over 10 min; Infusion: 0.375–0.75 mcg/kg/min',
    onset: '5–15 min', duration: 'Infusion-dependent',
    mechanism: 'PDE-3 inhibitor → increased cAMP → inotropy + vasodilation (inodilator)',
    contraindications: 'Severe aortic/pulmonary stenosis, hypotension',
    interactions: 'Additive hypotension with other vasodilators; arrhythmia risk',
    pediatricDose: '0.25–0.75 mcg/kg/min; loading dose optional',
    notes: 'Inodilator — increases CO and reduces SVR/PVR. Useful post-cardiac surgery. Arrhythmogenic. Long half-life (2–3h) — hypotension may persist. Renally cleared.'
  },
];

export const antihypertensives: Drug[] = [
  {
    id: '40', name: 'Labetalol', category: 'Antihypertensive',
    dose: 'Bolus: 5–20 mg IV q10min (max 300 mg); Infusion: 1–2 mg/min',
    onset: '5 min IV', duration: '3–6 hr',
    mechanism: 'Non-selective beta-blocker + selective alpha-1 blocker (ratio 7:1 IV)',
    contraindications: 'Asthma, COPD, severe bradycardia, 2°/3° heart block, acute decompensated HF',
    interactions: 'Additive with antihypertensives; masks hypoglycemia signs',
    pediatricDose: '0.2–1 mg/kg IV (max 40 mg)',
    notes: 'Reduces BP without reflex tachycardia. Good for hypertensive urgency in OR. Caution in reactive airways disease. Reduces HR and BP predictably.'
  },
  {
    id: '41', name: 'Esmolol', category: 'Antihypertensive',
    dose: 'Loading: 500 mcg/kg IV over 1 min; Infusion: 50–300 mcg/kg/min',
    onset: '1–2 min', duration: '10–30 min (offset rapid after stopping)',
    mechanism: 'Ultra-short-acting cardioselective beta-1 blocker',
    contraindications: 'Severe bradycardia, 2°/3° AV block, decompensated HF, cardiogenic shock',
    interactions: 'Verapamil/diltiazem additive bradycardia; digoxin additive',
    pediatricDose: 'Loading: 100–500 mcg/kg IV; Infusion: 25–200 mcg/kg/min',
    notes: 'Ideal for acute, controlled HR/BP reduction. Esterase-hydrolyzed — very short action. Use for intubation response, emergence hypertension. Bronchospasm risk.'
  },
  {
    id: '42', name: 'Hydralazine', category: 'Antihypertensive',
    dose: '5–20 mg IV q20min; max 40 mg acute',
    onset: '5–20 min IV', duration: '2–4 hr',
    mechanism: 'Direct arteriolar vasodilator (mechanism not fully elucidated)',
    contraindications: 'Coronary artery disease, mitral valvular rheumatic disease, dissecting aortic aneurysm',
    interactions: 'Additive hypotension with other antihypertensives; increases digoxin levels',
    pediatricDose: '0.1–0.5 mg/kg IV q6h',
    notes: 'Reflex tachycardia limits use in CAD. Onset unpredictable. Preferred for hypertension in pregnancy (with methyldopa). Lupus-like syndrome with chronic use.'
  },
  {
    id: '43', name: 'Nicardipine', category: 'Antihypertensive',
    dose: 'Infusion: 5–15 mg/hr IV; titrate to response',
    onset: '5–10 min', duration: 'Infusion-dependent; 30–60 min after stopping',
    mechanism: 'Dihydropyridine calcium channel blocker → arterial vasodilation',
    contraindications: 'Advanced aortic stenosis',
    interactions: 'CYP3A4 substrate; additive with other antihypertensives',
    pediatricDose: '0.5–4 mcg/kg/min infusion',
    notes: 'Predictable, titratable BP control. No reflex tachycardia (vs. hydralazine). Preferred for perioperative hypertension. Minimal negative inotropy.'
  },
  {
    id: '44', name: 'Clevidipine', category: 'Antihypertensive',
    dose: 'Start 1–2 mg/hr; double q90sec; usual 4–6 mg/hr; max 32 mg/hr',
    onset: '2–4 min', duration: '5–15 min',
    mechanism: 'Ultra-short-acting dihydropyridine CCB → arterial vasodilation',
    contraindications: 'Egg/soy allergy, severe aortic stenosis, defective lipid metabolism',
    interactions: 'Additive with other antihypertensives',
    pediatricDose: 'Limited data',
    notes: 'Lipid emulsion formulation. Hydrolyzed by plasma esterases (ultra-short action). Ideal for precise, rapid BP titration. Triglyceride monitoring if >3 days.'
  },
  {
    id: '45', name: 'Nitroglycerin', category: 'Cardiovascular',
    dose: 'Infusion: 5–400 mcg/min IV; Sublingual: 0.3–0.4 mg',
    onset: '1–2 min IV', duration: 'Infusion-dependent',
    mechanism: 'Nitric oxide donor → venodilation > arterial dilation',
    contraindications: 'Concurrent phosphodiesterase-5 inhibitors (sildenafil etc.), hypovolemia, severe AS',
    interactions: 'PDE-5 inhibitors → severe hypotension',
    pediatricDose: '0.5–3 mcg/kg/min infusion',
    notes: 'Primarily venodilator at low doses → reduces preload. Coronary vasodilator. Methemoglobinemia with high doses. Tachyphylaxis. Headache common.'
  },
  {
    id: '46', name: 'Sodium Nitroprusside', category: 'Cardiovascular',
    dose: 'Infusion: 0.3–10 mcg/kg/min IV (titrate; minimize duration)',
    onset: '30–60 sec', duration: '3–5 min',
    mechanism: 'Nitric oxide donor → balanced arterio- and venodilation',
    contraindications: 'Severe hepatic/renal failure, Leber optic atrophy, compensatory hypertension',
    interactions: 'Cimetidine increases cyanide toxicity; yohimbine antagonizes',
    pediatricDose: '0.3–3 mcg/kg/min; limit duration',
    notes: 'Cyanide toxicity with prolonged use (>2 mcg/kg/min) or hepatic failure — treat with sodium thiosulfate. Thiocyanate accumulates in renal failure. Protect from light.'
  },
];

export const antiarrhythmics: Drug[] = [
  {
    id: '50', name: 'Amiodarone', category: 'Antiarrhythmic',
    dose: 'VF/pVT: 300 mg IV bolus; Stable VT: 150 mg IV over 10 min; Infusion: 1 mg/min x6h then 0.5 mg/min',
    onset: 'IV: minutes', duration: 'Days–weeks (t½ 40–55 days)',
    mechanism: 'Class III — blocks K+ channels; also Na+, Ca2+, beta-blocker properties',
    contraindications: 'Sinus node dysfunction, 2°/3° AV block (without pacemaker), thyroid disease',
    interactions: 'Increases digoxin/warfarin levels; many drug interactions (CYP inhibitor)',
    pediatricDose: 'VF: 5 mg/kg IV; Infusion: 5 mcg/kg/min',
    notes: 'Drug of choice for VF/pVT (ACLS). Highly lipophilic — pulmonary/thyroid/hepatic toxicity with chronic use. Hypotension and bradycardia common IV.'
  },
  {
    id: '51', name: 'Lidocaine (IV)', category: 'Antiarrhythmic',
    dose: 'VF/pVT: 1–1.5 mg/kg IV; Repeat: 0.5–0.75 mg/kg q5–10min; Infusion: 1–4 mg/min',
    onset: '45–90 sec IV', duration: '10–20 min',
    mechanism: 'Class IB — sodium channel blocker (rapid association/dissociation)',
    contraindications: 'Wolff-Parkinson-White with AF, high-degree AV block, Stokes-Adams syndrome',
    interactions: 'Beta-blockers increase toxicity; cimetidine increases levels',
    pediatricDose: '1 mg/kg IV; Infusion: 20–50 mcg/kg/min',
    notes: 'Alternative to amiodarone for VF/VT. Adjunct analgesic IV (1–1.5 mg/kg pre-incision reduces opioid requirements). Toxicity: CNS symptoms, then seizures, cardiac arrest.'
  },
  {
    id: '52', name: 'Adenosine', category: 'Antiarrhythmic',
    dose: '6 mg IV rapid bolus (large antecubital vein); may repeat 12 mg x2',
    onset: '20–30 sec', duration: '10–30 sec',
    mechanism: 'Activates A1 receptors → transient AV nodal blockade',
    contraindications: '2°/3° AV block, sick sinus syndrome, severe asthma/COPD (bronchospasm)',
    interactions: 'Caffeine/theophylline antagonize (need higher dose); dipyridamole potentiates (reduce dose)',
    pediatricDose: '0.1 mg/kg IV rapid bolus (max 6 mg); repeat 0.2 mg/kg',
    notes: 'First-line for SVT (PSVT). Very short duration — given as fast bolus followed by saline flush. Transient asystole. Chest pain and flushing normal (brief).'
  },
  {
    id: '53', name: 'Atropine', category: 'Anticholinergic',
    dose: 'Bradycardia: 0.5–1 mg IV; repeat q3–5min; max 3 mg; Reversal: 0.2 mg per 1 mg neostigmine',
    onset: '1–2 min IV', duration: '30–60 min',
    mechanism: 'Muscarinic acetylcholine receptor antagonist → ↑HR, ↓secretions',
    contraindications: 'Acute angle-closure glaucoma, myasthenia gravis, obstructive GI/urinary',
    interactions: 'Additive anticholinergic effects with other agents; avoid with digoxin toxicity bradycardia',
    pediatricDose: '0.02 mg/kg IV (minimum 0.1 mg to avoid paradoxical bradycardia); max 0.5 mg',
    notes: 'ACLS: symptomatic bradycardia. Minimum dose 0.1 mg in pediatrics (avoid paradoxical bradycardia). Use with neostigmine for NMB reversal. Dries secretions.'
  },
  {
    id: '54', name: 'Metoprolol (IV)', category: 'Antihypertensive',
    dose: '2.5–5 mg IV q5min (max 15 mg); then PO equivalent',
    onset: '5–10 min IV', duration: '3–6 hr',
    mechanism: 'Cardioselective beta-1 blocker',
    contraindications: 'Cardiogenic shock, decompensated HF, severe bradycardia, 2°/3° AV block',
    interactions: 'Calcium channel blockers additive; alpha-blockers additive hypotension',
    pediatricDose: '0.1 mg/kg IV (max 5 mg)',
    notes: 'Cardioselective at usual doses. Intraop rate control for AF/flutter. Less bronchospasm than non-selective beta-blockers. Avoid abrupt discontinuation.'
  },
];

export const reversalAgents: Drug[] = [
  {
    id: '60', name: 'Neostigmine', category: 'Reversal',
    dose: '0.03–0.07 mg/kg IV (always with anticholinergic)',
    onset: '5–15 min', duration: '40–60 min',
    mechanism: 'Acetylcholinesterase inhibitor → increases ACh at NMJ',
    contraindications: 'TOF count <2 twitches (prefer sugammadex), asthma (relative)',
    interactions: 'Requires anticholinergic (glycopyrrolate preferred); potentiates succinylcholine',
    pediatricDose: '0.04–0.08 mg/kg IV with atropine 0.02 mg/kg',
    notes: 'Give with glycopyrrolate (0.2 mg per 1 mg neostigmine) to block muscarinic side effects. Max 5 mg. Requires TOF ≥2 twitches (T2) for adequate reversal. PONV risk.'
  },
  {
    id: '61', name: 'Sugammadex', category: 'Reversal',
    dose: 'Routine reversal (TOF ≥2): 2–4 mg/kg IV; Immediate reversal: 16 mg/kg IV',
    onset: '1–3 min', duration: 'Complete reversal',
    mechanism: 'Modified gamma-cyclodextrin encapsulates rocuronium/vecuronium',
    contraindications: 'Known hypersensitivity; renal failure (complex excreted renally — accumulation)',
    interactions: 'Oral contraceptives — reduced efficacy for 7 days post-dose',
    pediatricDose: '2–4 mg/kg IV (same as adult)',
    notes: 'Works at any block depth. Reverses profound/deep block (no neostigmine equivalent). Advise patients using hormonal contraceptives. Not effective against cisatracurium.'
  },
  {
    id: '62', name: 'Flumazenil', category: 'Reversal',
    dose: '0.2 mg IV q1min until effect; max 3–5 mg total',
    onset: '1–2 min', duration: '45–90 min (shorter than most benzos)',
    mechanism: 'Competitive benzodiazepine receptor antagonist',
    contraindications: 'Chronic benzodiazepine dependence (precipitates seizures), tricyclic OD',
    interactions: 'May unmask seizure activity in polydrug overdose; metabolic alkalosis',
    pediatricDose: '0.01 mg/kg IV (max 0.2 mg); repeat q1min',
    notes: 'Re-sedation risk — shorter half-life than most benzodiazepines. Seizure risk in chronic users/TCA OD. Does not reverse barbiturates or propofol.'
  },
  {
    id: '63', name: 'Naloxone', category: 'Reversal',
    dose: 'Partial reversal: 0.04–0.08 mg IV q2–3min; Full reversal (OD): 0.4–2 mg IV/IM',
    onset: '1–2 min', duration: '30–90 min',
    mechanism: 'Competitive opioid receptor antagonist (mu, kappa, delta)',
    contraindications: 'Opioid-dependent patients without pain (precipitates severe withdrawal)',
    interactions: 'Acute opioid reversal → catecholamine surge (pulmonary edema, arrhythmia)',
    pediatricDose: '0.01 mg/kg IV; neonates: 0.1 mg/kg',
    notes: 'Titrate slowly to avoid acute pain/withdrawal. Re-narcotization risk with long-acting opioids. Monitor >1hr after dose. Pulmonary edema reported.'
  },
  {
    id: '64', name: 'Idarucizumab (Praxbind)', category: 'Reversal',
    dose: '5 g IV (2 × 2.5 g vials given within 15 min)',
    onset: 'Minutes', duration: '24 hr',
    mechanism: 'Humanized monoclonal antibody fragment — specifically binds dabigatran',
    contraindications: 'Hereditary fructose intolerance (sorbitol vehicle)',
    interactions: 'Binds only dabigatran; no effect on other anticoagulants',
    pediatricDose: 'Not established',
    notes: 'Specific dabigatran reversal. Immediate effect. Use for life-threatening bleeding or urgent surgery. Hypercoagulable state may occur post-reversal.'
  },
];

export const volatileAgents: Drug[] = [
  {
    id: '70', name: 'Sevoflurane', category: 'Volatile',
    dose: 'MAC: 2.0% (adult); Induction: 6–8%; Maintenance: 1–3%',
    onset: 'Fast (low pungency)', duration: 'Emergence: 8–15 min',
    mechanism: 'Potentiates GABA-A, inhibits NMDA — volatile halogenated ether',
    contraindications: 'MH susceptibility, known volatile agent hypersensitivity',
    interactions: 'Potentiates NMBAs; QTc prolongation; N2O reduces MAC',
    pediatricDose: 'MAC higher in children (3.2% neonates); good for mask induction',
    notes: 'Non-pungent — ideal for inhalational induction. Compound A with soda lime at very low flows (<1 L/min). Blood:gas coefficient 0.65 (relatively fast). MAC-awake: 0.6%.'
  },
  {
    id: '71', name: 'Desflurane', category: 'Volatile',
    dose: 'MAC: 6.0% (adult); Maintenance: 4–9%',
    onset: 'Very fast', duration: 'Emergence: 5–10 min',
    mechanism: 'Volatile halogenated ether — GABA-A potentiation, NMDA inhibition',
    contraindications: 'MH susceptibility, airway irritability (laryngospasm risk in awake patients), OR greenhouse gas concern',
    interactions: 'Potentiates NMBAs; strong airway irritant at >1 MAC',
    pediatricDose: 'Not for pediatric mask induction (irritant)',
    notes: 'Fastest emergence (B:G 0.42). Cannot be used for inhalation induction. Sympathetic stimulation >1 MAC → tachycardia/hypertension. High global warming potential.'
  },
  {
    id: '72', name: 'Isoflurane', category: 'Volatile',
    dose: 'MAC: 1.15% (adult); Maintenance: 0.5–2%',
    onset: 'Moderate', duration: 'Emergence: 10–20 min',
    mechanism: 'Volatile halogenated ether — GABA-A/NMDA modulation',
    contraindications: 'MH susceptibility, suspected coronary steal',
    interactions: 'Potentiates NMBAs; pungent — avoid for inhalational induction',
    pediatricDose: 'MAC 1.6% in infants; pungent — rarely used for induction',
    notes: 'Coronary steal debate (historical). Good muscle relaxation. Pungent odor limits induction use. B:G coefficient 1.4 (slower than sevo/des). Low cost.'
  },
  {
    id: '73', name: 'Nitrous Oxide', category: 'Volatile',
    dose: 'MAC: 104% (cannot be used alone); Adjunct: 50–70% inspired',
    onset: 'Very fast', duration: 'Emergence: 3–5 min',
    mechanism: 'NMDA antagonist; analgesic; MAC-sparing (reduces volatile requirement ~30%)',
    contraindications: 'Pneumothorax, air embolism, middle ear/bowel obstruction, vitamin B12 deficiency, first-trimester pregnancy',
    interactions: 'Second gas effect increases uptake of co-administered agents; diffusion hypoxia on emergence',
    pediatricDose: '50–70% with O2',
    notes: 'Expands air-filled cavities (pneumothorax, bowel, middle ear). Diffusion hypoxia on discontinuation — give 100% O2. Vitamin B12/folate metabolism impairment. Inexpensive adjunct.'
  },
];

export const antiemetics: Drug[] = [
  {
    id: '80', name: 'Ondansetron', category: 'Antiemetic',
    dose: '4–8 mg IV (adults); 4 mg at end of surgery',
    onset: '5–10 min', duration: '4–8 hr',
    mechanism: '5-HT3 receptor antagonist',
    contraindications: 'Congenital long QT syndrome; avoid with apomorphine',
    interactions: 'QTc-prolonging drugs additive; tramadol reduces analgesic effect',
    pediatricDose: '0.1 mg/kg IV (max 4 mg)',
    notes: 'Most commonly used PONV prophylaxis. Give at end of surgery for maximum effect. QTc prolongation (dose-dependent). Serotonin syndrome risk with serotonergic drugs.'
  },
  {
    id: '81', name: 'Dexamethasone', category: 'Antiemetic',
    dose: 'PONV prophylaxis: 4–8 mg IV at induction',
    onset: '30–60 min (anti-PONV effect)', duration: '24 hr',
    mechanism: 'Glucocorticoid — anti-emetic mechanism unclear (prostaglandin inhibition)',
    contraindications: 'Uncontrolled diabetes (relative — causes hyperglycemia), immunocompromised',
    interactions: 'Hyperglycemia with insulin/antidiabetics; adrenal suppression',
    pediatricDose: '0.15 mg/kg IV (max 8 mg)',
    notes: 'Synergistic with 5-HT3 antagonists for multimodal PONV prophylaxis. Anti-inflammatory analgesic adjunct. Causes transient blood glucose elevation. Give at induction.'
  },
  {
    id: '82', name: 'Metoclopramide', category: 'Antiemetic',
    dose: '10–20 mg IV slow push (over 2–3 min)',
    onset: '1–3 min IV', duration: '1–2 hr',
    mechanism: 'D2 antagonist + 5-HT4 agonist → prokinetic + antiemetic',
    contraindications: 'Pheochromocytoma, GI obstruction/perforation, Parkinson disease, prior EPS reactions',
    interactions: 'Additive EPS with antipsychotics; increases cyclosporine absorption',
    pediatricDose: '0.1–0.15 mg/kg IV',
    notes: 'Prokinetic — accelerates gastric emptying. Extrapyramidal symptoms (akathisia, dystonia) — treat with diphenhydramine 25–50 mg. Less effective than ondansetron for PONV.'
  },
  {
    id: '83', name: 'Droperidol', category: 'Antiemetic',
    dose: 'PONV: 0.625–1.25 mg IV; Higher doses historically used',
    onset: '3–10 min', duration: '3–6 hr',
    mechanism: 'D2 antagonist (butyrophenone) → antiemetic, sedation',
    contraindications: 'Known QTc prolongation, Parkinson disease, hypokalemia/hypomagnesemia',
    interactions: 'QTc-prolonging drugs additive; CNS depressants additive',
    pediatricDose: '0.05–0.075 mg/kg IV (max 1.25 mg)',
    notes: 'FDA black box warning (QTc prolongation/torsades) — requires baseline/post-dose ECG at higher doses. Very effective low-dose PONV agent. Sedating. Oculogyric crisis possible.'
  },
  {
    id: '84', name: 'Scopolamine (Patch)', category: 'Antiemetic',
    dose: '1.5 mg transdermal patch (apply 2–4h before surgery to post-auricular area)',
    onset: '2–4 hr', duration: '72 hr',
    mechanism: 'Muscarinic antagonist — inhibits vestibular input to vomiting center',
    contraindications: 'Angle-closure glaucoma, urinary retention, elderly (confusion risk)',
    interactions: 'Additive anticholinergic effects with other agents',
    pediatricDose: 'Not recommended < 12 years',
    notes: 'Effective for motion sickness/PONV. Anticholinergic side effects: dry mouth, blurred vision, confusion (especially elderly). Wash hands after applying. Pupil dilation if eye contact.'
  },
  {
    id: '85', name: 'Promethazine', category: 'Antiemetic',
    dose: '6.25–25 mg IV over 10–15 min (avoid rapid IV); IM preferred',
    onset: '5 min IV; 20 min IM', duration: '4–8 hr',
    mechanism: 'H1 antihistamine + D2 antagonist + muscarinic antagonist',
    contraindications: 'Age <2 years (respiratory depression), IV injection (tissue necrosis)',
    interactions: 'CNS depressants additive; MAOIs contraindicated; QTc prolongation with certain agents',
    pediatricDose: '0.25–1 mg/kg PO/IM (NOT IV in children); avoid < 2 years',
    notes: 'FDA black box: can cause fatal respiratory depression in children <2 yrs. IV administration risks chemical burns — use IM or dilute slow IV if necessary. Highly sedating.'
  },
];

export const hemostatics: Drug[] = [
  {
    id: '90', name: 'Tranexamic Acid (TXA)', category: 'Hemostatic',
    dose: 'Trauma/MTP: 1 g IV over 10 min (within 3hr); Cardiac surgery: 10–100 mg/kg; Orthopedic: 1–2 g IV',
    onset: '5–10 min', duration: '3–8 hr',
    mechanism: 'Antifibrinolytic — competitively inhibits plasminogen activation',
    contraindications: 'Active thromboembolic disease, subarachnoid hemorrhage (relative), renal failure (reduce dose)',
    interactions: 'Additive with other prothrombotic agents',
    pediatricDose: '10–15 mg/kg IV',
    notes: 'MATTERs/CRASH-2 evidence in trauma. Significant mortality benefit when given within 3hr. Reduces transfusion in cardiac/orthopedic surgery. Seizure risk with high doses.'
  },
  {
    id: '91', name: 'Protamine', category: 'Hemostatic',
    dose: '1 mg per 100 units heparin given (max 50 mg slow IV over 10 min)',
    onset: '5 min', duration: '2 hr',
    mechanism: 'Strongly basic protein — binds/neutralizes heparin (ionic interaction)',
    contraindications: 'Fish allergy (relative), prior protamine exposure (allergy risk), vasectomy (anti-protamine antibodies)',
    interactions: 'Partially reverses LMWH; does not reverse fondaparinux or DOACs',
    pediatricDose: '1 mg per 100 units heparin (same as adult)',
    notes: 'Anaphylaxis/anaphylactoid risk (vasodilatory — give slowly). Prior protamine use or fish allergy increases risk. Protamine paradox: excess causes anticoagulation. Only partially reverses LMWH.'
  },
  {
    id: '92', name: 'Desmopressin (DDAVP)', category: 'Hemostatic',
    dose: '0.3 mcg/kg IV over 30 min; max 20–24 mcg',
    onset: '30–60 min', duration: '6–12 hr',
    mechanism: 'V2 receptor agonist → releases vWF and factor VIII from endothelium',
    contraindications: 'Type 2B vWD (worsens thrombocytopenia), hyponatremia risk',
    interactions: 'Indomethacin/chlorpropamide potentiate; additive with vasopressors',
    pediatricDose: '0.3 mcg/kg IV (same)',
    notes: 'Useful in mild von Willebrand disease, hemophilia A, uremic bleeding, platelet dysfunction. Monitor sodium (water retention). Tachyphylaxis with repeat dosing (q48–72h). Intranasal available.'
  },
  {
    id: '93', name: 'Calcium Chloride', category: 'Emergency',
    dose: 'Hyperkalemia/hypocalcemia: 500–1000 mg (5–10 mL of 10%) IV over 5–10 min; Cardiac arrest: 1 g IV',
    onset: '1–3 min', duration: '30–60 min',
    mechanism: 'Replenishes ionized calcium → cardiac membrane stabilization, myocyte function',
    contraindications: 'Digoxin toxicity (increases arrhythmia risk), hypercalcemia',
    interactions: 'Digitalis toxicity; sodium bicarbonate precipitates (flush line between)',
    pediatricDose: '20 mg/kg IV (max 1 g)',
    notes: 'Preferred over calcium gluconate in emergencies (3× more elemental Ca). MH hyperkalemia treatment. Per 4 units pRBC in MTP. Central line preferred (tissue necrosis if infiltrates). Flush before/after NaHCO3.'
  },
  {
    id: '94', name: 'Sodium Bicarbonate', category: 'Emergency',
    dose: 'Metabolic acidosis/cardiac arrest: 1 mEq/kg IV; Guided by ABG thereafter',
    onset: '1–3 min', duration: '30–60 min',
    mechanism: 'Buffers hydrogen ions → raises blood/urine pH',
    contraindications: 'Metabolic alkalosis, hypocalcemia, hypokalemia (all worsened)',
    interactions: 'Precipitates with calcium chloride; inactivates catecholamines if mixed',
    pediatricDose: '1 mEq/kg IV',
    notes: 'MH acidosis treatment. Hyperkalemia (shifts K+ into cells temporarily). CO2 generation — ensure adequate ventilation. Flush line between calcium and bicarb. Use guided by ABG when possible.'
  },
  {
    id: '95', name: 'Magnesium Sulfate', category: 'Emergency',
    dose: 'Torsades/VT: 1–2 g IV over 5–20 min; Eclampsia: 4–6 g load then 2 g/hr; Pre-eclampsia: same; Bronchospasm: 2 g IV',
    onset: '1–5 min IV', duration: '30–60 min',
    mechanism: 'Calcium antagonist; stabilizes cell membranes; NMJ depression',
    contraindications: 'Myasthenia gravis, renal failure (relative — accumulates)',
    interactions: 'Potentiates NMBAs (profound potentiation); calcium gluconate reverses toxicity',
    pediatricDose: '25–50 mg/kg IV over 20 min (max 2 g)',
    notes: 'Torsades de pointes first-line treatment. Eclampsia prevention/treatment (seizure prophylaxis). Potentiates NMBAs — reduce dosing. Toxicity: loss of DTRs (first sign) → respiratory arrest. Reversal: calcium gluconate 1 g IV.'
  },
  {
    id: '96', name: 'Dantrolene', category: 'Emergency',
    dose: 'MH treatment: 2.5 mg/kg IV bolus; repeat q5–10min; max 10 mg/kg; Maintenance: 1 mg/kg q4–6h x24–48h',
    onset: 'Minutes', duration: '4–8 hr',
    mechanism: 'Blocks RyR1 receptor → inhibits sarcoplasmic reticulum Ca2+ release',
    contraindications: 'None in MH emergency. Active hepatic disease (relative for chronic use)',
    interactions: 'CCBs + dantrolene → hyperkalemia and cardiovascular collapse (AVOID in MH)',
    pediatricDose: 'Same mg/kg dosing as adults',
    notes: 'MH-specific treatment — ONLY agent proven to treat MH. Mix 20 mg vial with 60 mL sterile water. Keep >36 vials stocked. Hepatotoxicity with chronic use. MHAUS hotline: 1-800-644-9737.'
  },
  {
    id: '97', name: 'Intralipid 20%', category: 'Emergency',
    dose: 'LAST: 1.5 mL/kg IV bolus over 1 min; then 0.25 mL/kg/min; repeat bolus x2 if unstable; max 12 mL/kg',
    onset: '1–2 min', duration: 'Infusion-dependent',
    mechanism: 'Lipid sink — sequesters lipophilic local anesthetics; direct cardiac effects',
    contraindications: 'Egg/soy allergy (relative); severe hyperlipidemia',
    interactions: 'May interfere with lipid-soluble drug levels post-administration',
    pediatricDose: '1.5 mL/kg bolus; 0.25 mL/kg/min infusion',
    notes: 'Lipid Rescue for LAST. American Society of Regional Anesthesia (ASRA) protocol. Stock in every regional anesthesia location. May interfere with ECMO. Continue CPR during administration.'
  },
];

export const analgesics: Drug[] = [
  {
    id: '100', name: 'Ketorolac', category: 'Analgesic',
    dose: '15–30 mg IV/IM (single dose limit: 30 mg IV, 60 mg IM); max 5 days',
    onset: '5–10 min IV', duration: '4–6 hr',
    mechanism: 'Non-selective COX-1/COX-2 inhibitor → prostaglandin synthesis inhibition',
    contraindications: 'Renal impairment, peptic ulcer disease, coagulopathy, neuraxial (epidural hematoma risk), age >65 (caution)',
    interactions: 'Additive bleeding risk with anticoagulants; reduces diuretic efficacy',
    pediatricDose: '0.5 mg/kg IV (max 30 mg)',
    notes: 'Potent NSAID analgesic (equivalent to ~10 mg morphine). Significant renal and GI side effects — short course only (max 5 days). Opioid-sparing. Avoid in renal failure and coagulopathy.'
  },
  {
    id: '101', name: 'Acetaminophen IV (Ofirmev)', category: 'Analgesic',
    dose: '>50 kg: 1000 mg IV q6h; <50 kg: 15 mg/kg q6h; max 4 g/day',
    onset: '5–10 min IV', duration: '4–6 hr',
    mechanism: 'COX inhibition in CNS; exact mechanism unclear (possible cannabinoid pathway)',
    contraindications: 'Severe hepatic impairment, acetaminophen allergy',
    interactions: 'Warfarin: INR increases with regular use; alcohol increases hepatotoxicity risk',
    pediatricDose: '10–15 mg/kg IV q6h (max 75 mg/kg/day)',
    notes: 'Opioid-sparing analgesic and antipyretic. Safe, well tolerated. Preferred over ketorolac in renal failure/coagulopathy. Hepatotoxicity with overdose or chronic alcohol use. Weight-based dosing critical.'
  },
  {
    id: '102', name: 'Gabapentin', category: 'Analgesic',
    dose: 'Periop premedication: 600–1200 mg PO 1–2h before surgery',
    onset: '1–2 hr PO', duration: '6–8 hr',
    mechanism: 'Voltage-gated calcium channel alpha-2-delta subunit inhibitor',
    contraindications: 'Renal failure (dose-reduce per CrCl), respiratory depression risk',
    interactions: 'CNS depressants additive; opioid synergy (respiratory depression risk)',
    pediatricDose: 'Not well established for periop use',
    notes: 'Multimodal analgesia (opioid-sparing). Reduces opioid consumption ~30–40%. Dizziness and sedation common. Reduces chronic postsurgical pain when used preop. Reduces anxiety.'
  },
  {
    id: '103', name: 'Ketamine (analgesic)', category: 'Analgesic',
    dose: 'Sub-dissociative: 0.1–0.5 mg/kg IV; Infusion: 0.1–0.2 mg/kg/hr',
    onset: '30–60 sec IV', duration: '15–30 min (analgesia)',
    mechanism: 'NMDA antagonist → anti-hyperalgesia, opioid-sparing',
    contraindications: 'Raised ICP, uncontrolled hypertension, psychosis, intracranial hypertension',
    interactions: 'Reduces opioid tolerance/OIH; synergistic with opioids',
    pediatricDose: '0.1–0.3 mg/kg IV bolus',
    notes: 'Periop infusion reduces opioid requirements and chronic postsurgical pain risk. Prevents opioid-induced hyperalgesia. Dysphoric effects minimized at sub-dissociative doses. Combine with midazolam if needed.'
  },
];

export const pulmonary: Drug[] = [
  {
    id: '110', name: 'Albuterol (Salbutamol)', category: 'Bronchodilator',
    dose: 'MDI: 2–4 puffs q20min x3; Neb: 2.5 mg q20min x3; IV: 0.25–0.5 mg over 15 min (where available)',
    onset: 'MDI: 1–5 min; Neb: 5–15 min', duration: '4–6 hr',
    mechanism: 'Selective beta-2 adrenergic agonist → bronchial smooth muscle relaxation',
    contraindications: 'Tachyarrhythmias (relative), uncontrolled hyperthyroidism',
    interactions: 'Beta-blockers antagonize; MAOIs/TCAs potentiate cardiovascular effects; hypokalemia with high doses',
    pediatricDose: 'MDI: 2–4 puffs (100 mcg/puff); Neb: 0.15 mg/kg (min 2.5 mg)',
    notes: 'First-line for bronchospasm. Can be given via ETT adapter in intubated patients. Tachycardia and hypokalemia at high doses. IV formulation available outside US for severe bronchospasm.'
  },
  {
    id: '111', name: 'Ipratropium', category: 'Bronchodilator',
    dose: 'MDI: 2–4 puffs q20min x3; Neb: 0.5 mg q20min x3 (combined with albuterol)',
    onset: '15–30 min', duration: '4–6 hr',
    mechanism: 'Muscarinic (M3) antagonist → bronchial smooth muscle relaxation',
    contraindications: 'Narrow-angle glaucoma (nebulized — avoid eye contact), urinary retention',
    interactions: 'Additive with other anticholinergics',
    pediatricDose: 'MDI: 1–2 puffs; Neb: 0.25 mg q20min x3',
    notes: 'Synergistic bronchodilation with albuterol (different mechanisms). Less effective than beta-2 agonists alone. Useful add-on for severe bronchospasm/asthma exacerbation.'
  },
];

export const allDrugs: Drug[] = [
  ...inductionAgents,
  ...opioids,
  ...nmbs,
  ...vasopressors,
  ...antihypertensives,
  ...antiarrhythmics,
  ...reversalAgents,
  ...volatileAgents,
  ...antiemetics,
  ...hemostatics,
  ...analgesics,
  ...pulmonary,
];

export const localAnesthetics: LocalAnesthetic[] = [
  { name: 'Lidocaine', maxDoseWithout: 4.5, maxDoseWith: 7, concentration: ['0.5%', '1%', '1.5%', '2%'] },
  { name: 'Bupivacaine', maxDoseWithout: 2.5, maxDoseWith: 3, concentration: ['0.25%', '0.5%', '0.75%'] },
  { name: 'Ropivacaine', maxDoseWithout: 3, maxDoseWith: 3.5, concentration: ['0.2%', '0.5%', '0.75%', '1%'] },
  { name: 'Mepivacaine', maxDoseWithout: 4.5, maxDoseWith: 7, concentration: ['1%', '1.5%', '2%'] },
  { name: 'Chloroprocaine', maxDoseWithout: 11, maxDoseWith: 14, concentration: ['1%', '2%', '3%'] },
  { name: 'Tetracaine', maxDoseWithout: 1.5, maxDoseWith: 2, concentration: ['0.5%', '1%'] },
  { name: 'Prilocaine', maxDoseWithout: 6, maxDoseWith: 8, concentration: ['0.5%', '1%', '2%'] },
];

export const anticoagulants = [
  { name: 'Warfarin (Coumadin)', holdTime: '5 days', restartTime: '24 hours post-op', notes: 'Check INR < 1.5 before neuraxial. Bridging with LMWH if high VTE/stroke risk.', labCheck: 'INR' },
  { name: 'Clopidogrel (Plavix)', holdTime: '5–7 days', restartTime: '24 hours post-op', notes: 'Irreversible P2Y12 inhibitor. No platelet transfusion benefit until drug cleared.', labCheck: 'Platelet function' },
  { name: 'Prasugrel (Effient)', holdTime: '7–10 days', restartTime: '24 hours post-op', notes: 'More potent and longer-acting than clopidogrel. High bleeding risk.', labCheck: 'Platelet function' },
  { name: 'Ticagrelor (Brilinta)', holdTime: '5–7 days', restartTime: '24 hours post-op', notes: 'Reversible P2Y12 inhibitor. Faster offset than clopidogrel but still requires 5–7 day hold.', labCheck: 'Platelet function' },
  { name: 'Apixaban (Eliquis)', holdTime: '3–5 days (>48h per ASRA)', restartTime: '24 hours post-op', notes: 'Factor Xa inhibitor. No antidote in most settings (andexanet alfa available). Anti-Xa levels can be measured if needed.', labCheck: 'Anti-Xa (if needed)' },
  { name: 'Rivaroxaban (Xarelto)', holdTime: '3 days (>24h per ASRA)', restartTime: '24 hours post-op', notes: 'Factor Xa inhibitor. OD dosing — predictable pharmacokinetics. Anti-Xa level for reversal guidance.', labCheck: 'Anti-Xa (if needed)' },
  { name: 'Edoxaban (Savaysa)', holdTime: '3 days', restartTime: '24 hours post-op', notes: 'Factor Xa inhibitor. Less published neuraxial data than other DOACs.', labCheck: 'Anti-Xa (if needed)' },
  { name: 'Dabigatran (Pradaxa)', holdTime: '5 days (CrCl >50 mL/min); 6 days (CrCl <50)', restartTime: '24 hours post-op', notes: 'Direct thrombin inhibitor. Renally cleared — hold longer in renal failure. Reversal: Idarucizumab (Praxbind).', labCheck: 'dTT, ECT (aPTT crude estimate)' },
  { name: 'Enoxaparin — Prophylactic (40 mg daily)', holdTime: '12 hours', restartTime: '4 hours post-op (single-shot); 24h (catheter removal)', notes: 'Low-dose — bridging standard. ASRA: neuraxial safe if 12h hold observed. No routine lab monitoring needed.', labCheck: 'Anti-Xa (if renal failure/obesity)' },
  { name: 'Enoxaparin — Therapeutic (1 mg/kg BID)', holdTime: '24 hours', restartTime: '24 hours post-op', notes: 'Therapeutic dosing carries higher bleeding risk. Anti-Xa monitoring recommended. Neuraxial contraindicated if <24h hold.', labCheck: 'Anti-Xa' },
  { name: 'Fondaparinux (Arixtra)', holdTime: '5 days', restartTime: '6–12 hours post-op', notes: 'Factor Xa inhibitor. No reversal agent (protamine ineffective). Long half-life. ASRA: single-injection neuraxial generally safe; avoid epidural catheter.', labCheck: 'Anti-Xa' },
  { name: 'Heparin IV (unfractionated)', holdTime: '4–6 hours (check aPTT normalized)', restartTime: '1 hour post-op (neuraxial removal)', notes: 'Check aPTT before neuraxial. Reversal: protamine 1 mg per 100 units. Permit procedure when aPTT normal.', labCheck: 'aPTT' },
  { name: 'Heparin SQ (5000 units BID/TID)', holdTime: '4–6 hours', restartTime: '1 hour post-op', notes: 'ASRA 2018: not a contraindication for neuraxial if ≤10,000 units/day. Document timing carefully. No routine monitoring.', labCheck: 'None required' },
  { name: 'Aspirin', holdTime: 'No hold required for neuraxial', restartTime: 'N/A', notes: 'ASRA: aspirin alone is NOT a contraindication for neuraxial anesthesia. Used with P2Y12 inhibitors — assess dual antiplatelet risk.', labCheck: 'None' },
  { name: 'NSAIDs', holdTime: 'No hold required for neuraxial', restartTime: 'N/A', notes: 'NSAIDs alone are NOT a contraindication per ASRA 2018. Individual assessment for surgical bleeding risk warranted.', labCheck: 'None' },
];
