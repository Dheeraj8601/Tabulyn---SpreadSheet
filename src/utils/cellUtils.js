export function columnIndexToLabel(index) {
  let n = index + 1;
  let label = '';
  while (n > 0) {
    n -= 1;
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26);
  }
  return label;
}

export function columnLabelToIndex(label) {
  return label
    .toUpperCase()
    .split('')
    .reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
}

export function cellKey(row, col) {
  return `${columnIndexToLabel(col)}${row + 1}`;
}

export function parseCellKey(key) {
  const match = /^([A-Z]+)([1-9]\d*)$/i.exec(key.trim());
  if (!match) return null;
  return {
    col: columnLabelToIndex(match[1]),
    row: Number(match[2]) - 1
  };
}

export function makeEmptySheet(name = 'Sheet1', rows = 40, cols = 16) {
  return {
    id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `sheet-${Date.now()}-${Math.random()}`,
    name,
    rows,
    cols,
    cells: {}
  };
}

export function cloneWorkbook(workbook) {
  return JSON.parse(JSON.stringify(workbook));
}
