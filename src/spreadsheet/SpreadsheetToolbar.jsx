export default function SpreadsheetToolbar({
  canUndo,
  canRedo,
  format,
  onUndo,
  onRedo,
  onNew,
  onImport,
  onSave,
  onExportCsv,
  onExportXlsx,
  onAddRow,
  onDeleteRow,
  onAddColumn,
  onDeleteColumn,
  onClear,
  onFormat,
}) {
  return (
    <div className="sheet-toolbar p-2 border-bottom bg-white d-flex flex-wrap gap-2 align-items-center" role="toolbar" aria-label="Spreadsheet toolbar">
      <button className="btn btn-sm btn-outline-secondary" onClick={onNew} title="Create a new workbook">New</button>
      <button className="btn btn-sm btn-outline-secondary" onClick={onImport} title="Import CSV or Excel">Import</button>
      <button className="btn btn-sm btn-outline-secondary" onClick={onSave} title="Save workbook to this browser">Save</button>
      <div className="vr mx-1" />
      <button className="btn btn-sm btn-outline-secondary" onClick={onUndo} disabled={!canUndo} title="Undo">Undo</button>
      <button className="btn btn-sm btn-outline-secondary" onClick={onRedo} disabled={!canRedo} title="Redo">Redo</button>
      <div className="vr mx-1" />
      <button className={`btn btn-sm ${format?.bold ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => onFormat('bold', !format?.bold)} title="Bold"><strong>B</strong></button>
      <button className={`btn btn-sm ${format?.italic ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => onFormat('italic', !format?.italic)} title="Italic"><em>I</em></button>
      <button className={`btn btn-sm ${format?.underline ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => onFormat('underline', !format?.underline)} title="Underline"><u>U</u></button>
      <select
        className="form-select form-select-sm toolbar-select"
        value={format?.align || 'left'}
        onChange={(e) => onFormat('align', e.target.value)}
        aria-label="Text alignment"
        title="Text alignment"
      >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>
      <select
        className="form-select form-select-sm toolbar-select"
        value={format?.fontSize || 14}
        onChange={(e) => onFormat('fontSize', Number(e.target.value))}
        aria-label="Font size"
        title="Font size"
      >
        {[11,12,14,16,18,20,24].map((size) => <option key={size} value={size}>{size}px</option>)}
      </select>
      <label className="color-tool" title="Text color">
        <span className="small">Text</span>
        <input type="color" value={format?.textColor || '#1f2937'} onChange={(e) => onFormat('textColor', e.target.value)} aria-label="Text color" />
      </label>
      <label className="color-tool" title="Cell background color">
        <span className="small">Fill</span>
        <input type="color" value={format?.backgroundColor || '#ffffff'} onChange={(e) => onFormat('backgroundColor', e.target.value)} aria-label="Cell background color" />
      </label>
      <div className="vr mx-1" />
      <div className="dropdown d-inline-block">
        <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" onClick={(e) => e.currentTarget.nextElementSibling?.classList.toggle('show')}>
          Rows / Columns
        </button>
        <div className="dropdown-menu p-2">
          <button className="dropdown-item" onClick={onAddRow}>Add row</button>
          <button className="dropdown-item" onClick={onDeleteRow}>Delete row</button>
          <button className="dropdown-item" onClick={onAddColumn}>Add column</button>
          <button className="dropdown-item" onClick={onDeleteColumn}>Delete column</button>
        </div>
      </div>
      <button className="btn btn-sm btn-outline-danger" onClick={onClear} title="Clear current sheet">Clear</button>
      <div className="ms-lg-auto d-flex gap-2">
        <button className="btn btn-sm btn-outline-primary" onClick={onExportCsv}>Download CSV</button>
        <button className="btn btn-sm btn-primary" onClick={onExportXlsx}>Download XLSX</button>
      </div>
    </div>
  );
}
