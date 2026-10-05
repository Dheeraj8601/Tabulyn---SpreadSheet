import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import Footer from './components/Footer';

const HomePage = lazy(() => import('./pages/HomePage'));
const SpreadsheetPage = lazy(() => import('./pages/SpreadsheetPage'));
const CsvEditorPage = lazy(() => import('./pages/CsvEditorPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="flex-grow-1">
        <Suspense fallback={<div className="container py-5">Loading…</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/spreadsheet" element={<SpreadsheetPage />} />
            <Route path="/csv-editor" element={<CsvEditorPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
