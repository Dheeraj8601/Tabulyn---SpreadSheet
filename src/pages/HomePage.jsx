import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import AdSenseAd from "../components/AdSenseAd";
import { appIdentity } from "../data/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tabulyn",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "A free browser-based spreadsheet and CSV editor with formulas, local autosave, and file export.",
};

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does Tabulyn upload my spreadsheet data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The current core editor processes spreadsheet data in the browser and stores autosave data in local browser storage.",
      },
    },
    {
      "@type": "Question",
      name: "Can I open CSV and Excel files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Tabulyn supports CSV import and Excel XLSX/XLS import, plus CSV and XLSX export.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <SEO
        description="Edit spreadsheets and CSV files online with formulas, browser-local autosave, CSV import, and Excel export. No login required for the core editor."
        structuredData={[structuredData, faqData]}
      />

      <section className="hero-section">
        <div className="container py-5 py-lg-6">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="eyebrow">Free browser spreadsheet</span>
              <h1 className="display-4 fw-bold mt-3">
                Edit spreadsheet data without leaving your browser.
              </h1>
              <p className="lead text-secondary mt-3">
                {appIdentity.name} is a lightweight online spreadsheet and CSV
                editor with formulas, local autosave, multi-sheet workbooks, and
                Excel export.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link className="btn btn-primary btn-lg" to="/spreadsheet">
                  Open Spreadsheet
                </Link>
                <Link
                  className="btn btn-outline-secondary btn-lg"
                  to="/csv-editor"
                >
                  Open CSV Editor
                </Link>
              </div>
              <p className="small text-secondary mt-3 mb-0">
                Your spreadsheet is processed in your browser and temporarily
                stored on this device.
              </p>
            </div>
            <div className="col-lg-5">
              <div
                className="hero-grid-card shadow-sm"
                aria-label="Spreadsheet preview illustration"
              >
                <div className="preview-toolbar" />
                <div className="preview-grid">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <span key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <div className="section-heading">
            <h2>Useful spreadsheet tools, without the clutter</h2>
            <p>
              Built for quick data editing, calculations, imports, and
              downloads.
            </p>
          </div>
          <div className="row g-4 mt-1">
            {[
              [
                "Formulas",
                "Use SUM, AVERAGE, MIN, MAX, COUNT and cell arithmetic without unsafe eval().",
              ],
              [
                "CSV & Excel",
                "Import CSV, XLSX, or XLS files and export your work as CSV or XLSX.",
              ],
              [
                "Local autosave",
                "Changes are debounced and stored in browser localStorage on your current device.",
              ],
              [
                "Formatting",
                "Use bold, italic, underline, alignment, font size, text color, and cell fill.",
              ],
              [
                "Multiple sheets",
                "Create, rename, switch, and delete workbook sheets.",
              ],
              [
                "Keyboard friendly",
                "Navigate with arrows, Enter, Tab, Delete, plus common clipboard shortcuts.",
              ],
            ].map(([title, text]) => (
              <div className="col-md-6 col-lg-4" key={title}>
                <article className="feature-card h-100">
                  <h3 className="h5">{title}</h3>
                  <p className="text-secondary mb-0">{text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdSenseAd className="container my-4" />

      <section className="py-5">
        <div className="container">
          <div className="section-heading">
            <h2>How it works</h2>
          </div>
          <div className="row g-4 mt-1">
            {[
              [
                "1",
                "Open the editor",
                "Start with a blank spreadsheet—no account required.",
              ],
              [
                "2",
                "Edit or import",
                "Type into cells or bring in a CSV/Excel file.",
              ],
              [
                "3",
                "Download",
                "Export the current sheet as CSV or the workbook as XLSX.",
              ],
            ].map(([n, title, text]) => (
              <div className="col-md-4" key={n}>
                <div className="step-card">
                  <div className="step-number">{n}</div>
                  <h3 className="h5 mt-3">{title}</h3>
                  <p className="text-secondary mb-0">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-6">
              <h2>Privacy-first core workflow</h2>
              <p className="text-secondary">
                The core spreadsheet editor does not require a backend. Autosave
                data stays in localStorage on the browser and device you are
                using unless you download a file.
              </p>
              <p className="text-secondary">
                Future analytics or advertising integrations can change what
                external services receive, so review the privacy and consent
                setup before enabling them.
              </p>
            </div>
            <div className="col-lg-6">
              <h2>Frequently asked questions</h2>
              <div className="accordion-simple">
                <details>
                  <summary>Does Tabulyn upload my spreadsheet data?</summary>
                  <p>
                    The core editor processes spreadsheet contents in your
                    browser and stores autosave data locally.
                  </p>
                </details>
                <details>
                  <summary>Can I open Excel files?</summary>
                  <p>
                    Yes. XLSX and legacy XLS import are supported through the
                    open-source SheetJS xlsx library.
                  </p>
                </details>
                <details>
                  <summary>
                    Will my local autosave appear on another device?
                  </summary>
                  <p>
                    No. localStorage is tied to the current browser profile and
                    device. Download files if you need to move your work.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
