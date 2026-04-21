import { useDraggable } from '@dnd-kit/core';
import { 
  Type, Image as ImageIcon, MousePointer2, CreditCard, 
  Menu, Star, Mail, LayoutTemplate, Minus, Columns
} from 'lucide-react';
import type { ElementType } from '../../types';

interface ComponentItem {
  type: ElementType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const COMPONENTS: ComponentItem[] = [
  { type: 'header', label: 'Header', icon: <Menu size={20} />, description: 'Навигационная шапка' },
  { type: 'hero', label: 'Hero', icon: <Star size={20} />, description: 'Главный баннер' },
  { type: 'text', label: 'Text', icon: <Type size={20} />, description: 'Текстовый блок' },
  { type: 'image', label: 'Image', icon: <ImageIcon size={20} />, description: 'Изображение' },
  { type: 'button', label: 'Button', icon: <MousePointer2 size={20} />, description: 'Кнопка с ссылкой' },
  { type: 'card', label: 'Card', icon: <CreditCard size={20} />, description: 'Карточка контента' },
  { type: 'form', label: 'Form', icon: <Mail size={20} />, description: 'Форма обратной связи' },
  { type: 'footer', label: 'Footer', icon: <LayoutTemplate size={20} />, description: 'Подвал сайта' },
  { type: 'divider', label: 'Divider', icon: <Minus size={20} />, description: 'Разделитель' },
  { type: 'columns', label: 'Columns', icon: <Columns size={20} />, description: 'Колонки' },
];

function DraggableComponent({ item }: { item: ComponentItem }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${item.type}`,
    data: { isNewComponent: true, componentType: item.type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px',
        borderRadius: 10,
        border: '1px solid #e2e8f0',
        background: isDragging ? '#f8fafc' : '#fff',
        cursor: 'grab',
        userSelect: 'none',
        opacity: isDragging ? 0.5 : 1,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.08)' : '0 1px 2px rgba(0,0,0,0.02)',
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#cbd5e1';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
        }
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: 36, 
        height: 36, 
        background: '#f1f5f9',
        borderRadius: 8,
        color: '#6366f1'
      }}>
        {item.icon}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{item.label}</div>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>{item.description}</div>
      </div>
    </div>
  );
}

export function ComponentPanel() {
  return (
    <div
      style={{
        width: 256,
        minWidth: 256,
        background: '#fff',
        borderRight: '1px solid #e2e8f0',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '16px 16px 8px', borderBottom: '1px solid #f1f5f9' }}>
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Компоненты
        </h3>
      </div>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {COMPONENTS.map((item) => (
          <DraggableComponent key={item.type} item={item} />
        ))}
      </div>
    </div>
  );
}
