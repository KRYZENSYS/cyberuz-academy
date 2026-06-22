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
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Xush kelibsiz! 🎉');
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Kirish muvaffaqiyatsiz');
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
          <h1 className="text-3xl font-bold gradient-text mb-2">Tizimga Kirish</h1>
          <p className="text-gray-400 text-sm">Akkauntingizga kiring va o'rganishni davom eting</p>
        </div>

        <form onSubmit={handleSubmit} className="cyber-card space-y-5">
          <div>
            <label className="block text-sm text-cyan-400 mb-2 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
                className="cyber-input pl-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-400">
              <input type="checkbox" className="mr-2 accent-cyan-500" />
              Eslab qol
            </label>
            <Link href="/forgot-password" className="text-cyan-400 hover:underline">
              Parolni unutdingizmi?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-neon w-full py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Kirilmoqda...
              </>
            ) : (
              'Kirish'
            )}
          </button>

          <div className="text-center text-sm text-gray-400">
            Akkauntingiz yo'qmi?{' '}
            <Link href="/register" className="text-cyan-400 hover:underline font-medium">
              Ro'yxatdan o'tish
            </Link>
          </div>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          🔒 Ma'lumotlaringiz xavfsiz saqlanadi
        </p>
      </div>
    </div>
  );
}