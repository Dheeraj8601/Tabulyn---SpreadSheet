import { memo } from 'react';

function Cell({
  cellId,
  value,
  displayValue,
  format,
  isActive,
  isEditing,
  onActivate,
  onDoubleClick,
  onChange,
  onBlur,
  onKeyDown,
}) {
  const style = {
    fontWeight: format?.bold ? 700 : 400,
    fontStyle: format?.italic ? 'italic' : 'normal',
    textDecoration: format?.underline ? 'underline' : 'none',
    textAlign: format?.align || 'left',
    fontSize: format?.fontSize ? `${format.fontSize}px` : undefined,
    color: format?.textColor || undefined,
    backgroundColor: format?.backgroundColor || undefined,
  };

  return (
    <td
      className={`sheet-cell ${isActive ? 'active' : ''}`}
      style={style}
      onMouseDown={(e) => {
        e.preventDefault();
        onActivate();
      }}
      onDoubleClick={onDoubleClick}
      role="gridcell"
      aria-selected={isActive}
      aria-label={`Cell ${cellId}`}
    >
      {isEditing ? (
        <input
          autoFocus
          className="cell-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          aria-label={`Edit ${cellId}`}
        />
      ) : (
        <span className="cell-content">{displayValue}</span>
      )}
    </td>
  );
}

export default memo(Cell);
