import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Clock, Users, Trophy, Target, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        include: { video: true },
      },
      _count: { select: { lessons: true } },
    },
  });

  if (!course) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 fade-in">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`badge badge-${
                  course.difficulty === 'BEGINNER' ? 'green' :
                  course.difficulty === 'INTERMEDIATE' ? 'yellow' :
                  course.difficulty === 'ADVANCED' ? 'blue' : 'red'
                }`}>
                  {course.difficulty}
                </span>
                {course.isFeatured && <span className="badge badge-yellow">⭐ Featured</span>}
                {course.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="badge badge-cyan">#{tag}</span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">{course.title}</h1>
              <p className="text-lg text-gray-300 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  {course._count.lessons} dars
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  {course.estimatedHours} soat
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  {course.enrollmentCount} o'quvchi
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Sertifikat
                </div>
              </div>
            </div>

            <div className="cyber-card mb-6">
              <h2 className="text-2xl font-bold mb-4">O'rganish Rejasi</h2>
              <div className="space-y-3">
                {course.lessons.map((lesson, idx) => (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg bg-cyber-black/50 hover:bg-cyber-black border border-transparent hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold flex-shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white group-hover:text-cyan-400 transition-colors truncate">
                        {lesson.title}
                      </div>
                      {lesson.duration > 0 && (
                        <div className="text-xs text-gray-500">{Math.floor(lesson.duration / 60)} daqiqa</div>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
                {course.lessons.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Tez orada darslar qo'shiladi
                  </div>
                )}
              </div>
            </div>

            {course.prerequisites.length > 0 && (
              <div className="cyber-card mb-6">
                <h2 className="text-2xl font-bold mb-4">Oldindan Bilish Kerak</h2>
                <div className="flex flex-wrap gap-2">
                  {course.prerequisites.map((p) => (
                    <Link key={p} href={`/courses/${p}`} className="badge badge-cyan">
                      {p}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {course.skills.length > 0 && (
              <div className="cyber-card">
                <h2 className="text-2xl font-bold mb-4">O'rganasiz</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {course.skills.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-gray-300">
                      <Target className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="cyber-card sticky top-24">
              <h3 className="text-xl font-bold mb-4">Kurs Haqida</h3>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Daraja:</span>
                  <span className="text-white font-medium">{course.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Davomiyligi:</span>
                  <span className="text-white font-medium">{course.estimatedHours}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Darslar:</span>
                  <span className="text-white font-medium">{course._count.lessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Til:</span>
                  <span className="text-white font-medium">O'zbekcha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Narxi:</span>
                  <span className="text-yellow-400 font-bold text-lg">BEPUL</span>
                </div>
              </div>

              <Link href={course.lessons[0] ? `/lessons/${course.lessons[0].id}` : '/register'} className="btn-neon w-full text-center block">
                🚀 Boshlash
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}