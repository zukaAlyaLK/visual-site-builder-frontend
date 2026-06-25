import { create } from 'zustand';
import type { CanvasElement } from '../types';
import { getYElements } from '../collab/yjs';

interface CanvasStore {
  elements: CanvasElement[];
  selectedId: string | null;
  history: CanvasElement[][];
  future: CanvasElement[][];
  setElements: (els: CanvasElement[], skipYjs?: boolean) => void;
  addElement: (el: CanvasElement) => void;
  duplicateElement: (id: string) => void;
  updateElement: (id: string, patch: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  resetStore: () => void;
  undo: () => void;
  redo: () => void;
}

function syncToYjs(els: CanvasElement[]) {
  const yElements = getYElements();
  yElements.delete(0, yElements.length);
  yElements.push(els);
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  elements: [],
  selectedId: null,
  history: [],
  future: [],

  /**
   * setElements: update the Zustand store.
   * Pass skipYjs=true when called FROM the Yjs observer to avoid
   * writing back into Yjs and causing an echo loop.
   */
  setElements: (els, skipYjs = false) => {
    set({ elements: els });
    if (!skipYjs) {
      syncToYjs(els);
    }
  },

  addElement: (el) => {
    const { elements, history } = get();
    const next = [...elements, el];
    set({ history: [...history, elements], future: [], elements: next });
    syncToYjs(next);
  },

  duplicateElement: (id) => {
    const { elements, history } = get();
    const sourceIndex = elements.findIndex(e => e.id === id);
    if (sourceIndex === -1) return;

    const sourceElement = elements[sourceIndex];
    const newElement: CanvasElement = {
      ...JSON.parse(JSON.stringify(sourceElement)),
      id: crypto.randomUUID(),
      order: sourceElement.order + 1,
    };

    const nextElements = [
      ...elements.slice(0, sourceIndex + 1),
      newElement,
      ...elements.slice(sourceIndex + 1).map(el => ({ ...el, order: el.order + 1 })),
    ];

    set({ history: [...history, elements], future: [], elements: nextElements });
    syncToYjs(nextElements);
  },

  updateElement: (id, patch) => {
    const { elements, history } = get();
    const updated = elements.map(el =>
      el.id === id
        ? {
            ...el,
            ...patch,
            style: { ...el.style, ...(patch.style || {}) },
            content: { ...el.content, ...(patch.content || {}) },
          }
        : el
    );
    set({ history: [...history, elements], future: [], elements: updated });
    syncToYjs(updated);
  },

  removeElement: (id) => {
    const { elements, history } = get();
    const next = elements.filter(el => el.id !== id);
    set({ history: [...history, elements], future: [], elements: next });
    syncToYjs(next);
  },

  selectElement: (id) => set({ selectedId: id }),

  /** Call when entering a new project to wipe all stale state */
  resetStore: () => set({ elements: [], history: [], future: [], selectedId: null }),

  undo: () => {
    const { history, elements, future } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set({ history: history.slice(0, -1), future: [elements, ...future], elements: prev });
    syncToYjs(prev);
  },

  redo: () => {
    const { future, elements, history } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({ future: future.slice(1), history: [...history, elements], elements: next });
    syncToYjs(next);
  },
}));
