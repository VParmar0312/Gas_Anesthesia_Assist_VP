import { Drug, LocalAnesthetic } from '@/types/anesthesia';

export const inductionAgents: Drug[] = [
  { id: '1', name: 'Propofol', category: 'Induction', dose: '1.5-2.5 mg/kg IV', onset: '15-30 sec', duration: '5-10 min', notes: 'Reduces BP, apnea common. Avoid in egg/soy allergy (controversial).' },
  { id: '2', name: 'Etomidate', category: 'Induction', dose: '0.2-0.3 mg/kg IV', onset: '15-45 sec', duration: '3-12 min', notes: 'Hemodynamically stable. Adrenal suppression with prolonged use. Myoclonus.' },
  { id: '3', name: 'Ketamine', category: 'Induction', dose: '1-2 mg/kg IV, 4-6 mg/kg IM', onset: '30-60 sec IV', duration: '10-20 min', notes: 'Dissociative. Bronchodilator. Increases HR/BP. Emergence delirium.' },
  { id: '4', name: 'Midazolam', category: 'Sedation', dose: '0.01-0.05 mg/kg IV', onset: '1-3 min', duration: '15-80 min', notes: 'Anxiolysis, amnesia. Respiratory depression. Reversal: Flumazenil.' },
  { id: '5', name: 'Fentanyl', category: 'Opioid', dose: '1-3 mcg/kg IV', onset: '1-2 min', duration: '30-60 min', notes: 'Chest wall rigidity at high doses. Reversal: Naloxone.' },
  { id: '6', name: 'Sufentanil', category: 'Opioid', dose: '0.1-0.5 mcg/kg IV', onset: '1-3 min', duration: '20-45 min', notes: '5-10x potency of fentanyl. Cardiac stable.' },
  { id: '7', name: 'Remifentanil', category: 'Opioid', dose: '0.5-1 mcg/kg bolus', onset: '1-1.5 min', duration: '3-10 min', notes: 'Ultra-short acting, esterase metabolism. Infusion: 0.05-0.2 mcg/kg/min.' },
  { id: '8', name: 'Succinylcholine', category: 'Neuromuscular Blocker', dose: '1-1.5 mg/kg IV', onset: '30-60 sec', duration: '5-10 min', notes: 'Depolarizing. Hyperkalemia risk. Contraindicated: burns, crush, denervation.' },
  { id: '9', name: 'Rocuronium', category: 'Neuromuscular Blocker', dose: '0.6-1.2 mg/kg IV', onset: '60-90 sec', duration: '30-60 min', notes: 'Non-depolarizing. RSI dose: 1.2 mg/kg. Reversal: Sugammadex.' },
  { id: '10', name: 'Cisatracurium', category: 'Neuromuscular Blocker', dose: '0.15-0.2 mg/kg IV', onset: '2-3 min', duration: '40-60 min', notes: 'Hofmann elimination. Organ-independent. No histamine release.' },
];

export const vasopressors: Drug[] = [
  { id: '11', name: 'Epinephrine', category: 'Vasopressor', dose: 'Bolus: 10-20 mcg IV', onset: 'Immediate', duration: '1-2 min', notes: 'Alpha + Beta agonist. Anaphylaxis: 0.3-0.5 mg IM. ACLS: 1 mg IV q3-5min.' },
  { id: '12', name: 'Phenylephrine', category: 'Vasopressor', dose: '50-200 mcg IV bolus', onset: 'Immediate', duration: '5-20 min', notes: 'Pure alpha-1. Reflex bradycardia. Infusion: 0.1-0.5 mcg/kg/min.' },
  { id: '13', name: 'Ephedrine', category: 'Vasopressor', dose: '5-10 mg IV bolus', onset: '1-2 min', duration: '10-15 min', notes: 'Mixed alpha/beta. Indirect acting. Tachyphylaxis. Good for spinal hypotension.' },
  { id: '14', name: 'Vasopressin', category: 'Vasopressor', dose: '1-4 units IV bolus', onset: '1-2 min', duration: '10-20 min', notes: 'V1 receptor. No tachycardia. Infusion: 0.01-0.04 units/min.' },
  { id: '15', name: 'Norepinephrine', category: 'Vasopressor', dose: '4-12 mcg IV bolus', onset: 'Immediate', duration: '1-2 min', notes: 'Potent alpha + mild beta-1. Infusion: 0.02-0.3 mcg/kg/min. Septic shock first-line.' },
];

export const reversalAgents: Drug[] = [
  { id: '16', name: 'Neostigmine', category: 'Reversal', dose: '0.03-0.07 mg/kg IV', onset: '5-15 min', duration: '40-60 min', notes: 'Give with Glycopyrrolate (0.2mg per 1mg neo). Max: 5mg. TOF >2 twitches.' },
  { id: '17', name: 'Sugammadex', category: 'Reversal', dose: '2-4 mg/kg IV (routine), 16 mg/kg (immediate)', onset: '1-3 min', duration: 'Complete', notes: 'Encapsulates rocuronium/vecuronium. Works at any depth of block.' },
  { id: '18', name: 'Flumazenil', category: 'Reversal', dose: '0.2 mg IV q1min', onset: '1-2 min', duration: '45-90 min', notes: 'Max 3-5mg. Re-sedation risk. Seizure risk in chronic benzo users.' },
  { id: '19', name: 'Naloxone', category: 'Reversal', dose: '0.04-0.4 mg IV', onset: '1-2 min', duration: '30-45 min', notes: 'Titrate to effect. Pulmonary edema risk. Re-narcotization with long-acting opioids.' },
];

export const volatileAgents: Drug[] = [
  { id: '20', name: 'Sevoflurane', category: 'Volatile', dose: 'MAC: 2.0% (adults)', onset: 'Fast', duration: 'Emergence: 8-15 min', notes: 'Smooth induction. Compound A concern (low flow). Non-pungent.' },
  { id: '21', name: 'Desflurane', category: 'Volatile', dose: 'MAC: 6.0% (adults)', onset: 'Fast', duration: 'Emergence: 5-10 min', notes: 'Fastest emergence. Airway irritant (not for mask induction). Sympathetic stimulation >1 MAC.' },
  { id: '22', name: 'Isoflurane', category: 'Volatile', dose: 'MAC: 1.15% (adults)', onset: 'Moderate', duration: 'Emergence: 10-20 min', notes: 'Coronary steal controversy. Good muscle relaxation. Pungent.' },
  { id: '23', name: 'Nitrous Oxide', category: 'Volatile', dose: 'MAC: 104%', onset: 'Fast', duration: 'Emergence: 3-5 min', notes: 'Second gas effect. Diffusion hypoxia. Expands closed spaces. Avoid in pneumothorax.' },
];

export const allDrugs: Drug[] = [
  ...inductionAgents,
  ...vasopressors,
  ...reversalAgents,
  ...volatileAgents,
];

export const localAnesthetics: LocalAnesthetic[] = [
  { name: 'Lidocaine', maxDoseWithout: 4.5, maxDoseWith: 7, concentration: ['0.5%', '1%', '1.5%', '2%'] },
  { name: 'Bupivacaine', maxDoseWithout: 2.5, maxDoseWith: 3, concentration: ['0.25%', '0.5%', '0.75%'] },
  { name: 'Ropivacaine', maxDoseWithout: 3, maxDoseWith: 3.5, concentration: ['0.2%', '0.5%', '0.75%', '1%'] },
  { name: 'Mepivacaine', maxDoseWithout: 4.5, maxDoseWith: 7, concentration: ['1%', '1.5%', '2%'] },
  { name: 'Chloroprocaine', maxDoseWithout: 11, maxDoseWith: 14, concentration: ['1%', '2%', '3%'] },
];

export const anticoagulants = [
  { name: 'Warfarin (Coumadin)', holdTime: '5 days', restartTime: '24 hours post', notes: 'Check INR < 1.5 before neuraxial', labCheck: 'INR' },
  { name: 'Clopidogrel (Plavix)', holdTime: '5-7 days', restartTime: '24 hours post', notes: 'Irreversible platelet inhibition', labCheck: 'Platelet function' },
  { name: 'Prasugrel (Effient)', holdTime: '7-10 days', restartTime: '24 hours post', notes: 'More potent than clopidogrel', labCheck: 'Platelet function' },
  { name: 'Ticagrelor (Brilinta)', holdTime: '5-7 days', restartTime: '24 hours post', notes: 'Reversible P2Y12 inhibitor', labCheck: 'Platelet function' },
  { name: 'Apixaban (Eliquis)', holdTime: '3-5 days', restartTime: '24 hours post', notes: 'Factor Xa inhibitor. Anti-Xa levels if needed.', labCheck: 'Anti-Xa' },
  { name: 'Rivaroxaban (Xarelto)', holdTime: '3 days', restartTime: '24 hours post', notes: 'Factor Xa inhibitor', labCheck: 'Anti-Xa' },
  { name: 'Dabigatran (Pradaxa)', holdTime: '5 days (CrCl>50), 6 days (CrCl<50)', restartTime: '24 hours post', notes: 'Direct thrombin inhibitor. Reversal: Idarucizumab.', labCheck: 'dTT, ECT' },
  { name: 'Enoxaparin (Lovenox) - Prophylactic', holdTime: '12 hours', restartTime: '4 hours post', notes: '40mg daily dosing', labCheck: 'Anti-Xa (if needed)' },
  { name: 'Enoxaparin (Lovenox) - Therapeutic', holdTime: '24 hours', restartTime: '4 hours post', notes: '1mg/kg BID or 1.5mg/kg daily', labCheck: 'Anti-Xa' },
  { name: 'Heparin IV', holdTime: '4-6 hours', restartTime: '1 hour post', notes: 'Check aPTT normalized', labCheck: 'aPTT' },
  { name: 'Heparin SQ (5000 units BID/TID)', holdTime: '4-6 hours', restartTime: '1 hour post', notes: 'No contraindication per ASRA 2018 if <10,000 units/day', labCheck: 'None required' },
  { name: 'Aspirin', holdTime: 'No hold required', restartTime: 'N/A', notes: 'ASRA: not a contraindication alone for neuraxial', labCheck: 'None' },
  { name: 'NSAIDs', holdTime: 'No hold required', restartTime: 'N/A', notes: 'No contraindication for neuraxial per ASRA', labCheck: 'None' },
];
