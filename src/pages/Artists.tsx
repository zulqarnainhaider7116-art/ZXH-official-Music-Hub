import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic2, Play, ArrowUpRight } from 'lucide-react';
import { getTrendingTracks } from '../services/audius';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types/music';
import '../styles/landing.css';

export default function Artists() {
 const [tracks,setTracks]=useState<Track[]>([]); const [loading,setLoading]=useState(true); const player=usePlayer();
 useEffect(()=>{let live=true;getTrendingTracks(40,'month').then(data=>{if(live){setTracks(data);setLoading(false)}});return()=>{live=false}},[]);
 const artists=Array.from(new Map(tracks.map(t=>[t.artistId||t.artist,t])).values());
 return <div className="landing-page">
  <div className="landing-kicker"><Mic2 size={15}/> THE PEOPLE BEHIND THE SOUND</div>
  <h1 className="landing-heading">Meet the<br/><em>music makers.</em></h1>
  <p className="landing-intro">Discover artists shaping the sound right now. Explore their tracks, follow the feeling and find a new favourite voice.</p>
  <section className="landing-hero" style={{backgroundImage:"linear-gradient(90deg,rgba(25,0,17,.94),rgba(25,0,17,.2)),url('https://images.unsplash.com/photo-152436 유?auto=format&fit=crop&w=1800&q=85')"}}>
   <div><span className="landing-kicker">ARTIST SPOTLIGHT</span><h2>Every sound<br/>has a story.</h2><p>Start with the voices moving the charts this week.</p><div className="landing-actions"><Link className="landing-cta" to="/trending">Hear what's hot <ArrowUpRight size={17}/></Link></div></div>
  </section>
  <section className="landing-section"><div className="landing-section-head"><div><h2>Artists in rotation</h2><p>Creators represented in this month's trending tracks.</p></div></div>
  {loading?<p className="landing-loading">Loading artists…</p>:artists.length?<div className="landing-artist-grid">{artists.slice(0,30).map((t,i)=><button className="landing-artist" key={t.artistId||t.artist} onClick={()=>player.loadAndPlay(t,tracks,tracks.findIndex(x=>x.id===t.id))}><img src={t.artwork} alt="" loading="lazy"/><h3>{t.artist}</h3><p>Featured track · {i+1}</p></button>)}</div>:<div className="landing-empty">Artist discovery is temporarily unavailable. Try again soon.</div>}</section>
  </div>;
}