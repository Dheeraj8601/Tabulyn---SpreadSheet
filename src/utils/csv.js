export function parseCsv(text) {
  if (!text.trim()) throw new Error('The CSV file is empty.');

  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (quoted) throw new Error('The CSV contains an unclosed quoted field.');
  row.push(cell);
  rows.push(row);
  return rows.filter((r) => r.some((value) => value !== ''));
}

export function toCsv(matrix) {
  return matrix
    .map((row) =>
      row
        .map((value) => {
          const text = String(value ?? '');
          return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
        })
        .join(',')
    )
    .join('\r\n');
}
