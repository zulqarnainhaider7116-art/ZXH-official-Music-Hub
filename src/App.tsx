import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Header from './components/Header';
import MiniPlayer from './components/MiniPlayer';
import Footer from './components/Footer';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Trending from './pages/Trending';
import SearchPage from './pages/Search';
import Artists from './pages/Artists';
import Playlists from './pages/Playlists';
import PlayerPage from './pages/Player';
import './styles/global.css';
import './styles/animations.css';

function AppShell() {
  const location = useLocation();
  const isPlayerRoute = location.pathname === '/player';
  return <>
    <Header />
    <main className={isPlayerRoute ? 'app-main app-main-player' : 'app-main'}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/genre/:genreId" element={<Discover />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:artistId" element={<Artists />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </main>
    {!isPlayerRoute && <Footer />}
    <MiniPlayer />
  </>;
}

export default function App() {
  return <PlayerProvider><BrowserRouter><AppShell /></BrowserRouter></PlayerProvider>;
}
