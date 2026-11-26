import type { RiskCategory } from '@/types';

const riskConfig: Record<
  RiskCategory,
  { label: string; bg: string; text: string; dot: string }
> = {
  'low risk': {
    label: 'Low Risk',
    bg: 'bg-success-100',
    text: 'text-success',
    dot: 'bg-success',
  },
  'mid risk': {
    label: 'Mid Risk',
    bg: 'bg-warning-100',
    text: 'text-warning',
    dot: 'bg-warning',
  },
  'high risk': {
    label: 'High Risk',
    bg: 'bg-danger-100',
    text: 'text-danger',
    dot: 'bg-danger',
  },
};

export function RiskBadge({
  risk,
  size = 'sm',
}: {
  risk: RiskCategory;
  size?: 'sm' | 'xs';
}) {
  const cfg = riskConfig[risk];
  const pad = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`badge ${cfg.bg} ${cfg.text} ${pad}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

const reviewConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: {
    label: 'Pending',
    bg: 'bg-burgundy-100',
    text: 'text-burgundy-600',
    dot: 'bg-burgundy-400',
  },
  reviewed: {
    label: 'Reviewed',
    bg: 'bg-success-100',
    text: 'text-success',
    dot: 'bg-success',
  },
  flagged: {
    label: 'Flagged',
    bg: 'bg-danger-100',
    text: 'text-danger',
    dot: 'bg-danger',
  },
};

export function ReviewBadge({ status }: { status: string }) {
  const cfg = reviewConfig[status] ?? reviewConfig.pending;
  return (
    <span className={`badge ${cfg.bg} ${cfg.text} px-2.5 py-1 text-xs`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
