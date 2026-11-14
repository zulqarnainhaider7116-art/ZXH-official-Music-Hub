import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import './MiniPlayer.css';

export default function MiniPlayer() {
  const player = usePlayer();

  if (!player.currentTrack) return null;

  const { currentTrack, isPlaying, progress, duration, volume, isMuted, isLoading } = player;

  const format = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="mini-player glass-strong">
      <div className="mp-progress" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const ratio = x / rect.width;
        player.seek(ratio * duration);
      }}>
        <div className="mp-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="mp-inner">
        <div className="mp-track">
          <img src={currentTrack.artwork} alt={currentTrack.title} className="mp-art" />
          <div className="mp-info">
            <span className="mp-title">{currentTrack.title}</span>
            <span className="mp-artist">{currentTrack.artist}</span>
          </div>
          
        </div>

        <div className="mp-controls">
          <button onClick={player.playPrev} aria-label="Previous">
            <SkipBack size={18} />
          </button>
          <button className="mp-play" onClick={player.togglePlay} disabled={isLoading} aria-label="Play/Pause">
            {isLoading ? (
              <span className="spinner" />
            ) : isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </button>
          <button onClick={player.playNext} aria-label="Next">
            <SkipForward size={18} />
          </button>
        </div>

        <div className="mp-right">
          <span className="mp-time">{format(progress)} / {format(duration)}</span>
          <button onClick={player.toggleMute} aria-label="Mute">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => player.setVolume(parseFloat(e.target.value))}
            className="mp-volume"
            aria-label="Volume"
          />
          
        </div>
      </div>
    </div>
  );
}
