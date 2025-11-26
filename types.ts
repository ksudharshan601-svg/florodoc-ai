export interface TreatmentPlan {
  organic: string[];
  chemical: string[];
}

export interface DiseaseAnalysisResult {
  isPlant: boolean;
  plantName: string;
  condition: string; // "Healthy" or Disease Name
  confidence: number; // 0-100
  description: string;
  symptoms: string[];
  causes: string[];
  treatments: TreatmentPlan;
  prevention: string[];
}

export interface AnalysisState {
  loading: boolean;
  error: string | null;
  data: DiseaseAnalysisResult | null;
}
