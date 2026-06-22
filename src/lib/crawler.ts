import { google } from 'googleapis';
import { prisma } from './prisma';
import { analyzeVideoContent } from './ai';
import { VideoSource, DifficultyLevel, LearningPath } from '@prisma/client';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

const SEARCH_KEYWORDS = [
  'cybersecurity tutorial',
  'ethical hacking',
  'linux security',
  'networking fundamentals',
  'kali linux',
  'bug bounty hunting',
  'web security OWASP',
  'penetration testing',
  'digital forensics',
  'malware analysis',
  'SOC analyst',
  'cyber defense',
  'red team operations',
  'blue team',
  'CTF walkthrough',
  'tryhackme',
  'hackthebox',
  'nmap tutorial',
  'burp suite',
  'metasploit',
];

interface CrawlResult {
  searched: number;
  found: number;
  analyzed: number;
  saved: number;
  errors: string[];
}

export async function discoverAndAnalyzeVideos(maxResults: number = 50): Promise<CrawlResult> {
  const result: CrawlResult = {
    searched: 0,
    found: 0,
    analyzed: 0,
    saved: 0,
    errors: [],
  };

  console.log('🕷️ Starting video discovery...');

  for (const keyword of SEARCH_KEYWORDS) {
    try {
      result.searched++;
      console.log(`\n🔍 Searching: "${keyword}"`);

      const searchResponse = await youtube.search.list({
        part: ['snippet'],
        q: keyword,
        type: ['video'],
        maxResults: Math.ceil(maxResults / SEARCH_KEYWORDS.length),
        videoDuration: 'medium',
        videoCategoryId: '27', // Education
        relevanceLanguage: 'en',
        order: 'relevance',
        safeSearch: 'strict',
      });

      const videos = searchResponse.data.items || [];
      result.found += videos.length;
      console.log(`   Found ${videos.length} videos`);

      for (const video of videos) {
        if (!video.id?.videoId) continue;

        try {
          // Check if already exists
          const existing = await prisma.video.findUnique({
            where: { externalId: video.id.videoId },
          });

          if (existing) {
            console.log(`   ⏭️  Skipped (exists): ${video.snippet?.title?.substring(0, 50)}`);
            continue;
          }

          // Get video details
          const videoResponse = await youtube.videos.list({
            part: ['snippet', 'contentDetails', 'statistics'],
            id: [video.id.videoId],
          });

          const videoData = videoResponse.data.items?.[0];
          if (!videoData) continue;

          const title = videoData.snippet?.title || '';
          const description = videoData.snippet?.description || '';
          const thumbnail = videoData.snippet?.thumbnails?.high?.url || '';
          const channel = videoData.snippet?.channelTitle || '';
          const channelId = videoData.snippet?.channelId || '';
          const publishedAt = videoData.snippet?.publishedAt ? new Date(videoData.snippet.publishedAt) : null;
          const duration = parseDuration(videoData.contentDetails?.duration || 'PT0M0S');
          const viewCount = parseInt(videoData.statistics?.viewCount || '0');
          const likeCount = parseInt(videoData.statistics?.likeCount || '0');

          // Skip non-English or very short videos
          if (duration < 300) continue; // Less than 5 minutes

          // AI analysis
          result.analyzed++;
          console.log(`   🤖 Analyzing: ${title.substring(0, 50)}...`);

          const analysis = await analyzeVideoContent(title, description);

          // Save to database
          await prisma.video.create({
            data: {
              externalId: video.id.videoId,
              source: VideoSource.YOUTUBE,
              url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
              embedUrl: `https://www.youtube.com/embed/${video.id.videoId}`,
              title,
              description: description.substring(0, 5000),
              thumbnail,
              duration,
              channel,
              channelUrl: `https://www.youtube.com/channel/${channelId}`,
              publishedAt,
              viewCount,
              likeCount,
              language: 'en',
              difficulty: analysis.difficulty as DifficultyLevel,
              topics: analysis.topics,
              tags: analysis.tags,
              learningPaths: (analysis.learningPaths || []) as LearningPath[],
              aiAnalyzed: true,
              aiAnalysis: analysis as any,
              isApproved: false, // Admin approval required
            },
          });

          result.saved++;
          console.log(`   ✅ Saved`);

          // Rate limiting
          await new Promise((r) => setTimeout(r, 1000));
        } catch (videoError: any) {
          result.errors.push(`Video ${video.id.videoId}: ${videoError.message}`);
        }
      }
    } catch (keywordError: any) {
      result.errors.push(`Keyword "${keyword}": ${keywordError.message}`);
    }
  }

  console.log('\n🎉 Discovery complete!');
  console.log(`   Searched: ${result.searched} keywords`);
  console.log(`   Found: ${result.found} videos`);
  console.log(`   Analyzed: ${result.analyzed} videos`);
  console.log(`   Saved: ${result.saved} new videos`);

  return result;
}

function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Fetch video transcript using YouTube captions (simplified)
 */
export async function getVideoTranscript(videoId: string): Promise<string | null> {
  // Note: Real implementation would use youtube-transcript npm package
  // For now, returning null
  return null;
}
