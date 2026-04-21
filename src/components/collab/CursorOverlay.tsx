import { useEffect, useRef, useState } from 'react';
import { onCursorMove } from '../../collab/socket';

interface Cursor {
  socketId: string;
  name?: string;
  color?: string;
  x: number;
  y: number;
}

interface RenderCursor extends Cursor {
  name: string;
  color: string;
  displayX: number;
  displayY: number;
  lastSeen: number;
}

const colorFromId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 80%, 50%)`;
};

export function CursorOverlay() {
  const [cursors, setCursors] = useState<Map<string, RenderCursor>>(new Map());
  const targetsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    onCursorMove((data) => {
      const now = Date.now();
      targetsRef.current.set(data.socketId, { x: data.x, y: data.y });
      setCursors((prev) => {
        const next = new Map(prev);
        const existing = next.get(data.socketId);
        const name = data.userName ?? existing?.name ?? 'User';
        const color = existing?.color ?? colorFromId(data.socketId);
        next.set(data.socketId, {
          socketId: data.socketId,
          name,
          color,
          x: data.x,
          y: data.y,
          displayX: existing?.displayX ?? data.x,
          displayY: existing?.displayY ?? data.y,
          lastSeen: now,
        });
        return next;
      });
    });
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      setCursors((prev) => {
        let changed = false;
        const next = new Map(prev);

        next.forEach((cursor, id) => {
          if (now - cursor.lastSeen > 1500) {
            next.delete(id);
            targetsRef.current.delete(id);
            changed = true;
            return;
          }
          const target = targetsRef.current.get(id);
          if (!target) return;
          const dx = target.x - cursor.displayX;
          const dy = target.y - cursor.displayY;
          const displayX = cursor.displayX + dx * 0.35;
          const displayY = cursor.displayY + dy * 0.35;
          if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) changed = true;
          next.set(id, {
            ...cursor,
            x: target.x,
            y: target.y,
            displayX,
            displayY,
          });
        });

        return changed ? next : prev;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {Array.from(cursors.values()).map((cursor) => (
        <div
          key={cursor.socketId}
          style={{
            position: 'absolute',
            left: cursor.displayX,
            top: cursor.displayY,
            pointerEvents: 'none',
            transform: 'translate(-2px, -2px)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill={cursor.color}>
            <path d="M0 0 L0 12 L3.5 8.5 L6 14 L8 13 L5.5 7.5 L10 7.5 Z" />
          </svg>
          <span
            style={{
              background: cursor.color,
              color: '#fff',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 11,
              marginLeft: 4,
              whiteSpace: 'nowrap',
            }}
          >
            {cursor.name}
          </span>
        </div>
      ))}
    </div>
  );
}
