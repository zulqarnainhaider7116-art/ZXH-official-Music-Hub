import { useState } from 'react';
import { Search as SearchIcon, Play, Pause } from 'lucide-react';
import { searchTracks } from '../services/audius';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types/music';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const player = usePlayer();

  const doSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const tracks = await searchTracks(query, 24);
    setResults(tracks);
    setLoading(false);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ paddingTop: 'calc(var(--header-h) + 32px)', paddingBottom: 120, maxWidth: 1400, margin: '0 auto', paddingLeft: 32, paddingRight: 32 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 24 }}>Search</h1>

      <form onSubmit={doSearch} style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <SearchIcon size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Songs, artists, albums..."
            style={{
              width: '100%',
              padding: '14px 16px 14px 44px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.08)',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '0 28px',
            borderRadius: 999,
            background: 'var(--gradient-primary)',
            fontWeight: 600,
            fontSize: '0.95rem',
          }}
        >
          Search
        </button>
      </form>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Searching...</p>}

      {!loading && searched && results.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No results found for “{query}”.</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20 }}>
        {results.map((t, i) => (
          <div
            key={t.id}
            onClick={() => player.loadAndPlay(t, results, i)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ position: 'relative', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
              <img src={t.artwork} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                style={{
                  position: 'absolute', bottom: 8, right: 8, width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--fuchsia)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (player.currentTrack?.id === t.id) player.togglePlay();
                  else player.loadAndPlay(t, results, i);
                }}
              >
                {player.currentTrack?.id === t.id && player.isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
              </button>
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.artist} · {formatTime(t.duration)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
