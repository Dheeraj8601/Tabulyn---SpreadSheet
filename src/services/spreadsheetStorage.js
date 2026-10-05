const STORAGE_KEY = 'tabulyn_spreadsheet_v1';

export function loadWorkbook() {
  // Browser storage is device/browser-local. The app never assumes stored JSON is valid.
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.sheets) || parsed.sheets.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveWorkbook(workbook) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workbook));
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to save to browser storage.'
    };
  }
}

export function clearStoredWorkbook() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
