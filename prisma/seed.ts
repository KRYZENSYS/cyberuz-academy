import { PrismaClient, UserRole, DifficultyLevel, LearningPath, VideoSource, QuizType, QuizDifficulty, ChallengeType, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ===== Admin User =====
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'change-me', 12);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@cyberuz.academy' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@cyberuz.academy',
      username: 'admin',
      fullName: 'Administrator',
      password: adminPassword,
      role: UserRole.ADMIN,
      emailVerified: true,
      xp: 9999,
      level: 99,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // ===== Learning Paths =====
  const learningPaths = [
    {
      slug: 'cybersecurity-fundamentals',
      title: 'Kiberxavfsizlik Asoslari',
      description: 'Kiberxavfsizlikning asosiy tushunchalari, tamoyillari va amaliy ko\'nikmalar. Boshlovchilar uchun ideal.',
      shortDescription: 'Kiberxavfsizlikka kirish kursi',
      learningPath: LearningPath.CYBERSECURITY_FUNDAMENTALS,
      difficulty: DifficultyLevel.BEGINNER,
      estimatedHours: 20,
      prerequisites: [],
      tags: ['cybersecurity', 'basics', 'security', 'fundamentals'],
      skills: ['Threat identification', 'Security principles', 'Risk assessment'],
      isFeatured: true,
      language: 'uz',
    },
    {
      slug: 'linux-for-security',
      title: 'Linux Xavfsizlik Uchun',
      description: 'Linux operatsion tizimini o\'rganish va uni xavfsizlik maqsadlarida ishlatish.',
      shortDescription: 'Linux asoslari va xavfsizlik',
      learningPath: LearningPath.LINUX_FOR_SECURITY,
      difficulty: DifficultyLevel.BEGINNER,
      estimatedHours: 25,
      prerequisites: ['cybersecurity-fundamentals'],
      tags: ['linux', 'kali', 'bash', 'security'],
      skills: ['Linux CLI', 'File system', 'User management', 'Networking'],
      isFeatured: true,
    },
    {
      slug: 'networking-basics',
      title: 'Tarmoq Asoslari',
      description: 'TCP/IP, DNS, HTTP, subnetting, firewall va boshqa tarmoq tushunchalari.',
      shortDescription: 'Tarmoq protokollari va xavfsizlik',
      learningPath: LearningPath.NETWORKING_BASICS,
      difficulty: DifficultyLevel.BEGINNER,
      estimatedHours: 30,
      prerequisites: [],
      tags: ['networking', 'tcp-ip', 'dns', 'http'],
      skills: ['Network protocols', 'Subnetting', 'Wireshark', 'Packet analysis'],
      isFeatured: true,
    },
    {
      slug: 'web-application-security',
      title: 'Veb Ilovalar Xavfsizligi',
      description: 'OWASP Top 10, SQL injection, XSS, CSRF va boshqa veb zaifliklar.',
      shortDescription: 'OWASP Top 10 va veb xavfsizlik',
      learningPath: LearningPath.WEB_APPLICATION_SECURITY,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 40,
      prerequisites: ['networking-basics'],
      tags: ['owasp', 'web-security', 'xss', 'sql-injection'],
      skills: ['OWASP Top 10', 'Burp Suite', 'SQLi', 'XSS', 'CSRF'],
      isFeatured: true,
    },
    {
      slug: 'bug-bounty',
      title: 'Bug Bounty',
      description: 'HackerOne, Bugcrowd platformalarida zaiflik topish va mukofot olish.',
      shortDescription: 'Bug bounty hunter bo\'lish',
      learningPath: LearningPath.BUG_BOUNTY,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 35,
      prerequisites: ['web-application-security'],
      tags: ['bug-bounty', 'hackerone', 'recon', 'exploitation'],
      skills: ['Recon', 'Exploitation', 'Reporting', 'Platform usage'],
    },
    {
      slug: 'soc-analyst',
      title: 'SOC Mutaxassisi',
      description: 'Security Operations Center ishi, SIEM, log tahlili, incident response.',
      shortDescription: 'SOC analyst bo\'lish',
      learningPath: LearningPath.SOC_ANALYST,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 45,
      prerequisites: ['networking-basics'],
      tags: ['soc', 'siem', 'incident-response', 'monitoring'],
      skills: ['SIEM', 'Log analysis', 'Threat hunting', 'Incident response'],
    },
    {
      slug: 'digital-forensics',
      title: 'Raqamli Kriminalistika',
      description: 'Raqamli dalillarni yig\'ish, tahlil qilish va tiklash.',
      shortDescription: 'Digital forensics va incident investigation',
      learningPath: LearningPath.DIGITAL_FORENSICS,
      difficulty: DifficultyLevel.ADVANCED,
      estimatedHours: 50,
      prerequisites: ['linux-for-security'],
      tags: ['forensics', 'investigation', 'autopsy', 'volatility'],
      skills: ['Disk forensics', 'Memory forensics', 'Network forensics'],
    },
    {
      slug: 'malware-analysis',
      title: 'Zararli Dasturlar Tahlili',
      description: 'Malware statik va dinamik tahlili, reverse engineering.',
      shortDescription: 'Malware analysis va reverse engineering',
      learningPath: LearningPath.MALWARE_ANALYSIS,
      difficulty: DifficultyLevel.ADVANCED,
      estimatedHours: 60,
      prerequisites: ['linux-for-security'],
      tags: ['malware', 'reverse-engineering', 'ida', 'ghidra'],
      skills: ['Static analysis', 'Dynamic analysis', 'Reverse engineering'],
    },
    {
      slug: 'red-team',
      title: 'Red Team',
      description: 'Hujumkor xavfsizlik testlari, penetration testing, exploitation.',
      shortDescription: 'Red team operations',
      learningPath: LearningPath.RED_TEAM,
      difficulty: DifficultyLevel.EXPERT,
      estimatedHours: 70,
      prerequisites: ['bug-bounty', 'malware-analysis'],
      tags: ['red-team', 'pentest', 'c2', 'exploitation'],
      skills: ['Penetration testing', 'C2 frameworks', 'Exploit development'],
    },
    {
      slug: 'blue-team',
      title: 'Blue Team',
      description: 'Mudofaa xavfsizligi, detection engineering, threat intelligence.',
      shortDescription: 'Blue team operations',
      learningPath: LearningPath.BLUE_TEAM,
      difficulty: DifficultyLevel.EXPERT,
      estimatedHours: 65,
      prerequisites: ['soc-analyst', 'digital-forensics'],
      tags: ['blue-team', 'detection', 'siem', 'threat-intel'],
      skills: ['Detection engineering', 'Threat intel', 'Defense strategies'],
    },
  ];

  for (const path of learningPaths) {
    await prisma.course.upsert({
      where: { slug: path.slug },
      update: path,
      create: path,
    });
  }
  console.log(`✅ Created ${learningPaths.length} learning paths`);

  // ===== Achievements =====
  const achievements = [
    {
      slug: 'first-lesson',
      title: 'Birinchi Qadam',
      description: 'Birinchi darsni tugating',
      icon: '🎯',
      xpReward: 10,
      badgeColor: 'cyan',
      criteria: { type: 'lessons_completed', count: 1 },
    },
    {
      slug: 'first-course',
      title: 'Kurs Yutugi',
      description: 'Birinchi kursni tugating',
      icon: '🏆',
      xpReward: 100,
      badgeColor: 'yellow',
      criteria: { type: 'courses_completed', count: 1 },
    },
    {
      slug: 'quiz-master',
      title: 'Quiz Ustasi',
      description: '10 ta quizda 100% ball oling',
      icon: '🧠',
      xpReward: 50,
      badgeColor: 'blue',
      criteria: { type: 'perfect_quizzes', count: 10 },
    },
    {
      slug: 'week-streak',
      title: 'Haftalik Streak',
      description: '7 kun ketma-ket o\'rganing',
      icon: '🔥',
      xpReward: 70,
      badgeColor: 'yellow',
      criteria: { type: 'daily_streak', count: 7 },
    },
    {
      slug: 'month-streak',
      title: 'Oylik Streak',
      description: '30 kun ketma-ket o\'rganing',
      icon: '⚡',
      xpReward: 300,
      badgeColor: 'yellow',
      criteria: { type: 'daily_streak', count: 30 },
    },
    {
      slug: 'xp-100',
      title: '100 XP',
      description: '100 XP to\'plang',
      icon: '⭐',
      xpReward: 0,
      badgeColor: 'cyan',
      criteria: { type: 'xp', count: 100 },
    },
    {
      slug: 'xp-1000',
      title: '1000 XP',
      description: '1000 XP to\'plang',
      icon: '🌟',
      xpReward: 0,
      badgeColor: 'blue',
      criteria: { type: 'xp', count: 1000 },
    },
    {
      slug: 'xp-10000',
      title: '10000 XP - Afsona',
      description: '10000 XP to\'plang',
      icon: '💎',
      xpReward: 0,
      badgeColor: 'yellow',
      criteria: { type: 'xp', count: 10000 },
    },
    {
      slug: 'first-certificate',
      title: 'Sertifikat Egasi',
      description: 'Birinchi sertifikatni qo\'lga kiriting',
      icon: '📜',
      xpReward: 200,
      badgeColor: 'yellow',
      criteria: { type: 'certificates', count: 1 },
    },
    {
      slug: 'commentator',
      title: 'Faol Izoh Beruvchi',
      description: '50 ta izoh qoldiring',
      icon: '💬',
      xpReward: 50,
      badgeColor: 'cyan',
      criteria: { type: 'comments', count: 50 },
    },
    {
      slug: 'bug-hunter',
      title: 'Bug Hunter',
      description: 'Bug Bounty kursini tugating',
      icon: '🐛',
      xpReward: 300,
      badgeColor: 'yellow',
      criteria: { type: 'course_completed', course: 'bug-bounty' },
    },
    {
      slug: 'soc-expert',
      title: 'SOC Eksperti',
      description: 'SOC Analyst kursini tugating',
      icon: '🛡️',
      xpReward: 300,
      badgeColor: 'blue',
      criteria: { type: 'course_completed', course: 'soc-analyst' },
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: achievement,
      create: achievement,
    });
  }
  console.log(`✅ Created ${achievements.length} achievements`);

  // ===== Sample Announcements =====
  await prisma.announcement.createMany({
    data: [
      {
        title: '🎉 CyberUz Academy ishga tushdi!',
        content: 'O\'zbek tilidagi birinchi bepul kiberxavfsizlik platformasi. 10 ta o\'rganish yo\'li va yuzlab bepul darslar sizni kutmoqda!',
        type: 'info',
        isActive: true,
      },
      {
        title: '🤖 AI O\'qituvchi qo\'shildi',
        content: 'CyberAI — o\'zbek tilidagi sun\'iy intellekt o\'qituvchi. Savollaringizga javob beradi, quiz yaratadi.',
        type: 'feature',
        isActive: true,
      },
    ],
  });
  console.log('✅ Announcements created');

  // ===== Welcome notification for admin =====
  await prisma.notification.create({
    data: {
      userId: admin.id,
      type: NotificationType.ANNOUNCEMENT,
      title: '🎉 Xush kelibsiz!',
      message: 'CyberUz Academy admin paneli tayyor. Tizimni boshqarishni boshlashingiz mumkin.',
      link: '/admin',
    },
  });

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
