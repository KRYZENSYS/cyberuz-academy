import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Clock, Trophy, Target } from 'lucide-react';

const paths = [
  { id: 'CYBERSECURITY_FUNDAMENTALS', icon: '🛡️', title: 'Cybersecurity Fundamentals', description: 'Kiberxavfsizlik asoslari — asosiy tushunchalar va terminologiya', difficulty: 'BEGINNER', duration: '10 soat', lessons: 15, xp: 150, skills: ['Network Security', 'Malware Basics', 'Social Engineering', 'Data Protection'] },
  { id: 'LINUX_FOR_SECURITY', icon: '🐧', title: 'Linux for Security', description: 'Linux operatsion tizimi va xavfsizlik asoslari', difficulty: 'BEGINNER', duration: '15 soat', lessons: 20, xp: 200, skills: ['Linux Commands', 'Permissions', 'Process Management', 'System Hardening'] },
  { id: 'NETWORKING_BASICS', icon: '🌐', title: 'Networking Basics', description: 'TCP/IP, DNS, HTTP va tarmoq protokollari', difficulty: 'BEGINNER', duration: '12 soat', lessons: 18, xp: 180, skills: ['TCP/IP', 'DNS', 'HTTP/HTTPS', 'Firewalls'] },
  { id: 'WEB_APPLICATION_SECURITY', icon: '🔐', title: 'Web Application Security', description: 'OWASP Top 10 va web xavfsizligi asoslari', difficulty: 'INTERMEDIATE', duration: '20 soat', lessons: 25, xp: 250, skills: ['OWASP Top 10', 'SQL Injection', 'XSS', 'CSRF', 'Authentication'] },
  { id: 'BUG_BOUNTY', icon: '💰', title: 'Bug Bounty Hunter', description: 'Bug bounty platformalari va penetration testing', difficulty: 'INTERMEDIATE', duration: '30 soat', lessons: 35, xp: 350, skills: ['Bug Bounty Platforms', 'Reconnaissance', 'Exploit Development', 'Reporting'] },
  { id: 'SOC_ANALYST', icon: '🔍', title: 'SOC Analyst', description: 'Security Operations Center va incident monitoring', difficulty: 'INTERMEDIATE', duration: '25 soat', lessons: 30, xp: 300, skills: ['SIEM', 'Incident Response', 'Threat Intelligence', 'Log Analysis'] },
  { id: 'DIGITAL_FORENSICS', icon: '🔬', title: 'Digital Forensics', description: 'Digital dalillarni izlash va tahlil qilish', difficulty: 'ADVANCED', duration: '35 soat', lessons: 40, xp: 400, skills: ['Disk Forensics', 'Memory Analysis', 'Network Forensics', 'Evidence Collection'] },
  { id: 'MALWARE_ANALYSIS', icon: '🦠', title: 'Malware Analysis', description: 'Malware turlari va analizi', difficulty: 'ADVANCED', duration: '30 soat', lessons: 35, xp: 380, skills: ['Malware Types', 'Static Analysis', 'Dynamic Analysis', 'Reverse Engineering'] },
  { id: 'RED_TEAM', icon: '⚔️', title: 'Red Team Operations', description: 'Offensive security va penetration testing', difficulty: 'EXPERT', duration: '50 soat', lessons: 60, xp: 600, skills: ['Penetration Testing', 'Social Engineering', 'Exploit Development', 'Red Teaming'] },
  { id: 'BLUE_TEAM', icon: '🛡️', title: 'Blue Team Operations', description: 'Defensive security va SOC operations', difficulty: 'EXPERT', duration: '45 soat', lessons: 55, xp: 550, skills: ['Threat Detection', 'Incident Response', 'Security Monitoring', 'Defense Strategies'] },
];

const difficultyColors: Record<string, string> = {
  BEGINNER: 'cyan',
  INTERMEDIATE: 'yellow',
  ADVANCED: 'yellow',
  EXPERT: 'yellow',
};

const difficultyLabels: Record<string, string> = {
  BEGINNER: 'Boshlang\'ich',
  INTERMEDIATE: 'O\'rta',
  ADVANCED: 'Yuqori',
  EXPERT: 'Ekspert',
};

export default function PathsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">O'rganish Yo'llari</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Boshlovchidan ekspertgacha — 10 ta professional yo'l
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path) => (
            <Link
              key={path.id}
              href={`/courses?path=${path.id}`}
              className="cyber-card group cursor-pointer block h-full flex flex-col"
            >
              <div className="text-6xl mb-4">{path.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {path.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4 flex-1">{path.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge badge-${difficultyColors[path.difficulty]}`}>
                  {difficultyLabels[path.difficulty]}
                </span>
                <span className="badge badge-blue">
                  <Clock className="w-3 h-3 mr-1 inline" /> {path.duration}
                </span>
                <span className={`badge ${path.xp >= 300 ? 'badge-yellow' : 'badge-cyan'}`}>
                  <Trophy className="w-3 h-3 mr-1 inline" /> +{path.xp} XP
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {path.skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="badge badge-cyan text-xs">{skill}</span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-cyan-500/10">
                <span>{path.lessons} dars</span>
                <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">Boshlash →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}