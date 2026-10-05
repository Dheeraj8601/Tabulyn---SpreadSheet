import { NavLink, Link } from 'react-router-dom';

export default function SiteHeader() {
  return (
    <header className="site-header border-bottom bg-white sticky-top">
      <nav className="navbar navbar-expand-lg container py-2" aria-label="Main navigation">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <span className="brand-mark" aria-hidden="true">T</span>
          Tabulyn
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#siteNav"
          aria-controls="siteNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => {
            const el = document.getElementById('siteNav');
            el?.classList.toggle('show');
          }}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="siteNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <NavLink className="nav-link" to="/spreadsheet">Spreadsheet</NavLink>
            <NavLink className="nav-link" to="/csv-editor">CSV Editor</NavLink>
            <NavLink className="nav-link" to="/about">About</NavLink>
            <Link className="btn btn-primary ms-lg-2" to="/spreadsheet">Open Spreadsheet</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
