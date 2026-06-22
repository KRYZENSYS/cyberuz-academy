'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, BookOpen, Clock, Trophy, Search, Filter } from 'lucide-react';
import { getDifficultyLabel, getLearningPathLabel, formatDuration } from '@/lib/utils';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || course.difficulty === filter;
    return matchesSearch && matchesFilter;
  });

  const pathIcons: Record<string, string> = {
    CYBERSECURITY_FUNDAMENTALS: '🛡️',
    LINUX_FOR_SECURITY: '🐧',
    NETWORKING_BASICS: '🌐',
    WEB_APPLICATION_SECURITY: '🔐',
    BUG_BOUNTY: '💰',
    SOC_ANALYST: '🔍',
    DIGITAL_FORENSICS: '🔬',
    MALWARE_ANALYSIS: '🦠',
    RED_TEAM: '⚔️',
    BLUE_TEAM: '🛡️',
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
            <Link href="/ai-teacher" className="text-sm hover:text-cyan-400">AI</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="gradient-text">Kurslar</span>
          </h1>
          <p className="text-gray-400">Bepul kiberxavfsizlik kurslarini o'rganing</p>
        </div>

        {/* Search & Filter */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Kurslarni qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-11"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field md:w-48"
            >
              <option value="all">Barcha darajalar</option>
              <option value="BEGINNER">Boshlang'ich</option>
              <option value="INTERMEDIATE">O'rta</option>
              <option value="ADVANCED">Yuqori</option>
              <option value="EXPERT">Ekspert</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">Kurslar topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link href={`/courses/${course.slug}`} key={course.id}>
                <div className="glass-card glass-card-hover p-6 h-full flex flex-col group">
                  <div className="text-5xl mb-4">{pathIcons[course.learningPath] || '📚'}</div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-400 transition line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`badge ${
                      course.difficulty === 'BEGINNER' ? 'badge-cyan' :
                      course.difficulty === 'INTERMEDIATE' ? 'badge-yellow' :
                      course.difficulty === 'ADVANCED' ? 'badge-yellow' :
                      'badge-yellow'
                    }`}>
                      {getDifficultyLabel(course.difficulty)}
                    </span>
                    <span className="badge badge-blue">
                      <Clock className="w-3 h-3 mr-1" />
                      {course.estimatedHours || 10}s
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {course._count?.lessons || 0} dars
                    </span>
                    <span className="text-cyan-400 group-hover:underline">
                      Boshlash →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}