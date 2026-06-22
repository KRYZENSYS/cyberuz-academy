'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Play, CheckCircle, Brain, Loader2, ArrowLeft, ArrowRight, Award, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      const data = await res.json();
      if (res.ok) setLesson(data.lesson);
      else toast.error(data.error);
    } catch {
      toast.error('Server xatoligi');
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: 100, completed: true, watchTime: lesson?.duration || 0, courseId: lesson.courseId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCompleted(true);
        setProgress(100);
        if (data.xpResult) toast.success(`+${data.xpResult.xpAwarded} XP! 🎉`);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error('Tarmoq xatoligi');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Dars topilmadi</p>
          <Link href="/courses" className="btn-neon text-sm">Kurslarga qaytish</Link>
        </div>
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
          <Link href={`/courses/${lesson.course?.slug}`} className="text-sm hover:text-cyan-400 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> {lesson.course?.title}
          </Link>
        </div>
      </nav>

      <div className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="aspect-video bg-cyber-black rounded-xl overflow-hidden border border-cyan-500/30 mb-4 relative">
              {lesson.video?.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${lesson.video.youtubeId}?modestbranding=1&rel=0`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-20 h-20 text-cyan-400 opacity-50" />
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="glass-card p-6 mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="badge badge-cyan">{lesson.course?.title}</span>
                {completed && <span className="badge badge-green">✓ Tugatilgan</span>}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3">{lesson.title}</h1>
              {lesson.description && <p className="text-gray-300 mb-4">{lesson.description}</p>}

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <button
                onClick={markComplete}
                disabled={completed}
                className={`btn-neon w-full ${completed ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {completed ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Dars tugatildi
                  </span>
                ) : (
                  '✓ Darsni tugatdim'
                )}
              </button>
            </div>

            {/* AI Teacher Button */}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="glass-card glass-card-hover w-full p-4 flex items-center justify-between mb-4"
            >
              <span className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-cyan-400" />
                <span className="font-bold">CyberAI dan savol berish</span>
              </span>
              <MessageCircle className="w-5 h-5 text-gray-500" />
            </button>

            {chatOpen && (
              <div className="glass-card p-4 mb-4">
                <p className="text-sm text-gray-400 mb-3">Bu dars haqida AI dan tushuntirish so'rang:</p>
                <Link
                  href={`/ai-teacher?lesson=${encodeURIComponent(lesson.title)}&course=${encodeURIComponent(lesson.course?.title || '')}`}
                  className="btn-neon w-full flex items-center justify-center gap-2"
                >
                  <Brain className="w-4 h-4" /> AI ga o'tish
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="glass-card p-5 sticky top-20">
              <h3 className="text-lg font-bold mb-4">Kurs darslari</h3>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {lesson.course?.lessons?.map((l: any, i: number) => (
                  <Link
                    key={l.id}
                    href={`/lessons/${l.id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition ${
                      l.id === lessonId ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-cyber-black/50 hover:bg-cyber-black'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      l.id === lessonId ? 'bg-cyan-500 text-white' : 'bg-cyber-dark text-gray-400'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{l.title}</div>
                      {l.duration > 0 && <div className="text-xs text-gray-500">{Math.floor(l.duration / 60)} daq</div>}
                    </div>
                    {l.id === lessonId && <Play className="w-4 h-4 text-cyan-400" />}
                  </Link>
                ))}
              </div>

              {lesson.course?.lessons?.length > 0 && (
                <Link href={`/courses/${lesson.course.slug}`} className="btn-outline w-full mt-4 text-center block text-sm py-2">
                  Kurs sahifasiga o'tish
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}