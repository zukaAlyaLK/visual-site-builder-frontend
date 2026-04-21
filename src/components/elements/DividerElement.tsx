import type { CanvasElement } from '../../types';

interface Props {
  element: CanvasElement;
  selected: boolean;
  onSelect: () => void;
}

export function DividerElement({ element, selected, onSelect }: Props) {
  const { style } = element;
  return (
    <div
      onClick={onSelect}
      style={{
        padding: style.padding || '24px 0',
        outline: selected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        cursor: 'pointer',
        backgroundColor: style.backgroundColor,
        margin: style.margin,
        opacity: style.opacity !== undefined ? style.opacity : 1,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.outline = '1px dashed #cbd5e1';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.outline = 'none';
      }}
    >
      <hr
        style={{
          border: 'none',
          borderTop: `${style.borderWidth || 1}px solid ${style.borderColor || '#e2e8f0'}`,
          margin: 0,
        }}
      />
    </div>
  );
}
