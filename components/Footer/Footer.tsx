import styles from './Footer.module.scss';

type FooterProps = {
  year: number;
};

export default function Footer({ year }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <p>© {year} Julien Dupont — Portfolio Web Developer</p>
      <a href="#hero">Retour en haut</a>
    </footer>
  );
}
