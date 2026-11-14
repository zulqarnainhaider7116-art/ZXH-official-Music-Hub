import { TrendingUp, Flame, ArrowUpRight } from 'lucide-react';
import TrendingSection from '../components/TrendingSection';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

export default function Trending() {
 return <div className="landing-page">
  <div className="landing-kicker"><Flame size={15}/> THE SOUND RIGHT NOW</div>
  <h1 className="landing-heading">On repeat.<br/><em>On the rise.</em></h1>
  <p className="landing-intro">The tracks making waves across the Audius catalogue. Catch the momentum, find your next favourite and keep the volume up.</p>
  <section className="landing-hero" style={{backgroundImage:"linear-gradient(90deg,rgba(25,0,17,.94),rgba(25,0,17,.18)),url('https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1800&q=85')"}}>
   <div><span className="landing-kicker"><TrendingUp size={15}/> WEEKLY CHARTS</span><h2>Feel the pulse<br/>of what's next.</h2><p>Freshly trending tracks, updated from the Audius music catalogue.</p><div className="landing-actions"><Link className="landing-cta" to="/discover">Explore more <ArrowUpRight size={17}/></Link></div></div>
  </section>
  <TrendingSection/>
 </div>;
}
