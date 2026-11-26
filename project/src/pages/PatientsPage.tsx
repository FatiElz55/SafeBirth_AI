import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Eye,
  X,
  AlertCircle,
  Users as UsersIcon,
} from 'lucide-react';
import type { Patient, Assessment, PageKey } from '@/types';
import { RiskBadge } from '@/components/RiskBadge';
import { DemoBanner } from '@/components/DemoBanner';

interface PatientsPageProps {
  patients: Patient[];
  assessments: Assessment[];
  onAddPatient: (p: Patient) => void;
  onNavigate: (page: PageKey) => void;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  active: { label: 'Active', bg: 'bg-success-100', text: 'text-success' },
  monitoring: { label: 'Monitoring', bg: 'bg-warning-100', text: 'text-warning' },
  discharged: { label: 'Discharged', bg: 'bg-burgundy-100', text: 'text-burgundy-600' },
};

interface FormErrors {
  patientId?: string;
  fullName?: string;
  dateOfBirth?: string;
  age?: string;
  phone?: string;
  gestationalAgeWeeks?: string;
}

export function PatientsPage({
  patients,
  assessments,
  onAddPatient,
  onNavigate,
}: PatientsPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.patientId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [patients, search, statusFilter]);

  const lastRiskForPatient = (patientId: string) => {
    const found = assessments
      .filter((a) => a.patientId === patientId)
      .sort((a, b) => b.assessmentDate.localeCompare(a.assessmentDate));
    return found[0] ?? null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <DemoBanner />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">Patient Management</h2>
          <p className="text-sm text-muted mt-1">
            {patients.length} registered patients under clinical care.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Patient
        </button>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or patient ID…"
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'monitoring', 'discharged'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                statusFilter === s
                  ? 'bg-burgundy-500 text-white shadow-soft'
                  : 'bg-palepink text-charcoal hover:bg-blush'
              }`}
            >
              {s === 'all' ? 'All Status' : s}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-burgundy-100 bg-palepink/50 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-6 py-3.5">Patient ID</th>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Age</th>
                <th className="px-6 py-3.5">Gestational Age</th>
                <th className="px-6 py-3.5">Last Assessment</th>
                <th className="px-6 py-3.5">Risk</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const last = lastRiskForPatient(p.patientId);
                const status = statusConfig[p.status];
                return (
                  <tr
                    key={p.id}
                    className="border-b border-burgundy-50 last:border-0 hover:bg-palepink/40 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-charcoal">{p.patientId}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blush text-burgundy-600 text-xs font-bold">
                          {p.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">{p.fullName}</p>
                          <p className="text-xs text-muted">{p.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-muted">{p.age}</td>
                    <td className="px-6 py-3.5 text-muted">{p.gestationalAgeWeeks}w</td>
                    <td className="px-6 py-3.5 text-muted">
                      {last ? last.assessmentDate : '—'}
                    </td>
                    <td className="px-6 py-3.5">
                      {last ? <RiskBadge risk={last.prediction} size="xs" /> : '—'}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`badge ${status.bg} ${status.text} px-2.5 py-1 text-xs`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedPatient(p)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-burgundy-600 hover:text-burgundy-700"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted text-sm">
                    No patients match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddPatientModal
          onClose={() => setShowModal(false)}
          onAdd={(p) => {
            onAddPatient(p);
            setShowModal(false);
          }}
          existingCount={patients.length}
        />
      )}

      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          assessments={assessments.filter((a) => a.patientId === selectedPatient.patientId)}
          onClose={() => setSelectedPatient(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

function AddPatientModal({
  onClose,
  onAdd,
  existingCount,
}: {
  onClose: () => void;
  onAdd: (p: Patient) => void;
  existingCount: number;
}) {
  const [form, setForm] = useState({
    patientId: '',
    fullName: '',
    dateOfBirth: '',
    age: '',
    phone: '',
    gestationalAgeWeeks: '',
    medicalNotes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.patientId.trim()) e.patientId = 'Patient ID is required.';
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required.';
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 14 || Number(form.age) > 55)
      e.age = 'Enter a valid age (14–55).';
    if (!form.phone.trim() || form.phone.trim().length < 7) e.phone = 'Enter a valid phone number.';
    if (!form.gestationalAgeWeeks || Number(form.gestationalAgeWeeks) < 1 || Number(form.gestationalAgeWeeks) > 42)
      e.gestationalAgeWeeks = 'Enter gestational age (1–42 weeks).';
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    onAdd({
      id: String(existingCount + 1),
      patientId: form.patientId,
      fullName: form.fullName,
      dateOfBirth: form.dateOfBirth,
      age: Number(form.age),
      phone: form.phone,
      gestationalAgeWeeks: Number(form.gestationalAgeWeeks),
      medicalNotes: form.medicalNotes,
      status: 'active',
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg card p-6 max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blush text-burgundy-600">
              <UsersIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-charcoal">Register New Patient</h3>
              <p className="text-xs text-muted">Complete the clinical intake form.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-charcoal transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Patient ID" error={errors.patientId}>
            <input
              className="input-field"
              placeholder="e.g. MC-2024-011"
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            />
          </Field>
          <Field label="Full Name" error={errors.fullName}>
            <input
              className="input-field"
              placeholder="e.g. Jane Doe"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </Field>
          <Field label="Date of Birth" error={errors.dateOfBirth}>
            <input
              type="date"
              className="input-field"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            />
          </Field>
          <Field label="Age (years)" error={errors.age}>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 30"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </Field>
          <Field label="Phone Number" error={errors.phone}>
            <input
              className="input-field"
              placeholder="+1 (555) 555-0100"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Gestational Age (weeks)" error={errors.gestationalAgeWeeks}>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 20"
              value={form.gestationalAgeWeeks}
              onChange={(e) => setForm({ ...form, gestationalAgeWeeks: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <label className="label-field">Relevant Medical Notes</label>
            <textarea
              className="input-field min-h-[80px] resize-y"
              placeholder="Allergies, prior conditions, current medications…"
              value={form.medicalNotes}
              onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary">
            Register Patient
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label-field">{label}</label>
      {children}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-danger">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function PatientDetailModal({
  patient,
  assessments,
  onClose,
  onNavigate,
}: {
  patient: Patient;
  assessments: Assessment[];
  onClose: () => void;
  onNavigate: (page: PageKey) => void;
}) {
  const status = statusConfig[patient.status];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl card max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-burgundy-100">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blush text-burgundy-600 text-sm font-bold">
              {patient.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-charcoal">{patient.fullName}</h3>
              <p className="text-xs text-muted font-mono">{patient.patientId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-charcoal transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InfoCell label="Age" value={`${patient.age} yrs`} />
            <InfoCell label="Gestational Age" value={`${patient.gestationalAgeWeeks} weeks`} />
            <InfoCell label="Phone" value={patient.phone} />
            <InfoCell
              label="Status"
              value={status.label}
              badge={true}
              badgeClass={`${status.bg} ${status.text}`}
            />
          </div>

          <div>
            <p className="label-field">Medical Notes</p>
            <p className="text-sm text-charcoal/80 bg-palepink rounded-lg p-3 leading-relaxed">
              {patient.medicalNotes || 'No notes recorded.'}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="label-field mb-0">Assessment History</p>
              <button
                onClick={() => onNavigate('new-assessment')}
                className="text-xs font-semibold text-burgundy-600 hover:text-burgundy-700"
              >
                + New Assessment
              </button>
            </div>
            {assessments.length === 0 ? (
              <p className="text-sm text-muted bg-palepink rounded-lg p-4 text-center">
                No assessments recorded for this patient yet.
              </p>
            ) : (
              <div className="space-y-2">
                {assessments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border border-burgundy-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-muted">{a.assessmentId}</span>
                      <span className="text-sm text-charcoal">{a.assessmentDate}</span>
                      <span className="text-xs text-muted">
                        BP {a.SystolicBP}/{a.DiastolicBP}
                      </span>
                    </div>
                    <RiskBadge risk={a.prediction} size="xs" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCell({
  label,
  value,
  badge,
  badgeClass,
}: {
  label: string;
  value: string;
  badge?: boolean;
  badgeClass?: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      {badge ? (
        <span className={`badge ${badgeClass} px-2.5 py-1 text-xs mt-1`}>{value}</span>
      ) : (
        <p className="text-sm font-medium text-charcoal mt-1">{value}</p>
      )}
    </div>
  );
}
