import styles from './Process.module.scss';

const steps = [
  {
    title: '01. Immersion',
    description: 'Audit UX, recherche utilisateur et définition du ton émotionnel.',
  },
  {
    title: '02. Design narratif',
    description: 'Wireframes, prototypage animé et direction artistique.',
  },
  {
    title: '03. Production',
    description: 'Développement sur-mesure avec GSAP, Three.js et Web Audio API.',
  },
  {
    title: '04. Optimisation',
    description: 'Testing multi-device, performance et SEO technique.',
  },
];

export default function Process() {
  return (
    <section className={styles.section} id="process" data-animate="process">
      <header className={styles.header}>
        <span className={styles.eyebrow}>Process</span>
        <h2 className={styles.title}>Une méthodologie centrée sur l’impact</h2>
        <p className={styles.description}>
          De l’idéation à la livraison, chaque étape est conçue pour maximiser la performance et l’émotion.
        </p>
      </header>
      <div className={styles.steps}>
        {steps.map((step) => (
          <article key={step.title} className={styles.step}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
