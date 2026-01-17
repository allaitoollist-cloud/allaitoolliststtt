import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@/components/Analytics';
import { AuthProvider } from '@/contexts/AuthContext';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { ChatbotWidget } from '@/components/ChatbotWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://allaitoollist.com'),
  title: 'AI Tool List - Discover the Best AI Tools',
  description: 'The most comprehensive directory of AI tools. Find, compare, and master the best AI software.',
  keywords: ['AI tools', 'artificial intelligence', 'AI directory', 'machine learning tools', 'AI software'],
  authors: [{ name: 'AI Tool List' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://allaitoollist.com',
    siteName: 'AI Tool List',
    title: 'AI Tool List - Discover the Best AI Tools',
    description: 'The most comprehensive directory of AI tools. Find, compare, and master the best AI software.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Tool List - Discover the Best AI Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tool List - Discover the Best AI Tools',
    description: 'The most comprehensive directory of AI tools. Find, compare, and master the best AI software.',
    images: ['/og-image.png'],
    creator: '@aitoollist',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <ComparisonProvider>
            {children}
            <Analytics />
            <Toaster />
            <ChatbotWidget />
          </ComparisonProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
