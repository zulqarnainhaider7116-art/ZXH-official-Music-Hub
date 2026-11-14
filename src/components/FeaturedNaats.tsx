import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, MoonStar, ArrowUpRight, LoaderCircle } from 'lucide-react';
import { getFeaturedNaats } from '../services/audius';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types/music';
import './FeaturedNaats.css';

export default function FeaturedNaats() {
  const [tracks,setTracks]=useState<Track[]>([]);
  const [loading,setLoading]=useState(true);
  const player=usePlayer();
  useEffect(()=>{let active=true;getFeaturedNaats(30).then(items=>{if(active){setTracks(items);setLoading(false);}});return()=>{active=false;};},[]);
  const play=(track:Track,index:number)=>player.loadAndPlay(track,tracks,index);
  return <section className="featured-naats" id="featured-naats">
    <div className="naats-heading"><div><span className="naats-eyebrow"><MoonStar size={15}/> SPIRITUAL COLLECTION · ZXH MUSIC</span><h2>Featured <em>Naats.</em></h2><p>A dedicated collection of devotional voices. Discover and listen in one tap.</p></div><Link to="/genre/naat" className="naats-more">Explore all <ArrowUpRight size={17}/></Link></div>
    {loading?<div className="naats-loading"><LoaderCircle className="naats-spin" size={22}/> Finding featured Naats from Audius…</div>:tracks.length?<><div className="naats-count">{tracks.length}+ DEVOTIONAL TRACKS FOUND</div><div className="naats-grid">{tracks.map((t,i)=><article className={player.currentTrack?.id===t.id?'naat-card is-active':'naat-card'} key={t.id}><button className="naat-art" onClick={()=>play(t,i)} aria-label={`Play ${t.title}`}><img src={t.artwork} alt={t.title} loading="lazy"/><span>{player.currentTrack?.id===t.id&&player.isPlaying?<Pause size={21} fill="currentColor"/>:<Play size={21} fill="currentColor"/>}</span></button><div className="naat-info"><h3>{t.title}</h3><p>{t.artist}</p></div><button className="naat-inline-play" onClick={()=>player.currentTrack?.id===t.id?player.togglePlay():play(t,i)} aria-label="Play Naat">{player.currentTrack?.id===t.id&&player.isPlaying?<Pause size={17}/>:<Play size={17}/>}</button></article>)}</div></>:<div className="naats-empty">Featured Naats are temporarily unavailable. Please try again shortly.</div>}
  </section>;
}
