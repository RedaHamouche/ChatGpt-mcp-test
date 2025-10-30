'use client';

import { useState } from 'react';
import styles from './Nav.module.scss';

const links = [
  { href: '#hero', label: 'Accueil' },
  { href: '#projects', label: 'Projets' },
  { href: '#passions', label: 'Passions' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.brand}>JD</div>
      <button
        type="button"
        className={styles.menuButton}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="nav-links"
      >
        ☰
      </button>
      <ul
        id="nav-links"
        className={`${styles.navLinks} ${isOpen ? styles.navLinksOpen : ''}`}
        role="list"
      >
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={styles.navLink} data-nav-link onClick={closeMenu}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
