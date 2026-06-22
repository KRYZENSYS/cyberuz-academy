'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, User, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', username: '', fullName: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [accept, setAccept] = useState(false);

  const checks = {
    length: form.password.length >= 8,
    match: form.password === form.confirmPassword && form.password.length > 0,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checks.length) return toast.error('Parol kamida 8 belgi');
    if (!checks.match) return toast.error('Parollar mos kelmadi');
    if (!accept) return toast.error('Shartlarni qabul qiling');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          fullName: form.fullName,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Akkaunt yaratildi! Xush kelibsiz 🎉');
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Ro\'yxatdan o\'tish muvaffaqiyatsiz');
      }
    } catch (error) {
      toast.error('Tarmoq xatosi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Shield className="w-10 h-10 text-cyan-400" />
            <span className="text-2xl font-bold neon-text">CyberUz</span>
          </Link>
          <h1 className="text-3xl font-bold gradient-text mb-2">Ro'yxatdan O'tish</h1>
          <p className="text-gray-400 text-sm">Bepul akkaunt yarating — 30 soniyada</p>
        </div>

        <form onSubmit={handleSubmit} className="cyber-card space-y-4">
          <div>
            <label className="block text-sm text-cyan-400 mb-2 font-medium">Ism va Familiya</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Firdavs Abdusamatov"
                className="cyber-input pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-cyan-400 mb-2 font-medium">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
                required
                pattern="[a-zA-Z0-9_]{3,30}"
                placeholder="firdavs_dev"
                className="cyber-input pl-11"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">3-30 belgi, faqat harflar, raqamlar va _</p>
          </div>

          <div>
            <label className="block text-sm text-cyan-400 mb-2 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="email@example.com"
                className="cyber-input pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-cyan-400 mb-2 font-medium">Parol</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
                placeholder="••••••••"
                className="cyber-input pl-11"
              />
            </div>
            <div className="text-xs mt-2 space-y-1">
              <div className={checks.length ? 'text-green-400' : 'text-gray-500'}>
                {checks.length ? '✓' : '○'} Kamida 8 belgi
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-cyan-400 mb-2 font-medium">Parolni Tasdiqlash</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                placeholder="••••••••"
                className="cyber-input pl-11"
              />
            </div>
            {checks.match && (
              <div className="text-xs mt-2 text-green-400 flex items-center gap-1">
                <Check size={14} /> Parollar mos keldi
              </div>
            )}
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-400 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
              className="mt-1 accent-cyan-500"
            />
            <span>
              Men <Link href="/terms" className="text-cyan-400 hover:underline">foydalanish shartlari</Link> va{' '}
              <Link href="/privacy" className="text-cyan-400 hover:underline">maxfiylik siyosatini</Link> qabul qilaman
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !accept}
            className="btn-neon btn-neon-yellow w-full py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Yaratilmoqda...</>
            ) : (
              '🚀 Akkaunt Yaratish'
            )}
          </button>

          <div className="text-center text-sm text-gray-400">
            Akkauntingiz bormi?{' '}
            <Link href="/login" className="text-cyan-400 hover:underline font-medium">
              Kirish
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}