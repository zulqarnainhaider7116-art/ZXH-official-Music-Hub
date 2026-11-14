import type { AudiusTrack, Track } from '../types/music';

const APP_NAME = 'ZXH_MUSIC';
const BASE_URL = 'https://api.audius.co/v1';

async function fetchAudius<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('app_name', APP_NAME);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);
    if (!res.ok) {
      throw new Error(`Audius API error: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    return json.data ?? json;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

export function mapAudiusTrack(t: AudiusTrack): Track {
  const artwork =
    t.artwork?.['480x480'] ||
    t.artwork?.['150x150'] ||
    t.artwork?.['1000x1000'] ||
    `https://picsum.photos/seed/${t.id}/400/400`;

  // Stream URL pattern used by Audius discovery providers
  const streamUrl = `${BASE_URL}/tracks/${t.id}/stream?app_name=${APP_NAME}`;

  return {
    id: t.id,
    title: t.title || 'Unknown Track',
    artist: t.user?.name || t.user?.handle || 'Unknown Artist',
    artistId: t.user?.id,
    duration: t.duration || 0,
    artwork,
    streamUrl,
    genre: t.genre,
    playCount: t.play_count,
  };
}

export async function getTrendingTracks(limit = 20, time: 'week' | 'month' | 'year' | 'allTime' = 'week'): Promise<Track[]> {
  try {
    const data = await fetchAudius<AudiusTrack[]>('/tracks/trending', { limit, time });
    return (Array.isArray(data) ? data : []).map(mapAudiusTrack);
  } catch (e) {
    console.error('Failed to fetch trending tracks', e);
    return [];
  }
}

export async function searchTracks(query: string, limit = 20): Promise<Track[]> {
  if (!query.trim()) return [];
  try {
    const data = await fetchAudius<AudiusTrack[]>('/tracks/search', { query, limit });
    return (Array.isArray(data) ? data : []).map(mapAudiusTrack);
  } catch (e) {
    console.error('Search failed', e);
    return [];
  }
}

export async function getTrack(id: string): Promise<Track | null> {
  try {
    const data = await fetchAudius<AudiusTrack>(`/tracks/${id}`);
    return data ? mapAudiusTrack(data) : null;
  } catch {
    return null;
  }
}

export function getStreamUrl(trackId: string): string {
  return `${BASE_URL}/tracks/${trackId}/stream?app_name=${APP_NAME}`;
}

// Fallback curated tracks if API is rate-limited or unavailable (still real Audius IDs when possible)
export const FALLBACK_TRACKS: Track[] = [
  {
    id: 'fallback-1',
    title: 'Neon Dreams',
    artist: 'ZXH Collective',
    duration: 214,
    artwork: 'https://picsum.photos/seed/neon1/400/400',
    streamUrl: '',
    genre: 'Electronic',
  },
  {
    id: 'fallback-2',
    title: 'Midnight Pulse',
    artist: 'Fuchsia Wave',
    duration: 198,
    artwork: 'https://picsum.photos/seed/neon2/400/400',
    streamUrl: '',
    genre: 'Chill',
  },
];
