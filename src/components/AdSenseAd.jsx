import { useEffect } from 'react';

/*
  GOOGLE ADSENSE

  This component is intentionally disabled by default.

  After approval:
  1. Add the AdSense script in index.html and replace:
     ca-pub-XXXXXXXXXXXXXXXX
     with your real publisher ID.
  2. Pass your approved ad slot ID to this component.
  3. Change ENABLE_ADSENSE to true after your consent implementation is ready.
  4. Never click your own ads.

  Publisher IDs and ad-slot IDs are public identifiers, not API secrets.
*/
const ENABLE_ADSENSE = false;
const PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX';

export default function AdSenseAd({ slot = 'XXXXXXXXXX', className = '' }) {
  useEffect(() => {
    if (!ENABLE_ADSENSE) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers or unavailable AdSense script should not break the app.
    }
  }, []);

  if (!ENABLE_ADSENSE) {
    return (
      <div className={`ad-placeholder ${className}`} aria-label="Advertisement placeholder">
        <span>Ad space reserved for future AdSense integration</span>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client={PUBLISHER_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
