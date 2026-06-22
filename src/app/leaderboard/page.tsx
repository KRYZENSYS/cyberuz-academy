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
    } catch (e) {
      console.error(e);
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
            <span className="text-sm font-bold text-yellow-400">🏆 Reyting</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="gradient-text">🏆</span> Reyting
          </h1>
          <p className="text-gray-400">Eng ko'p XP to'plagan o'quvchilar</p>
        </div>

        <div className="flex gap-2 justify-center mb-8">
          {(['all', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                filter === p
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-cyber-dark text-gray-400 hover:text-white'
              }`}
            >
              {p === 'all' ? 'Barcha vaqt' : p === 'week' ? 'Hafta' : 'Oy'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">Hozircha foydalanuvchilar yo'q</p>
          </div>
        ) : (
          <>
            {/* Top 3 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {users.slice(0, 3).map((u, i) => (
                <div key={u.id} className={`glass-card glass-card-hover p-6 text-center ${i === 0 ? 'border-yellow-400/50' : i === 1 ? 'border-gray-300/50' : 'border-orange-400/50'}`}>
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${
                    i === 0 ? 'from-yellow-400 to-yellow-600' :
                    i === 1 ? 'from-gray-300 to-gray-500' :
                    'from-orange-400 to-orange-600'
                  } flex items-center justify-center text-2xl font-black text-black`}>
                    {(u.fullName || u.username)?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="text-3xl mb-2">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                  <div className="font-bold truncate">{u.fullName || u.username}</div>
                  <div className="text-xs text-gray-400">@{u.username}</div>
                  <div className="text-cyan-400 font-bold mt-2">{u.xp} XP</div>
                </div>
              ))}
            </div>

            {/* Other ranks */}
            <div className="glass-card p-6">
              <div className="space-y-3">
                {users.slice(3).map((user, i) => (
                  <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg bg-cyber-black/50 hover:bg-cyber-black transition">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold flex-shrink-0">
                      {(user.fullName || user.username)?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{user.fullName || user.username}</div>
                      <div className="text-xs text-gray-500">@{user.username} · Daraja {user.level || 1}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">{user.xp} XP</div>
                      <div className="text-xs text-gray-500">Daraja {user.level || 1}</div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-sm flex-shrink-0">
                      {i + 4}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}