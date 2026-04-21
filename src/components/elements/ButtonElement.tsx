import type { CanvasElement } from '../../types';

interface Props {
  element: CanvasElement;
  selected: boolean;
  onSelect: () => void;
}

export function ButtonElement({ element, selected, onSelect }: Props) {
  const { content, style } = element;
  return (
    <div
      onClick={onSelect}
      style={{
        padding: style.padding || '16px 24px',
        outline: selected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        cursor: 'pointer',
        backgroundColor: style.backgroundColor,
        border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || '#e2e8f0'}` : '1px solid transparent',
        display: 'flex',
        justifyContent: style.textAlign === 'left' ? 'flex-start' : style.textAlign === 'right' ? 'flex-end' : 'center',
        margin: style.margin,
        opacity: style.opacity !== undefined ? style.opacity : 1,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <button
        style={{
          backgroundColor: style.backgroundColor || '#6366f1',
          color: style.color || '#fff',
          border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || '#6366f1'}` : 'none',
          padding: '14px 28px',
          width: style.width,
          height: style.height,
          borderRadius: style.borderRadius !== undefined ? `${style.borderRadius}px` : 12,
          fontSize: style.fontSize || 16,
          fontWeight: style.fontWeight || 600,
          cursor: 'pointer',
          transition: 'transform 0.1s, box-shadow 0.2s',
          boxShadow: style.boxShadow || '0 4px 12px rgba(99,102,241,0.15)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = style.boxShadow || '0 6px 16px rgba(99,102,241,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = style.boxShadow || '0 4px 12px rgba(99,102,241,0.15)';
        }}
      >
        {content.buttonText || 'Кнопка'}
      </button>
    </div>
  );
}
