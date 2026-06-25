import * as Y from 'yjs';

// The active Y.Doc — replaced on every new project session
let _ydoc = new Y.Doc();

export function getYDoc(): Y.Doc {
  return _ydoc;
}

/** Call this when entering a new project to get a clean slate */
export function resetYDoc(): Y.Doc {
  _ydoc.destroy();
  _ydoc = new Y.Doc();
  return _ydoc;
}

export function getYElements(): Y.Array<any> {
  return _ydoc.getArray<any>('elements');
}

export function applyRemoteUpdate(update: Uint8Array) {
  // Pass 'remote' as origin so the ydoc 'update' listener can skip
  // echoing this back to the server
  Y.applyUpdate(_ydoc, update, 'remote');
}

export function getStateUpdate(): Uint8Array {
  return Y.encodeStateAsUpdate(_ydoc);
}
