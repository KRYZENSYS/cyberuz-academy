'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Users, BookOpen, Trophy, Activity, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/activity'),
      ]);
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      } else {
        toast.error('Admin panelga kirish taqiqlangan');
      }
      if (activityRes.ok) {
        const data = await activityRes.json();
        setActivity(data.activity || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
            <Link href="/admin" className="text-sm font-bold text-yellow-400">👑 Admin</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
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
          ].map((s, i) => (
            <div key={i} className="cyber-card">
              <s.icon className={`w-8 h-8 text-${s.color}-400 mb-3`} />
              <div className="text-3xl font-black">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/courses">
            <div className="cyber-card cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-8 h-8 text-cyan-400" />
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
              </div>
              <h3 className="text-xl font-bold mb-2">Kurslar</h3>
              <p className="text-gray-400 text-sm">Barcha kurslarni boshqaring</p>
            </div>
          </Link>
          <Link href="/admin/lessons">
            <div className="cyber-card cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition" />
              </div>
              <h3 className="text-xl font-bold mb-2">Darslar</h3>
              <p className="text-gray-400 text-sm">YouTube darslar qo'shing</p>
            </div>
          </Link>
          <Link href="/admin/users">
            <div className="cyber-card cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-400" />
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
              </div>
              <h3 className="text-xl font-bold mb-2">Foydalanuvchilar</h3>
              <p className="text-gray-400 text-sm">Barcha userlarni boshqaring</p>
            </div>
          </Link>
        </div>

        <div className="cyber-card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" /> So'nggi Faollik
          </h3>
          {activity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Hozircha faollik yo'q</div>
          ) : (
            <div className="space-y-3">
              {activity.slice(0, 10).map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-cyber-black/50">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <div className="flex-1">
                    <p className="text-sm">{a.message}</p>
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