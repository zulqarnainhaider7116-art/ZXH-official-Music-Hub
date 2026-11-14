import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, User } from 'lucide-react';
import './Header.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/discover', label: 'Discover' },
  { path: '/trending', label: 'Trending' },
  { path: '/search', label: 'Search' },
  { path: '/artists', label: 'Artists' },
  { path: '/playlists', label: 'Playlists' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-inner glass">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-icon">🎧</span>
          <div className="logo-text">
            <span className="logo-main">ZXH MUSIC</span>
            <span className="logo-sub">POWERED BY ZXH OFFICIAL</span>
          </div>
        </Link>

        <nav className={`nav ${open ? 'open' : ''}`}>
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={location.pathname === l.path ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button className="icon-btn" aria-label="Language">
            <Globe size={18} />
            <span className="lang">Eng</span>
          </button>
          <button className="btn-login">
            <User size={16} />
            <span>Login / Register</span>
          </button>
          <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
