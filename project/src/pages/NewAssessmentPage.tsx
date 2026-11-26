import { useState } from 'react';
import {
  Activity,
  Droplet,
  HeartPulse,
  Thermometer,
  Gauge,
  CalendarDays,
  Loader2,
  Save,
  History,
  LayoutDashboard,
  AlertTriangle,
  Stethoscope,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import type {
  Patient,
  Assessment,
  RiskCategory,
  PageKey,
  AssessmentInput,
} from '@/types';
import { predictRisk, isDemoMode } from '@/services/predictionApi';
import { RiskBadge } from '@/components/RiskBadge';
import { ClinicalDisclaimer, DemoBanner } from '@/components/DemoBanner';

interface NewAssessmentPageProps {
  patients: Patient[];
  onSave: (a: Assessment) => void;
  onNavigate: (page: PageKey) => void;
}

interface MeasurementField {
  key: keyof AssessmentInput;
  label: string;
  unit: string;
  icon: typeof Activity;
  placeholder: string;
  min: number;
  max: number;
  step: number;
  hint: string;
}

const fields: MeasurementField[] = [
  {
    key: 'Age',
    label: 'Age',
    unit: 'years',
    icon: Activity,
    placeholder: '25',
    min: 14,
    max: 55,
    step: 1,
    hint: 'Patient age in years',
  },
  {
    key: 'SystolicBP',
    label: 'Systolic Blood Pressure',
    unit: 'mmHg',
    icon: Gauge,
    placeholder: '120',
    min: 70,
    max: 200,
    step: 1,
    hint: 'Normal range: 110–130 mmHg',
  },
  {
    key: 'DiastolicBP',
    label: 'Diastolic Blood Pressure',
    unit: 'mmHg',
    icon: Gauge,
    placeholder: '80',
    min: 40,
    max: 130,
    step: 1,
    hint: 'Normal range: 70–85 mmHg',
  },
  {
    key: 'BS',
    label: 'Blood Sugar',
    unit: 'mmol/L',
    icon: Droplet,
    placeholder: '7.5',
    min: 3,
    max: 20,
    step: 0.1,
    hint: 'Fasting blood sugar level',
  },
  {
    key: 'BodyTemp',
    label: 'Body Temperature',
    unit: '°F',
    icon: Thermometer,
    placeholder: '98.6',
    min: 95,
    max: 106,
    step: 0.1,
    hint: 'Normal: ~98.6°F (37°C)',
  },
  {
    key: 'HeartRate',
    label: 'Heart Rate',
    unit: 'bpm',
    icon: HeartPulse,
    placeholder: '75',
    min: 40,
    max: 180,
    step: 1,
    hint: 'Resting heart rate',
  },
];

const riskColors: Record<RiskCategory, { ring: string; bg: string; icon: string }> = {
  'low risk': { ring: 'ring-success/30', bg: 'bg-success-50', icon: 'text-success' },
  'mid risk': { ring: 'ring-warning/30', bg: 'bg-warning-50', icon: 'text-warning' },
  'high risk': { ring: 'ring-danger/30', bg: 'bg-danger-50', icon: 'text-danger' },
};

const emptyForm: Record<keyof AssessmentInput, string> = {
  Age: '',
  SystolicBP: '',
  DiastolicBP: '',
  BS: '',
  BodyTemp: '',
  HeartRate: '',
};

export function NewAssessmentPage({
  patients,
  onSave,
  onNavigate,
}: NewAssessmentPageProps) {
  const [patientId, setPatientId] = useState('');
  const [assessmentDate, setAssessmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    prediction: RiskCategory;
    confidence?: number;
    inputs: AssessmentInput;
  } | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!patientId) e.patient = 'Please select a patient.';
    if (!assessmentDate) e.date = 'Assessment date is required.';
    fields.forEach((f) => {
      const v = form[f.key];
      if (v === '' || v === undefined) {
        e[f.key] = `${f.label} is required.`;
        return;
      }
      const n = Number(v);
      if (isNaN(n)) e[f.key] = `${f.label} must be a number.`;
      else if (n < f.min || n > f.max)
        e[f.key] = `${f.label} must be between ${f.min} and ${f.max} ${f.unit}.`;
    });
    return e;
  }

  async function handleAnalyze() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    setError('');
    setResult(null);
    setSaved(false);

    const inputs: AssessmentInput = {
      Age: Number(form.Age),
      SystolicBP: Number(form.SystolicBP),
      DiastolicBP: Number(form.DiastolicBP),
      BS: Number(form.BS),
      BodyTemp: Number(form.BodyTemp),
      HeartRate: Number(form.HeartRate),
    };

    try {
      const res = await predictRisk(inputs);
      setResult({ ...res, inputs });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to get prediction. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!result || !patientId) return;
    const patient = patients.find((p) => p.patientId === patientId);
    const assessment: Assessment = {
      ...result.inputs,
      id: crypto.randomUUID(),
      assessmentId: `AS-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      patientId,
      patientName: patient?.fullName ?? 'Unknown',
      assessmentDate,
      prediction: result.prediction,
      confidence: result.confidence,
      reviewStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    onSave(assessment);
    setSaved(true);
  }

  function resetForm() {
    setForm(emptyForm);
    setPatientId('');
    setResult(null);
    setErrors({});
    setError('');
    setSaved(false);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <DemoBanner />

      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal">
          New Maternal Risk Assessment
        </h2>
        <p className="text-sm text-muted mt-1">
          Record clinical measurements to generate an ML-based risk classification.
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blush text-burgundy-600">
            <Stethoscope className="h-5 w-5" />
          </div>
          <h3 className="font-display text-base font-bold text-charcoal">
            Assessment Context
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label-field">
              Patient <span className="text-danger">*</span>
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="input-field"
            >
              <option value="">Select a patient…</option>
              {patients.map((p) => (
                <option key={p.id} value={p.patientId}>
                  {p.fullName} — {p.patientId} ({p.age}y, {p.gestationalAgeWeeks}w)
                </option>
              ))}
            </select>
            {errors.patient && (
              <p className="mt-1 text-xs text-danger flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.patient}
              </p>
            )}
          </div>
          <div>
            <label className="label-field">
              Assessment Date <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
              <input
                type="date"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="input-field pl-9"
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-xs text-danger flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.date}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blush text-burgundy-600">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-charcoal">
              Clinical Measurements
            </h3>
            <p className="text-xs text-muted">
              Six model inputs — enter the latest recorded values.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {fields.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.key}>
                <label className="label-field">
                  {f.label} <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  <input
                    type="number"
                    step={f.step}
                    min={f.min}
                    max={f.max}
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="input-field pl-9 pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted">
                    {f.unit}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted">{f.hint}</p>
                {errors[f.key] && (
                  <p className="mt-0.5 text-xs text-danger flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors[f.key]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-burgundy-100 pt-5">
          <p className="text-xs text-muted max-w-md">
            The model evaluates these six measurements to produce a risk
            classification. Ensure values are current and accurately recorded.
          </p>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary text-base px-7 py-3 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Activity className="h-5 w-5" />
                Analyze Risk
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-danger/30 bg-danger-50 px-4 py-3 text-sm text-danger flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-6 animate-scale-in">
          <div className={`card overflow-hidden ring-2 ${riskColors[result.prediction].ring}`}>
            <div className={`${riskColors[result.prediction].bg} px-6 py-5`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-soft ${riskColors[result.prediction].icon}`}>
                    <ShieldAlert className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Predicted Risk Category
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <h3 className="font-display text-2xl font-bold text-charcoal capitalize">
                        {result.prediction}
                      </h3>
                      {isDemoMode && (
                        <span className="badge bg-burgundy-100 text-burgundy-600 px-2 py-0.5 text-[10px]">
                          DEMO
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {result.confidence !== undefined && (
                  <div className="text-right">
                    <p className="text-xs text-muted">Confidence</p>
                    <p className="font-display text-xl font-bold text-charcoal">
                      {(result.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                {fields.map((f) => (
                  <div key={f.key} className="rounded-lg bg-palepink p-3 text-center">
                    <p className="text-[11px] font-medium text-muted uppercase tracking-wide">
                      {f.label}
                    </p>
                    <p className="font-display text-lg font-bold text-charcoal mt-1">
                      {result.inputs[f.key]}
                    </p>
                    <p className="text-[11px] text-muted">{f.unit}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div className="rounded-lg bg-palepink p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Patient ID
                  </p>
                  <p className="font-mono text-sm text-charcoal mt-1">{patientId}</p>
                </div>
                <div className="rounded-lg bg-palepink p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Assessment Date
                  </p>
                  <p className="text-sm text-charcoal mt-1">{assessmentDate}</p>
                </div>
              </div>

              <div className="mb-5">
                <ClinicalDisclaimer />
              </div>

              {saved && (
                <div className="mb-5 rounded-lg border border-success/30 bg-success-50 px-4 py-3 text-sm text-success flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  Assessment saved successfully. It is now pending clinician review.
                </div>
              )}

              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className="btn-primary"
                >
                  <Save className="h-4 w-4" />
                  {saved ? 'Saved' : 'Save Assessment'}
                </button>
                <button
                  onClick={() => onNavigate('patients')}
                  className="btn-secondary"
                >
                  <History className="h-4 w-4" />
                  View Patient History
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="btn-ghost"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Return to Dashboard
                </button>
                <button
                  onClick={resetForm}
                  className="btn-ghost ml-auto"
                >
                  New Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


