import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  Download,
  FileBarChart,
  TrendingUp,
  ClipboardList,
  ShieldAlert,
  Percent,
} from 'lucide-react';
import type { Assessment } from '@/types';
import { getRiskDistribution, monthlyTrends } from '@/data/demoData';
import { DemoBanner } from '@/components/DemoBanner';

const PIE_COLORS = ['#4F9D69', '#C8862E', '#A3344A'];

export function ReportsPage({ assessments }: { assessments: Assessment[] }) {
  const distribution = getRiskDistribution(assessments);
  const total = assessments.length;
  const lowPct = total ? Math.round((distribution[0].value / total) * 100) : 0;
  const midPct = total ? Math.round((distribution[1].value / total) * 100) : 0;
  const highPct = total ? Math.round((distribution[2].value / total) * 100) : 0;

  const trendData = monthlyTrends.map((t) => ({
    ...t,
    total: t.low + t.mid + t.high,
  }));

  const stackedData = monthlyTrends.map((t) => ({
    month: t.month,
    'Low Risk': t.low,
    'Mid Risk': t.mid,
    'High Risk': t.high,
  }));

  function handleExport() {
    const headers = [
      'Assessment ID',
      'Patient ID',
      'Patient Name',
      'Date',
      'Age',
      'SystolicBP',
      'DiastolicBP',
      'BS',
      'BodyTemp',
      'HeartRate',
      'Prediction',
      'Review Status',
    ];
    const rows = assessments.map((a) =>
      [
        a.assessmentId,
        a.patientId,
        a.patientName,
        a.assessmentDate,
        a.Age,
        a.SystolicBP,
        a.DiastolicBP,
        a.BS,
        a.BodyTemp,
        a.HeartRate,
        a.prediction,
        a.reviewStatus,
      ]
        .map((v) => `"${v}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maternacare-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <DemoBanner>
        Demo Mode — Statistics describe recorded model classifications, not
        confirmed clinical outcomes. All data is fictional.
      </DemoBanner>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">Reports & Analytics</h2>
          <p className="text-sm text-muted mt-1">
            Aggregate view of assessment activity and risk distribution.
          </p>
        </div>
        <button onClick={handleExport} className="btn-primary">
          <Download className="h-4 w-4" />
          Export Report (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <ReportStat
          label="Total Assessments"
          value={total}
          icon={ClipboardList}
          accent="bg-blush text-burgundy-600"
        />
        <ReportStat
          label="Low Risk"
          value={`${lowPct}%`}
          icon={Percent}
          accent="bg-success-100 text-success"
        />
        <ReportStat
          label="High Risk"
          value={`${highPct}%`}
          icon={ShieldAlert}
          accent="bg-danger-100 text-danger"
        />
        <ReportStat
          label="Monthly Avg"
          value={(trendData.reduce((s, t) => s + t.total, 0) / trendData.length).toFixed(1)}
          icon={TrendingUp}
          accent="bg-warning-100 text-warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileBarChart className="h-4 w-4 text-dustyrose" />
            <h3 className="font-display text-base font-bold text-charcoal">
              Risk Category Distribution
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-56 w-56 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {distribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid #F8E9EF',
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3 w-full">
              {distribution.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PIE_COLORS[i] }}
                  />
                  <span className="text-sm text-charcoal font-medium flex-1">{d.name}</span>
                  <span className="text-sm font-bold text-charcoal">{d.value}</span>
                  <span className="text-xs text-muted w-10 text-right">
                    {total ? Math.round((d.value / total) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-4 w-4 text-dustyrose" />
            <h3 className="font-display text-base font-bold text-charcoal">
              Monthly Assessment Trends
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#70263F" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#70263F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #F8E9EF',
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#70263F"
                  strokeWidth={2.5}
                  fill="url(#colorTotal)"
                  name="Total Assessments"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <FileBarChart className="h-4 w-4 text-dustyrose" />
          <h3 className="font-display text-base font-bold text-charcoal">
            Risk Classification by Month
          </h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackedData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={28} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #F8E9EF',
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="Low Risk" stackId="a" fill="#4F9D69" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Mid Risk" stackId="a" fill="#C8862E" radius={[0, 0, 0, 0]} />
              <Bar dataKey="High Risk" stackId="a" fill="#A3344A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ReportStat({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: typeof TrendingUp;
  accent: string;
}) {
  return (
    <div className="card p-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        <p className="font-display text-2xl font-bold text-charcoal mt-1.5">{value}</p>
      </div>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
