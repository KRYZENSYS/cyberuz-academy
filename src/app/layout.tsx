import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CyberUz Academy — Kiberxavfsizlik O\'rganish Platformasi',
  description: 'O\'zbek tilidagi eng katta bepul kiberxavfsizlik o\'rganish platformasi. AI-powered automatic lesson discovery, gamification, certificates.',
  keywords: ['cybersecurity', 'kiberxavfsizlik', 'ethical hacking', 'bug bounty', 'uzbek', 'o\'zbek', 'AI', 'learning'],
  authors: [{ name: 'CyberUz Academy Team' }],
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
      <body className="min-h-screen bg-cyber-black text-white antialiased">
        <div className="matrix-rain opacity-30">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              style={{
                left: `${(i * 3.33) % 100}%`,
                animationDuration: `${8 + Math.random() * 12}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {Array.from({ length: 40 }).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join('')}
            </span>
          ))}
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}