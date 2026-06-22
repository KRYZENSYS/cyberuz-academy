'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Trophy, Flame, Loader2 } from 'lucide-react';

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?period=${filter}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
            <Link href="/leaderboard" className="text-sm font-bold text-yellow-400">🏆 Reyting</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="gradient-text">🏆</span> Reyting
          </h1>
          <p className="text-gray-400">Eng ko'p XP to'plagan o'quvchilar</p>
        </div>

        <div className="flex gap-2 justify-center mb-8">
          {[{ v: 'all', l: 'Barcha vaqt' }, { v: 'week', l: 'Hafta' }, { v: 'month', l: 'Oy' }].map((f) => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f.v
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-cyber-dark text-gray-400 hover:text-white'
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Hozircha foydalanuvchilar yo'q</p>
          </div>
        ) : (
          <>
            {/* Top 3 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {users.slice(0, 3).map((u, i) => (
                <div key={u.id} className={`cyber-card text-center ${i === 0 ? 'border-yellow-500/60' : i === 1 ? 'border-gray-400/60' : 'border-orange-500/60'}`}>
                  <div className={`text-3xl mb-2 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : 'text-orange-400'}`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-lg font-black">
                    {(u.fullName || u.username)?.[0]?.toUpperCase()}
                  </div>
                  <div className="font-bold text-sm truncate">{u.fullName || u.username}</div>
                  <div className="text-xs text-gray-400">Daraja {u.level}</div>
                  <div className="text-lg font-black text-cyan-400 mt-2">{u.xp} XP</div>
                </div>
              ))}
            </div>

            {/* Rest */}
            <div className="space-y-2">
              {users.slice(3).map((u, i) => (
                <div key={u.id} className="cyber-card flex items-center gap-4 hover:bg-cyber-black transition">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold flex-shrink-0">
                    {(u.fullName || u.username)?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{u.fullName || u.username}</div>
                    <div className="text-xs text-gray-500">Daraja {u.level} • 🔥 {u.streak || 0}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-cyan-400">{u.xp} XP</div>
                    <div className="text-xs text-gray-500">Daraja {u.level}</div>
                  </div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-cyan-500/20 text-cyan-400">
                    {i + 4}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}