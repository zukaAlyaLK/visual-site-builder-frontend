import type { CanvasElement } from '../../types';

interface Props {
  element: CanvasElement;
  selected: boolean;
  onSelect: () => void;
}

export function FormElement({ element, selected, onSelect }: Props) {
  const { content, style } = element;
  return (
    <div
      onClick={onSelect}
      style={{
        backgroundColor: style.backgroundColor || '#ffffff',
        padding: style.padding || '48px',
        border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || '#e2e8f0'}` : '1px solid transparent',
        outline: selected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        cursor: 'pointer',
        borderRadius: style.borderRadius !== undefined ? `${style.borderRadius}px` : 24,
        margin: style.margin || '40px auto',
        maxWidth: 600,
        boxShadow: style.boxShadow || '0 10px 40px -10px rgba(0,0,0,0.08)',
        opacity: style.opacity !== undefined ? style.opacity : 1,
        textAlign: style.textAlign || 'left',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <div style={{ textAlign: style.textAlign === 'left' ? 'left' : style.textAlign === 'right' ? 'right' : 'center', marginBottom: 32 }}>
        <h2 style={{ color: style.color || '#0f172a', fontSize: style.fontSize || 32, fontWeight: style.fontWeight === 'bold' ? 800 : 500, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          {content.title || 'Готовы начать?'}
        </h2>
        {content.subtitle && (
          <p style={{ color: '#64748b', fontSize: 16, margin: 0 }}>{content.subtitle}</p>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          readOnly
          placeholder="Ваше имя"
          style={{ padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: style.fontSize ? Math.max(12, style.fontSize - 4) : 15, backgroundColor: '#f8fafc', outline: 'none' }}
        />
        <input
          readOnly
          placeholder="Email адрес"
          style={{ padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: style.fontSize ? Math.max(12, style.fontSize - 4) : 15, backgroundColor: '#f8fafc', outline: 'none' }}
        />
        <textarea
          readOnly
          placeholder="Как мы можем вам помочь?"
          rows={4}
          style={{ padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: style.fontSize ? Math.max(12, style.fontSize - 4) : 15, backgroundColor: '#f8fafc', resize: 'none', outline: 'none' }}
        />
        <button
          style={{
            backgroundColor: style.color || '#6366f1',
            color: '#fff',
            border: 'none',
            padding: '16px',
            borderRadius: 12,
            fontSize: style.fontSize ? Math.max(14, style.fontSize - 2) : 16,
            fontWeight: style.fontWeight === 'bold' ? 700 : 600,
            cursor: 'pointer',
            marginTop: 8,
            transition: 'background 0.2s',
            boxShadow: '0 4px 12px rgba(99,102,241,0.2)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {content.buttonText || 'Отправить'}
        </button>
      </div>
    </div>
  );
}
