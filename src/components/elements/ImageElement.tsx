import type { CanvasElement } from '../../types';

interface Props {
  element: CanvasElement;
  selected: boolean;
  onSelect: () => void;
}

export function ImageElement({ element, selected, onSelect }: Props) {
  const { style } = element;
  return (
    <div
      onClick={onSelect}
      style={{
        padding: style.padding || '8px',
        outline: selected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        cursor: 'pointer',
        backgroundColor: style.backgroundColor,
        border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || '#e2e8f0'}` : '1px solid transparent',
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
      <img
        src={style.imageUrl || 'https://placehold.co/800x400?text=Image'}
        alt=""
        style={{
          width: style.width || '100%',
          height: style.height || 'auto',
          display: 'block',
          margin: style.textAlign === 'center' ? '0 auto' : style.textAlign === 'right' ? '0 0 0 auto' : '0',
          borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
          objectFit: style.objectFit || 'cover',
        }}
      />
    </div>
  );
}
