import SEO from '../components/SEO';
import Spreadsheet from '../spreadsheet/Spreadsheet';
import AdSenseAd from '../components/AdSenseAd';

export default function SpreadsheetPage() {
  return (
    <>
      <SEO
        title="Free Online Spreadsheet Editor"
        description="Create and edit spreadsheets online with formulas, local autosave, multiple sheets, CSV import, and Excel export."
        path="/spreadsheet"
      />
      <div className="tool-page-intro container-fluid px-3 py-2 bg-light border-bottom">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <div>
            <h1 className="h5 mb-0">Online Spreadsheet Editor</h1>
            <div className="small text-secondary">No login required. Autosaved locally in this browser.</div>
          </div>
        </div>
      </div>
      <Spreadsheet />
      <div className="container py-3">
        <AdSenseAd />
      </div>
    </>
  );
}
