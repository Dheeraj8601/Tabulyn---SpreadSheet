import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" description="The requested Tabulyn page could not be found." noindex />
      <section className="container py-5 text-center">
        <h1>Page not found</h1>
        <p className="text-secondary">The page you requested does not exist.</p>
        <Link className="btn btn-primary" to="/">Go home</Link>
      </section>
    </>
  );
}
