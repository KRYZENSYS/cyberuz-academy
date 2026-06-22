'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowLeft, BookOpen, Brain, MessageCircle, Send, Loader2, CheckCircle2, Clock, Trophy, Lightbulb, FileText, Bookmark, BookmarkCheck } from 'lucide-react';
import { getYouTubeId } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'transcript' | 'summary' | 'quiz'>('notes');
  const [bookmarked, setBookmarked] = useState(false);
  const [notes, setNotes] = useState('');

  // AI Chat
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchLesson = async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      const data = await res.json();
      setLesson(data.lesson);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || aiLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          lessonTitle: lesson?.title,
          courseTitle: lesson?.course?.title,
          history: messages,
        }),
      });
      const data = await res.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      toast.error('AI javob berolmadi');
    } finally {
      setAiLoading(false);
    }
  };

  const toggleBookmark = async () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Bookmark olib tashlandi' : 'Bookmark qilindi');
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
        <p className="text-gray-400">Dars topilmadi</p>
      </div>
    );
  }

  const videoUrl = lesson.video?.embedUrl;

  return (
    <div className="min-h-screen pb-12">
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="text-lg font-bold gradient-text">CyberUz Academy</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-lg transition ${bookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
            >
              {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="neon-button text-sm flex items-center gap-2"
            >
              <Brain className="w-4 h-4" /> CyberAI
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-20 px-4 max-w-7xl mx-auto">
        {/* Back button */}
        <Link href={`/courses/${lesson.course?.slug}`} className="inline-flex items-center gap-2 text-cyan-400 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" /> Kursga qaytish
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video */}
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden glass-card">
              {videoUrl ? (
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Video tez orada qo'shiladi</p>
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-black mb-2">{lesson.title}</h1>
              <p className="text-gray-400">{lesson.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {lesson.video?.duration && (
                  <span className="badge badge-cyan">
                    <Clock className="w-3 h-3 mr-1" />
                    {Math.floor(lesson.video.duration / 60)} daq
                  </span>
                )}
                <span className="badge badge-yellow">
                  <Trophy className="w-3 h-3 mr-1" /> +10 XP
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="glass-card overflow-hidden">
              <div className="flex border-b border-cyan-500/20">
                {[
                  { id: 'notes', label: 'Qaydlar', icon: FileText },
                  { id: 'transcript', label: 'Transcript', icon: BookOpen },
                  { id: 'summary', label: 'AI Xulosa', icon: Lightbulb },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'notes' && (
                  <div>
                    <h3 className="font-bold mb-3">Shaxsiy Qaydlaringiz</h3>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Bu dars bo'yicha qaydlaringizni yozing..."
                      className="input-field min-h-[200px] resize-y"
                    />
                    <button
                      onClick={() => toast.success('Qaydlar saqlandi')}
                      className="neon-button mt-3 text-sm"
                    >
                      Saqlash
                    </button>
                  </div>
                )}

                {activeTab === 'transcript' && (
                  <div>
                    <h3 className="font-bold mb-3">Video Matni</h3>
                    {lesson.video?.transcript ? (
                      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {lesson.video.transcript}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">Transcript mavjud emas</p>
                    )}
                  </div>
                )}

                {activeTab === 'summary' && (
                  <div>
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" /> AI Xulosa
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="glass-card p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" /> Keyingi Darslar
              </h3>
              <div className="text-gray-400 text-sm">
                Kursning boshqa darslari tez orada
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="font-bold mb-3">Asosiy Tushunchalar</h3>
              <div className="flex flex-wrap gap-2">
                {(lesson.video?.tags || ['security', 'tutorial']).map((tag: string, i: number) => (
                  <span key={i} className="badge badge-cyan text-xs">{tag}</span>
                ))}
              </div>
            </div>

            <div className="glass-card p-4 bg-gradient-to-br from-cyan-500/10 to-yellow-500/10">
              <Brain className="w-8 h-8 text-cyan-400 mb-2" />
              <h3 className="font-bold mb-2">CyberAI bilan o'rganing</h3>
              <p className="text-sm text-gray-400 mb-3">
                Savollaringizga javob oling, qiyin mavzularni tushuntirishni so'rang
              </p>
              <button
                onClick={() => setChatOpen(true)}
                className="neon-button text-sm w-full"
              >
                Suhbatni Boshlash
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] glass-card border-cyan-500/40 shadow-2xl z-50 animate-slide-up">
          <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              <span className="font-bold">CyberAI O'qituvchi</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Salom! Men CyberAI — kiberxavfsizlik o'qituvchisi</p>
                <p className="text-xs mt-1">Savolingizni yozing 👇</p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white'
                      : 'bg-cyber-dark text-gray-200 border border-cyan-500/20'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="bg-cyber-dark border border-cyan-500/20 rounded-lg p-3">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-cyan-500/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Savolingizni yozing..."
                className="input-field text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={aiLoading || !input.trim()}
                className="neon-button text-sm px-4 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}