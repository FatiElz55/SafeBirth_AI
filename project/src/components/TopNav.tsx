import { Bell, Search, ChevronDown, Menu } from 'lucide-react';
import { useState } from 'react';

interface TopNavProps {
  title: string;
  subtitle?: string;
  onOpenMenu: () => void;
}

export function TopNav({ title, subtitle, onOpenMenu }: TopNavProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-burgundy-100 bg-ivory/90 px-4 backdrop-blur-md sm:gap-4 sm:px-6 lg:px-8">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onOpenMenu}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-burgundy-100 text-charcoal hover:bg-blush lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-lg font-bold text-charcoal tracking-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-muted truncate">{subtitle}</p>
        )}
      </div>

      <div className="hidden md:flex relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          type="text"
          placeholder="Search patients, assessments…"
          className="w-64 pl-9 pr-4 py-2 rounded-lg border border-burgundy-100 bg-palepink text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-burgundy-200 focus:bg-white transition-all"
        />
      </div>

      <div className="relative">
        <button
          onClick={() => setNotifOpen((o) => !o)}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-burgundy-100 text-charcoal hover:bg-blush transition-colors"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>
        {notifOpen && (
          <div className="absolute right-0 mt-2 w-72 card p-2 animate-scale-in z-50">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Notifications
            </p>
            {[
              { t: 'High-risk assessment flagged', d: 'Priya Venkatesan — AS-2024-00121', time: '2h ago' },
              { t: 'New assessment pending review', d: 'Eleanor Whitfield — AS-2024-00120', time: '5h ago' },
              { t: 'Assessment reviewed', d: 'Amara Okafor — AS-2024-00119', time: '1d ago' },
            ].map((n, i) => (
              <div key={i} className="rounded-lg px-3 py-2 hover:bg-blush cursor-pointer transition-colors">
                <p className="text-sm font-semibold text-charcoal">{n.t}</p>
                <p className="text-xs text-muted">{n.d}</p>
                <p className="text-[11px] text-burgundy-400 mt-0.5">{n.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-lg hover:bg-blush transition-colors">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-burgundy-500 text-white text-sm font-bold">
          AH
        </div>
        <div className="hidden md:block text-left leading-tight">
          <p className="text-sm font-semibold text-charcoal">Dr. Amara Hayford</p>
          <p className="text-[11px] text-muted">OB-GYN · St. Augustine Hospital</p>
        </div>
        <ChevronDown className="h-4 w-4 text-muted" />
      </button>
    </header>
  );
}
