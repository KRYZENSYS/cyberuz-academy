import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

export const revalidate = 3600;

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  });

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Yangiliklar</span>
          </h1>
          <p className="text-gray-400">Kiberxavfsizlik sohasidagi so'nggi yangiliklar va maqolalar</p>
        </div>

        {news.length === 0 ? (
          <div className="cyber-card p-12 text-center">
            <p className="text-gray-400 mb-4">Hozircha yangiliklar yo'q</p>
            <p className="text-sm text-gray-500">Tez orada qo'shiladi. Yangiliklar AI tomonidan avtomatik generatsiya qilinadi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="cyber-card group cursor-pointer block"
              >
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
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-400 mb-4 line-clamp-3">{item.excerpt}</p>
                <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  O'qish <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}