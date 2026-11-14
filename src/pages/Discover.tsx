import { Link } from 'react-router-dom';
import { Compass, ArrowUpRight, Music2, MoonStar, Heart, Zap, Headphones, Globe2 } from 'lucide-react';
import TrendingSection from '../components/TrendingSection';
import CategorySection from '../components/CategorySection';
import '../styles/landing.css';

const paths=[{name:'Bollywood',desc:'Big-screen melodies and timeless hits.',icon:Globe2},{name:'Punjabi',desc:'Bass, bhangra and bold energy.',icon:Zap},{name:'Pakistani',desc:'Local voices, new waves and classics.',icon:Music2},{name:'Naats & Nasheeds',desc:'Peaceful listening and spiritual reflection.',icon:MoonStar},{name:'Sufi & Qawwali',desc:'Soulful traditions, powerful vocals.',icon:Heart},{name:'Chill & Lo-fi',desc:'Soft focus for slow moments.',icon:Headphones}];
export default function Discover(){return <div className="landing-page">
 <div className="landing-kicker"><Compass size={15}/> YOUR NEXT FAVOURITE STARTS HERE</div>
 <h1 className="landing-heading">Find your<br/><em>frequency.</em></h1>
 <p className="landing-intro">A world of sound, sorted by feeling. Move through genres, moods and fresh discoveries — then let the music take it from there.</p>
 <section className="landing-hero" style={{backgroundImage:"linear-gradient(90deg,rgba(25,0,17,.94),rgba(25,0,17,.2)),url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1800&q=85')"}}>
  <div><span className="landing-kicker">EXPLORE WITHOUT LIMITS</span><h2>One mood away<br/>from your next obsession.</h2><p>From the sounds you grew up with to the ones you'll discover today.</p><div className="landing-actions"><Link to="/search" className="landing-cta">Search music <ArrowUpRight size={17}/></Link><Link to="/playlists" className="landing-cta secondary">Browse playlists</Link></div></div>
 </section>
 <section className="landing-section"><div className="landing-section-head"><div><h2>Explore by mood & genre</h2><p>Choose a direction. Let the algorithm-free wandering begin.</p></div></div><div className="landing-feature-grid">{paths.map((p)=><article className="landing-feature" key={p.name}><p><p.icon size={24}/></p><h3>{p.name}</h3><p>{p.desc}</p></article>)}</div></section>
 <CategorySection/>
 <TrendingSection/>
 </div>}
