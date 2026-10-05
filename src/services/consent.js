const CONSENT_KEY = 'tabulyn_consent_v1';

export function getConsentPreference() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveConsentPreference(preference) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(preference));
}

/*
  Consent requirements can vary by visitor region and current Google policies.
  Before enabling personalized advertising or analytics, integrate a suitable
  consent-management flow and confirm current requirements for your audience.
*/
