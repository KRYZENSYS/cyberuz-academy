import Link from 'next/link';
import { Shield, Brain, Trophy, BookOpen, Award, Zap, Users, Target, Lock, Code } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const features = [
  { icon: Brain, title: 'AI O\'qituvchi', desc: 'CyberAI o\'zbek tilida darslarni tushuntiradi, savollarga javob beradi.' },
  { icon: BookOpen, title: 'Bepul Darslar', desc: 'YouTube, OWASP, PortSwigger dan minglab bepul darslar.' },
  { icon: Trophy, title: 'XP va Yutuqlar', desc: 'O\'rganing, ball to\'plang, yutuqlar qo\'lga kiriting.' },
  { icon: Award, title: 'Sertifikatlar', desc: 'Kurslarni tugatib, QR-li sertifikat oling.' },
  { icon: Zap, title: 'AI Roadmap', desc: 'Sizga moslashtirilgan o\'rganish rejasi.' },
  { icon: Users, title: 'Jamiyat', desc: 'Forum va Telegram orqali boshqalar bilan muloqot.' },
];

const paths = [
  { slug: 'cybersecurity-fundamentals', title: 'Kiberxavfsizlik Asoslari', level: 'Boshlang\'ich', color: 'green' },
  { slug: 'linux-for-security', title: 'Linux Xavfsizlik Uchun', level: 'Boshlang\'ich', color: 'green' },
  { slug: 'networking-basics', title: 'Tarmoq Asoslari', level: 'Boshlang\'ich', color: 'green' },
  { slug: 'web-application-security', title: 'Veb Xavfsizlik', level: 'O\'rta', color: 'yellow' },
  { slug: 'bug-bounty', title: 'Bug Bounty', level: 'O\'rta', color: 'yellow' },
  { slug: 'soc-analyst', title: 'SOC Mutaxassisi', level: 'O\'rta', color: 'yellow' },
  { slug: 'digital-forensics', title: 'Digital Forensics', level: 'Yuqori', color: 'orange' },
  { slug: 'malware-analysis', title: 'Malware Analysis', level: 'Yuqori', color: 'orange' },
  { slug: 'red-team', title: 'Red Team', level: 'Ekspert', color: 'red' },
  { slug: 'blue-team', title: 'Blue Team', level: 'Ekspert', color: 'red' },
];

const stats = [
  { value: '10+', label: 'O\'rganish yo\'li' },
  { value: '500+', label: 'Bepul darslar' },
  { value: 'AI', label: 'O\'qituvchi' },
  { value: '100%', label: 'Bepul' },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12">
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-cyan-500/30 bg-cyan-500/5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-cyan-400 text-sm font-mono">v1.0.0 — Ochiq beta</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="gradient-text">Kiberxavfsizlikni</span>
            <br />
            <span className="neon-text">O'rganing Bepul</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            O'zbek tilidagi <span className="text-cyan-400 font-semibold">birinchi professional</span> kiberxavfsizlik platformasi.
            AI yordamida <span className="text-yellow-400 font-semibold">avtomatik</span> darslar,
            <span className="text-cyan-400 font-semibold">10 ta</span> o'rganish yo'li va sertifikatlar — <span className="text-yellow-400 font-bold">barchasi bepul</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register" className="btn-neon text-base px-8 py-4">
              🚀 O'rganishni Boshlash
            </Link>
            <Link href="/courses" className="btn-outline text-base px-8 py-4">
              Kurslarni Ko'rish
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="cyber-card text-center">
                <div className="text-4xl md:text-5xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Nima uchun CyberUz?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              AI, gamification va professional kontent — hammasi bitta platformada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="cyber-card group">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* LEARNING PATHS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">O'rganish Yo'llari</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Bosqichma-bosqich professional darajaga yeting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((p) => (
              <Link
                key={p.slug}
                href={`/courses/${p.slug}`}
                className="cyber-card group cursor-pointer block"
              >
                <div className="flex items-start justify-between mb-3">
                  <Target className="w-8 h-8 text-cyan-400 group-hover:rotate-12 transition-transform" />
                  <span className={`badge badge-${p.color}`}>{p.level}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {p.title}
                </h3>
                <div className="flex items-center text-cyan-400 text-sm font-medium">
                  Boshlash <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="cyber-card">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="gradient-text">Qanday Ishlaydi?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { n: '01', title: 'Ro\'yxatdan o\'ting', desc: 'Bepul akkaunt yarating, 30 soniyada', icon: Shield },
                { n: '02', title: 'Yo\'lni tanlang', desc: '10 ta yo\'ldan o\'zingizga mosini toping', icon: Target },
                { n: '03', title: 'O\'rganing', desc: 'Video darslar, AI yordam, quiz', icon: Code },
                { n: '04', title: 'Sertifikat oling', desc: 'Kurs tugagach QR-li PDF sertifikat', icon: Award },
              ].map((s) => (
                <div key={s.n} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500 flex items-center justify-center mx-auto mb-4">
                    <s.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div className="text-cyan-400 font-mono text-sm mb-2">{s.n}</div>
                  <h3 className="text-white font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="cyber-card text-center neon-border pulse-glow">
            <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
              Kiberxavfsizlik Karyerangizni Boshlang
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Bugun ro'yxatdan o'ting va birinchi darsdan boshlang. Butunlay bepul.
            </p>
            <Link href="/register" className="btn-neon btn-neon-yellow text-base px-10 py-4 inline-block">
              ⚡ Bepul Boshlash
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}