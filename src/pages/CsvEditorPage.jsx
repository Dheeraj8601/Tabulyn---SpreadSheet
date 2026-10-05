import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function CsvEditorPage() {
  return (
    <>
      <SEO
        title="CSV Editor Online"
        description="Open and edit CSV files in a spreadsheet-style browser editor, then download CSV or Excel files."
        path="/csv-editor"
      />
      <section className="container py-5">
        <div className="narrow-content">
          <span className="eyebrow">CSV editor online</span>
          <h1 className="display-6 fw-bold mt-3">
            Edit CSV files in a spreadsheet-style grid
          </h1>
          <p className="lead text-secondary">
            Use Tabulyn to import a CSV file, make changes, use formulas and
            formatting, then download the updated data as CSV or XLSX.
          </p>
          <Link className="btn btn-primary btn-lg mt-2" to="/spreadsheet">
            Open CSV in Spreadsheet
          </Link>

          <hr className="my-5" />
          <h2 className="h4">What happens to my CSV data?</h2>
          <p className="text-secondary">
            In the core version, file contents are read in your browser.
            Autosave data is stored on this browser/device through localStorage.
            Download your work if you need a portable copy.
          </p>
          <h2 className="h4 mt-4">Supported workflow</h2>
          <p className="text-secondary">
            Import .csv, .xlsx, or .xls → edit cells → use supported formulas →
            download .csv or .xlsx.
          </p>
        </div>
      </section>
    </>
  );
}
