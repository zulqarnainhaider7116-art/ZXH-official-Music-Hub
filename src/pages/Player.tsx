import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, VolumeX, ListMusic, Music2, Disc3 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import '../styles/landing.css';
import './Player.css';

export default function PlayerPage(){
 const p=usePlayer();const t=p.currentTrack;
 const fmt=(s:number)=>{if(!Number.isFinite(s)||s<0)return '0:00';return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;};
 const seek=(value:string)=>p.seek(Math.max(0,Math.min(p.duration,Number(value))));
 return <div className="full-player-page">
  <div className="full-player-top"><Link to="/" className="player-back"><ArrowLeft size={18}/> Back to music</Link><span><Disc3 size={17}/> ZXH OFFICIAL MUSIC PLAYER</span></div>
  {!t?<div className="player-empty"><div className="player-empty-icon"><Music2 size={42}/></div><span className="player-kicker">YOUR LISTENING SPACE</span><h1>Ready when<br/><em>you are.</em></h1><p>Choose a Naat, discover a track or explore the charts to start listening.</p><Link to="/discover" className="landing-cta">Discover music <Play size={16} fill="currentColor"/></Link></div>:
  <div className="full-player-layout">
   <section className="player-art-panel"><div className="player-art-glow"/><img className={p.isPlaying?'player-cover playing':'player-cover'} src={t.artwork} alt={t.title}/><span className="player-art-caption">NOW PLAYING · ZXH MUSIC</span></section>
   <section className="player-main-panel">
    <span className="player-kicker">NOW PLAYING</span><h1 className="player-track-title">{t.title}</h1><p className="player-track-artist">{t.artist}</p>
    {p.error&&<p className="player-error" role="status">{p.error}</p>}
    <div className="player-seek"><input type="range" min="0" max={p.duration||1} step="1" value={Math.min(p.progress,p.duration||0)} onChange={e=>seek(e.target.value)} aria-label="Seek track"/><div><span>{fmt(p.progress)}</span><span>{fmt(p.duration)}</span></div></div>
    <div className="player-controls"><button onClick={p.toggleShuffle} className={p.isShuffle?'selected':''} aria-label="Toggle shuffle" title="Shuffle"><Shuffle size={20}/></button><button onClick={p.playPrev} aria-label="Previous track"><SkipBack size={24} fill="currentColor"/></button><button className="player-main-play" onClick={p.togglePlay} disabled={p.isLoading} aria-label="Play or pause">{p.isLoading?<span className="player-spinner"/>:p.isPlaying?<Pause size={27} fill="currentColor"/>:<Play size={27} fill="currentColor"/>}</button><button onClick={p.playNext} aria-label="Next track"><SkipForward size={24} fill="currentColor"/></button><button onClick={p.cycleRepeat} className={p.repeatMode!=='off'?'selected':''} aria-label={`Repeat ${p.repeatMode}`} title={`Repeat: ${p.repeatMode}`}>{p.repeatMode==='one'?<Repeat1 size={20}/>:<Repeat size={20}/>}</button></div>
    <div className="player-volume"><button onClick={p.toggleMute} aria-label="Toggle mute">{p.isMuted||p.volume===0?<VolumeX size={19}/>:<Volume2 size={19}/>}</button><input type="range" min="0" max="1" step="0.01" value={p.isMuted?0:p.volume} onChange={e=>p.setVolume(Number(e.target.value))} aria-label="Volume"/><span>{Math.round((p.isMuted?0:p.volume)*100)}%</span></div>
    <div className="player-queue"><div className="queue-heading"><h2><ListMusic size={19}/> Up next</h2><span>{p.queue.length} tracks</span></div>{p.queue.length?p.queue.map((q,i)=><button key={q.id} className={p.currentIndex===i?'queue-track current':'queue-track'} onClick={()=>p.loadAndPlay(q,p.queue,i)}><img src={q.artwork} alt=""/><span className="queue-track-copy"><strong>{q.title}</strong><small>{q.artist}</small></span><span className="queue-index">{p.currentIndex===i&&p.isPlaying?'PLAYING':String(i+1).padStart(2,'0')}</span></button>):<p className="queue-empty">Your queue will appear here.</p>}</div>
   </section>
  </div>}
 </div>;
}
