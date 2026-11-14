import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Pause, MoonStar, ArrowUpRight, Headphones } from 'lucide-react';
import { getFeaturedNaats } from '../services/audius';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types/music';
import './FeaturedNaats.css';

export default function FeaturedNaats() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const player = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getFeaturedNaats(10)
      .then(items => { if (active) setTracks(items.slice(0, 10)); })
      .catch(error => console.error('Featured Naats could not load', error))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const play = (track: Track, index: number) => {
    player.loadAndPlay(track, tracks, index);
    navigate('/player');
  };

  return (
    <section className="featured-naats" id="featured-naats">
      <div className="naats-heading">
        <div className="naats-heading-copy">
          <span className="naats-eyebrow"><MoonStar size={15} /> THE SPIRITUAL SOUND COLLECTION</span>
          <h2>Featured <em>Naats.</em></h2>
          <p>Ten individual devotional recitations. Each track has its own artwork and a dedicated listening experience.</p>
        </div>
        <Link to="/genre/naat" className="naats-more">Explore collection <ArrowUpRight size={17} /></Link>
      </div>
      <div className="naats-toolbar">
        <div className="naats-library-label"><span className="naats-live-dot" /> HANDPICKED LISTENING</div>
        {!loading && <div className="naats-count"><Headphones size={14} /> {tracks.length} TRACKS</div>}
      </div>
      {loading ? (
        <div className="naats-grid naats-skeleton-grid" aria-label="Loading featured Naats">
          {Array.from({ length: 10 }, (_, index) => <div className="naat-skeleton" key={index}><span className="naat-skeleton-art" /><span className="naat-skeleton-lines"><i /><i /></span></div>)}
        </div>
      ) : tracks.length ? (
        <div className="naats-grid">
          {tracks.map((track, index) => {
            const active = player.currentTrack?.id === track.id;
            return (
              <article className={active ? 'naat-card is-active' : 'naat-card'} key={track.id}>
                <button className="naat-art" onClick={() => play(track, index)} aria-label={`Play ${track.title}`}>
                  <img src={track.artwork} alt={`${track.title} cover art`} loading="lazy" />
                  <span className="naat-art-play">{active && player.isPlaying ? <Pause size={21} fill="currentColor" /> : <Play size={21} fill="currentColor" />}</span>
                  <span className="naat-track-number">{String(index + 1).padStart(2, '0')}</span>
                </button>
                <button className="naat-info" onClick={() => play(track, index)}>
                  <span className="naat-type">NAAT COLLECTION · {String(index + 1).padStart(2, '0')}</span>
                  <h3>{track.title}</h3><p>{track.artist}</p>
                </button>
                <button className="naat-inline-play" onClick={() => play(track, index)} aria-label={`Open player for ${track.title}`}>{active && player.isPlaying ? <Pause size={17} /> : <Play size={17} />}</button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="naats-empty"><MoonStar size={24} /><div><strong>Collection is refreshing</strong><p>Featured Naats are temporarily unavailable. Please try again shortly.</p></div></div>
      )}
      <div className="naats-footer-note">A NEW LISTENING EXPERIENCE BY <strong>ZXH OFFICIAL</strong></div>
    </section>
  );
}
