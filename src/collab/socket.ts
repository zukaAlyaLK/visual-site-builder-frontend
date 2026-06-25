import { io, Socket } from 'socket.io-client';
import { applyRemoteUpdate, getYDoc, getYElements } from './yjs';

let socket: Socket | null = null;
let ydocUpdateListener: ((update: Uint8Array, origin: unknown) => void) | null = null;

type CursorHandler = (data: {
  socketId: string;
  userName?: string;
  color?: string;
  x: number;
  y: number;
}) => void;
let cursorHandler: CursorHandler | null = null;

export function connectToProject(projectId: string, token: string) {
  // Disconnect any existing connection first
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  // Remove any previous ydoc listener to avoid duplicates
  if (ydocUpdateListener) {
    getYDoc().off('update', ydocUpdateListener);
    ydocUpdateListener = null;
  }

  // ✅ Use default transports (polling → websocket upgrade).
  // Forcing websocket-only skips the HTTP handshake and causes
  // "WebSocket is closed before the connection is established".
  socket = io(import.meta.env.VITE_WS_URL, {
    auth: { token },
    transports: ['polling', 'websocket'],
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected, joining project:', projectId);
    // No need to pass token here; auth is already done via handshake
    socket!.emit('join-project', { projectId });
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
  });

  // ✅ Receive initial Yjs state snapshot from server (sent on join)
  socket.on('sync-state', (update: number[]) => {
    applyRemoteUpdate(new Uint8Array(update));
  });

  // ✅ Receive incremental Yjs updates from other collaborators
  socket.on('yjs-update', ({ update }: { update: number[] }) => {
    applyRemoteUpdate(new Uint8Array(update));
  });

  // ✅ Correct event name: server emits 'cursor-moved' (not 'cursor-move')
  socket.on('cursor-moved', (data: {
    socketId: string;
    userName?: string;
    color?: string;
    x: number;
    y: number;
  }) => {
    if (cursorHandler) cursorHandler(data);
  });

  // Listen for local Yjs changes and send them to the server
  ydocUpdateListener = (update: Uint8Array, origin: unknown) => {
    // Skip updates that originated from the server (origin === 'remote')
    if (origin === 'remote') return;
    socket?.emit('yjs-update', {
      projectId,
      update: Array.from(update),
    });
  };
  getYDoc().on('update', ydocUpdateListener);

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });
}

export function onCursorMove(handler: CursorHandler) {
  cursorHandler = handler;
}

export function sendCursor(projectId: string, x: number, y: number) {
  // ✅ Send { projectId, x, y } — matches what backend expects
  socket?.emit('cursor-move', { projectId, x, y });
}

export function disconnectSocket() {
  if (ydocUpdateListener) {
    getYDoc().off('update', ydocUpdateListener);
    ydocUpdateListener = null;
  }
  socket?.disconnect();
  socket = null;
  cursorHandler = null;
}

export function getSocket() {
  return socket;
}
