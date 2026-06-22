'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, User, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const passwordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);
  const strengthLabels = ['Juda zaif', 'Zaif', 'O\'rtacha', 'Yaxshi', 'Kuchli'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-cyan-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.username || !formData.password) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Parollar mos kelmaydi');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Parol kamida 8 belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Ro\'yxatdan o\'tish xatoligi');
        return;
      }

      toast.success('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!');
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
          <h1 className="text-3xl font-black mb-2 text-center">Ro'yxatdan o'tish</h1>
          <p className="text-gray-400 text-center mb-6">Bepul o'rganishni boshlang</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">To'liq ism (ixtiyoriy)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ism Familiya"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                  placeholder="username"
                  className="input-field pl-11"
                  required
                  minLength={3}
                  maxLength={30}
                  pattern="[a-zA-Z0-9_]+"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Kamida 8 belgi"
                  className="input-field pl-11"
                  required
                />
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${i <= strength ? strengthColors[strength] : 'bg-gray-700'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Parol kuchi: {strengthLabels[strength]}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Parolni tasdiqlang</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pl-11"
                  required
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                )}
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-400">
              <input type="checkbox" required className="mt-1 rounded" />
              <span>
                Men <Link href="/terms" className="text-cyan-400 hover:underline">foydalanish shartlari</Link> va{' '}
                <Link href="/privacy" className="text-cyan-400 hover:underline">maxfiylik siyosatini</Link> qabul qilaman
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="neon-button w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Ro'yxatdan o'tilmoqda...</>
              ) : (
                'Ro\'yxatdan o\'tish'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Akkauntingiz bormi?{' '}
            <Link href="/login" className="text-cyan-400 hover:underline font-semibold">
              Kirish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}