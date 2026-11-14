import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">🎧 ZXH MUSIC</span>
          <p className="footer-tagline">MUSIC BEYOND BOUNDARIES.</p>
        </div>

        <nav className="footer-nav">
          <Link to="/">Home</Link>
          <Link to="/discover">Discover</Link>
          <Link to="/trending">Trending</Link>
          <Link to="/artists">Artists</Link>
          <Link to="/playlists">Playlists</Link>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="footer-credits">
          <p>POWERED BY ZXH OFFICIAL</p>
          <p>CREATED & DEVELOPED BY<br />ZULQARNAIN X HAIDER</p>
        </div>

        <p className="footer-copy">© 2026 ZXH MUSIC. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
