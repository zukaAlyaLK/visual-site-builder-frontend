import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import type { CanvasElement as CanvasElementType } from '../../types';
import { HeaderElement } from '../elements/HeaderElement';
import { HeroElement } from '../elements/HeroElement';
import { TextElement } from '../elements/TextElement';
import { ImageElement } from '../elements/ImageElement';
import { ButtonElement } from '../elements/ButtonElement';
import { CardElement } from '../elements/CardElement';
import { FormElement } from '../elements/FormElement';
import { FooterElement } from '../elements/FooterElement';
import { DividerElement } from '../elements/DividerElement';
import { ColumnsElement } from '../elements/ColumnsElement';
import { useCanvasStore } from '../../store/canvas.store';

interface Props {
  element: CanvasElementType;
}

export function CanvasElement({ element }: Props) {
  const { selectedId, selectElement, removeElement, duplicateElement } = useCanvasStore();
  const selected = selectedId === element.id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: element.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  const handleSelect = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    selectElement(element.id);
  };

  const elementProps = {
    element,
    selected,
    onSelect: handleSelect,
  };

  const renderElement = () => {
    switch (element.type) {
      case 'header': return <HeaderElement {...elementProps} />;
      case 'hero': return <HeroElement {...elementProps} />;
      case 'text': return <TextElement {...elementProps} />;
      case 'image': return <ImageElement {...elementProps} />;
      case 'button': return <ButtonElement {...elementProps} />;
      case 'card': return <CardElement {...elementProps} />;
      case 'form': return <FormElement {...elementProps} />;
      case 'footer': return <FooterElement {...elementProps} />;
      case 'divider': return <DividerElement {...elementProps} />;
      case 'columns': return <ColumnsElement {...elementProps} />;
      default: return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        style={{ position: 'relative', userSelect: 'none' }}
        onClick={handleSelect}
      >
        {selected && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1000,
              display: 'flex',
              gap: 4,
            }}
          >
            <button
              {...listeners}
              style={{
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
              }}
              title="Перетащить"
            >
              <GripVertical size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); duplicateElement(element.id); }}
              style={{
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(59,130,246,0.4)',
              }}
              title="Дублировать"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); removeElement(element.id); }}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
              }}
              title="Удалить"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
        {renderElement()}
      </div>
    </div>
  );
}
