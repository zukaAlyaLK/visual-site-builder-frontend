import { io, Socket } from 'socket.io-client';
import { applyRemoteUpdate, ydoc } from './yjs';

let socket: Socket | null = null;
type CursorHandler = (data: { socketId: string; userName?: string; x: number; y: number }) => void;
let cursorHandler: CursorHandler | null = null;

export function connectToProject(projectId: string, token: string) {
  if (socket) {
    socket.disconnect();
  }

  socket = io(import.meta.env.VITE_WS_URL, { transports: ['websocket'] });

  socket.on('connect', () => {
    socket!.emit('join-project', { projectId, token });
  });

  socket.on('sync-state', (update: ArrayBuffer) => {
    applyRemoteUpdate(new Uint8Array(update));
  });

  socket.on('yjs-update', ({ update }: { update: ArrayBuffer }) => {
    applyRemoteUpdate(new Uint8Array(update));
  });

  socket.on('cursor-move', (data: { socketId: string; name: string; color: string; x: number; y: number }) => {
    if (cursorHandler) cursorHandler(data);
  });

  ydoc.on('update', (update: Uint8Array, origin: unknown) => {
    if (origin === 'remote') return;
    socket?.emit('yjs-update', {
      room: `project:${projectId}`,
      update: Array.from(update),
    });
  });
}

export function onCursorMove(handler: CursorHandler) {
  cursorHandler = handler;
}

export function sendCursor(projectId: string, x: number, y: number, userName?: string) {
  socket?.emit('cursor-move', { room: `project:${projectId}`, x, y, userName });
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket() {
  return socket;
}
