'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Users, BookOpen, Trophy, Activity, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStats(), fetchActivity()]);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (res.ok) setStats(data.stats);
      else toast.error(data.error || 'Admin panelga kirish taqiqlangan');
    } catch {
      toast.error('Server xatoligi');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await fetch('/api/admin/activity');
      const data = await res.json();
      if (res.ok) setActivity(data.activity || []);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="text-lg font-bold gradient-text">CyberUz Academy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm hover:text-cyan-400">Dashboard</Link>
            <span className="text-sm font-bold text-yellow-400">👑 Admin</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="gradient-text">Admin</span> Panel
          </h1>
          <p className="text-gray-400">Platforma statistikasi va boshqaruv</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Foydalanuvchilar', value: stats?.totalUsers || 0, color: 'cyan' },
            { icon: BookOpen, label: 'Kurslar', value: stats?.totalCourses || 0, color: 'blue' },
            { icon: Trophy, label: 'Darslar', value: stats?.totalLessons || 0, color: 'cyan' },
            { icon: Activity, label: 'Faollik', value: stats?.activeUsers || 0, color: 'yellow' },
          ].map((stat, i) => (
            <div key={i} className="glass-card glass-card-hover p-4 text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-2 text-${stat.color}-400`} />
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/courses" className="glass-card glass-card-hover p-6 group block">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-cyan-400" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-xl font-bold mb-2">Kurslarni Boshqarish</h3>
            <p className="text-gray-400 text-sm">Kurslar, darslar va yo'llarni boshqaring</p>
          </Link>

          <Link href="/admin/lessons" className="glass-card glass-card-hover p-6 group block">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-yellow-400" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-xl font-bold mb-2">Dars Qo'shish</h3>
            <p className="text-gray-400 text-sm">YouTube dan avtomatik darslar qo'shing</p>
          </Link>

          <Link href="/admin/users" className="glass-card glass-card-hover p-6 group block">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-xl font-bold mb-2">Foydalanuvchilar</h3>
            <p className="text-gray-400 text-sm">Foydalanuvchilar, XP va yutuqlarni ko'ring</p>
          </Link>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" /> So'nggi Faollik
          </h3>
          {activity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Hozircha faollik yo'q</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activity.slice(0, 10).map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-cyber-black/50">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{a.message || a.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(a.createdAt).toLocaleString('uz-UZ')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}