'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Code, Lock, Zap, Brain, Trophy, BookOpen, Users, Award, Sparkles, ArrowRight, Github, Mail } from 'lucide-react';

export default function HomePage() {
  const features = [
    { icon: Brain, title: 'AI O\'qituvchi', desc: 'CyberAI sizga o\'zbek tilida darslik beradi, quiz yaratadi va savollaringizga javob beradi.', color: 'cyan' },
    { icon: BookOpen, title: '10 ta O\'rganish Yo\'li', desc: 'Cybersecurity Fundamentals dan Red Team gacha — barcha yo\'nalishlar.', color: 'blue' },
    { icon: Trophy, title: 'Gamification', desc: 'XP, darajalar, yutuqlar, haftalik musobaqalar va streak tizimi.', color: 'yellow' },
    { icon: Award, title: 'Sertifikatlar', desc: 'Kurslarni tugatganingizda QR kodli PDF sertifikat qo\'lga kiritasiz.', color: 'cyan' },
    { icon: Code, title: 'Bepul Darslar', desc: 'YouTube, OWASP, PortSwigger dan avtomatik topilgan bepul video darslar.', color: 'blue' },
    { icon: Lock, title: 'Xavfsiz', desc: 'JWT autentifikatsiya, bcrypt parollar, email tasdiqlash.', color: 'yellow' },
  ];

  const stats = [
    { value: '1000+', label: 'Bepul Video Darslar' },
    { value: '10', label: 'O\'rganish Yo\'li' },
    { value: '100%', label: 'Bepul' },
    { value: '24/7', label: 'AI Yordam' },
  ];

  const paths = [
    { icon: '🛡️', name: 'Cybersecurity Fundamentals', desc: 'Asoslardan boshlang' },
    { icon: '🐧', name: 'Linux for Security', desc: 'Linux va xavfsizlik' },
    { icon: '🌐', name: 'Networking Basics', desc: 'TCP/IP, DNS, HTTP' },
    { icon: '🔐', name: 'Web Application Security', desc: 'OWASP Top 10' },
    { icon: '💰', name: 'Bug Bounty', desc: 'Hunter bo\'ling' },
    { icon: '🔍', name: 'SOC Analyst', desc: 'SOC markazda ishlash' },
  ];

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold gradient-text">CyberUz Academy</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="hover:text-cyan-400 transition">Kurslar</Link>
            <Link href="/paths" className="hover:text-cyan-400 transition">Yo\'llar</Link>
            <Link href="/ai-teacher" className="hover:text-cyan-400 transition">AI O\'qituvchi</Link>
            <Link href="/leaderboard" className="hover:text-cyan-400 transition">Reyting</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm hover:text-cyan-400 transition">Kirish</Link>
            <Link href="/register" className="neon-button text-sm">Ro'yxatdan o'tish</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 grid-bg">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-card border-cyan-500/30">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">AI-powered • 100% Bepul • O'zbek tilida</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="gradient-text">Kiberxavfsizlikni</span>
              <br />
              <span className="text-white neon-text">O'rganing</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
              O'zbek tilidagi eng katta bepul kiberxavfsizlik platformasi.
              AI yordamida har 6 soatda yangi darslar topiladi va tizimlashtiriladi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="neon-button inline-flex items-center justify-center gap-2">
                Bepul Boshlash <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/courses" className="neon-button neon-button-yellow inline-flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" /> Kurslarni Ko'rish
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-6">
                <div className="text-3xl md:text-4xl font-black gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="gradient-text">Nima uchun</span> CyberUz Academy?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Zamonaviy AI texnologiyalar va professional ta\'lim metodikasi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card glass-card-hover p-6 group"
              >
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 px-4 grid-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="gradient-text">O'rganish</span> Yo'llari
            </h2>
            <p className="text-gray-400">Boshlovchidan ekspertgacha — 10 ta yo'l</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((path, i) => (
              <Link href="/paths" key={i}>
                <div className="glass-card glass-card-hover p-6 cursor-pointer group">
                  <div className="text-5xl mb-4">{path.icon}</div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-400 transition">{path.name}</h3>
                  <p className="text-gray-400 text-sm">{path.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-yellow-500/10" />
          <div className="relative">
            <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Bugun o'rganishni <span className="gradient-text">boshlang</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Minglab o'quvchilar bilan birga kiberxavfsizlikni bepul o'rganing.
              AI sizga har bir qadamda yordam beradi.
            </p>
            <Link href="/register" className="neon-button inline-flex items-center gap-2">
              Ro'yxatdan o'tish <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span className="font-bold gradient-text">CyberUz Academy</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 CyberUz Academy. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-4">
            <a href="https://github.com/KRYZENSYS/cyberuz-academy" className="hover:text-cyan-400 transition"><Github className="w-5 h-5" /></a>
            <a href="mailto:info@cyberuz.academy" className="hover:text-cyan-400 transition"><Mail className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </main>
  );
}