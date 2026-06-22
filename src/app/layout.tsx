import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import MatrixBackground from '@/components/MatrixBackground';
import ParticleField from '@/components/ParticleField';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: '🛡️ CyberUz Academy — O\'zbek tilidagi kiberxavfsizlik platformasi',
  description: 'AI yordamida kiberxavfsizlikni o\'rganing. 10 ta o\'rganish yo\'li, yuzlab bepul darslar va sertifikatlar.',
  keywords: ['kiberxavfsizlik', 'cybersecurity', 'ethical hacking', 'pentest', 'bug bounty', 'uzbek'],
  authors: [{ name: 'CyberUz Academy' }],
  openGraph: {
    title: 'CyberUz Academy',
    description: 'O\'zbek tilidagi bepul kiberxavfsizlik platformasi',
    type: 'website',
    locale: 'uz_UZ',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}>
        <MatrixBackground />
        <ParticleField />
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111827',
              color: '#fff',
              border: '1px solid #06B6D4',
            },
          }}
        />
      </body>
    </html>
  );
}