import TrendingSection from '../components/TrendingSection';

export default function Trending() {
  return (
    <div style={{ paddingTop: 'var(--header-h)' }}>
      <div style={{ padding: '48px 32px 0', maxWidth: 1400, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>Trending Now</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
          Real-time trending tracks from the Audius catalogue.
        </p>
      </div>
      <TrendingSection />
    </div>
  );
}
