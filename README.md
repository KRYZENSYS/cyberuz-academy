# 🛡️ CyberUz Academy

**O'zbek tilidagi birinchi professional kiberxavfsizlik o'rganish platformasi.**

AI yordamida avtomatik darslar, 10 ta o'rganish yo'li, minglab bepul darslar, gamification va sertifikatlar — hammasi bepul.

---

## ✨ Xususiyatlar

- 🤖 **AI O'qituvchi (CyberAI)** — Groq AI bilan kiberxavfsizlik bo'yicha suhbat
- 📚 **10 ta O'rganish Yo'li** — boshlang'ichdan ekspert darajasigacha
- 🎓 **Video Darslar** — YouTube'dan avtomatik import + AI tavsif
- 🏆 **Gamification** — XP, darajalar, streak, yutuqlar
- 📜 **Sertifikatlar** — QR kod bilan tasdiqlanadigan PDF
- 📰 **AI Yangiliklar** — har kuni avtomatik generatsiya
- 📧 **Daily Push** — har kuni ertalab email
- 👥 **Forum** — jamiyat va discussion
- 🔐 **Admin Panel** — kurslar, darslar va foydalanuvchilarni boshqarish
- 📊 **Reyting** — leaderboard va weekly/monthly filter
- 🌐 **O'zbek tilida** — butun platforma o'zbek tilida

---

## 🛠️ Texnologiyalar

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** JWT (access + refresh tokens), bcrypt
- **AI:** Groq (Llama 3.3 70B)
- **Email:** Nodemailer (SMTP)
- **PDF:** jsPDF + QRCode
- **Deployment:** Vercel + Neon/Supabase
- **Cron Jobs:** Vercel Cron (har kuni)
- **YouTube API:** Avtomatik dars import

---

## 🚀 Tez Boshlash

### 1. Repository'ni klonlash

```bash
git clone https://github.com/KRYZENSYS/cyberuz-academy.git
cd cyberuz-academy
npm install
```

### 2. Environment sozlash

```bash
cp .env.example .env
```

`.env` faylini tahrirlang:

```env
DATABASE_URL="postgresql://user:password@host:5432/cyberuz"
JWT_SECRET="your-random-secret-key"
JWT_REFRESH_SECRET="another-random-secret"
GROQ_API_KEY="gsk_..."
YOUTUBE_API_KEY="AIza..."
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="app-password"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CRON_SECRET="random-cron-secret"
```

### 3. Database sozlash

```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. Development server

```bash
npm run dev
```

Brauzerda oching: [http://localhost:3000](http://localhost:3000)

---

## 📦 Production Deploy (Vercel + Neon)

### 1. Neon Database yaratish

1. [https://neon.tech](https://neon.tech) ga kiring
2. Yangi project yarating
3. Connection string'ni `.env` ga qo'ying

### 2. Vercel Deploy

```bash
npm i -g vercel
vercel login
vercel
```

Vercel dashboard'da environment variables qo'ling.

### 3. Database migrate

Vercel dashboard → Settings → Environment Variables → Production ga DATABASE_URL qo'ying.

Keyin:

```bash
vercel env pull .env.production
npx prisma migrate deploy
npx prisma db seed
```

---

## 📁 Struktura

```
cyberuz-academy/
├── prisma/
│   ├── schema.prisma        # 15 ta model
│   └── seed.ts               # Seed data
├── src/
│   ├── app/
│   │   ├── (auth)/           # Login, Register
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # JWT auth
│   │   │   ├── ai/           # AI chat
│   │   │   ├── admin/        # Admin panel
│   │   │   ├── cron/         # Cron jobs
│   │   │   ├── leaderboard/
│   │   │   ├── news/
│   │   │   └── certificates/
│   │   ├── admin/            # Admin panel UI
│   │   ├── ai-teacher/       # AI chat UI
│   │   ├── courses/          # Kurslar
│   │   ├── lessons/          # Video player
│   │   ├── dashboard/        # User dashboard
│   │   ├── leaderboard/      # Reyting
│   │   ├── news/             # Yangiliklar
│   │   ├── paths/            # O'rganish yo'llari
│   │   ├── profile/          # Profil
│   │   ├── verify/           # Sertifikat tekshirish
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Landing
│   │   └── globals.css       # Cyberpunk theme
│   ├── components/           # UI komponentlar
│   └── lib/                  # Utilities
│       ├── prisma.ts
│       ├── auth.ts
│       ├── jwt.ts
│       ├── ai.ts             # Groq AI
│       ├── email.ts
│       ├── gamification.ts   # XP, levels
│       ├── pdf.ts            # Sertifikat PDF
│       └── youtube.ts        # YouTube API
├── vercel.json               # Cron jobs
├── tailwind.config.ts
├── next.config.js
├── package.json
└── README.md
```

---

## 🎮 Demo Akkaunt

Seed qilingandan keyin:

- **Admin:** `admin@cyberuz.uz` / `Admin@2026!`
- **XP:** 5000, **Level:** 10, **Streak:** 30

---

## 🤝 Hissa Qo'shish

Pull request'lar xush kelibsiz! Katta o'zgarishlar uchun avval issue oching.

---

## 📄 Litsenziya

MIT License

---

## 📞 Aloqa

- **Telegram:** [@FirdavsVIP](https://t.me/FirdavsVIP)
- **Email:** f91186645@gmail.com
- **GitHub:** [KRYZENSYS](https://github.com/KRYZENSYS)

---

**🛡️ O'zbek tilidagi kiberxavfsizlik ta'limi — BEPUL, OCHIQ, HAMMA UCHUN.**