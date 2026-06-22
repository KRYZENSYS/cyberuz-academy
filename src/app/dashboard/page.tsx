import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Trophy, Flame, BookOpen, Award, Brain, Target, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { xpForNextLevel } from '@/lib/gamification';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');

  const [progress, certificates, achievements, recentLessons, leaderboardPos] = await Promise.all([
    prisma.userProgress.findMany({
      where: { userId: user.id },
      include: { course: true, lesson: true },
      orderBy: { lastWatchedAt: 'desc' },
      take: 5,
    }),
    prisma.certificate.findMany({
      where: { userId: user.id },
      include: { course: true },
      take: 3,
      orderBy: { issuedAt: 'desc' },
    }),
    prisma.userAchievement.findMany({
      where: { userId: user.id, completed: true },
      include: { achievement: true },
      take: 6,
      orderBy: { unlockedAt: 'desc' },
    }),
    prisma.lesson.findMany({
      where: { isPublished: true },
      include: { course: true, video: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where: { xp: { gt: user.xp }, isBanned: false } }),
  ]);

  const nextLevelXP = xpForNextLevel(user.level);
  const prevLevelXP = xpForNextLevel(user.level - 1);
  const progressPercent = ((user.xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Salom, <span className="gradient-text">{user.fullName || user.username}</span> 👋
          </h1>
          <p className="text-gray-400">Bugun ham o'rganishni davom eting!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="cyber-card">
            <div className="flex items-center justify-between mb-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <span className="text-xs text-gray-500">XP</span>
            </div>
            <div className="text-3xl font-black text-yellow-400">{user.xp}</div>
            <div className="mt-3">
              <div className="text-xs text-gray-400 mb-1 flex justify-between">
                <span>Daraja {user.level}</span>
                <span>{user.xp}/{nextLevelXP}</span>
              </div>
              <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-yellow-400"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="cyber-card">
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-8 h-8 text-orange-400" />
              <span className="text-xs text-gray-500">Streak</span>
            </div>
            <div className="text-3xl font-black text-orange-400">{user.streak}</div>
            <div className="text-xs text-gray-400 mt-3">kun ketma-ket</div>
          </div>

          <div className="cyber-card">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 text-cyan-400" />
              <span className="text-xs text-gray-500">Sertifikat</span>
            </div>
            <div className="text-3xl font-black text-cyan-400">{certificates.length}</div>
            <div className="text-xs text-gray-400 mt-3">qo'lga kiritilgan</div>
          </div>

          <div className="cyber-card">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <span className="text-xs text-gray-500">Reyting</span>
            </div>
            <div className="text-3xl font-black text-blue-400">#{leaderboardPos + 1}</div>
            <div className="text-xs text-gray-400 mt-3">o'rindagi</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 cyber-card">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-cyan-400" />
              Davom Ettirish
            </h2>
            {progress.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Target className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p>Hozircha darslar boshlanmagan</p>
                <Link href="/courses" className="btn-neon mt-4 inline-block text-sm">
                  Kurslarni Ko'rish
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {progress.map((p) => (
                  <Link
                    key={p.id}
                    href={p.lessonId ? `/lessons/${p.lessonId}` : `/courses/${p.course.slug}`}
                    className="block p-3 rounded-lg bg-cyber-black/50 hover:bg-cyber-black border border-transparent hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-white">{p.course.title}</div>
                      <span className="text-xs text-cyan-400">{p.progress}%</span>
                    </div>
                    {p.lesson && <div className="text-sm text-gray-400 mb-2">{p.lesson.title}</div>}
                    <div className="h-1.5 bg-cyber-dark rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${p.progress}%` }} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="cyber-card">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Yutuqlar
            </h2>
            {achievements.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                Yutuqlar hali yo'q
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((ua) => (
                  <div key={ua.id} className="text-center group">
                    <div className="text-4xl mb-1 group-hover:scale-110 transition-transform">{ua.achievement.icon}</div>
                    <div className="text-xs text-gray-400 truncate">{ua.achievement.title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="cyber-card mb-8 neon-border-yellow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">CyberAI tavsiya qiladi</h3>
              <p className="text-gray-300 mb-3">Yangi darslarga tayyor bo'lasizmi? AI bilan suhbatlashing.</p>
              <Link href="/ai-teacher" className="btn-neon text-sm py-2 px-5 inline-block">
                AI bilan Suhbat
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Lessons */}
        <div className="cyber-card">
          <h2 className="text-2xl font-bold mb-4">Yangi Darslar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentLessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="block group cursor-pointer"
              >
                <div className="aspect-video bg-cyber-black rounded-lg mb-3 overflow-hidden relative border border-cyan-500/20 group-hover:border-cyan-500/60 transition-colors">
                  {lesson.video?.thumbnail ? (
                    <img src={lesson.video.thumbnail} alt={lesson.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-cyan-400/40" />
                    </div>
                  )}
                </div>
                <div className="text-xs text-cyan-400 mb-1">{lesson.course.title}</div>
                <div className="font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {lesson.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}