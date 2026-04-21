import type { CanvasElement } from '../../types';

interface Props {
  element: CanvasElement;
  selected: boolean;
  onSelect: () => void;
}

export function HeroElement({ element, selected, onSelect }: Props) {
  const { content, style } = element;
  return (
    <section
      onClick={onSelect}
      style={{
        backgroundColor: style.backgroundColor || '#f8fafc',
        padding: style.padding || '100px 40px',
        border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || '#e2e8f0'}` : '1px solid transparent',
        outline: selected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        cursor: 'pointer',
        textAlign: style.textAlign || 'center',
        borderRadius: style.borderRadius !== undefined ? `${style.borderRadius}px` : '24px',
        margin: style.margin || '20px',
        opacity: style.opacity !== undefined ? style.opacity : 1,
        boxShadow: style.boxShadow,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ color: style.color || '#0f172a', fontSize: style.fontSize || 56, fontWeight: style.fontWeight === 'bold' ? 800 : 600, margin: '0 0 24px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          {content.title || 'Заголовок'}
        </h1>
        {content.subtitle && (
          <p style={{ color: '#64748b', fontSize: 20, margin: '0 0 40px', lineHeight: 1.6 }}>{content.subtitle}</p>
        )}
        {content.buttonText && (
          <button
            style={{
              backgroundColor: '#6366f1',
              color: '#fff',
              border: 'none',
              padding: '16px 36px',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
              boxShadow: '0 4px 14px rgba(99,102,241,0.2)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#4f46e5')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#6366f1')}
          >
            {content.buttonText}
          </button>
        )}
      </div>
    </section>
  );
}
