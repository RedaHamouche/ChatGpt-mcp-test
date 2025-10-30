import styles from './Contact.module.scss';

export default function Contact() {
  return (
    <section className={styles.section} id="contact" data-animate="contact">
      <div className={styles.content}>
        <span className={styles.eyebrow}>Contact</span>
        <h2 className={styles.title}>Prêt à concevoir l’expérience de demain ?</h2>
        <p className={styles.text}>
          Racontez-moi votre projet ou votre défi. Je reviens vers vous en 24h avec des pistes créatives.
        </p>
        <a href="mailto:bonjour@julien.dev" className={styles.mailLink} data-cursor="accent">
          bonjour@julien.dev
        </a>
        <div className={styles.socials}>
          <a href="#" aria-label="Dribbble" data-cursor>
            Dribbble
          </a>
          <a href="#" aria-label="Behance" data-cursor>
            Behance
          </a>
          <a href="#" aria-label="LinkedIn" data-cursor>
            LinkedIn
          </a>
        </div>
      </div>
      <form className={styles.form}>
        <label className={styles.field}>
          <span>Nom</span>
          <input className={styles.input} type="text" name="name" placeholder="Votre nom" required />
        </label>
        <label className={styles.field}>
          <span>Email</span>
          <input className={styles.input} type="email" name="email" placeholder="Votre email" required />
        </label>
        <label className={styles.field}>
          <span>Projet</span>
          <textarea
            className={styles.textarea}
            name="message"
            rows={4}
            placeholder="Parlez-moi de votre idée"
            required
          />
        </label>
        <button type="submit" className={styles.submit} data-cursor="accent">
          Envoyer
        </button>
      </form>
    </section>
  );
}
