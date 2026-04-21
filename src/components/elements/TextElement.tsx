import type { CanvasElement } from '../../types';

interface Props {
  element: CanvasElement;
  selected: boolean;
  onSelect: () => void;
}

export function TextElement({ element, selected, onSelect }: Props) {
  const { content, style } = element;
  return (
    <div
      onClick={onSelect}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color || '#1e293b',
        fontSize: style.fontSize || 16,
        fontWeight: style.fontWeight === 'bold' ? 700 : 400,
        padding: style.padding || '16px 24px',
        border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || '#e2e8f0'}` : '1px solid transparent',
        outline: selected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        cursor: 'pointer',
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
        margin: style.margin,
        textAlign: style.textAlign || 'left',
        opacity: style.opacity !== undefined ? style.opacity : 1,
        boxShadow: style.boxShadow,
        lineHeight: 1.6,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      {content.text || 'Введите текст здесь'}
    </div>
  );
}
