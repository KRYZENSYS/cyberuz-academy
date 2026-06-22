import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, 'yil'],
    [2592000, 'oy'],
    [86400, 'kun'],
    [3600, 'soat'],
    [60, 'daqiqa'],
  ];

  for (const [secs, label] of intervals) {
    const interval = Math.floor(seconds / secs);
    if (interval >= 1) {
      return `${interval} ${label} avval`;
    }
  }
  return 'Hozirgina';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getDifficultyColor(level: string): string {
  const colors: Record<string, string> = {
    BEGINNER: 'text-green-400 border-green-500',
    INTERMEDIATE: 'text-yellow-400 border-yellow-500',
    ADVANCED: 'text-orange-400 border-orange-500',
    EXPERT: 'text-red-400 border-red-500',
  };
  return colors[level] || 'text-gray-400 border-gray-500';
}

export function getDifficultyLabel(level: string): string {
  const labels: Record<string, string> = {
    BEGINNER: 'Boshlang\'ich',
    INTERMEDIATE: 'O\'rta',
    ADVANCED: 'Yuqori',
    EXPERT: 'Ekspert',
  };
  return labels[level] || level;
}

export function getLearningPathLabel(path: string): string {
  const labels: Record<string, string> = {
    CYBERSECURITY_FUNDAMENTALS: 'Kiberxavfsizlik Asoslari',
    LINUX_FOR_SECURITY: 'Linux Xavfsizlik Uchun',
    NETWORKING_BASICS: 'Tarmoq Asoslari',
    WEB_APPLICATION_SECURITY: 'Veb Ilovalar Xavfsizligi',
    BUG_BOUNTY: 'Bug Bounty',
    SOC_ANALYST: 'SOC Mutaxassisi',
    DIGITAL_FORENSICS: 'Raqamli Kriminalistika',
    MALWARE_ANALYSIS: 'Zararli Dasturlar Tahlili',
    RED_TEAM: 'Red Team',
    BLUE_TEAM: 'Blue Team',
  };
  return labels[path] || path;
}
