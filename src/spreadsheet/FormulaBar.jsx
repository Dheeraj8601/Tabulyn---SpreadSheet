export default function FormulaBar({ activeCell, value, onChange, onCommit }) {
  return (
    <div className="formula-bar d-flex align-items-center border-top border-bottom bg-white">
      <div className="cell-address px-3 py-2 small fw-semibold">{activeCell}</div>
      <div className="formula-symbol px-2 text-secondary" aria-hidden="true">fx</div>
      <input
        className="form-control border-0 rounded-0 shadow-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onCommit();
          }
        }}
        onBlur={onCommit}
        aria-label={`Formula or value for ${activeCell}`}
      />
    </div>
  );
}
