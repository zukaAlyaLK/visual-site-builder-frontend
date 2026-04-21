import type { CanvasElement } from '../../types';

interface Props {
  element: CanvasElement;
  selected: boolean;
  onSelect: () => void;
}

export function CardElement({ element, selected, onSelect }: Props) {
  const { content, style } = element;
  const cards = (content.cards && content.cards.length > 0)
    ? content.cards
    : [{ title: content.title, text: content.text, imageUrl: style.imageUrl }];
  const isMulti = cards.length > 1;
  return (
    <div
      onClick={onSelect}
      style={{
        backgroundColor: isMulti ? 'transparent' : style.backgroundColor || '#fff',
        border: isMulti ? '1px solid transparent' : (style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || '#e2e8f0'}` : '1px solid transparent'),
        borderRadius: style.borderRadius !== undefined ? `${style.borderRadius}px` : 16,
        overflow: 'hidden',
        outline: selected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        cursor: 'pointer',
        maxWidth: isMulti ? 960 : 360,
        margin: style.margin || '16px auto',
        boxShadow: isMulti ? 'none' : (style.boxShadow || '0 4px 20px rgba(0,0,0,0.06)'),
        opacity: style.opacity !== undefined ? style.opacity : 1,
        textAlign: style.textAlign || 'left',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = '#cbd5e1';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = style.boxShadow ? style.boxShadow : '0 8px 30px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = style.boxShadow || '0 4px 20px rgba(0,0,0,0.06)';
        }
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMulti ? 'repeat(auto-fit, minmax(220px, 1fr))' : '1fr',
          gap: isMulti ? 16 : 0,
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              backgroundColor: style.backgroundColor || '#fff',
              border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || '#e2e8f0'}` : '1px solid transparent',
              borderRadius: style.borderRadius !== undefined ? `${style.borderRadius}px` : 16,
              overflow: 'hidden',
              boxShadow: style.boxShadow || '0 4px 20px rgba(0,0,0,0.06)',
              textAlign: style.textAlign || 'left',
            }}
          >
            {card.imageUrl && (
              <img src={card.imageUrl} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
            )}
            <div style={{ padding: style.padding || '24px', textAlign: style.textAlign || 'left' }}>
              <h3 style={{ color: style.color || '#0f172a', fontSize: style.fontSize || 20, fontWeight: style.fontWeight === 'bold' ? 700 : 500, margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                {card.title || 'Карточка'}
              </h3>
              <p style={{ color: '#64748b', margin: 0, lineHeight: 1.5, fontSize: 15 }}>{card.text || 'Описание'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
