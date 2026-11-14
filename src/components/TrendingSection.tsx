import { useEffect, useState } from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { getTrendingTracks } from '../services/audius';
import type { Track } from '../types/music';
import './TrendingSection.css';

export default function TrendingSection() {
  const player = usePlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingTracks(16, 'week').then((t) => {
      setTracks(t);
      setLoading(false);
    });
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <section className="trending-section">
      <div className="section-header">
        <h2>TOP SONGS OF THE MONTH</h2>
        <button
          className="play-all"
          onClick={() => tracks[0] && player.loadAndPlay(tracks[0], tracks, 0)}
        >
          <Play size={16} fill="currentColor" /> Play All
        </button>
      </div>

      <div className="track-grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="track-card skeleton-card" />
            ))
          : tracks.map((t, i) => (
              <div
                key={t.id}
                className={`track-card ${player.currentTrack?.id === t.id ? 'active' : ''}`}
                onClick={() => player.loadAndPlay(t, tracks, i)}
              >
                <div className="card-art-wrap">
                  <img src={t.artwork} alt={t.title} loading="lazy" />
                  <button
                    className="card-play"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (player.currentTrack?.id === t.id) player.togglePlay();
                      else player.loadAndPlay(t, tracks, i);
                    }}
                  >
                    {player.currentTrack?.id === t.id && player.isPlaying ? (
                      <Pause size={20} fill="currentColor" />
                    ) : (
                      <Play size={20} fill="currentColor" />
                    )}
                  </button>
                  <button className="card-like" onClick={(e) => e.stopPropagation()}>
                    <Heart size={16} />
                  </button>
                </div>
                <div className="card-meta">
                  <h4>{t.title}</h4>
                  <p>{t.artist}</p>
                  <span className="card-dur">{formatTime(t.duration)}</span>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}
