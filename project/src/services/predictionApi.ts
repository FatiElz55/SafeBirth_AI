import type { PredictionRequest, PredictionResponse, RiskCategory } from '@/types';

/**
 * API service layer for maternal risk prediction.
 *
 * When the FastAPI backend is connected, set VITE_API_BASE_URL to point to it.
 * The prediction endpoint is expected to be:
 *   POST {VITE_API_BASE_URL}/predict
 *
 * Request body:
 *   { "Age": 25, "SystolicBP": 120, "DiastolicBP": 80, "BS": 7.5, "BodyTemp": 98.6, "HeartRate": 75 }
 *
 * Response body:
 *   { "prediction": "low risk" }
 *
 * In demo mode (no backend configured), a heuristic classifier produces a
 * clearly-labelled demo prediction so the full UI flow is exercisable.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const isDemoMode = !API_BASE_URL;

function heuristicPrediction(req: PredictionRequest): PredictionResponse {
  // A transparent, non-clinical heuristic for demo purposes only.
  let score = 0;
  if (req.Age > 35) score += 2;
  else if (req.Age > 30) score += 1;
  if (req.SystolicBP >= 140) score += 2;
  else if (req.SystolicBP >= 130) score += 1;
  if (req.DiastolicBP >= 90) score += 2;
  else if (req.DiastolicBP >= 85) score += 1;
  if (req.BS >= 8) score += 2;
  else if (req.BS >= 7) score += 1;
  if (req.BodyTemp >= 99) score += 1;
  if (req.HeartRate >= 90) score += 1;

  let prediction: RiskCategory = 'low risk';
  if (score >= 5) prediction = 'high risk';
  else if (score >= 3) prediction = 'mid risk';

  return { prediction };
}

export async function predictRisk(
  req: PredictionRequest
): Promise<PredictionResponse> {
  if (!API_BASE_URL) {
    await new Promise((r) => setTimeout(r, 900));
    return heuristicPrediction(req);
  }

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    throw new Error(`Prediction request failed: ${response.status}`);
  }

  return (await response.json()) as PredictionResponse;
}
