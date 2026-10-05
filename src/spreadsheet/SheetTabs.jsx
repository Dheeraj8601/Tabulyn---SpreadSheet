export default function SheetTabs({
  sheets,
  activeSheetId,
  onSelect,
  onAdd,
  onRename,
  onDelete,
}) {
  return (
    <div className="sheet-tabs d-flex align-items-center gap-1 border-top bg-light px-2 py-1">
      {sheets.map((sheet) => (
        <button
          key={sheet.id}
          className={`btn btn-sm ${sheet.id === activeSheetId ? 'btn-light active-sheet-tab' : 'btn-link text-secondary'}`}
          onClick={() => onSelect(sheet.id)}
          onDoubleClick={() => onRename(sheet.id)}
          title="Double-click to rename"
        >
          {sheet.name}
        </button>
      ))}
      <button className="btn btn-sm btn-link text-decoration-none" onClick={onAdd} aria-label="Add sheet" title="Add sheet">＋</button>
      <button className="btn btn-sm btn-link text-danger text-decoration-none ms-auto" onClick={onDelete} disabled={sheets.length <= 1} title="Delete current sheet">
        Delete sheet
      </button>
    </div>
  );
}
