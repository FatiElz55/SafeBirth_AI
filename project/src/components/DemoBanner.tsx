import { type ReactNode } from 'react';
import { Info } from 'lucide-react';

export function DemoBanner({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-dustyrose/30 bg-blush px-4 py-2.5 text-xs text-burgundy-700">
      <Info className="h-4 w-4 flex-shrink-0 text-dustyrose" />
      <span>
        {children ??
          'Demo Mode — All data shown is fictional and for demonstration purposes only.'}
      </span>
    </div>
  );
}

export function ClinicalDisclaimer() {
  return (
    <div className="rounded-lg border border-warning/30 bg-warning-50 px-4 py-3 text-xs text-charcoal/80 leading-relaxed">
      <p className="font-semibold text-warning mb-0.5">Clinical Disclaimer</p>
      This tool provides an automated classification based on the available
      dataset. It is intended for research and decision-support prototyping
      only. It is not a diagnostic tool and must not replace professional
      clinical judgment.
    </div>
  );
}
