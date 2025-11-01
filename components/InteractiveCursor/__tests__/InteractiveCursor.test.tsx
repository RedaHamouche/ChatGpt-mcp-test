import { cleanup, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import InteractiveCursor from '../InteractiveCursor';

const quickSetters: Array<{
  target: Element;
  property: string;
  setter: jest.Mock;
}> = [];

const contextReverts: jest.Mock[] = [];

const gsapMock = {
  quickTo: jest.fn((target: Element, property: string) => {
    const setter = jest.fn();
    quickSetters.push({ target, property, setter });
    return setter;
  }),
  to: jest.fn(),
  set: jest.fn(),
  killTweensOf: jest.fn(),
  context: jest.fn((callback: () => void) => {
    callback();
    const revert = jest.fn();
    contextReverts.push(revert);
    return { revert };
  }),
};

jest.mock('gsap', () => ({ gsap: gsapMock }));

describe('InteractiveCursor', () => {
  const setMatchMedia = ({
    pointerFine,
    reducedMotion,
  }: {
    pointerFine: boolean;
    reducedMotion: boolean;
  }) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn((query: string) => {
        const matches =
          query === '(pointer: fine)'
            ? pointerFine
            : query === '(prefers-reduced-motion: reduce)'
            ? reducedMotion
            : false;

        return {
          matches,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        } as MediaQueryList;
      }),
    });
  };

  const getSetter = (role: string, property: string) => {
    const entry = quickSetters.find(
      ({ target, property: recordedProperty }) =>
        (target as HTMLElement).dataset.cursorRole === role && recordedProperty === property,
    );

    if (!entry) {
      throw new Error(`No setter recorded for role "${role}" and property "${property}"`);
    }

    return entry.setter;
  };

  beforeEach(() => {
    quickSetters.length = 0;
    contextReverts.length = 0;
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('renders nothing when the pointer is not precise', () => {
    setMatchMedia({ pointerFine: false, reducedMotion: false });

    const { container } = render(<InteractiveCursor />);

    expect(container.firstChild).toBeNull();
    expect(document.body.dataset.customCursor).toBeUndefined();
  });

  it('animates cursor elements with GSAP in response to pointer and interaction events', () => {
    setMatchMedia({ pointerFine: true, reducedMotion: false });

    const interactiveButton = document.createElement('button');
    interactiveButton.dataset.cursor = 'accent';
    document.body.appendChild(interactiveButton);

    render(<InteractiveCursor />);

    expect(document.body.dataset.customCursor).toBe('true');

    const cursor = document.querySelector('[data-cursor-role="dot"]') as HTMLElement;
    const aura = document.querySelector('[data-cursor-role="aura"]') as HTMLElement;

    act(() => {
      document.dispatchEvent(new PointerEvent('pointermove', { clientX: 120, clientY: 180 }));
    });

    expect(getSetter('dot', 'x')).toHaveBeenLastCalledWith(120);
    expect(getSetter('dot', 'y')).toHaveBeenLastCalledWith(180);
    expect(getSetter('aura', 'x')).toHaveBeenLastCalledWith(120);
    expect(getSetter('aura', 'y')).toHaveBeenLastCalledWith(180);

    act(() => {
      interactiveButton.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    });

    expect(getSetter('aura', 'scale')).toHaveBeenLastCalledWith(1.45);
    expect(getSetter('dot', 'scale')).toHaveBeenLastCalledWith(1.25);

    const auraCalls = gsapMock.to.mock.calls.filter((call) => call[0] === aura);
    expect(auraCalls[auraCalls.length - 1][1]).toEqual(
      expect.objectContaining({ backgroundColor: 'rgba(181, 162, 255, 0.34)' }),
    );

    const cursorCalls = gsapMock.to.mock.calls.filter((call) => call[0] === cursor);
    expect(cursorCalls[cursorCalls.length - 1][1]).toEqual(
      expect.objectContaining({ boxShadow: '0 0 0 3px rgba(136, 110, 219, 0.3)' }),
    );

    act(() => {
      interactiveButton.dispatchEvent(new PointerEvent('pointerdown'));
    });

    expect(getSetter('aura', 'scale')).toHaveBeenLastCalledWith(0.85);
    expect(getSetter('dot', 'scale')).toHaveBeenLastCalledWith(0.7);

    act(() => {
      document.dispatchEvent(new PointerEvent('pointerup'));
    });

    expect(getSetter('dot', 'scale')).toHaveBeenLastCalledWith(1.25);

    act(() => {
      interactiveButton.dispatchEvent(new Event('mouseleave', { bubbles: true }));
    });

    expect(getSetter('dot', 'scale')).toHaveBeenLastCalledWith(1);
    expect(getSetter('aura', 'scale')).toHaveBeenLastCalledWith(1);
  });

  it('cleans up GSAP animations on unmount', () => {
    setMatchMedia({ pointerFine: true, reducedMotion: false });

    const { unmount } = render(<InteractiveCursor />);

    expect(document.body.dataset.customCursor).toBe('true');

    unmount();

    expect(document.body.dataset.customCursor).toBeUndefined();
    expect(gsapMock.killTweensOf).toHaveBeenCalled();
    expect(contextReverts).not.toHaveLength(0);
    expect(contextReverts[0]).toHaveBeenCalled();
  });
});
