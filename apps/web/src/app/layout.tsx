import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'CtrlPass — Discover, Book, Experience',
  description: 'Premium event discovery, ticketing, and gate access for concerts, festivals, and conferences across India.',
  icons: {
    icon: '/brand/logo.png',
    apple: '/brand/app-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-ink text-sand antialiased selection:bg-orange selection:text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
