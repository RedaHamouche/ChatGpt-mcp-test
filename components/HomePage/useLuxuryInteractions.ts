'use client';

import { useEffect } from 'react';

export function useLuxuryInteractions() {
  useEffect(() => {
    let isCancelled = false;
    let context: { revert(): void } | undefined;
    const removeListeners: Array<() => void> = [];

    async function init() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (isCancelled) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const intro = gsap.timeline({
          defaults: {
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.08,
          },
        });

        intro
          .from('[data-animate="nav"]', { y: -40, opacity: 0 })
          .from('[data-animate="hero"] .hero-eyebrow', { y: 35, opacity: 0 }, '-=0.35')
          .from('[data-animate="hero"] h1 span, [data-animate="hero"] h1', {
            y: 36,
            opacity: 0,
            duration: 0.7,
          })
          .from('[data-animate="hero"] .hero-text', { y: 28, opacity: 0 })
          .from('[data-animate="hero"] .hero-actions', { y: 24, opacity: 0 }, '-=0.25')
          .from('[data-animate="hero"] [data-parallax]', {
            y: 48,
            opacity: 0,
            scale: 0.97,
            duration: 0.65,
          });

        const sections: Array<{ selector: string; offset: string }> = [
          { selector: '[data-animate="metrics"] article', offset: 'top 80%' },
          { selector: '[data-animate="projects"] [data-tilt]', offset: 'top 80%' },
          { selector: '[data-animate="passions"] > *', offset: 'top 82%' },
          { selector: '[data-animate="process"] article', offset: 'top 85%' },
          { selector: '[data-animate="contact"] > *', offset: 'top 85%' },
        ];

        sections.forEach(({ selector, offset }) => {
          gsap.from(selector, {
            scrollTrigger: {
              trigger: selector,
              start: offset,
              toggleActions: 'play none none reverse',
            },
            y: 28,
            opacity: 0,
            duration: 0.65,
            ease: 'power2.out',
            stagger: 0.12,
          });
        });

        const parallaxCard = document.querySelector<HTMLElement>('[data-parallax]');
        if (parallaxCard) {
          const handleParallax = (event: MouseEvent) => {
            const bounds = parallaxCard.getBoundingClientRect();
            const offsetX = event.clientX - bounds.left - bounds.width / 2;
            const offsetY = event.clientY - bounds.top - bounds.height / 2;

            gsap.to(parallaxCard, {
              x: offsetX * 0.04,
              y: offsetY * 0.04,
              rotateY: offsetX * 0.02,
              rotateX: -offsetY * 0.02,
              transformPerspective: 600,
              ease: 'power2.out',
              duration: 0.6,
            });
          };

          const resetParallax = () => {
            gsap.to(parallaxCard, {
              x: 0,
              y: 0,
              rotateY: 0,
              rotateX: 0,
              duration: 0.6,
              ease: 'power2.out',
            });
          };

          parallaxCard.addEventListener('mousemove', handleParallax);
          parallaxCard.addEventListener('mouseleave', resetParallax);
          removeListeners.push(() => {
            parallaxCard.removeEventListener('mousemove', handleParallax);
            parallaxCard.removeEventListener('mouseleave', resetParallax);
          });
        }

        const projectCards = gsap.utils.toArray<HTMLElement>('[data-tilt]');
        projectCards.forEach((card) => {
          const glare = card.querySelector<HTMLElement>('[data-glare]');
          if (!glare) {
            return;
          }

          const moveTilt = (event: MouseEvent) => {
            const bounds = card.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            gsap.to(card, {
              rotateX,
              rotateY,
              scale: 1.02,
              transformPerspective: 700,
              transformOrigin: 'center',
              ease: 'power2.out',
              duration: 0.4,
            });

            gsap.to(glare, {
              background: `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.35), transparent 60%)`,
              duration: 0.4,
            });
          };

          const resetTilt = () => {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              duration: 0.6,
              ease: 'power2.out',
            });

            gsap.to(glare, {
              background:
                'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08), transparent 60%)',
              duration: 0.6,
            });
          };

          const focusTilt = () => {
            gsap.to(card, {
              scale: 1.02,
              duration: 0.4,
            });
          };

          card.addEventListener('mousemove', moveTilt);
          card.addEventListener('mouseleave', resetTilt);
          card.addEventListener('focus', focusTilt);
          card.addEventListener('blur', resetTilt);

          removeListeners.push(() => {
            card.removeEventListener('mousemove', moveTilt);
            card.removeEventListener('mouseleave', resetTilt);
            card.removeEventListener('focus', focusTilt);
            card.removeEventListener('blur', resetTilt);
          });
        });

        const navLinks = gsap.utils.toArray<HTMLAnchorElement>('[data-nav-link]');
        navLinks.forEach((link) => {
          const handleEnter = () => {
            gsap.to(link, { y: -2, duration: 0.2, ease: 'power2.out' });
          };
          const handleLeave = () => {
            gsap.to(link, { y: 0, duration: 0.2, ease: 'power2.out' });
          };

          link.addEventListener('mouseenter', handleEnter);
          link.addEventListener('mouseleave', handleLeave);
          removeListeners.push(() => {
            link.removeEventListener('mouseenter', handleEnter);
            link.removeEventListener('mouseleave', handleLeave);
          });
        });
      });
    }

    init();

    return () => {
      isCancelled = true;
      removeListeners.forEach((fn) => fn());
      context?.revert();
    };
  }, []);
}
