import styles from './Projects.module.scss';

const projects = [
  {
    title: 'Atlas Expedition',
    description:
      'Plateforme immersive sur la biodiversité mêlant WebGL, narration scrollée et scoring Awwwards Honorable Mention.',
    linkLabel: 'Étude de cas',
    link: '#',
  },
  {
    title: 'Lumen Studio',
    description:
      'Site vitrine pour un studio lumière avec transitions GSAP 3D, effets typographiques et optimisation Core Web Vitals.',
    linkLabel: 'Étude de cas',
    link: '#',
  },
  {
    title: 'Terroir Nouveau',
    description:
      'Expérience ecommerce premium avec micro-interactions et storytelling sonore, finaliste Awwwards Site of the Day.',
    linkLabel: 'Étude de cas',
    link: '#',
  },
];

export default function Projects() {
  return (
    <section className={styles.section} id="projects" data-animate="projects">
      <header className={styles.header}>
        <span className={styles.eyebrow}>Projets sélectionnés</span>
        <h2 className={styles.title}>Des expériences qui marquent</h2>
        <p className={styles.description}>
          Chaque projet est une immersion entre technologie et émotion, pensé pour générer de l’engagement et
          remporter des prix.
        </p>
      </header>
      <div className={styles.list}>
        {projects.map((project) => (
          <article key={project.title} className={styles.card} data-tilt tabIndex={0}>
            <div className={styles.glare} data-glare aria-hidden="true" />
            <div className={styles.cardMedia} />
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardText}>{project.description}</p>
              <a href={project.link} className={styles.cardLink}>
                {project.linkLabel}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
