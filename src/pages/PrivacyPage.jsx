import SEO from '../components/SEO';

export default function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Privacy information for Tabulyn, including browser storage, future analytics, cookies, and advertising integrations."
        path="/privacy"
      />
      <section className="container py-5">
        <div className="narrow-content legal-copy">
          <h1>Privacy Policy</h1>
          <p className="text-secondary"><strong>Customize before publishing:</strong> add your legal entity/contact information, effective date, jurisdiction-specific disclosures, and actual services you enable.</p>

          <h2>Browser storage</h2>
          <p>
            The core spreadsheet editor stores workbook data in your browser using localStorage so it can restore your work after refresh.
            This storage is normally specific to the current browser profile and device.
          </p>

          <h2>Spreadsheet contents</h2>
          <p>
            In the default core implementation, spreadsheet content is processed in the browser and is not sent to a Tabulyn backend because no backend is included.
          </p>

          <h2>Cookies and consent</h2>
          <p>
            The core editor does not require advertising cookies. If analytics, advertising, or other third-party services are enabled later,
            update this policy and implement consent handling where required by applicable law or platform policy.
          </p>

          <h2>Google AdSense</h2>
          <p>
            This project contains disabled placeholders for future Google AdSense integration. If AdSense is enabled, Google and its partners may use
            cookies or similar technologies for advertising according to their own policies. Configure region-appropriate consent before loading advertising where required.
          </p>

          <h2>Analytics</h2>
          <p>
            No analytics service is enabled in the starter project. If you add one, document the provider, data collected, retention, and opt-out/consent options.
          </p>

          <h2>Local deletion</h2>
          <p>
            Users can clear workbook data by creating a new workbook and can also clear site storage through their browser settings.
          </p>

          <h2>Contact</h2>
          <p>[REPLACE WITH YOUR CONTACT EMAIL OR CONTACT PAGE BEFORE PUBLISHING]</p>

          <p className="small text-secondary">
            This template is informational and is not a legal guarantee or substitute for professional legal advice.
          </p>
        </div>
      </section>
    </>
  );
}
