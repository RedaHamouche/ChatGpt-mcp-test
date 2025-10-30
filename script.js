const initAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  const timeline = gsap.timeline({
    defaults: { duration: 0.8, ease: 'power3.out', stagger: 0.12 },
  });

  timeline
    .from('[data-animate="nav"]', { y: -30, opacity: 0 })
    .from('[data-animate="hero"] .hero__eyebrow', { y: 40, opacity: 0 }, '-=0.3')
    .from('[data-animate="hero"] h1 span, [data-animate="hero"] h1', {
      y: 60,
      opacity: 0,
    })
    .from('[data-animate="hero"] .hero__text', { y: 40, opacity: 0 })
    .from('[data-animate="hero"] .btn', { y: 20, opacity: 0 }, '-=0.3')
    .from('[data-animate="hero"] .preview-card', { y: 80, opacity: 0, scale: 0.95 }, '-=0.5');

  const scrollSections = [
    { selector: '[data-animate="metrics"] article', offset: 'top 80%' },
    { selector: '.project-card', offset: 'top 85%' },
    { selector: '.passions__content > *', offset: 'top 80%' },
    { selector: '.process__steps article', offset: 'top 85%' },
    { selector: '.contact__content > *, .contact__form', offset: 'top 85%' },
  ];

  scrollSections.forEach(({ selector, offset }) => {
    gsap.from(selector, {
      scrollTrigger: {
        trigger: selector,
        start: offset,
        toggleActions: 'play none none reverse',
      },
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.18,
    });
  });

  const parallaxCard = document.querySelector('[data-parallax]');
  if (parallaxCard) {
    const handleParallax = (event) => {
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

    parallaxCard.addEventListener('mousemove', handleParallax);
    parallaxCard.addEventListener('mouseleave', () => {
      gsap.to(parallaxCard, { x: 0, y: 0, rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' });
    });
  }

  const projectCards = gsap.utils.toArray('[data-tilt]');
  projectCards.forEach((card) => {
    const glare = document.createElement('span');
    glare.className = 'project-card__glare';
    card.appendChild(glare);

    const moveTilt = (event) => {
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

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
      gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'power2.out' });
      gsap.to(glare, {
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08), transparent 60%)',
        duration: 0.6,
      });
    };

    card.addEventListener('mousemove', moveTilt);
    card.addEventListener('mouseleave', resetTilt);
    card.addEventListener('focus', () => gsap.to(card, { scale: 1.02, duration: 0.4 }));
    card.addEventListener('blur', resetTilt);
  });

  const navLinks = gsap.utils.toArray('.nav__links a');
  navLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, { y: -2, duration: 0.2, ease: 'power2.out' });
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(link, { y: 0, duration: 0.2, ease: 'power2.out' });
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
});
