import { useState } from 'react';
import type { PageKey, Patient, Assessment } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { DashboardPage } from '@/pages/DashboardPage';
import { PatientsPage } from '@/pages/PatientsPage';
import { NewAssessmentPage } from '@/pages/NewAssessmentPage';
import { AssessmentsPage } from '@/pages/AssessmentsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import {
  demoPatients,
  demoAssessments,
  demoActivity,
} from '@/data/demoData';

const pageMeta: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: "Today's maternal health overview" },
  patients: { title: 'Patients', subtitle: 'Manage registered patient records' },
  'new-assessment': {
    title: 'New Assessment',
    subtitle: 'Record clinical measurements for risk classification',
  },
  assessments: {
    title: 'Risk Assessments',
    subtitle: 'Browse and review all recorded classifications',
  },
  reports: { title: 'Reports', subtitle: 'Analytics and aggregate statistics' },
  settings: { title: 'Settings', subtitle: 'Account and platform configuration' },
};

function App() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [patients, setPatients] = useState<Patient[]>(demoPatients);
  const [assessments, setAssessments] = useState<Assessment[]>(demoAssessments);

  function handleNavigate(p: PageKey) {
    setPage(p);
  }

  function handleAddPatient(p: Patient) {
    setPatients((prev) => [p, ...prev]);
  }

  function handleSaveAssessment(a: Assessment) {
    setAssessments((prev) => [a, ...prev]);
  }

  const meta = pageMeta[page];

  return (
    <div className="min-h-screen bg-ivory">
      <Sidebar current={page} onNavigate={handleNavigate} />
      <div className="ml-64 flex min-h-screen flex-col">
        <TopNav title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 px-8 py-6">
          <div className="mx-auto max-w-7xl">
            {page === 'dashboard' && (
              <DashboardPage
                onNavigate={handleNavigate}
                assessments={assessments}
                activity={demoActivity}
              />
            )}
            {page === 'patients' && (
              <PatientsPage
                patients={patients}
                assessments={assessments}
                onAddPatient={handleAddPatient}
                onNavigate={handleNavigate}
              />
            )}
            {page === 'new-assessment' && (
              <NewAssessmentPage
                patients={patients}
                onSave={handleSaveAssessment}
                onNavigate={handleNavigate}
              />
            )}
            {page === 'assessments' && (
              <AssessmentsPage assessments={assessments} />
            )}
            {page === 'reports' && <ReportsPage assessments={assessments} />}
            {page === 'settings' && <SettingsPage />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
