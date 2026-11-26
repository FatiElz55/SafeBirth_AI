import { useState, useMemo } from 'react';
import { Filter, Search, Eye, ShieldAlert, Calendar } from 'lucide-react';
import type { Assessment } from '@/types';
import { RiskBadge, ReviewBadge } from '@/components/RiskBadge';
import { DemoBanner } from '@/components/DemoBanner';

interface AssessmentsPageProps {
  assessments: Assessment[];
}

export function AssessmentsPage({ assessments }: AssessmentsPageProps) {
  const [riskFilter, setRiskFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Assessment | null>(null);

  const filtered = useMemo(() => {
    return assessments.filter((a) => {
      const matchRisk = riskFilter === 'all' || a.prediction === riskFilter;
      const matchSearch =
        a.assessmentId.toLowerCase().includes(search.toLowerCase()) ||
        a.patientId.toLowerCase().includes(search.toLowerCase()) ||
        a.patientName.toLowerCase().includes(search.toLowerCase());
      const matchFrom = !dateFrom || a.assessmentDate >= dateFrom;
      const matchTo = !dateTo || a.assessmentDate <= dateTo;
      return matchRisk && matchSearch && matchFrom && matchTo;
    });
  }, [assessments, riskFilter, dateFrom, dateTo, search]);

  return (
    <div className="space-y-6 animate-fade-in">
      <DemoBanner />

      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal">Risk Assessments</h2>
        <p className="text-sm text-muted mt-1">
          All recorded maternal risk classifications and review status.
        </p>
      </div>

      <div className="card p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by assessment ID, patient ID, or name…"
            className="input-field pl-9"
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted flex-shrink-0" />
            {['all', 'low risk', 'mid risk', 'high risk'].map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  riskFilter === r
                    ? 'bg-burgundy-500 text-white shadow-soft'
                    : 'bg-palepink text-charcoal hover:bg-blush'
                }`}
              >
                {r === 'all' ? 'All Risks' : r}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 lg:ml-auto">
            <Calendar className="h-4 w-4 text-muted flex-shrink-0" />
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="input-field !py-2 w-auto"
              />
              <span className="text-muted text-sm">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="input-field !py-2 w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-burgundy-100 bg-palepink/50 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-6 py-3.5">Assessment ID</th>
                <th className="px-6 py-3.5">Patient ID</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Age</th>
                <th className="px-6 py-3.5">Blood Pressure</th>
                <th className="px-6 py-3.5">Predicted Risk</th>
                <th className="px-6 py-3.5">Review</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-burgundy-50 last:border-0 hover:bg-palepink/40 transition-colors"
                >
                  <td className="px-6 py-3.5 font-mono text-xs text-charcoal">{a.assessmentId}</td>
                  <td className="px-6 py-3.5 font-mono text-xs text-muted">{a.patientId}</td>
                  <td className="px-6 py-3.5 text-muted">{a.assessmentDate}</td>
                  <td className="px-6 py-3.5 text-muted">{a.Age}</td>
                  <td className="px-6 py-3.5 text-muted">
                    {a.SystolicBP}/{a.DiastolicBP}
                  </td>
                  <td className="px-6 py-3.5">
                    <RiskBadge risk={a.prediction} size="xs" />
                  </td>
                  <td className="px-6 py-3.5">
                    <ReviewBadge status={a.reviewStatus} />
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => setSelected(a)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-burgundy-600 hover:text-burgundy-700"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted text-sm">
                    No assessments match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <AssessmentDetailModal assessment={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function AssessmentDetailModal({
  assessment,
  onClose,
}: {
  assessment: Assessment;
  onClose: () => void;
}) {
  const fields = [
    { label: 'Age', value: `${assessment.Age} yrs` },
    { label: 'Systolic BP', value: `${assessment.SystolicBP} mmHg` },
    { label: 'Diastolic BP', value: `${assessment.DiastolicBP} mmHg` },
    { label: 'Blood Sugar', value: `${assessment.BS} mmol/L` },
    { label: 'Body Temp', value: `${assessment.BodyTemp} °F` },
    { label: 'Heart Rate', value: `${assessment.HeartRate} bpm` },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl card max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-burgundy-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blush text-burgundy-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-charcoal">
                {assessment.assessmentId}
              </h3>
              <p className="text-xs text-muted">{assessment.patientName} — {assessment.patientId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-charcoal transition-colors text-xl leading-none">
            ×
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-palepink px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Predicted Risk
              </p>
              <div className="mt-1">
                <RiskBadge risk={assessment.prediction} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Assessment Date
              </p>
              <p className="text-sm text-charcoal mt-1">{assessment.assessmentDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fields.map((f) => (
              <div key={f.label} className="rounded-lg border border-burgundy-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {f.label}
                </p>
                <p className="text-sm font-semibold text-charcoal mt-0.5">{f.value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">Review Status</p>
            <ReviewBadge status={assessment.reviewStatus} />
          </div>

          <div className="rounded-lg border border-warning/30 bg-warning-50 px-4 py-3 text-xs text-charcoal/80 leading-relaxed">
            <p className="font-semibold text-warning mb-0.5">Clinical Disclaimer</p>
            This tool provides an automated classification based on the available
            dataset. It is intended for research and decision-support prototyping
            only. It is not a diagnostic tool and must not replace professional
            clinical judgment.
          </div>
        </div>
      </div>
    </div>
  );
}
