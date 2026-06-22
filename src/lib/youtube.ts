import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  channelTitle: string;
  publishedAt: string;
}

export async function fetchYouTubeVideo(query: string, maxResults = 10): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YOUTUBE_API_KEY not configured, returning empty');
    return [];
  }

  try {
    const searchRes = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: {
        key: YOUTUBE_API_KEY,
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults,
        relevanceLanguage: 'uz',
        safeSearch: 'strict',
        order: 'relevance',
      },
    });

    const videoIds = searchRes.data.items?.map((item: any) => item.id.videoId).filter(Boolean) || [];
    if (videoIds.length === 0) return [];

    const detailsRes = await axios.get(`${YOUTUBE_API_URL}/videos`, {
      params: {
        key: YOUTUBE_API_KEY,
        id: videoIds.join(','),
        part: 'contentDetails,snippet',
      },
    });

    return detailsRes.data.items?.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      duration: parseISO8601Duration(item.contentDetails.duration),
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    })) || [];
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0') * 3600;
  const minutes = parseInt(match[2] || '0') * 60;
  const seconds = parseInt(match[3] || '0');
  return hours + minutes + seconds;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}