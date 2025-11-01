'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './InteractiveCursor.module.scss';

const INTERACTIVE_SELECTORS = 'a, button, [data-cursor]';

const AURA_BACKGROUND = {
  base: 'rgba(207, 198, 255, 0.24)',
  active: 'rgba(199, 186, 255, 0.3)',
  accent: 'rgba(181, 162, 255, 0.34)',
} as const;

const AURA_SHADOW = {
  base: '0 0 0 0 rgba(0, 0, 0, 0)',
  accent: '0 0 0 1px rgba(136, 110, 219, 0.25)',
} as const;

const DOT_SHADOW = {
  base: '0 0 0 2px rgba(40, 30, 61, 0.45)',
  accent: '0 0 0 3px rgba(136, 110, 219, 0.3)',
} as const;

const INITIAL_POSITION = {
  x: () => window.innerWidth / 2,
  y: () => window.innerHeight / 2,
} as const;

type CursorAnimator = {
  move: (x: number, y: number) => void;
  setActive: (active: boolean, accent?: boolean) => void;
  setPressed: (pressed: boolean) => void;
  dispose: () => void;
};

interface AnimatorOptions {
  reducedMotion: boolean;
}

function createCursorAnimator(
  cursor: HTMLElement,
  aura: HTMLElement,
  options: AnimatorOptions,
): CursorAnimator {
  const ctx = gsap.context(() => {
    gsap.set([cursor, aura], {
      xPercent: -50,
      yPercent: -50,
      transformOrigin: '50% 50%',
      force3D: true,
    });

    gsap.set(cursor, {
      opacity: 0.85,
      scale: 1,
      boxShadow: DOT_SHADOW.base,
    });

    gsap.set(aura, {
      opacity: 0.55,
      scale: 1,
      backgroundColor: AURA_BACKGROUND.base,
      boxShadow: AURA_SHADOW.base,
    });
  });

  const moveDuration = options.reducedMotion ? 0 : 0.16;
  const auraMoveDuration = options.reducedMotion ? 0 : 0.25;
  const scaleDuration = options.reducedMotion ? 0 : 0.18;
  const colorDuration = options.reducedMotion ? 0 : 0.2;

  const cursorMoveX = gsap.quickTo(cursor, 'x', {
    duration: moveDuration,
    ease: 'power3.out',
  });
  const cursorMoveY = gsap.quickTo(cursor, 'y', {
    duration: moveDuration,
    ease: 'power3.out',
  });
  const auraMoveX = gsap.quickTo(aura, 'x', {
    duration: auraMoveDuration,
    ease: 'power3.out',
  });
  const auraMoveY = gsap.quickTo(aura, 'y', {
    duration: auraMoveDuration,
    ease: 'power3.out',
  });

  const cursorScale = gsap.quickTo(cursor, 'scale', {
    duration: scaleDuration,
    ease: 'power2.out',
  });
  const auraScale = gsap.quickTo(aura, 'scale', {
    duration: scaleDuration,
    ease: 'power2.out',
  });
  const cursorOpacity = gsap.quickTo(cursor, 'opacity', {
    duration: scaleDuration,
    ease: 'power2.out',
  });
  const auraOpacity = gsap.quickTo(aura, 'opacity', {
    duration: scaleDuration,
    ease: 'power2.out',
  });

  const state = {
    active: false,
    accent: false,
    pressed: false,
  };

  const applyState = () => {
    const { active, accent, pressed } = state;

    const auraScaleValue = pressed ? 0.85 : active ? 1.45 : 1;
    const cursorScaleValue = pressed ? 0.7 : active ? 1.25 : 1;
    const auraOpacityValue = active ? 1 : 0.55;
    const cursorOpacityValue = active ? 1 : 0.85;

    auraScale(auraScaleValue);
    cursorScale(cursorScaleValue);
    auraOpacity(auraOpacityValue);
    cursorOpacity(cursorOpacityValue);

    const auraColor = active
      ? accent
        ? AURA_BACKGROUND.accent
        : AURA_BACKGROUND.active
      : AURA_BACKGROUND.base;
    const auraShadow = active && accent ? AURA_SHADOW.accent : AURA_SHADOW.base;
    const cursorShadow = active && accent ? DOT_SHADOW.accent : DOT_SHADOW.base;

    gsap.to(aura, {
      backgroundColor: auraColor,
      boxShadow: auraShadow,
      duration: colorDuration,
      ease: 'power1.out',
      overwrite: 'auto',
    });

    gsap.to(cursor, {
      boxShadow: cursorShadow,
      duration: colorDuration,
      ease: 'power1.out',
      overwrite: 'auto',
    });
  };

  applyState();

  return {
    move: (x, y) => {
      cursorMoveX(x);
      cursorMoveY(y);
      auraMoveX(x);
      auraMoveY(y);
    },
    setActive: (active, accent = false) => {
      state.active = active;
      state.accent = accent && active;
      applyState();
    },
    setPressed: (pressed) => {
      state.pressed = pressed;
      applyState();
    },
    dispose: () => {
      ctx.revert();
      gsap.killTweensOf(cursor);
      gsap.killTweensOf(aura);
    },
  };
}

function useFinePointer(): boolean {
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(pointer: fine)');
    const update = (event?: MediaQueryListEvent) => {
      setIsFinePointer(event ? event.matches : mediaQuery.matches);
    };

    update();

    const listener = (event: MediaQueryListEvent) => update(event);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }

    mediaQuery.addListener(listener);
    return () => mediaQuery.removeListener(listener);
  }, []);

  return isFinePointer;
}

export default function InteractiveCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const animatorRef = useRef<CursorAnimator | null>(null);
  const isEnabled = useFinePointer();

  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') {
      return undefined;
    }

    const cursor = cursorRef.current;
    const aura = auraRef.current;

    if (!cursor || !aura) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const animator = createCursorAnimator(cursor, aura, { reducedMotion: prefersReducedMotion });

    animatorRef.current = animator;
    document.body.dataset.customCursor = 'true';

    const handlePointerMove = (event: PointerEvent) => {
      animator.move(event.clientX, event.clientY);
    };

    const handlePointerDown = () => {
      animator.setPressed(true);
    };

    const handlePointerUp = () => {
      animator.setPressed(false);
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);

    animator.move(INITIAL_POSITION.x(), INITIAL_POSITION.y());

    const interactiveElements = Array.from(
      document.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTORS),
    );

    const handleInteractiveEnter = (event: Event) => {
      const element = event.currentTarget as HTMLElement;
      const auraMode = element.dataset.cursor ?? 'interactive';
      animator.setActive(true, auraMode === 'accent');
    };

    const handleInteractiveLeave = () => {
      animator.setActive(false);
    };

    const handleInteractiveDown = () => {
      animator.setPressed(true);
    };

    const handleInteractiveUp = () => {
      animator.setPressed(false);
    };

    interactiveElements.forEach((element) => {
      element.addEventListener('mouseenter', handleInteractiveEnter);
      element.addEventListener('mouseleave', handleInteractiveLeave);
      element.addEventListener('focus', handleInteractiveEnter);
      element.addEventListener('blur', handleInteractiveLeave);
      element.addEventListener('pointerdown', handleInteractiveDown);
      element.addEventListener('pointerup', handleInteractiveUp);
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
        element.removeEventListener('blur', handleInteractiveLeave);
        element.removeEventListener('pointerdown', handleInteractiveDown);
        element.removeEventListener('pointerup', handleInteractiveUp);
      });

      animator.setActive(false);
      animator.setPressed(false);
      animator.dispose();
      animatorRef.current = null;
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className={styles.cursorContainer} data-testid="interactive-cursor" aria-hidden="true">
      <div ref={auraRef} className={styles.cursorAura} data-cursor-role="aura" />
      <div ref={cursorRef} className={styles.cursorDot} data-cursor-role="dot" />
    </div>
  );
}
