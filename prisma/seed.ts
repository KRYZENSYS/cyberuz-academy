import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const courses = [
  {
    slug: 'cybersecurity-fundamentals',
    title: 'Cybersecurity Fundamentals',
    description: 'Kiberxavfsizlikning asosiy tushunchalari, terminlari va tamoyillarini o\'rganing. CIA Triad, threat modeling va boshqalar.',
    learningPath: 'CYBERSECURITY_FUNDAMENTALS',
    difficulty: 'BEGINNER',
    estimatedHours: 10,
    isFeatured: true,
    isPublished: true,
    tags: ['beginner', 'fundamentals', 'security'],
    skills: ['Network Security', 'Malware Basics', 'Social Engineering', 'Data Protection'],
    prerequisites: [],
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
  },
  {
    slug: 'linux-for-security',
    title: 'Linux for Security',
    description: 'Linux operatsion tizimini o\'rganing va undan xavfsizlik maqsadlarida foydalaning. CLI, permissions, hardening.',
    learningPath: 'LINUX_FOR_SECURITY',
    difficulty: 'BEGINNER',
    estimatedHours: 15,
    isPublished: true,
    tags: ['linux', 'os', 'beginner'],
    skills: ['Linux Commands', 'Permissions', 'Process Management', 'System Hardening'],
    prerequisites: ['cybersecurity-fundamentals'],
    thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221d04b?w=800',
  },
  {
    slug: 'networking-basics',
    title: 'Networking Basics',
    description: 'TCP/IP, DNS, HTTP, VPN va boshqa tarmoq protokollarini o\'rganing.',
    learningPath: 'NETWORKING_BASICS',
    difficulty: 'BEGINNER',
    estimatedHours: 12,
    isPublished: true,
    tags: ['networking', 'tcp-ip'],
    skills: ['TCP/IP', 'DNS', 'HTTP/HTTPS', 'Firewalls'],
    prerequisites: [],
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
  },
  {
    slug: 'web-application-security',
    title: 'Web Application Security',
    description: 'OWASP Top 10, SQL Injection, XSS, CSRF va boshqa web zaifliklar.',
    learningPath: 'WEB_APPLICATION_SECURITY',
    difficulty: 'INTERMEDIATE',
    estimatedHours: 20,
    isFeatured: true,
    isPublished: true,
    tags: ['web', 'owasp', 'intermediate'],
    skills: ['OWASP Top 10', 'SQL Injection', 'XSS', 'CSRF', 'Authentication'],
    prerequisites: ['networking-basics'],
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
  },
  {
    slug: 'bug-bounty-hunting',
    title: 'Bug Bounty Hunting',
    description: 'Bug bounty platformalari, methodology va professional penetration testing.',
    learningPath: 'BUG_BOUNTY',
    difficulty: 'INTERMEDIATE',
    estimatedHours: 30,
    isFeatured: true,
    isPublished: true,
    tags: ['bug-bounty', 'pentest'],
    skills: ['Bug Bounty Platforms', 'Reconnaissance', 'Exploit Development', 'Reporting'],
    prerequisites: ['web-application-security'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
  },
  {
    slug: 'soc-analyst',
    title: 'SOC Analyst',
    description: 'Security Operations Center da ishlash, SIEM, incident response.',
    learningPath: 'SOC_ANALYST',
    difficulty: 'INTERMEDIATE',
    estimatedHours: 25,
    isPublished: true,
    tags: ['soc', 'soc-analyst'],
    skills: ['SIEM', 'Incident Response', 'Threat Intelligence', 'Log Analysis'],
    prerequisites: ['networking-basics'],
    thumbnail: 'https://images.unsplash.com/photo-1551808525-051a9eddb88d?w=800',
  },
  {
    slug: 'digital-forensics',
    title: 'Digital Forensics',
    description: 'Digital dalillarni izlash, disk va memory forensics.',
    learningPath: 'DIGITAL_FORENSICS',
    difficulty: 'ADVANCED',
    estimatedHours: 35,
    isPublished: true,
    tags: ['forensics', 'advanced'],
    skills: ['Disk Forensics', 'Memory Analysis', 'Network Forensics', 'Evidence Collection'],
    prerequisites: ['soc-analyst'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  },
  {
    slug: 'malware-analysis',
    title: 'Malware Analysis',
    description: 'Malware turlari, static va dynamic analysis, reverse engineering.',
    learningPath: 'MALWARE_ANALYSIS',
    difficulty: 'ADVANCED',
    estimatedHours: 30,
    isPublished: true,
    tags: ['malware', 'reverse-engineering'],
    skills: ['Malware Types', 'Static Analysis', 'Dynamic Analysis', 'Reverse Engineering'],
    prerequisites: ['linux-for-security'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
  },
  {
    slug: 'red-team-operations',
    title: 'Red Team Operations',
    description: 'Offensive security, advanced penetration testing, red teaming.',
    learningPath: 'RED_TEAM',
    difficulty: 'EXPERT',
    estimatedHours: 50,
    isPublished: true,
    tags: ['red-team', 'pentest', 'expert'],
    skills: ['Penetration Testing', 'Social Engineering', 'Exploit Development', 'Red Teaming'],
    prerequisites: ['bug-bounty-hunting'],
    thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800',
  },
  {
    slug: 'blue-team-defender',
    title: 'Blue Team Defender',
    description: 'Defensive security, threat hunting va SOC operations.',
    learningPath: 'BLUE_TEAM',
    difficulty: 'EXPERT',
    estimatedHours: 45,
    isPublished: true,
    tags: ['blue-team', 'defense'],
    skills: ['Threat Detection', 'Incident Response', 'Security Monitoring', 'Defense Strategies'],
    prerequisites: ['digital-forensics'],
    thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800',
  },
];

const achievements = [
  { slug: 'first-lesson', title: 'Birinchi Qadam', description: 'Birinchi darsni tugatdingiz', icon: '🎯', xpReward: 50, rarity: 'COMMON' },
  { slug: 'streak-7', title: 'Bir Haftalik Streak', description: '7 kun ketma-ket o\'rganing', icon: '🔥', xpReward: 100, rarity: 'RARE' },
  { slug: 'streak-30', title: 'Bir Oylik Streak', description: '30 kun ketma-ket o\'rganing', icon: '💪', xpReward: 500, rarity: 'EPIC' },
  { slug: 'first-course', title: 'Birinchi Kurs', description: 'Birinchi kursni tugatdingiz', icon: '🏆', xpReward: 200, rarity: 'COMMON' },
  { slug: 'five-courses', title: '5 Kurs Yutuq', description: '5 ta kursni tugatdingiz', icon: '⭐', xpReward: 500, rarity: 'RARE' },
  { slug: 'ten-courses', title: '10 Kurs Yutuq', description: '10 ta kursni tugatdingiz', icon: '🌟', xpReward: 1000, rarity: 'EPIC' },
  { slug: 'xp-100', title: '100 XP', description: '100 XP to\'pladingiz', icon: '💎', xpReward: 0, rarity: 'COMMON' },
  { slug: 'xp-1000', title: '1000 XP', description: '1000 XP to\'pladingiz', icon: '💠', xpReward: 0, rarity: 'RARE' },
  { slug: 'xp-10000', title: '10000 XP', description: '10000 XP to\'pladingiz', icon: '👑', xpReward: 0, rarity: 'LEGENDARY' },
  { slug: 'ai-user', title: 'AI Chat', description: 'AI bilan 10 ta savol bering', icon: '🤖', xpReward: 100, rarity: 'COMMON' },
  { slug: 'social-bug', title: 'Jamiyat', description: 'Forumda birinchi comment', icon: '💬', xpReward: 50, rarity: 'COMMON' },
  { slug: 'level-10', title: '10-Daraja', description: '10-darajaga yeting', icon: '🎓', xpReward: 300, rarity: 'RARE' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@2026!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@cyberuz.uz' },
    update: {},
    create: {
      email: 'admin@cyberuz.uz',
      username: 'admin',
      fullName: 'CyberUz Admin',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
      xp: 5000,
      level: 10,
      streak: 30,
    },
  });

  console.log('✅ Admin user created');

  // Courses
  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: courseData,
      create: courseData,
    });
    console.log(`✅ Course: ${course.title}`);

    // Add 3-5 sample lessons per course
    const lessonCount = await prisma.lesson.count({ where: { courseId: course.id } });
    if (lessonCount === 0) {
      const lessonTitles = [
        `${course.title} - Kirish`,
        `${course.title} - Asoslar`,
        `${course.title} - Amaliyot`,
        `${course.title} - Chuqur o'rganish`,
        `${course.title} - Yakun`,
      ];
      for (let i = 0; i < lessonTitles.length; i++) {
        await prisma.lesson.create({
          data: {
            courseId: course.id,
            title: lessonTitles[i],
            description: `${course.title} ning ${i + 1}-darsi. AI tomonidan tayyorlangan.`,
            order: i + 1,
            isPublished: true,
            duration: 600 + i * 300,
          },
        });
      }
    }
  }

  // Achievements
  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { slug: ach.slug },
      update: ach,
      create: ach,
    });
  }
  console.log(`✅ ${achievements.length} achievements`);

  // Sample news
  const news = [
    {
      slug: 'ai-revolution-cybersecurity',
      title: 'AI kiberxavfsizlikni qanday o\'zgartirmoqda',
      excerpt: 'Sun\'iy intellekt kiberxavfsizlik sohasida inqilob qilmoqda. AI yordamida tahdidlar aniqlanmoqda va avtomatik javob berilmoqda.',
      content: 'AI texnologiyalari kiberxavfsizlik sohasida yangi imkoniyatlar ochmoqda. Threat detection, automated response, va predictive analytics kabi sohalarda AI katta yutuqlar ko\'rsatmoqda.',
      category: 'AI',
      published: true,
      publishedAt: new Date(),
    },
    {
      slug: 'zero-day-vulnerabilities-2026',
      title: '2026 yilgi eng katta zero-day zaifliklar',
      excerpt: 'Yangi yilda topilgan eng xavfli zero-day zaifliklar va ularga qarshi choralar.',
      content: 'Zero-day zaifliklar har yili ko\'paymoqda. Eng so\'nggi topilmalar va ularga qarshi defense strategiyalari haqida batafsil ma\'lumot.',
      category: 'Vulnerabilities',
      published: true,
      publishedAt: new Date(),
    },
    {
      slug: 'uzbek-cybersecurity-growth',
      title: 'O\'zbekistonda kiberxavfsizlik bozori o\'smoqda',
      excerpt: 'O\'zbekistonda kiberxavfsizlik mutaxassislariga talab ortib bormoqda. Yangi imkoniyatlar va ish o\'rinlari.',
      content: 'O\'zbekiston Respublikasi kiberxavfsizlik bo\'yicha kadrlar tayyorlash dasturlarini kengaytirmoqda. Yangi ish o\'rinlari va imkoniyatlar haqida.',
      category: 'Industry',
      published: true,
      publishedAt: new Date(),
    },
  ];

  for (const n of news) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: n,
      create: n,
    });
  }
  console.log(`✅ ${news.length} news articles`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });