import '@testing-library/jest-dom';

if (typeof window !== 'undefined') {
  window.scrollTo = window.scrollTo || (() => {});
}

if (typeof globalThis.PointerEvent === 'undefined') {
  class PointerEvent extends MouseEvent {
    constructor(type: string, init?: PointerEventInit) {
      super(type, init);
      Object.assign(this, init);
    }
  }

  // @ts-ignore
  globalThis.PointerEvent = PointerEvent;
}
