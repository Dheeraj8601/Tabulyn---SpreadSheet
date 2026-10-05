import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-top bg-white mt-auto">
      <div className="container py-4 d-flex flex-column flex-md-row gap-3 justify-content-between">
        <div>
          <strong>Tabulyn</strong>
          <div className="small text-secondary">A fast, private spreadsheet editor in your browser.</div>
        </div>
        <nav className="d-flex flex-wrap gap-3 small" aria-label="Footer">
          <Link to="/spreadsheet">Spreadsheet</Link>
          <Link to="/csv-editor">CSV Editor</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
