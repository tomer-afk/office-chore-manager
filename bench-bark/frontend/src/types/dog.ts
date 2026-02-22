export interface VaccinationRecord {
  name: string;
  date: string;
  notes?: string;
}

export interface Dog {
  id: number;
  user_id: number;
  name: string;
  breed: string | null;
  estimated_age: string | null;
  weight: number | null;
  weight_unit: 'lbs' | 'kg';
  gender: 'male' | 'female' | 'unknown' | null;
  photo_url: string | null;
  photo_public_id: string | null;
  vaccination_records: VaccinationRecord[];
  special_needs: string | null;
  medical_notes: string | null;
  ai_breed_confidence: number | null;
  ai_age_confidence: number | null;
  ai_raw_response: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDogInput {
  name: string;
  breed?: string;
  estimated_age?: string;
  weight?: number;
  weight_unit?: 'lbs' | 'kg';
  gender?: 'male' | 'female' | 'unknown';
  special_needs?: string;
  medical_notes?: string;
  vaccination_records?: VaccinationRecord[];
  photo_url?: string;
  photo_public_id?: string;
  ai_breed_confidence?: number;
  ai_age_confidence?: number;
  ai_raw_response?: Record<string, any>;
}

export interface AnalyzePhotoResponse {
  photo_url: string;
  photo_public_id: string;
  ai_analysis: {
    breed: string;
    estimated_age: string;
    breed_confidence: number;
    age_confidence: number;
  } | null;
}

export interface UpdateDogInput extends Partial<CreateDogInput> {}

export interface PhotoAnalysisResponse {
  dog: Dog;
  ai_analysis: {
    breed: string;
    estimated_age: string;
    breed_confidence: number;
    age_confidence: number;
  } | null;
}
