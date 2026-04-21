import * as Y from 'yjs';

export const ydoc = new Y.Doc();

export const yElements = ydoc.getArray<any>('elements');

export const applyRemoteUpdate = (update: Uint8Array) => {
  Y.applyUpdate(ydoc, update);
};

export const getStateUpdate = () => Y.encodeStateAsUpdate(ydoc);
