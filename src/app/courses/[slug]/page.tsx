'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, BookOpen, Clock, Trophy, ArrowRight, CheckCircle2, Play, Loader2, Award, Target } from 'lucide-react';
import { getDifficultyLabel } from '@/lib/utils';

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${slug}`);
      const data = await res.json();
      setCourse(data.course);
      setLessons(data.course?.lessons || []);
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

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Kurs topilmadi</p>
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
          <Link href="/courses" className="text-sm hover:text-cyan-400">← Kurslar</Link>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="badge badge-cyan">{getDifficultyLabel(course.difficulty)}</span>
            <span className="badge badge-blue">
              <Clock className="w-3 h-3 mr-1" />
              {course.estimatedHours} soat
            </span>
            <span className="badge badge-yellow">
              <Trophy className="w-3 h-3 mr-1" />
              +{course.estimatedHours * 10} XP
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 gradient-text">{course.title}</h1>
          <p className="text-lg text-gray-300 mb-6">{course.description}</p>

          <div className="flex flex-wrap gap-3">
            {lessons[0] && (
              <Link href={`/lessons/${lessons[0].id}`} className="neon-button inline-flex items-center gap-2">
                <Play className="w-5 h-5" /> Kursni Boshlash
              </Link>
            )}
            <button className="neon-button neon-button-yellow inline-flex items-center gap-2">
              <Award className="w-5 h-5" /> Sertifikat olish
            </button>
          </div>
        </div>

        {/* Skills */}
        {course.skills?.length > 0 && (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" /> O'rganiladigan Ko'nikmalar
            </h2>
            <div className="flex flex-wrap gap-2">
              {course.skills.map((skill: string, i: number) => (
                <span key={i} className="badge badge-cyan">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Lessons */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            Darslar ({lessons.length})
          </h2>
          {lessons.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Darslar tez orada qo'shiladi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, i) => (
                <Link href={`/lessons/${lesson.id}`} key={lesson.id}>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-cyber-black/50 hover:bg-cyber-black border border-cyan-500/10 hover:border-cyan-500/40 transition group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-cyan-400 transition">{lesson.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{lesson.description}</p>
                    </div>
                    {lesson.isFree && <span className="badge badge-yellow text-xs">Bepul</span>}
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
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