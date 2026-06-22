'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Trophy, BookOpen, Award, Flame, Calendar, Edit, LogOut, Loader2, Zap, Target, Star, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', bio: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, statsRes, achRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/user/stats'),
        fetch('/api/user/achievements'),
      ]);
      const [userData, statsData, achData] = await Promise.all([
        userRes.json(),
        statsRes.json(),
        achRes.json(),
      ]);

      if (!userData.user) {
        router.push('/login');
        return;
      }

      setUser(userData.user);
      setStats(statsData.stats);
      setAchievements(achData.achievements || []);
      setFormData({
        fullName: userData.user.fullName || '',
        bio: userData.user.profile?.bio || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Profil yangilandi');
        setEditing(false);
        fetchData();
      } else {
        toast.error('Xatolik yuz berdi');
      }
    } catch (err) {
      toast.error('Tarmoq xatoligi');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Chiqdingiz');
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
    <div className="min-h-screen pb-12">
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="text-lg font-bold gradient-text">CyberUz Academy</span>
          </Link>
          <Link href="/dashboard" className="text-sm hover:text-cyan-400">← Dashboard</Link>
        </div>
      </nav>

      <div className="pt-24 px-4 max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="glass-card p-8 mb-6 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-yellow-500 flex items-center justify-center text-3xl font-black">
              {(user.fullName || user.username)?.[0]?.toUpperCase()}
            </div>

            <div className="flex-1">
              {editing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field mb-2 text-2xl font-bold"
                  placeholder="To'liq ism"
                />
              ) : (
                <h1 className="text-3xl font-black mb-1">
                  {user.fullName || user.username}
                </h1>
              )}
              <p className="text-gray-400 mb-2">@{user.username} • {user.email}</p>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-cyan">
                  <Zap className="w-3 h-3 mr-1" /> Daraja {user.level}
                </span>
                <span className="badge badge-yellow">
                  <Flame className="w-3 h-3 mr-1" /> {user.streak} kun streak
                </span>
                <span className="badge badge-blue">
                  {user.role === 'ADMIN' ? '👑 Admin' : user.role === 'INSTRUCTOR' ? '🎓 O\'qituvchi' : '🎯 Talaba'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {editing ? (
                <>
                  <button onClick={handleSave} className="neon-button text-sm">Saqlash</button>
                  <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm bg-cyber-dark rounded-lg">Bekor</button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="neon-button text-sm flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Tahrirlash
                </button>
              )}
              <button onClick={handleLogout} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6 pt-6 border-t border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Daraja {user.level} → {user.level + 1}</span>
              <span className="text-sm font-bold text-cyan-400">{user.xp.toLocaleString()} / {xpForNext} XP</span>
            </div>
            <div className="h-3 bg-cyber-black rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-yellow-500 transition-all"
                style={{ width: `${Math.min(xpProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: BookOpen, label: 'Tugatilgan Darslar', value: stats?.lessonsCompleted || 0, color: 'cyan' },
            { icon: Trophy, label: 'Tugatilgan Kurslar', value: stats?.coursesCompleted || 0, color: 'yellow' },
            { icon: Award, label: 'Sertifikatlar', value: stats?.certificates || 0, color: 'yellow' },
            { icon: MessageSquare, label: 'Izohlar', value: stats?.comments || 0, color: 'blue' },
          ].map((stat, i) => (
            <div key={i} className="glass-card glass-card-hover p-4 text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-2 text-${stat.color}-400`} />
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" /> Yutuqlar ({achievements.filter(a => a.completed).length}/{achievements.length})
          </h2>
          {achievements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Yutuqlar mavjud emas</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-4 rounded-lg border ${
                    ach.completed
                      ? 'border-yellow-500/50 bg-yellow-500/10'
                      : 'border-gray-700 bg-cyber-black/50 opacity-60'
                  }`}
                >
                  <div className="text-3xl mb-2">{ach.icon || '🏆'}</div>
                  <h3 className="font-bold text-sm mb-1">{ach.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">{ach.description}</p>
                  {ach.completed ? (
                    <span className="badge badge-yellow text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Qo'lga kiritilgan
                    </span>
                  ) : (
                    <span className="badge text-xs">+{ach.xpReward} XP</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificates */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-cyan-400" /> Sertifikatlarim
          </h2>
          {(stats?.certificateList || []).length === 0 ? (
            <p className="text-gray-500 text-center py-8">Hozircha sertifikatlar yo'q. Kurslarni tugating!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(stats.certificateList || []).map((cert: any) => (
                <Link href={`/verify/${cert.uniqueId}`} key={cert.id}>
                  <div className="glass-card glass-card-hover p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-10 h-10 text-yellow-400" />
                      <div>
                        <h3 className="font-bold">{cert.courseName}</h3>
                        <p className="text-xs text-gray-400">{new Date(cert.issuedAt).toLocaleDateString('uz-UZ')}</p>
                      </div>
                    </div>
                    <p className="text-xs text-cyan-400 font-mono">{cert.uniqueId}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}