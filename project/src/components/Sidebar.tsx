import type { PageKey } from '@/types';
import {
  LayoutDashboard,
  Users,
  ClipboardPlus,
  ShieldAlert,
  FileBarChart,
  Settings,
  HeartHandshake,
  FlaskConical,
  X,
} from 'lucide-react';
import { isDemoMode } from '@/services/predictionApi';

interface SidebarProps {
  current: PageKey;
  open: boolean;
  onClose: () => void;
  onNavigate: (page: PageKey) => void;
}

const navItems: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'patients', label: 'Patients', icon: Users },
  { key: 'new-assessment', label: 'New Assessment', icon: ClipboardPlus },
  { key: 'assessments', label: 'Risk Assessments', icon: ShieldAlert },
  { key: 'reports', label: 'Reports', icon: FileBarChart },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ current, open, onClose, onNavigate }: SidebarProps) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-burgundy-700 text-white transition-transform duration-300 ease-out lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-16 items-center gap-3 px-6 border-b border-white/10">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
          <HeartHandshake className="h-6 w-6 text-dustyrose" />
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="font-display text-lg font-bold tracking-tight">Safe Birth AI</p>
          <p className="text-[11px] text-white/50 font-medium tracking-wide uppercase">
            Clinical Platform
          </p>
        </div>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-white/12 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] ${
                  active ? 'text-dustyrose' : 'text-white/50 group-hover:text-dustyrose'
                }`}
              />
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-dustyrose" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-4 pb-6">
        <div
          className={`rounded-lg p-3 text-xs ${
            isDemoMode ? 'bg-white/10' : 'bg-success/15'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical
              className={`h-4 w-4 ${isDemoMode ? 'text-dustyrose' : 'text-success'}`}
            />
            <span className="font-semibold text-white">
              {isDemoMode ? 'Demo Mode' : 'API Connected'}
            </span>
          </div>
          <p className="text-white/50 leading-relaxed">
            {isDemoMode
              ? 'Using simulated classifications. Connect the FastAPI backend for live predictions.'
              : 'Live prediction endpoint is active.'}
          </p>
        </div>
      </div>
    </aside>
  );
}
