import SEO from "../components/SEO";

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About"
        description="Learn what Tabulyn is, how its browser-based spreadsheet editor works, and the principles behind the product."
        path="/about"
      />
      <section className="container py-5">
        <div className="narrow-content">
          <h1>About Tabulyn</h1>
          <p className="lead text-secondary">
            Tabulyn is a lightweight browser-based spreadsheet and CSV editor
            designed for quick everyday data work.
          </p>
          <h2 className="h4 mt-5">Why it exists</h2>
          <p>
            Many spreadsheet tasks do not need an account, a complex
            collaboration system, or a heavyweight desktop app. Tabulyn focuses
            on editing, formulas, importing, exporting, and a clean workflow.
          </p>
          <h2 className="h4 mt-4">Current architecture</h2>
          <p>
            The current version uses React and Vite and keeps core spreadsheet
            data in your browser's localStorage. There is no required backend
            for the core editing workflow.
          </p>
          <p className="small text-secondary">
            Customize this page with your business or owner information before
            publishing the site commercially.
          </p>
        </div>
      </section>
    </>
  );
}
