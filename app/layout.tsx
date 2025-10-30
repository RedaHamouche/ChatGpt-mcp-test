import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.scss';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Portfolio – Développeur web',
  description:
    'Portfolio premium pour un développeur web spécialisé dans les expériences immersives et l’animation avancée.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
