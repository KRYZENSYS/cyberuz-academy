'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Trophy, Zap, BookOpen, TrendingUp, Clock, Award, Flame, ArrowRight, LogOut, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.user) {
        router.push('/login');
        return;
      }
      setUser(data.user);
      setStats({
        coursesEnrolled: 0,
        lessonsCompleted: 0,
        certificates: 0,
        totalXp: data.user.xp,
        streak: data.user.streak,
      });
    } catch (err) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Tizimdan chiqdingiz');
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const xpForNext = Math.pow(user.level, 2) * 100;
  const xpProgress = ((user.xp % 100) / 100) * 100;

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="text-lg font-bold gradient-text">CyberUz Academy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/courses" className="hidden sm:block hover:text-cyan-400 transition text-sm">Kurslar</Link>
            <Link href="/ai-teacher" className="hidden sm:block hover:text-cyan-400 transition text-sm">AI</Link>
            <Link href="/profile" className="flex items-center gap-2 hover:opacity-80">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-sm">
                {(user.fullName || user.username)?.[0]?.toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm">{user.username}</span>
            </Link>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Salom, <span className="gradient-text">{user.fullName || user.username}</span> 👋
          </h1>
          <p className="text-gray-400">Bugun ham yangi bilim olish vaqti!</p>
        </div>

        {/* Level & XP */}
        <div className="glass-card p-6 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Daraja</div>
                <div className="text-2xl font-black text-cyan-400">{user.level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Jami XP</div>
              <div className="text-2xl font-black text-yellow-400">{user.xp.toLocaleString()}</div>
            </div>
          </div>
          <div className="relative h-3 bg-cyber-black rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Keyingi darajagacha: {xpForNext - user.xp} XP
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Flame, label: 'Streak', value: user.streak, color: 'yellow' },
            { icon: BookOpen, label: 'Kurslar', value: stats?.coursesEnrolled || 0, color: 'cyan' },
            { icon: Trophy, label: 'Yutuqlar', value: stats?.lessonsCompleted || 0, color: 'cyan' },
            { icon: Award, label: 'Sertifikat', value: stats?.certificates || 0, color: 'yellow' },
          ].map((stat, i) => (
            <div key={i} className="glass-card glass-card-hover p-4">
              <stat.icon className={`w-8 h-8 text-${stat.color}-400 mb-2`} />
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/courses">
            <div className="glass-card glass-card-hover p-6 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
              </div>
              <h3 className="text-xl font-bold mb-2">Kurslarni Davom Ettirish</h3>
              <p className="text-gray-400 text-sm">Bepul kiberxavfsizlik kurslarini o'rganing</p>
            </div>
          </Link>

          <Link href="/ai-teacher">
            <div className="glass-card glass-card-hover p-6 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-yellow-500/5" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-yellow-500 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition" />
                </div>
                <h3 className="text-xl font-bold mb-2">CyberAI O'qituvchi</h3>
                <p className="text-gray-400 text-sm">Sun'iy intellekt bilan suhbatlashing</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" /> So'nggi Faollik
          </h3>
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Hozircha faollik yo'q</p>
            <Link href="/courses" className="text-cyan-400 hover:underline text-sm">
              Birinchi kursni boshlang →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}