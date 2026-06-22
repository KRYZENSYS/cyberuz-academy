'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Kirish xatoligi');
        return;
      }

      toast.success('Xush kelibsiz!');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      toast.error('Tarmoq xatoligi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-10 h-10 text-cyan-400" />
          <span className="text-2xl font-bold gradient-text">CyberUz Academy</span>
        </Link>

        <div className="glass-card p-8">
          <h1 className="text-3xl font-black mb-2 text-center">Kirish</h1>
          <p className="text-gray-400 text-center mb-6">Akkauntingizga kiring</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Parol</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-400">Eslab qolish</span>
              </label>
              <Link href="/forgot-password" className="text-cyan-400 hover:underline">
                Parolni unutdingizmi?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="neon-button w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Yuklanmoqda...</>
              ) : (
                'Kirish'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Akkauntingiz yo\'qmi?{' '}
            <Link href="/register" className="text-cyan-400 hover:underline font-semibold">
              Ro\'yxatdan o\'tish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}