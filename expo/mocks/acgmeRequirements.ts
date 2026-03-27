import { ACGMERequirement } from '@/types/anesthesia';
import Colors from '@/constants/colors';

export const acgmeRequirements: ACGMERequirement[] = [
  { id: '1', category: 'General', subcategory: 'Total Cases', minimum: 600, completed: 0, color: Colors.accent },
  { id: '2', category: 'Cardiac', subcategory: 'Cardiac/Thoracic', minimum: 30, completed: 0, color: Colors.emergency },
  { id: '3', category: 'Pediatric', subcategory: 'Pediatric (< 3 years)', minimum: 30, completed: 0, color: Colors.blue },
  { id: '4', category: 'Pediatric', subcategory: 'Pediatric (3-12 years)', minimum: 40, completed: 0, color: Colors.blue },
  { id: '5', category: 'OB', subcategory: 'OB - Cesarean Delivery', minimum: 30, completed: 0, color: Colors.purple },
  { id: '6', category: 'OB', subcategory: 'OB - Vaginal Delivery Analgesia', minimum: 40, completed: 0, color: Colors.purple },
  { id: '7', category: 'Neuro', subcategory: 'Neuroanesthesia', minimum: 20, completed: 0, color: Colors.orange },
  { id: '8', category: 'Regional', subcategory: 'Epidurals (Placement)', minimum: 40, completed: 0, color: Colors.accent },
  { id: '9', category: 'Regional', subcategory: 'Spinals', minimum: 40, completed: 0, color: Colors.accent },
  { id: '10', category: 'Regional', subcategory: 'Peripheral Nerve Blocks', minimum: 40, completed: 0, color: Colors.accent },
  { id: '11', category: 'Procedures', subcategory: 'Arterial Lines', minimum: 40, completed: 0, color: Colors.warning },
  { id: '12', category: 'Procedures', subcategory: 'Central Lines', minimum: 20, completed: 0, color: Colors.warning },
  { id: '13', category: 'Airway', subcategory: 'Difficult Intubations', minimum: 20, completed: 0, color: Colors.emergency },
  { id: '14', category: 'Pain', subcategory: 'Chronic Pain', minimum: 20, completed: 0, color: Colors.orange },
  { id: '15', category: 'Critical Care', subcategory: 'ICU Months', minimum: 4, completed: 0, color: Colors.blue },
];

export const acgmeCategories = [
  'General',
  'Cardiac/Thoracic',
  'Pediatric',
  'OB/GYN',
  'Neuroanesthesia',
  'Regional/Blocks',
  'Vascular',
  'Orthopedic',
  'ENT',
  'Ophthalmology',
  'Trauma/Emergency',
  'Ambulatory',
  'Pain Management',
  'Critical Care',
];

export const anesthesiaTypes = [
  'General',
  'MAC/Sedation',
  'Spinal',
  'Epidural',
  'CSE',
  'Regional Block',
  'Local',
];

export const proceduresList = [
  'Intubation (DL)',
  'Intubation (VL)',
  'Intubation (Fiberoptic)',
  'LMA Placement',
  'Arterial Line',
  'Central Line (IJ)',
  'Central Line (Subclavian)',
  'Central Line (Femoral)',
  'Epidural Placement',
  'Spinal Placement',
  'Interscalene Block',
  'Supraclavicular Block',
  'Axillary Block',
  'Femoral Block',
  'Adductor Canal Block',
  'Popliteal Block',
  'TAP Block',
  'Erector Spinae Block',
];
