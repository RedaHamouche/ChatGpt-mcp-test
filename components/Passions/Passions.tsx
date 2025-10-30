import styles from './Passions.module.scss';

export default function Passions() {
  return (
    <section className={styles.section} id="passions" data-animate="passions">
      <div className={styles.media} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.eyebrow}>Passions</span>
        <h2 className={styles.title}>Créativité, technologie &amp; nature</h2>
        <p className={styles.text}>
          Je puise mon inspiration dans la photographie outdoor, le design génératif et la musique électronique. Ces
          univers nourrissent ma vision pour créer des interfaces sensibles et performantes.
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <strong>Design génératif :</strong> prototypes interactifs en WebGL.
          </li>
          <li className={styles.listItem}>
            <strong>Photographie :</strong> composition et lumière au service du storytelling.
          </li>
          <li className={styles.listItem}>
            <strong>Musique :</strong> mix live et sound design immersif.
          </li>
        </ul>
      </div>
    </section>
  );
}
