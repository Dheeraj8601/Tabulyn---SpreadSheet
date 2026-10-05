import { useMemo, useRef, useState } from 'react';
import SpreadsheetToolbar from './SpreadsheetToolbar';
import FormulaBar from './FormulaBar';
import SpreadsheetGrid from './SpreadsheetGrid';
import SheetTabs from './SheetTabs';
import useDebouncedEffect from '../hooks/useDebouncedEffect';
import { loadWorkbook, saveWorkbook, clearStoredWorkbook } from '../services/spreadsheetStorage';
import { cellKey, cloneWorkbook, makeEmptySheet, parseCellKey } from '../utils/cellUtils';
import { evaluateFormula } from '../utils/formulaEngine';
import { exportCsv, exportXlsx, importSpreadsheetFile, matrixToCells } from '../utils/fileIO';

function createInitialWorkbook() {
  const stored = loadWorkbook();
  if (stored) return stored;
  const first = makeEmptySheet('Sheet1');
  return {
    name: 'Untitled Spreadsheet',
    activeSheetId: first.id,
    sheets: [first],
    updatedAt: new Date().toISOString()
  };
}

export default function Spreadsheet() {
  const [workbook, setWorkbook] = useState(createInitialWorkbook);
  const [active, setActive] = useState({ row: 0, col: 0 });
  const [editingKey, setEditingKey] = useState(null);
  const [formulaInput, setFormulaInput] = useState('');
  const [status, setStatus] = useState('Saved locally');
  const [message, setMessage] = useState(null);
  const historyRef = useRef({ past: [], future: [] });
  const fileInputRef = useRef(null);

  const sheet = workbook.sheets.find((s) => s.id === workbook.activeSheetId) || workbook.sheets[0];

  const getCellFromSheet = (targetSheet, row, col) => targetSheet.cells[cellKey(row, col)] || { value: '', format: {} };
  const getCell = (row, col) => getCellFromSheet(sheet, row, col);

  function resolveCellValue(targetSheet, row, col, stack = new Set()) {
    const key = cellKey(row, col);
    const cell = getCellFromSheet(targetSheet, row, col);
    const raw = cell.value ?? '';
    if (typeof raw !== 'string' || !raw.startsWith('=')) return raw;

    if (stack.has(key)) return '#CYCLE!';
    const nextStack = new Set(stack);
    nextStack.add(key);

    return evaluateFormula(raw, (ref) => {
      if (typeof ref === 'string') {
        const parsed = parseCellKey(ref);
        if (!parsed || parsed.row >= targetSheet.rows || parsed.col >= targetSheet.cols) return 0;
        return resolveCellValue(targetSheet, parsed.row, parsed.col, nextStack);
      }
      return resolveCellValue(targetSheet, ref.row, ref.col, nextStack);
    });
  }

  const displayValue = (row, col) => resolveCellValue(sheet, row, col);
  const activeKey = cellKey(active.row, active.col);
  const activeCell = getCell(active.row, active.col);

  function recordHistory() {
    historyRef.current.past.push(cloneWorkbook(workbook));
    if (historyRef.current.past.length > 60) historyRef.current.past.shift();
    historyRef.current.future = [];
  }

  function updateWorkbook(mutator, { history = true } = {}) {
    if (history) recordHistory();
    setStatus('Saving...');
    setWorkbook((current) => {
      const next = cloneWorkbook(current);
      mutator(next);
      next.updatedAt = new Date().toISOString();
      return next;
    });
  }

  useDebouncedEffect(() => {
    const result = saveWorkbook(workbook);
    setStatus(result.ok ? 'Saved locally' : 'Local save failed');
    if (!result.ok) setMessage({ type: 'danger', text: result.error });
  }, [workbook], 600);

  function syncFormulaFromActive(row = active.row, col = active.col) {
    setFormulaInput(getCell(row, col).value || '');
  }

  function changeCell(row, col, value) {
    updateWorkbook((next) => {
      const target = next.sheets.find((s) => s.id === next.activeSheetId);
      const key = cellKey(row, col);
      const previous = target.cells[key] || { value: '', format: {} };
      target.cells[key] = { ...previous, value };
    });
    if (row === active.row && col === active.col) setFormulaInput(value);
  }

  function applyFormat(prop, value) {
    updateWorkbook((next) => {
      const target = next.sheets.find((s) => s.id === next.activeSheetId);
      const key = activeKey;
      const previous = target.cells[key] || { value: '', format: {} };
      target.cells[key] = {
        ...previous,
        format: { ...(previous.format || {}), [prop]: value }
      };
    });
  }

  function activate(row, col) {
    setActive({ row, col });
    setEditingKey(null);
    setFormulaInput(getCell(row, col).value || '');
  }

  function commitFormulaBar() {
    const current = getCell(active.row, active.col).value || '';
    if (formulaInput !== current) changeCell(active.row, active.col, formulaInput);
  }

  function startEdit(row, col) {
    activate(row, col);
    setEditingKey(cellKey(row, col));
  }

  function onGridKeyDown(e) {
    if (editingKey) {
      if (e.key === 'Enter') {
        e.preventDefault();
        setEditingKey(null);
        moveActive(1, 0);
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setEditingKey(null);
        syncFormulaFromActive();
      }
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      e.shiftKey ? redo() : undo();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      redo();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      navigator.clipboard?.writeText(String(displayValue(active.row, active.col) ?? ''));
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x') {
      e.preventDefault();
      navigator.clipboard?.writeText(String(displayValue(active.row, active.col) ?? ''));
      changeCell(active.row, active.col, '');
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      navigator.clipboard?.readText().then((text) => changeCell(active.row, active.col, text)).catch(() => {
        setMessage({ type: 'warning', text: 'Clipboard access is not available in this browser context.' });
      });
      return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      changeCell(active.row, active.col, '');
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      moveActive(1, 0);
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      moveActive(0, e.shiftKey ? -1 : 1);
      return;
    }
    if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1, 0); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1, 0); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); moveActive(0, -1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); moveActive(0, 1); return; }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      changeCell(active.row, active.col, e.key);
      setEditingKey(activeKey);
    }
  }

  function moveActive(dr, dc) {
    const row = Math.max(0, Math.min(sheet.rows - 1, active.row + dr));
    const col = Math.max(0, Math.min(sheet.cols - 1, active.col + dc));
    activate(row, col);
  }

  function undo() {
    const previous = historyRef.current.past.pop();
    if (!previous) return;
    historyRef.current.future.push(cloneWorkbook(workbook));
    setWorkbook(previous);
    setStatus('Saving...');
  }

  function redo() {
    const next = historyRef.current.future.pop();
    if (!next) return;
    historyRef.current.past.push(cloneWorkbook(workbook));
    setWorkbook(next);
    setStatus('Saving...');
  }


  function manualSave() {
    const result = saveWorkbook(workbook);
    setStatus(result.ok ? 'Saved locally' : 'Local save failed');
    setMessage(
      result.ok
        ? { type: 'success', text: 'Workbook saved to this browser.' }
        : { type: 'danger', text: result.error || 'Unable to save locally.' }
    );
  }

  function newWorkbook() {
    if (!window.confirm('Create a new workbook? Download anything you need first.')) return;
    recordHistory();
    const first = makeEmptySheet('Sheet1');
    const next = {
      name: 'Untitled Spreadsheet',
      activeSheetId: first.id,
      sheets: [first],
      updatedAt: new Date().toISOString()
    };
    clearStoredWorkbook();
    setWorkbook(next);
    setActive({ row: 0, col: 0 });
    setFormulaInput('');
    setStatus('Saving...');
  }

  async function handleImport(file) {
    try {
      const imported = await importSpreadsheetFile(file);
      recordHistory();
      const sheets = imported.map((entry, i) => {
        const rows = Math.max(40, entry.data.length || 1);
        const maxCols = Math.max(16, ...entry.data.map((r) => r.length), 1);
        const newSheet = makeEmptySheet(entry.name || `Sheet${i + 1}`, rows, maxCols);
        newSheet.cells = matrixToCells(entry.data);
        return newSheet;
      });
      setWorkbook((current) => ({
        ...current,
        name: file.name.replace(/\.(csv|xlsx|xls)$/i, '') || current.name,
        activeSheetId: sheets[0].id,
        sheets,
        updatedAt: new Date().toISOString()
      }));
      setActive({ row: 0, col: 0 });
      setFormulaInput('');
      setMessage({ type: 'success', text: `Imported ${file.name} successfully.` });
    } catch (error) {
      setMessage({ type: 'danger', text: error instanceof Error ? error.message : 'Import failed.' });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function addRow() {
    updateWorkbook((next) => {
      next.sheets.find((s) => s.id === next.activeSheetId).rows += 1;
    });
  }

  function deleteRow() {
    if (sheet.rows <= 1) return;
    updateWorkbook((next) => {
      const target = next.sheets.find((s) => s.id === next.activeSheetId);
      const rowToDelete = active.row;
      const newCells = {};
      Object.entries(target.cells).forEach(([key, cell]) => {
        const parsed = parseCellKey(key);
        if (!parsed || parsed.row === rowToDelete) return;
        const newRow = parsed.row > rowToDelete ? parsed.row - 1 : parsed.row;
        newCells[cellKey(newRow, parsed.col)] = cell;
      });
      target.rows -= 1;
      target.cells = newCells;
    });
    setActive((a) => ({ ...a, row: Math.max(0, Math.min(a.row, sheet.rows - 2)) }));
  }

  function addColumn() {
    updateWorkbook((next) => {
      next.sheets.find((s) => s.id === next.activeSheetId).cols += 1;
    });
  }

  function deleteColumn() {
    if (sheet.cols <= 1) return;
    updateWorkbook((next) => {
      const target = next.sheets.find((s) => s.id === next.activeSheetId);
      const colToDelete = active.col;
      const newCells = {};
      Object.entries(target.cells).forEach(([key, cell]) => {
        const parsed = parseCellKey(key);
        if (!parsed || parsed.col === colToDelete) return;
        const newCol = parsed.col > colToDelete ? parsed.col - 1 : parsed.col;
        newCells[cellKey(parsed.row, newCol)] = cell;
      });
      target.cols -= 1;
      target.cells = newCells;
    });
    setActive((a) => ({ ...a, col: Math.max(0, Math.min(a.col, sheet.cols - 2)) }));
  }

  function clearSheet() {
    if (!window.confirm('Clear all values and formatting from this sheet?')) return;
    updateWorkbook((next) => {
      next.sheets.find((s) => s.id === next.activeSheetId).cells = {};
    });
    setFormulaInput('');
  }

  function addSheet() {
    updateWorkbook((next) => {
      const newSheet = makeEmptySheet(`Sheet${next.sheets.length + 1}`);
      next.sheets.push(newSheet);
      next.activeSheetId = newSheet.id;
    });
    setActive({ row: 0, col: 0 });
    setFormulaInput('');
  }

  function renameSheet(id) {
    const target = workbook.sheets.find((s) => s.id === id);
    const name = window.prompt('Rename sheet', target?.name || '');
    if (!name?.trim()) return;
    updateWorkbook((next) => {
      const s = next.sheets.find((x) => x.id === id);
      s.name = name.trim().slice(0, 31);
    });
  }

  function deleteSheet() {
    if (workbook.sheets.length <= 1) return;
    if (!window.confirm(`Delete ${sheet.name}?`)) return;
    updateWorkbook((next) => {
      const idx = next.sheets.findIndex((s) => s.id === next.activeSheetId);
      next.sheets.splice(idx, 1);
      next.activeSheetId = next.sheets[Math.max(0, idx - 1)].id;
    });
    setActive({ row: 0, col: 0 });
    setFormulaInput('');
  }

  const currentFormat = useMemo(() => activeCell.format || {}, [activeCell.format]);

  return (
    <section className="spreadsheet-app" aria-label="Tabulyn spreadsheet editor">
      {message && (
        <div className={`alert alert-${message.type} alert-dismissible m-2 mb-0`} role="alert">
          {message.text}
          <button className="btn-close" aria-label="Close" onClick={() => setMessage(null)} />
        </div>
      )}

      <div className="workbook-titlebar px-3 py-2 bg-light border-bottom d-flex flex-wrap gap-2 align-items-center">
        <input
          className="workbook-name form-control form-control-sm"
          value={workbook.name}
          onChange={(e) => updateWorkbook((next) => { next.name = e.target.value; }, { history: false })}
          aria-label="Spreadsheet name"
        />
        <span className="small text-secondary ms-auto">{status}</span>
      </div>

      <SpreadsheetToolbar
        canUndo={historyRef.current.past.length > 0}
        canRedo={historyRef.current.future.length > 0}
        format={currentFormat}
        onUndo={undo}
        onRedo={redo}
        onNew={newWorkbook}
        onImport={() => fileInputRef.current?.click()}
        onSave={manualSave}
        onExportCsv={() => exportCsv(workbook.name, sheet, displayValue)}
        onExportXlsx={() => exportXlsx(workbook.name, workbook.sheets, resolveCellValue)}
        onAddRow={addRow}
        onDeleteRow={deleteRow}
        onAddColumn={addColumn}
        onDeleteColumn={deleteColumn}
        onClear={clearSheet}
        onFormat={applyFormat}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        hidden
        onChange={(e) => handleImport(e.target.files?.[0])}
      />

      <FormulaBar
        activeCell={activeKey}
        value={formulaInput}
        onChange={setFormulaInput}
        onCommit={commitFormulaBar}
      />

      <SpreadsheetGrid
        sheet={sheet}
        active={active}
        editingKey={editingKey}
        getCell={getCell}
        getDisplayValue={displayValue}
        onActivate={activate}
        onStartEdit={startEdit}
        onChangeCell={changeCell}
        onCommitEdit={() => setEditingKey(null)}
        onGridKeyDown={onGridKeyDown}
      />

      <SheetTabs
        sheets={workbook.sheets}
        activeSheetId={workbook.activeSheetId}
        onSelect={(id) => {
          updateWorkbook((next) => { next.activeSheetId = id; }, { history: false });
          setActive({ row: 0, col: 0 });
          const nextSheet = workbook.sheets.find((s) => s.id === id);
          setFormulaInput(nextSheet?.cells.A1?.value || '');
        }}
        onAdd={addSheet}
        onRename={renameSheet}
        onDelete={deleteSheet}
      />
    </section>
  );
}
