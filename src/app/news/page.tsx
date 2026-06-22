import Link from 'next/link';
import { Shield, Calendar, ArrowRight, Tag } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600;

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  });

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
            <Link href="/news" className="text-sm font-bold text-cyan-400">Yangiliklar</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="gradient-text">Yangiliklar</span>
          </h1>
          <p className="text-gray-400">Kiberxavfsizlik sohasidagi so'nggi yangiliklar</p>
        </div>

        {news.length === 0 ? (
          <div className="cyber-card p-12 text-center">
            <p className="text-gray-400 mb-2">Hozircha yangiliklar yo'q</p>
            <p className="text-sm text-gray-500">Tez orada AI tomonidan avtomatik qo'shiladi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`} className="cyber-card group block">
                {item.image && (
                  <div className="aspect-video bg-cyber-black rounded-lg mb-4 overflow-hidden border border-cyan-500/20">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <time>{new Date(item.publishedAt || item.createdAt).toLocaleDateString('uz-UZ')}</time>
                  {item.category && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{item.category}</span>
                    </>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{item.title}</h2>
                <p className="text-sm text-gray-400 mb-4 line-clamp-3">{item.excerpt}</p>
                <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  O'qish <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}