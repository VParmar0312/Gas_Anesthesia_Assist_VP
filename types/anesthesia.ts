export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
}

export interface ChecklistGroup {
  id: string;
  title: string;
  icon: string;
  items: ChecklistItem[];
}

export interface PediatricSetup {
  age: number;
  weight: number;
  ettUncuffed: number;
  ettCuffed: number;
  ettDepth: number;
  bladeSize: string;
  bladeType: string;
  circuitType: string;
}

export interface AirwayAssessment {
  mallampati: number;
  thyromental: 'normal' | 'short';
  mouthOpening: 'adequate' | 'limited';
  neckMobility: 'full' | 'limited';
  stopBangScore: number;
  stopBangAnswers: boolean[];
}

export type ASAClass = 1 | 2 | 3 | 4 | 5 | 6;

export interface CaseLog {
  id: string;
  date: string;
  patientAge: number;
  asaClass: ASAClass;
  procedureType: string;
  acgmeCategory: string;
  anesthesiaType: string;
  procedures: string[];
  notes: string;
  isEmergency: boolean;
}

export interface ACGMERequirement {
  id: string;
  category: string;
  subcategory: string;
  minimum: number;
  completed: number;
  color: string;
}

export interface Drug {
  id: string;
  name: string;
  category: string;
  dose: string;
  onset: string;
  duration: string;
  notes: string;
  maxDose?: string;
  mechanism?: string;
  contraindications?: string;
  interactions?: string;
  pediatricDose?: string;
}

export interface CrisisProtocol {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  steps: CrisisStep[];
}

export interface CrisisStep {
  id: string;
  order: number;
  action: string;
  detail?: string;
  isCritical: boolean;
}

export interface LocalAnesthetic {
  name: string;
  maxDoseWithout: number;
  maxDoseWith: number;
  concentration: string[];
}

export interface BodyWeightMetrics {
  ibw: number;
  lbm: number;
  abw: number;
}

export interface FluidCalculation {
  hourlyRate: number;
  npoDeficit: number;
  firstHour: number;
  secondHour: number;
}

export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'in';
export type Gender = 'male' | 'female';
