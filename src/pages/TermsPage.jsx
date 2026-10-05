import SEO from '../components/SEO';

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Use"
        description="Terms template for using the Tabulyn browser-based spreadsheet and CSV editor."
        path="/terms"
      />
      <section className="container py-5">
        <div className="narrow-content legal-copy">
          <h1>Terms of Use</h1>
          <p className="text-secondary"><strong>Customize before publishing:</strong> add your legal entity, governing law, contact details, and any product-specific commercial terms.</p>

          <h2>Service</h2>
          <p>Tabulyn provides browser-based spreadsheet editing features, including local autosave, import, and export capabilities.</p>

          <h2>Your data and backups</h2>
          <p>
            Browser localStorage is not a backup system. Users are responsible for downloading copies of important work.
            Clearing browser data, changing browsers, private-browsing behavior, or device loss may remove locally stored work.
          </p>

          <h2>Acceptable use</h2>
          <p>Do not use the service to violate laws, infringe rights, distribute malware, or interfere with the operation of the site.</p>

          <h2>No warranty</h2>
          <p>
            [CUSTOMIZE FOR YOUR JURISDICTION.] The service should be tested for your use case before relying on it for critical records.
          </p>

          <h2>Third-party services</h2>
          <p>If advertising, analytics, hosting, or other third-party services are enabled, their separate terms and policies may apply.</p>

          <h2>Contact</h2>
          <p>[REPLACE WITH YOUR CONTACT EMAIL OR CONTACT PAGE BEFORE PUBLISHING]</p>

          <p className="small text-secondary">This starter template is not legal advice.</p>
        </div>
      </section>
    </>
  );
}
