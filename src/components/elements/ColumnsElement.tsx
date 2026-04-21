import type { CanvasElement } from '../../types';

interface Props {
  element: CanvasElement;
  selected: boolean;
  onSelect: () => void;
}

export function ColumnsElement({ element, selected, onSelect }: Props) {
  const { content, style } = element;
  const columns = content.columns || [[], []];
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex',
        gap: style.padding || '24px',
        padding: style.padding || '24px',
        backgroundColor: style.backgroundColor,
        border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || '#e2e8f0'}` : undefined,
        outline: selected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        cursor: 'pointer',
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
        margin: style.margin,
        opacity: style.opacity !== undefined ? style.opacity : 1,
        boxShadow: style.boxShadow,
        textAlign: style.textAlign,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      {columns.map((col, i) => (
        <div
          key={i}
          style={{
            minHeight: 80,
            background: '#f1f5f9',
            borderRadius: 8,
            padding: 12,
            border: '1px dashed #cbd5e1',
          }}
        >
          {col.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', margin: 0, fontSize: 13 }}>
              Колонка {i + 1}
            </p>
          ) : (
            col.map((child) => (
              <div key={child.id} style={{ marginBottom: 8 }}>
                {child.content.text || child.content.title || child.type}
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
