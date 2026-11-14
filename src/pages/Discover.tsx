import TrendingSection from '../components/TrendingSection';
import CategorySection from '../components/CategorySection';

export default function Discover() {
  return (
    <div style={{ paddingTop: 'var(--header-h)' }}>
      <div style={{ padding: '48px 32px 0', maxWidth: 1400, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>Discover</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
          Explore curated moods, genres and new releases.
        </p>
      </div>
      <CategorySection />
      <TrendingSection />
    </div>
  );
}
