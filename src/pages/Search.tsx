import { useState, type FormEvent } from 'react';
import { Search as SearchIcon, Play, Pause, Sparkles } from 'lucide-react';
import { searchTracks } from '../services/audius';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types/music';
import '../styles/landing.css';

export default function SearchPage() {
 const [query,setQuery]=useState(''); const [results,setResults]=useState<Track[]>([]); const [loading,setLoading]=useState(false); const [searched,setSearched]=useState(false); const player=usePlayer();
 const doSearch=async(e?:FormEvent)=>{e?.preventDefault();if(!query.trim())return;setLoading(true);setSearched(true);const tracks=await searchTracks(query,24);setResults(tracks);setLoading(false)};
 const formatTime=(s:number)=>`${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
 return <div className="landing-page">
  <div className="landing-kicker"><Sparkles size={15}/> SEARCH THE SOUND</div>
  <h1 className="landing-heading">What are<br/><em>we feeling?</em></h1>
  <p className="landing-intro">Find songs, artists and unexpected favourites across the Audius catalogue. Your next repeat-worthy track is one search away.</p>
  <form onSubmit={doSearch} style={{display:'flex',gap:10,maxWidth:850,margin:'38px 0 52px'}}>
   <div style={{position:'relative',flex:1,minWidth:0}}><SearchIcon size={19} style={{position:'absolute',left:18,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}}/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search songs, artists, sounds…" aria-label="Search music" style={{width:'100%',padding:'17px 18px 17px 50px',borderRadius:999,border:'1px solid rgba(255,255,255,.18)',background:'rgba(255,255,255,.09)',color:'#fff',fontSize:'1rem',outline:'none',minWidth:0}}/></div>
   <button type="submit" disabled={loading} className="landing-cta">Search <SearchIcon size={17}/></button>
  </form>
  <section className="landing-section"><div className="landing-section-head"><div><h2>{searched?'Search results':'Start exploring'}</h2><p>{searched?`Matches for “${query}”`:'Search by track title, artist name or keyword.'}</p></div></div>
   {loading&&<p className="landing-loading">Searching the catalogue…</p>}
   {!loading&&searched&&results.length===0&&<div className="landing-empty">No tracks found for “{query}”. Try another artist or search term.</div>}
   {!searched&&<div className="landing-feature-grid"><article className="landing-feature"><span>01 · FIND</span><h3>Search a song</h3><p>Type a title and jump straight into the music.</p></article><article className="landing-feature"><span>02 · DISCOVER</span><h3>Explore artists</h3><p>Search a creator and uncover their sound.</p></article><article className="landing-feature"><span>03 · PLAY</span><h3>Keep it going</h3><p>Play a result and let the queue take over.</p></article></div>}
   {results.length>0&&<div className="landing-track-grid">{results.map((t,i)=><article className="landing-track" key={t.id} onClick={()=>player.loadAndPlay(t,results,i)}><div className="landing-track-art"><img src={t.artwork} alt={t.title} loading="lazy"/><button className="landing-track-play" aria-label={player.currentTrack?.id===t.id&&player.isPlaying?'Pause':'Play'} onClick={e=>{e.stopPropagation();if(player.currentTrack?.id===t.id)player.togglePlay();else player.loadAndPlay(t,results,i)}}>{player.currentTrack?.id===t.id&&player.isPlaying?<Pause size={19} fill="white"/>:<Play size={19} fill="white"/>}</button></div><h3>{t.title}</h3><p>{t.artist} · {formatTime(t.duration)}</p></article>)}</div>}
  </section>
 </div>;
}