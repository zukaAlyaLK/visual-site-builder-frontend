import type { CanvasElement } from '../../types';

interface Props {
  element: CanvasElement;
  selected: boolean;
  onSelect: () => void;
}

export function HeaderElement({ element, selected, onSelect }: Props) {
  const { content, style } = element;
  return (
    <header
      onClick={onSelect}
      style={{
        backgroundColor: style.backgroundColor || '#ffffff',
        padding: style.padding || '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: style.borderWidth === 0 && !selected ? '1px solid #e2e8f0' : undefined,
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
        if (!selected) e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {content.logoImageUrl ? (
          <img src={content.logoImageUrl} alt="Logo" style={{ maxHeight: 40, objectFit: 'contain' }} />
        ) : (
          <div style={{ color: style.color || '#0f172a', fontWeight: 800, fontSize: style.fontSize || 24, letterSpacing: '-0.02em' }}>
            {content.logoText || 'Logo'}
          </div>
        )}
      </div>
      <nav style={{ display: 'flex', gap: 24 }}>
        {(content.navLinks || ['Главная', 'О нас']).map((link, i) => (
          <a key={i} href="#" style={{ color: style.color ? `${style.color}cc` : '#64748b', textDecoration: 'none', fontWeight: 500, fontSize: style.fontSize ? Math.max(12, style.fontSize - 8) : 15, transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = style.color || '#0f172a')} onMouseLeave={(e) => (e.currentTarget.style.color = style.color ? `${style.color}cc` : '#64748b')}>
            {link}
          </a>
        ))}
      </nav>
    </header>
  );
}
