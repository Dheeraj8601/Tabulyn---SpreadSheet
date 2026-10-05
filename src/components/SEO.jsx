import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Tabulyn';
const DEFAULT_DOMAIN = 'https://tabulyn.netlify.app';

export default function SEO({
  title,
  description,
  path = '/',
  structuredData,
  noindex = false,
}) {

  const canonical = `${DEFAULT_DOMAIN}${path === '/' ? '' : path}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Free Online Spreadsheet & CSV Editor`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
}
