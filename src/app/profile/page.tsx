import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Flame, BookOpen, Award, LogOut, Settings, Edit3, Shield, Target } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { xpForNextLevel } from '@/lib/gamification';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [completedLessons, certificates, achievements] = await Promise.all([
    prisma.userProgress.count({ where: { userId: user.id, completed: true } }),
    prisma.certificate.count({ where: { userId: user.id } }),
    prisma.userAchievement.count({ where: { userId: user.id, completed: true } }),
  ]);

  const nextLevelXP = xpForNextLevel(user.level);
  const progressPercent = (user.xp / nextLevelXP) * 100;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cyber-card mb-6 fade-in">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-4xl font-black flex-shrink-0">
              {(user.fullName || user.username)?.[0]?.toUpperCase() || '?'}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{user.fullName || user.username}</h1>
                  <p className="text-gray-400 mb-2">@{user.username}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge badge-yellow">⭐ Daraja {user.level}</span>
                    {user.role === 'ADMIN' && <span className="badge badge-red">👑 Admin</span>}
                    {user.emailVerified && <span className="badge badge-green">✓ Tasdiqlangan</span>}
                  </div>
                </div>
                <Link href="/profile/edit" className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" /> Tahrirlash
                </Link>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Daraja {user.level}</span>
                  <span>{user.xp} / {nextLevelXP} XP</span>
                </div>
                <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-yellow-400" style={{ width: `${Math.min(progressPercent, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="cyber-card text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-yellow-400">{user.xp}</div>
            <div className="text-xs text-gray-400 mt-1">XP</div>
          </div>
          <div className="cyber-card text-center">
            <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-orange-400">{user.streak}</div>
            <div className="text-xs text-gray-400 mt-1">Kun streak</div>
          </div>
          <div className="cyber-card text-center">
            <BookOpen className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-cyan-400">{completedLessons}</div>
            <div className="text-xs text-gray-400 mt-1">Dars tugatilgan</div>
          </div>
          <div className="cyber-card text-center">
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-yellow-400">{certificates}</div>
            <div className="text-xs text-gray-400 mt-1">Sertifikat</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cyber-card">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" /> Ma'lumotlar
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-cyan-500/10">
                <span className="text-gray-400">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-cyan-500/10">
                <span className="text-gray-400">Username:</span>
                <span className="font-medium">@{user.username}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-cyan-500/10">
                <span className="text-gray-400">Daraja:</span>
                <span className="font-medium text-yellow-400">{user.level}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Yutuqlar:</span>
                <span className="font-medium">{achievements}</span>
              </div>
            </div>
          </div>

          <div className="cyber-card">
            <h3 className="text-xl font-bold mb-4">Tezkor havolalar</h3>
            <div className="space-y-2">
              <Link href="/dashboard" className="flex items-center justify-between p-3 rounded-lg bg-cyber-black/50 hover:bg-cyber-black transition">
                <span className="flex items-center gap-2"><Target className="w-4 h-4 text-cyan-400" /> Dashboard</span>
                <span>→</span>
              </Link>
              <Link href="/leaderboard" className="flex items-center justify-between p-3 rounded-lg bg-cyber-black/50 hover:bg-cyber-black transition">
                <span className="flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-400" /> Reyting</span>
                <span>→</span>
              </Link>
              <Link href="/courses" className="flex items-center justify-between p-3 rounded-lg bg-cyber-black/50 hover:bg-cyber-black transition">
                <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-cyan-400" /> Kurslar</span>
                <span>→</span>
              </Link>
              <form action="/api/auth/logout" method="POST" className="contents">
                <button type="submit" className="w-full flex items-center justify-between p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition text-red-400">
                  <span className="flex items-center gap-2"><LogOut className="w-4 h-4" /> Chiqish</span>
                  <span>→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}