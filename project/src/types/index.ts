export type RiskCategory = 'low risk' | 'mid risk' | 'high risk';

export type ReviewStatus = 'pending' | 'reviewed' | 'flagged';

export interface Patient {
  id: string;
  patientId: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  phone: string;
  gestationalAgeWeeks: number;
  medicalNotes: string;
  status: 'active' | 'monitoring' | 'discharged';
  createdAt: string;
}

export interface AssessmentInput {
  Age: number;
  SystolicBP: number;
  DiastolicBP: number;
  BS: number;
  BodyTemp: number;
  HeartRate: number;
}

export interface Assessment extends AssessmentInput {
  id: string;
  assessmentId: string;
  patientId: string;
  patientName: string;
  assessmentDate: string;
  prediction: RiskCategory;
  confidence?: number;
  reviewStatus: ReviewStatus;
  createdAt: string;
}

export interface PredictionRequest extends AssessmentInput {}

export interface PredictionResponse {
  prediction: RiskCategory;
  confidence?: number;
}

export type PageKey =
  | 'dashboard'
  | 'patients'
  | 'new-assessment'
  | 'assessments'
  | 'reports'
  | 'settings';

export interface ActivityEntry {
  id: string;
  type: 'assessment' | 'patient' | 'review';
  description: string;
  timestamp: string;
  risk?: RiskCategory;
}
