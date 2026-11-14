import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Headphones } from 'lucide-react';
import { getTrendingTracks } from '../services/audius';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types/music';
import '../styles/landing.css';

const mixes = [
  { name: 'Late Night Frequencies', note: 'Slow down. Let the night speak.', tag: 'AFTER DARK', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85' },
  { name: 'The Feel-Good Edit', note: 'Bright sounds for brighter days.', tag: 'GOOD ENERGY', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=85' },
  { name: 'Deep Focus', note: 'Find your flow and stay there.', tag: 'FOCUS MODE', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=85' },
];

export default function Playlists() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const player = usePlayer();
  useEffect(() => { let live = true; getTrendingTracks(20, 'month').then(data => { if (live) { setTracks(data); setLoading(false); } }); return () => { live = false; }; }, []);
  return <div className="landing-page">
    <div className="landing-kicker"><Sparkles size={15}/> THE SOUNDTRACK TO YOUR DAY</div>
    <h1 className="landing-heading">Made for<br/><em>your mood.</em></h1>
    <p className="landing-intro">Hand-picked listening journeys, fresh discoveries and sounds worth keeping on repeat. Find the mix that feels like you.</p>
    <section className="landing-hero" style={{backgroundImage:"linear-gradient(90deg,rgba(25,0,17,.94),rgba(25,0,17,.25)),url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1800&q=85')"}}>
      <div><span className="landing-kicker">ZXH EDITOR'S PICK</span><h2>Press play.<br/>Leave the world behind.</h2><p>One destination. Endless ways to feel the music.</p><div className="landing-actions"><Link className="landing-cta" to="/discover"><Headphones size={17}/> Explore mixes</Link><Link className="landing-cta secondary" to="/trending">Trending now</Link></div></div>
    </section>
    <section className="landing-section"><div className="landing-section-head"><div><h2>Curated for every moment</h2><p>Three starting points. A thousand different feelings.</p></div></div><div className="landing-feature-grid">{mixes.map(m=><article className="landing-feature" key={m.name} style={{backgroundImage:`linear-gradient(0deg,rgba(20,0,15,.95),rgba(20,0,15,.12)),url(${m.image})`,backgroundSize:'cover',backgroundPosition:'center'}}><span>{m.tag}</span><h3>{m.name}</h3><p>{m.note}</p></article>)}</div></section>
    <section className="landing-section"><div className="landing-section-head"><div><h2>Fresh tracks to add</h2><p>Trending picks from the Audius catalogue.</p></div>{tracks[0]&&<button className="landing-cta" onClick={()=>player.loadAndPlay(tracks[0],tracks,0)}><Play size={16} fill="currentColor"/> Play mix</button>}</div>
    {loading?<p className="landing-loading">Finding your next favourite tracks…</p>:tracks.length?<div className="landing-track-grid">{tracks.slice(0,12).map((t,i)=><article className="landing-track" key={t.id} onClick={()=>player.loadAndPlay(t,tracks,i)}><div className="landing-track-art"><img src={t.artwork} alt={t.title} loading="lazy"/><button className="landing-track-play" aria-label={`Play ${t.title}`}><Play size={19} fill="white"/></button></div><h3>{t.title}</h3><p>{t.artist}</p></article>)}</div>:<div className="landing-empty">Tracks are temporarily unavailable. Please try again shortly.</div>}</section>
  </div>;
}