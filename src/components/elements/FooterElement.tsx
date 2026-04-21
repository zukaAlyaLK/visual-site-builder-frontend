import type { CanvasElement } from '../../types';

interface Props {
  element: CanvasElement;
  selected: boolean;
  onSelect: () => void;
}

export function FooterElement({ element, selected, onSelect }: Props) {
  const { content, style } = element;
  return (
    <footer
      onClick={onSelect}
      style={{
        backgroundColor: style.backgroundColor || '#0f172a',
        color: style.color || '#94a3b8',
        padding: style.padding || '40px',
        textAlign: style.textAlign || 'center',
        border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || '#e2e8f0'}` : '1px solid transparent',
        outline: selected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        cursor: 'pointer',
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
        margin: style.margin,
        opacity: style.opacity !== undefined ? style.opacity : 1,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#475569';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ color: style.color || '#fff', fontWeight: 700, fontSize: style.fontSize ? style.fontSize + 6 : 20 }}>MyBrand</div>
        <div style={{ display: 'flex', gap: 24, justifyContent: style.textAlign === 'left' ? 'flex-start' : style.textAlign === 'right' ? 'flex-end' : 'center', margin: '12px 0' }}>
          <a href="#" style={{ color: style.color ? `${style.color}cc` : '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: style.fontSize || 14 }} onMouseEnter={(e) => (e.currentTarget.style.color = style.color || '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = style.color ? `${style.color}cc` : '#94a3b8')}>Условия</a>
          <a href="#" style={{ color: style.color ? `${style.color}cc` : '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: style.fontSize || 14 }} onMouseEnter={(e) => (e.currentTarget.style.color = style.color || '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = style.color ? `${style.color}cc` : '#94a3b8')}>Конфиденциальность</a>
          <a href="#" style={{ color: style.color ? `${style.color}cc` : '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: style.fontSize || 14 }} onMouseEnter={(e) => (e.currentTarget.style.color = style.color || '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = style.color ? `${style.color}cc` : '#94a3b8')}>Контакты</a>
        </div>
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 24, fontSize: style.fontSize ? style.fontSize - 1 : 13, color: style.color ? `${style.color}99` : '#64748b' }}>
          {content.text || '© 2025 Мой сайт'}
        </div>
      </div>
    </footer>
  );
}
