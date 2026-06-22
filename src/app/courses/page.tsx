import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { BookOpen, Users, Clock, Star, Target } from 'lucide-react';

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: 'desc' }, { enrollmentCount: 'desc' }],
    include: { _count: { select: { lessons: true } } },
  });

  const learningPaths = [
    { value: '', label: 'Barchasi' },
    { value: 'CYBERSECURITY_FUNDAMENTALS', label: 'Kiberxavfsizlik Asoslari' },
    { value: 'LINUX_FOR_SECURITY', label: 'Linux' },
    { value: 'NETWORKING_BASICS', label: 'Tarmoq' },
    { value: 'WEB_APPLICATION_SECURITY', label: 'Veb Xavfsizlik' },
    { value: 'BUG_BOUNTY', label: 'Bug Bounty' },
    { value: 'SOC_ANALYST', label: 'SOC' },
    { value: 'DIGITAL_FORENSICS', label: 'Forensics' },
    { value: 'MALWARE_ANALYSIS', label: 'Malware' },
    { value: 'RED_TEAM', label: 'Red Team' },
    { value: 'BLUE_TEAM', label: 'Blue Team' },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Kurslar</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            10 ta yo'nalish, professional darajadagi kurslar. AI yordamida tuzilgan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="cyber-card group cursor-pointer block"
            >
              {course.thumbnail && (
                <div className="aspect-video bg-cyber-black rounded-lg mb-4 overflow-hidden border border-cyan-500/20">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <span className={`badge badge-${
                  course.difficulty === 'BEGINNER' ? 'green' :
                  course.difficulty === 'INTERMEDIATE' ? 'yellow' :
                  course.difficulty === 'ADVANCED' ? 'blue' : 'red'
                }`}>
                  {course.difficulty === 'BEGINNER' ? 'Boshlang\'ich' :
                   course.difficulty === 'INTERMEDIATE' ? 'O\'rta' :
                   course.difficulty === 'ADVANCED' ? 'Yuqori' : 'Ekspert'}
                </span>
                {course.isFeatured && <span className="badge badge-yellow">⭐ Featured</span>}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-3">{course.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-cyan-500/10">
                <div className="flex items-center gap-1">
                  <BookOpen size={14} />
                  <span>{course._count.lessons} dars</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{course.estimatedHours}s</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{course.enrollmentCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}