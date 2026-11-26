import { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  FlaskConical,
  Save,
  CheckCircle2,
  Server,
} from 'lucide-react';
import { isDemoMode } from '@/services/predictionApi';
import { DemoBanner } from '@/components/DemoBanner';

export function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    highRisk: true,
    pendingReview: true,
    weeklyDigest: false,
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <DemoBanner />

      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal">Settings</h2>
        <p className="text-sm text-muted mt-1">
          Manage your account, notifications, and platform configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blush text-burgundy-600">
              <User className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-charcoal">
              Profile Information
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-burgundy-500 text-white text-xl font-bold">
                AH
              </div>
              <div>
                <p className="font-semibold text-charcoal">Dr. Amara Hayford</p>
                <p className="text-sm text-muted">OB-GYN</p>
                <p className="text-xs text-muted">St. Augustine Hospital</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Full Name</label>
                <input className="input-field" defaultValue="Dr. Amara Hayford" />
              </div>
              <div>
                <label className="label-field">Specialty</label>
                <input className="input-field" defaultValue="Obstetrics & Gynecology" />
              </div>
              <div>
                <label className="label-field">Email</label>
                <input className="input-field" defaultValue="a.hayford@staugustine.health" />
              </div>
              <div>
                <label className="label-field">Hospital</label>
                <input className="input-field" defaultValue="St. Augustine Hospital" />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blush text-burgundy-600">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-charcoal">
              Notifications
            </h3>
          </div>
          <div className="space-y-4">
            <Toggle
              label="High-risk assessment alerts"
              desc="Get notified when a high-risk classification is recorded."
              checked={notifications.highRisk}
              onChange={(v) => setNotifications({ ...notifications, highRisk: v })}
            />
            <Toggle
              label="Pending review reminders"
              desc="Remind me about assessments awaiting clinician review."
              checked={notifications.pendingReview}
              onChange={(v) => setNotifications({ ...notifications, pendingReview: v })}
            />
            <Toggle
              label="Weekly summary digest"
              desc="Receive a weekly email summary of assessment activity."
              checked={notifications.weeklyDigest}
              onChange={(v) => setNotifications({ ...notifications, weeklyDigest: v })}
            />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blush text-burgundy-600">
              <Server className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-charcoal">
              Backend Integration
            </h3>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-burgundy-100 bg-palepink p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-charcoal">Prediction API</span>
                <span
                  className={`badge px-2.5 py-1 text-xs ${
                    isDemoMode
                      ? 'bg-burgundy-100 text-burgundy-600'
                      : 'bg-success-100 text-success'
                  }`}
                >
                  {isDemoMode ? 'Demo Mode' : 'Connected'}
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {isDemoMode
                  ? 'No backend URL configured. The app uses a transparent heuristic classifier for demonstration. Set VITE_API_BASE_URL to connect the FastAPI /predict endpoint.'
                  : 'The FastAPI prediction endpoint is active and returning live classifications.'}
              </p>
            </div>
            <div>
              <label className="label-field">API Base URL</label>
              <input
                className="input-field font-mono text-xs"
                placeholder="https://api.example.com"
                disabled
              />
            </div>
            <div className="rounded-lg bg-burgundy-50/60 border border-burgundy-100 p-4">
              <p className="text-xs font-semibold text-charcoal mb-1 flex items-center gap-1.5">
                <FlaskConical className="h-3.5 w-3.5 text-dustyrose" />
                Expected Endpoint
              </p>
              <code className="text-xs text-burgundy-700 font-mono block">
                POST /predict
              </code>
              <p className="text-[11px] text-muted mt-2">
                Input: Age, SystolicBP, DiastolicBP, BS, BodyTemp, HeartRate
                <br />
                Output: prediction ("low risk" | "mid risk" | "high risk")
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blush text-burgundy-600">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-charcoal">
              Security & Privacy
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label-field">Current Password</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="label-field">New Password</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div className="rounded-lg bg-palepink p-3 text-xs text-muted leading-relaxed">
              Patient data is protected and never exposed in public interfaces.
              All assessment records are access-controlled and visible only to
              authorized healthcare professionals.
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary">
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-charcoal">{label}</p>
        <p className="text-xs text-muted mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
          checked ? 'bg-burgundy-500' : 'bg-burgundy-200'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  );
}
