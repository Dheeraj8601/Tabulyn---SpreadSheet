import Cell from './Cell';
import { cellKey, columnIndexToLabel } from '../utils/cellUtils';

export default function SpreadsheetGrid({
  sheet,
  active,
  editingKey,
  getCell,
  getDisplayValue,
  onActivate,
  onStartEdit,
  onChangeCell,
  onCommitEdit,
  onGridKeyDown,
}) {
  const rows = Array.from({ length: sheet.rows }, (_, i) => i);
  const cols = Array.from({ length: sheet.cols }, (_, i) => i);

  return (
    <div
      className="sheet-grid-wrap"
      tabIndex={0}
      onKeyDown={onGridKeyDown}
      role="grid"
      aria-label={`${sheet.name} spreadsheet`}
      aria-rowcount={sheet.rows}
      aria-colcount={sheet.cols}
    >
      <table className="sheet-grid">
        <thead>
          <tr>
            <th className="corner-cell" aria-hidden="true" />
            {cols.map((col) => (
              <th key={col} className="column-header" scope="col">{columnIndexToLabel(col)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <th className="row-header" scope="row">{row + 1}</th>
              {cols.map((col) => {
                const key = cellKey(row, col);
                const cell = getCell(row, col);
                return (
                  <Cell
                    key={key}
                    cellId={key}
                    value={cell.value || ''}
                    displayValue={getDisplayValue(row, col)}
                    format={cell.format || {}}
                    isActive={active.row === row && active.col === col}
                    isEditing={editingKey === key}
                    onActivate={() => onActivate(row, col)}
                    onDoubleClick={() => onStartEdit(row, col)}
                    onChange={(value) => onChangeCell(row, col, value)}
                    onBlur={onCommitEdit}
                    onKeyDown={onGridKeyDown}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
