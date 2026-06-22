'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Bosh sahifa' },
  { href: '/courses', label: 'Kurslar' },
  { href: '/paths', label: 'Yo\'llar' },
  { href: '/ai-teacher', label: 'AI Ustoz' },
  { href: '/leaderboard', label: 'Reyting' },
  { href: '/news', label: 'Yangiliklar' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cyber-black/90 backdrop-blur-md shadow-lg shadow-cyan-500/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="w-8 h-8 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-bold neon-text">CyberUz</span>
            <span className="text-yellow-400 text-xs font-mono hidden sm:inline">.academy</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-cyan-400 neon-text'
                    : 'text-gray-300 hover:text-cyan-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="btn-outline text-sm py-2 px-4">
              Kirish
            </Link>
            <Link href="/register" className="btn-neon text-sm py-2 px-4">
              Boshlash
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-cyan-400"
            aria-label="Menu"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 fade-in">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-cyan-400 py-2"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-2">
                <Link href="/login" className="btn-outline flex-1 text-center text-sm py-2">
                  Kirish
                </Link>
                <Link href="/register" className="btn-neon flex-1 text-center text-sm py-2">
                  Boshlash
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}