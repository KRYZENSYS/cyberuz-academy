'use client';

import Link from 'next/link';
import { Github, Send, Mail, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-cyan-500/20 bg-cyber-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold neon-text">CyberUz</span>
            </div>
            <p className="text-gray-400 text-sm">
              O'zbek tilidagi eng katta bepul kiberxavfsizlik o'rganish platformasi.
              AI yordamida avtomatik darslar.
            </p>
          </div>

          <div>
            <h3 className="text-cyan-400 font-semibold mb-4">Platforma</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/courses" className="hover:text-cyan-400">Kurslar</Link></li>
              <li><Link href="/paths" className="hover:text-cyan-400">Yo'llar</Link></li>
              <li><Link href="/leaderboard" className="hover:text-cyan-400">Reyting</Link></li>
              <li><Link href="/news" className="hover:text-cyan-400">Yangiliklar</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-cyan-400 font-semibold mb-4">Resurslar</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-cyan-400">Biz haqimizda</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-400">Bog'lanish</Link></li>
              <li><Link href="/faq" className="hover:text-cyan-400">FAQ</Link></li>
              <li><Link href="/community" className="hover:text-cyan-400">Jamiyat</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-cyan-400 font-semibold mb-4">Aloqa</h3>
            <div className="flex gap-3 mb-3">
              <a href="https://t.me/FirdavsVIP" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition-colors">
                <Send size={18} />
              </a>
              <a href="https://github.com/KRYZENSYS" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition-colors">
                <Github size={18} />
              </a>
              <a href="mailto:f91186645@gmail.com"
                className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition-colors">
                <Mail size={18} />
              </a>
            </div>
            <p className="text-xs text-gray-500">
              © 2026 CyberUz Academy<br />
              Bepul ta'lim — Barcha uchun ochiq
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}