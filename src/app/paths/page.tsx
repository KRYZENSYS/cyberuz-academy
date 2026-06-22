'use client';

import Link from 'next/link';
import { Shield, Target, Clock, Trophy, BookOpen } from 'lucide-react';

const paths = [
  { id: 'cybersecurity-fundamentals', icon: '🛡️', title: 'Cybersecurity Fundamentals', desc: 'Kiberxavfsizlik asoslari', difficulty: 'BEGINNER', duration: '10s', lessons: 15, xp: 150, skills: ['Network Security', 'Malware Basics', 'Social Engineering'] },
  { id: 'linux-for-security', icon: '🐧', title: 'Linux for Security', desc: 'Linux operatsion tizimi', difficulty: 'BEGINNER', duration: '15s', lessons: 20, xp: 200, skills: ['Linux Commands', 'Permissions', 'Hardening'] },
  { id: 'networking-basics', icon: '🌐', title: 'Networking Basics', desc: 'TCP/IP, DNS, HTTP protokollar', difficulty: 'BEGINNER', duration: '12s', lessons: 18, xp: 180, skills: ['TCP/IP', 'DNS', 'Firewalls'] },
  { id: 'web-application-security', icon: '🔐', title: 'Web Application Security', desc: 'OWASP Top 10 va web xavfsizligi', difficulty: 'INTERMEDIATE', duration: '20s', lessons: 25, xp: 250, skills: ['OWASP', 'SQLi', 'XSS', 'CSRF'] },
  { id: 'bug-bounty', icon: '💰', title: 'Bug Bounty Hunter', desc: 'Bug bounty va pentest', difficulty: 'INTERMEDIATE', duration: '30s', lessons: 35, xp: 350, skills: ['Bounty', 'Recon', 'Exploits'] },
  { id: 'soc-analyst', icon: '🔍', title: 'SOC Analyst', desc: 'Security Operations Center', difficulty: 'INTERMEDIATE', duration: '25s', lessons: 30, xp: 300, skills: ['SIEM', 'IR', 'Threat Intel'] },
  { id: 'digital-forensics', icon: '🔬', title: 'Digital Forensics', desc: 'Digital dalillarni izlash', difficulty: 'ADVANCED', duration: '35s', lessons: 40, xp: 400, skills: ['Disk', 'Memory', 'Network'] },
  { id: 'malware-analysis', icon: '🦠', title: 'Malware Analysis', desc: 'Malware tahlili', difficulty: 'ADVANCED', duration: '30s', lessons: 35, xp: 380, skills: ['Static', 'Dynamic', 'Reversing'] },
  { id: 'red-team', icon: '⚔️', title: 'Red Team', desc: 'Offensive security', difficulty: 'EXPERT', duration: '50s', lessons: 60, xp: 600, skills: ['Pentest', 'Exploits', 'Red Team'] },
  { id: 'blue-team', icon: '🛡️', title: 'Blue Team', desc: 'Defensive security', difficulty: 'EXPERT', duration: '45s', lessons: 55, xp: 550, skills: ['Detection', 'IR', 'Defense'] },
];

const colorMap: Record<string, string> = {
  BEGINNER: 'cyan',
  INTERMEDIATE: 'yellow',
  ADVANCED: 'blue',
  EXPERT: 'red',
};

export default function PathsPage() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="text-lg font-bold gradient-text">CyberUz Academy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm hover:text-cyan-400">Dashboard</Link>
            <Link href="/paths" className="text-sm font-bold text-cyan-400">Yo'llar</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="gradient-text">O'rganish</span> Yo'llari
          </h1>
          <p className="text-gray-400">Boshlovchidan ekspertgacha — 10 ta professional yo'l</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((p) => (
            <div key={p.id} className="cyber-card flex flex-col h-full">
              <div className="text-5xl mb-4">{p.icon}</div>
              <h3 className="text-xl font-bold mb-2">{p.title}</h3>
              <p className="text-gray-400 text-sm mb-4 flex-1">{p.desc}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge badge-${colorMap[p.difficulty]}`}>
                  {p.difficulty === 'BEGINNER' ? 'Boshlang' : p.difficulty === 'INTERMEDIATE' ? "O'rta" : p.difficulty === 'ADVANCED' ? 'Yuqori' : 'Ekspert'}
                </span>
                <span className="badge badge-blue">
                  <Clock className="w-3 h-3 mr-1" /> {p.duration}
                </span>
                <span className={`badge ${p.xp >= 300 ? 'badge-yellow' : 'badge-cyan'}`}>
                  <Trophy className="w-3 h-3 mr-1" /> +{p.xp}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {p.skills.slice(0, 3).map((s, i) => (
                  <span key={i} className="badge badge-cyan text-xs">{s}</span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-cyan-500/20">
                <span>{p.lessons} dars</span>
                <Link href={`/courses/${p.id}`} className="text-cyan-400 font-bold hover:underline">Boshlash →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}