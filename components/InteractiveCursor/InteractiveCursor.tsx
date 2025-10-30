'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './InteractiveCursor.module.scss';

const INTERACTIVE_SELECTORS = 'a, button, [data-cursor]';

export default function InteractiveCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(pointer: fine)');
    const update = () => setIsEnabled(mediaQuery.matches);

    update();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }

    if (!window.matchMedia('(pointer: fine)').matches) {
      return undefined;
    }

    const cursor = cursorRef.current;
    const aura = auraRef.current;

    if (!cursor || !aura) {
      return undefined;
    }

    document.body.dataset.customCursor = 'true';

    setPosition(cursor, window.innerWidth / 2, window.innerHeight / 2);
    setPosition(aura, window.innerWidth / 2, window.innerHeight / 2);

    const setPosition = (element: HTMLElement, x: number, y: number) => {
      element.style.setProperty('--cursor-x', `${x}px`);
      element.style.setProperty('--cursor-y', `${y}px`);
    };

    const updatePosition = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      setPosition(cursor, clientX, clientY);
      setPosition(aura, clientX, clientY);
    };

    const setState = (state: string, active: boolean) => {
      aura.classList.toggle(state, active);
      cursor.classList.toggle(state, active);
    };

    const handlePointerMove = (event: PointerEvent) => {
      updatePosition(event);
    };

    const handlePointerDown = () => {
      setState(styles.isPressed, true);
    };

    const handlePointerUp = () => {
      setState(styles.isPressed, false);
    };

    const handleInteractiveEnter = (event: Event) => {
      const element = event.currentTarget as HTMLElement;
      const auraMode = element.dataset.cursor ?? 'interactive';
      setState(styles.isActive, true);
      setState(styles.isAccent, auraMode === 'accent');
    };

    const handleInteractiveLeave = () => {
      setState(styles.isActive, false);
      setState(styles.isAccent, false);
    };

    const handleInteractiveDown = () => {
      setState(styles.isPressed, true);
    };

    const handleInteractiveUp = () => {
      setState(styles.isPressed, false);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);

    const interactiveElements = Array.from(
      document.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTORS),
    );

    interactiveElements.forEach((element) => {
      element.addEventListener('mouseenter', handleInteractiveEnter);
      element.addEventListener('mouseleave', handleInteractiveLeave);
      element.addEventListener('focus', handleInteractiveEnter);
      element.addEventListener('pointerdown', handleInteractiveDown);
      element.addEventListener('pointerup', handleInteractiveUp);
      element.addEventListener('blur', handleInteractiveLeave);
    });

    return () => {
      delete document.body.dataset.customCursor;
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);

      interactiveElements.forEach((element) => {
        element.removeEventListener('mouseenter', handleInteractiveEnter);
        element.removeEventListener('mouseleave', handleInteractiveLeave);
        element.removeEventListener('focus', handleInteractiveEnter);
        element.removeEventListener('pointerdown', handleInteractiveDown);
        element.removeEventListener('pointerup', handleInteractiveUp);
        element.removeEventListener('blur', handleInteractiveLeave);
      });
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className={styles.cursorContainer} aria-hidden="true">
      <div ref={auraRef} className={styles.cursorAura} />
      <div ref={cursorRef} className={styles.cursorDot} />
    </div>
  );
}
