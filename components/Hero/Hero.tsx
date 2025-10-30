import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={styles.hero} id="hero" data-animate="hero">
      <div className={styles.heroContent}>
        <p className={`${styles.heroEyebrow} hero-eyebrow`}>Développeur web freelance</p>
        <h1 className={styles.heroTitle}>
          J’imagine des expériences numériques <span>vivantes</span>
        </h1>
        <p className={`${styles.heroText} hero-text`}>
          Spécialisé en interfaces immersives et micro-interactions, j’accompagne les marques
          ambitieuses vers des expériences capables de séduire le jury d’Awwwards.
        </p>
        <div className={`${styles.heroActions} hero-actions`}>
          <a href="#projects" className={styles.buttonPrimary} data-cursor="accent">
            Voir mes réalisations
          </a>
          <a href="#contact" className={styles.buttonGhost} data-cursor>
            Collaborons
          </a>
        </div>
      </div>
      <div className={styles.heroPreview}>
        <article className={styles.previewCard} data-parallax data-cursor="accent">
          <span className={styles.previewTag}>UX • UI • WebGL</span>
          <h2 className={styles.previewTitle}>Expériences sur-mesure</h2>
          <p className={styles.previewText}>
            Animation fluide, storytelling interactif et optimisation SEO pour un impact durable.
          </p>
        </article>
      </div>
    </section>
  );
}
