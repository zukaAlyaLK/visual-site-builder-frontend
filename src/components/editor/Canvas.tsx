import { useCallback, useEffect, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCanvasStore } from '../../store/canvas.store';
import { Paintbrush } from 'lucide-react';
import { CanvasElement } from './CanvasElement';
import { CursorOverlay } from '../collab/CursorOverlay';
import { sendCursor } from '../../collab/socket';

interface Props {
  projectId: string;
}



export function Canvas({ projectId }: Props) {
  const { elements, selectElement } = useCanvasStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const { setNodeRef: setDropRef } = useDroppable({ id: 'canvas-drop' });
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  const flushCursor = useCallback(() => {
    if (!lastPosRef.current) return;
    sendCursor(projectId, lastPosRef.current.x, lastPosRef.current.y);
    rafRef.current = null;
  }, [projectId]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      lastPosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(flushCursor);
      }
    },
    [flushCursor]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      onClick={() => selectElement(null)}
      onMouseMove={handleMouseMove}
      style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#f1f5f9',
        position: 'relative',
        padding: '0 0 80px',
      }}
    >
      <div
        ref={setDropRef}
        style={{
          maxWidth: 900,
          margin: '0 auto',
          background: '#fff',
          minHeight: 'calc(100vh - 64px)',
          boxShadow: '0 0 0 1px #e2e8f0, 0 4px 16px rgba(0,0,0,0.07)',
        }}
      >
        {elements.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 400,
              color: '#94a3b8',
              gap: 12,
            }}
          >
            <div style={{ background: '#f1f5f9', padding: 24, borderRadius: '50%', marginBottom: 8 }}>
              <Paintbrush size={48} strokeWidth={1.5} color="#94a3b8" />
            </div>
            <p style={{ fontSize: 18, margin: 0 }}>Перетащите компонент из левой панели</p>
            <p style={{ fontSize: 14, margin: 0, color: '#cbd5e1' }}>или нажмите на компонент для добавления</p>
          </div>
        ) : (
          <SortableContext items={elements.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            {[...elements].sort((a, b) => a.order - b.order).map((el) => (
              <CanvasElement key={el.id} element={el} />
            ))}
          </SortableContext>
        )}
      </div>
      <CursorOverlay />
    </div>
  );
}
