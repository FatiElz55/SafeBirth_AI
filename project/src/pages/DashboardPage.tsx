import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Users,
  ClipboardList,
  ShieldAlert,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Activity as ActivityIcon,
  ChevronRight,
} from 'lucide-react';
import type { PageKey, Assessment, ActivityEntry } from '@/types';
import {
  demoAssessments,
  demoActivity,
  getRiskDistribution,
} from '@/data/demoData';
import { RiskBadge } from '@/components/RiskBadge';
import { DemoBanner } from '@/components/DemoBanner';

const PIE_COLORS = ['#4F9D69', '#C8862E', '#A3344A'];

interface StatCardProps {
  label: string;
  value: string | number;
  icon: typeof Users;
  trend?: { value: string; up: boolean };
  accent: string;
}

function StatCard({ label, value, icon: Icon, trend, accent }: StatCardProps) {
  return (
    <div className="card p-5 flex items-start justify-between hover:shadow-elevated transition-shadow">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {label}
        </p>
        <p className="font-display text-3xl font-bold text-charcoal mt-2">{value}</p>
        {trend && (
          <div
            className={`mt-2 flex items-center gap-1 text-xs font-medium ${
              trend.up ? 'text-success' : 'text-danger'
            }`}
          >
            {trend.up ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {trend.value}
          </div>
        )}
      </div>
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const now = new Date('2024-11-25T09:00:00Z').getTime();
  const t = new Date(iso).getTime();
  const diff = Math.floor((now - t) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function DashboardPage({
  onNavigate,
  assessments,
  activity,
}: {
  onNavigate: (page: PageKey) => void;
  assessments: Assessment[];
  activity: ActivityEntry[];
}) {
  const distribution = getRiskDistribution(assessments);
  const total = assessments.length;
  const highRisk = assessments.filter((a) => a.prediction === 'high risk').length;
  const pending = assessments.filter((a) => a.reviewStatus === 'pending').length;
  const recent = [...assessments].slice(0, 5);
  const recentActivity = activity.slice(0, 6);

  const barData = [
    { name: 'Low', value: distribution[0].value, fill: '#4F9D69' },
    { name: 'Mid', value: distribution[1].value, fill: '#C8862E' },
    { name: 'High', value: distribution[2].value, fill: '#A3344A' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <DemoBanner />

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">
            Good morning, Dr. Hayford
          </h2>
          <p className="text-sm text-muted mt-1">
            Here's an overview of maternal health assessments.
          </p>
        </div>
        <button onClick={() => onNavigate('new-assessment')} className="btn-primary">
          <Plus className="h-4 w-4" />
          New Assessment
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Patients"
          value="10"
          icon={Users}
          trend={{ value: '2 new this month', up: true }}
          accent="bg-blush text-burgundy-600"
        />
        <StatCard
          label="Total Assessments"
          value={total}
          icon={ClipboardList}
          trend={{ value: '+15% vs last month', up: true }}
          accent="bg-blush text-burgundy-600"
        />
        <StatCard
          label="High Risk"
          value={highRisk}
          icon={ShieldAlert}
          trend={{ value: '+1 this week', up: false }}
          accent="bg-danger-100 text-danger"
        />
        <StatCard
          label="Pending Reviews"
          value={pending}
          icon={Clock}
          trend={{ value: 'Awaiting clinician', up: false }}
          accent="bg-warning-100 text-warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-base font-bold text-charcoal">
                Risk Distribution
              </h3>
              <p className="text-xs text-muted">Classifications across all assessments</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="relative h-56 w-56 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={95}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {distribution.map((entry, i) => (
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
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-display text-3xl font-bold text-charcoal">{total}</span>
                <span className="text-xs text-muted">Assessments</span>
              </div>
            </div>
            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {barData.map((b) => (
                  <div key={b.name} className="rounded-lg bg-palepink p-3 text-center">
                    <div
                      className="mx-auto mb-1.5 h-2 w-full rounded-full"
                      style={{ backgroundColor: b.fill }}
                    />
                    <p className="font-display text-xl font-bold text-charcoal">{b.value}</p>
                    <p className="text-xs text-muted">{b.name} Risk</p>
                  </div>
                ))}
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barSize={32}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} width={28} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barData.map((b, i) => (
                        <Cell key={i} fill={b.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <ActivityIcon className="h-4 w-4 text-dustyrose" />
            <h3 className="font-display text-base font-bold text-charcoal">Recent Activity</h3>
          </div>
          <div className="space-y-1">
            {recentActivity.map((a) => (
              <div
                key={a.id}
                className="flex gap-3 rounded-lg px-2 py-2.5 hover:bg-palepink transition-colors"
              >
                <div className="mt-1">
                  {a.risk === 'high risk' && (
                    <span className="block h-2 w-2 rounded-full bg-danger" />
                  )}
                  {a.risk === 'mid risk' && (
                    <span className="block h-2 w-2 rounded-full bg-warning" />
                  )}
                  {a.risk === 'low risk' && (
                    <span className="block h-2 w-2 rounded-full bg-success" />
                  )}
                  {!a.risk && <span className="block h-2 w-2 rounded-full bg-burgundy-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-charcoal leading-snug">{a.description}</p>
                  <p className="text-[11px] text-muted mt-0.5">{timeAgo(a.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-burgundy-100">
          <div>
            <h3 className="font-display text-base font-bold text-charcoal">Recent Assessments</h3>
            <p className="text-xs text-muted">Latest recorded maternal risk classifications</p>
          </div>
          <button
            onClick={() => onNavigate('assessments')}
            className="flex items-center gap-1 text-sm font-semibold text-burgundy-600 hover:text-burgundy-700"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-burgundy-100 bg-palepink/50 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-6 py-3">Assessment ID</th>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">BP (mmHg)</th>
                <th className="px-6 py-3">Risk</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-burgundy-50 last:border-0 hover:bg-palepink/40 transition-colors"
                >
                  <td className="px-6 py-3.5 font-mono text-xs text-charcoal">{a.assessmentId}</td>
                  <td className="px-6 py-3.5">
                    <p className="font-medium text-charcoal">{a.patientName}</p>
                    <p className="text-xs text-muted">{a.patientId}</p>
                  </td>
                  <td className="px-6 py-3.5 text-muted">{a.assessmentDate}</td>
                  <td className="px-6 py-3.5 text-muted">
                    {a.SystolicBP}/{a.DiastolicBP}
                  </td>
                  <td className="px-6 py-3.5">
                    <RiskBadge risk={a.prediction} size="xs" />
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-xs text-muted capitalize">{a.reviewStatus}</span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => onNavigate('assessments')}
                      className="text-xs font-semibold text-burgundy-600 hover:text-burgundy-700 inline-flex items-center gap-0.5"
                    >
                      Details
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
