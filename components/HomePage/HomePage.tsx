'use client';

import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import GridHighlight from '@/components/GridHighlight/GridHighlight';
import Hero from '@/components/Hero/Hero';
import Nav from '@/components/Nav/Nav';
import Passions from '@/components/Passions/Passions';
import Process from '@/components/Process/Process';
import Projects from '@/components/Projects/Projects';
import styles from './HomePage.module.scss';
import { useLuxuryInteractions } from './useLuxuryInteractions';

export default function HomePage() {
  useLuxuryInteractions();

  const year = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <div className={styles.navPlaceholder} data-animate="nav">
        <Nav />
      </div>
      <main className={styles.main}>
        <Hero />
        <GridHighlight />
        <Projects />
        <Passions />
        <Process />
        <Contact />
      </main>
      <Footer year={year} />
    </div>
  );
}
