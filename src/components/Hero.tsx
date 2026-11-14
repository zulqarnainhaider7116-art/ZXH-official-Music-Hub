import { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, ChevronDown } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { getTrendingTracks } from '../services/audius';
import type { Track } from '../types/music';
import './Hero.css';

export default function Hero() {
  const player = usePlayer();
  const [collection, setCollection] = useState<Track[]>([]);
  const [featured, setFeatured] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const tracks = await getTrendingTracks(12, 'week');
      if (mounted) {
        setCollection(tracks.slice(0, 4));
        setFeatured(tracks.slice(4, 8));
        setLoading(false);
        // Auto-load first track into player (paused)
        if (tracks[0] && !player.currentTrack) {
          // just set as current without playing
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const playTrack = (track: Track, list: Track[], idx: number) => {
    player.loadAndPlay(track, list, idx);
  };

  const playAll = () => {
    if (collection.length) {
      player.loadAndPlay(collection[0], collection, 0);
    }
  };

  return (
    <section className="hero">
      <div className="hero-bg">
        <img
          src="/assets/hero/hero-girl.png"
          alt="Music experience"
          className="hero-image"
        />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        {/* Left Music Collection */}
        <div className="music-collection glass animate-fade-in-up">
          <div className="collection-header">
            <h3>MUSIC COLLECTION</h3>
            <button className="play-all-btn" onClick={playAll}>
              <Play size={14} fill="currentColor" />
              Play All
            </button>
          </div>
          <div className="collection-list">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="track-row skeleton" />
                ))
              : collection.map((t, i) => (
                  <div
                    key={t.id}
                    className={`track-row ${player.currentTrack?.id === t.id ? 'active' : ''}`}
                    onClick={() => playTrack(t, collection, i)}
                  >
                    <img src={t.artwork} alt={t.title} className="track-art" loading="lazy" />
                    <div className="track-info">
                      <span className="track-title">{t.title}</span>
                      <span className="track-artist">{t.artist}</span>
                    </div>
                    <span className="track-duration">{formatTime(t.duration)}</span>
                    <button
                      className="track-play"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (player.currentTrack?.id === t.id) player.togglePlay();
                        else playTrack(t, collection, i);
                      }}
                    >
                      {player.currentTrack?.id === t.id && player.isPlaying ? (
                        <Pause size={14} fill="currentColor" />
                      ) : (
                        <Play size={14} fill="currentColor" />
                      )}
                    </button>
                  </div>
                ))}
          </div>
        </div>

        {/* Floating mini controller (top right of image area) */}
        <div className="floating-controller glass-strong animate-fade-in-up delay-2">
          {player.currentTrack ? (
            <>
              <img src={player.currentTrack.artwork} alt="" className="fc-art" />
              <div className="fc-controls">
                <button onClick={player.playPrev} aria-label="Previous">
                  <SkipBack size={16} />
                </button>
                <button className="fc-play" onClick={player.togglePlay} aria-label="Play/Pause">
                  {player.isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>
                <button onClick={player.playNext} aria-label="Next">
                  <SkipForward size={16} />
                </button>
                <button
                  className={player.isShuffle ? 'active' : ''}
                  onClick={player.toggleShuffle}
                  aria-label="Shuffle"
                >
                  <Shuffle size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="fc-placeholder">Select a track</div>
          )}
        </div>

        {/* Hero text block */}
        <div className="hero-text animate-fade-in-up delay-1">
          <p className="hero-desc">
            A seamless experience shaped around how you listen to music. From chill to focus, find the right beat for every moment.
          </p>
          <h1 className="hero-title">ENDLESS VIBE</h1>
        </div>

        {/* Bottom left CORE PLAYER */}
        <div className="core-player animate-fade-in-up delay-3">
          <p className="core-label">Feel the beautiful sound, when music made for you</p>
          <h2 className="core-title">CORE PLAYER</h2>
          <div className="scroll-hint">
            <span>Scroll to explore</span>
            <ChevronDown size={18} className="scroll-arrow" />
          </div>
        </div>

        {/* Bottom right featured tiles */}
        <div className="hero-featured animate-fade-in-up delay-4">
          <div className="featured-header">
            <span>Top Songs of the Month</span>
            <button className="play-all-sm" onClick={() => featured[0] && playTrack(featured[0], featured, 0)}>
              Play All
            </button>
          </div>
          <div className="featured-tiles">
            {loading
              ? Array.from({ length: 2 }).map((_, i) => <div key={i} className="featured-tile skeleton" />)
              : featured.slice(0, 2).map((t, i) => (
                  <div
                    key={t.id}
                    className="featured-tile"
                    onClick={() => playTrack(t, featured, i)}
                  >
                    <img src={t.artwork} alt={t.title} />
                    <div className="tile-overlay">
                      <span className="tile-title">{t.title}</span>
                      <span className="tile-artist">{t.artist}</span>
                    </div>
                    <button className="tile-play">
                      {player.currentTrack?.id === t.id && player.isPlaying ? (
                        <Pause size={16} fill="currentColor" />
                      ) : (
                        <Play size={16} fill="currentColor" />
                      )}
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
