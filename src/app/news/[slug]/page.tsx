import Link from 'next/link';
import { Shield, Calendar, ArrowLeft, Tag } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = await prisma.news.findUnique({
    where: { slug: params.slug },
  });

  if (!news || !news.published) notFound();

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="text-lg font-bold gradient-text">CyberUz Academy</span>
          </Link>
          <Link href="/news" className="text-sm hover:text-cyan-400 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Yangiliklar
          </Link>
        </div>
      </nav>

      <article className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
        <Link href="/news" className="text-sm text-cyan-400 hover:underline mb-4 inline-block">
          ← Yangiliklarga qaytish
        </Link>

        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <time>{new Date(news.publishedAt || news.createdAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          {news.category && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{news.category}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-black mb-6">{news.title}</h1>

        {news.image && (
          <div className="aspect-video bg-cyber-black rounded-xl overflow-hidden mb-6 border border-cyan-500/20">
            <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6 italic">{news.excerpt}</p>
          <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">{news.content}</div>
        </div>

        <div className="mt-12 pt-6 border-t border-cyan-500/20">
          <Link href="/news" className="btn-neon inline-block">
            Boshqa yangiliklar
          </Link>
        </div>
      </article>
    </div>
  );
}