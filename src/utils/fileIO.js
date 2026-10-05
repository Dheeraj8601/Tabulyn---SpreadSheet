import * as XLSX from 'xlsx';
import { parseCsv, toCsv } from './csv';
import { columnIndexToLabel } from './cellUtils';

function sanitizeFilename(name) {
  return (name || 'spreadsheet')
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
    .replace(/\s+/g, '-')
    .slice(0, 80) || 'spreadsheet';
}

export function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function sheetToMatrix(sheet, getDisplayValue) {
  const matrix = [];
  for (let r = 0; r < sheet.rows; r += 1) {
    const row = [];
    for (let c = 0; c < sheet.cols; c += 1) {
      row.push(getDisplayValue(r, c));
    }
    matrix.push(row);
  }

  while (matrix.length && matrix.at(-1).every((v) => v === '')) matrix.pop();
  let lastCol = -1;
  matrix.forEach((row) => {
    row.forEach((value, idx) => {
      if (value !== '') lastCol = Math.max(lastCol, idx);
    });
  });
  return matrix.map((row) => row.slice(0, lastCol + 1));
}

export function exportCsv(workbookName, sheet, getDisplayValue) {
  const matrix = sheetToMatrix(sheet, getDisplayValue);
  downloadBlob(
    toCsv(matrix),
    `${sanitizeFilename(workbookName)}.csv`,
    'text/csv;charset=utf-8'
  );
}

export function exportXlsx(workbookName, sheets, valueResolver) {
  const wb = XLSX.utils.book_new();
  sheets.forEach((sheet) => {
    const matrix = sheetToMatrix(sheet, (r, c) => valueResolver(sheet, r, c));
    const ws = XLSX.utils.aoa_to_sheet(matrix);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name.slice(0, 31) || 'Sheet');
  });
  XLSX.writeFile(wb, `${sanitizeFilename(workbookName)}.xlsx`);
}

export async function importSpreadsheetFile(file) {
  if (!file) throw new Error('Choose a file first.');
  if (file.size === 0) throw new Error('The selected file is empty.');

  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'csv') {
    const text = await file.text();
    return [{ name: file.name.replace(/\.csv$/i, '') || 'Imported CSV', data: parseCsv(text) }];
  }

  if (ext === 'xlsx' || ext === 'xls') {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array', cellText: true, cellDates: false });
    if (!wb.SheetNames.length) throw new Error('No worksheets were found in the Excel file.');
    return wb.SheetNames.map((name) => ({
      name,
      data: XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: '', raw: false })
    }));
  }

  throw new Error('Unsupported file type. Please choose a CSV, XLSX, or XLS file.');
}

export function matrixToCells(matrix) {
  const cells = {};
  matrix.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value !== '' && value !== null && value !== undefined) {
        cells[`${columnIndexToLabel(c)}${r + 1}`] = { value: String(value), format: {} };
      }
    });
  });
  return cells;
}
