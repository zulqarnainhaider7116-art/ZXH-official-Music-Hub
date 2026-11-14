import Hero from '../components/Hero';
import TrendingSection from '../components/TrendingSection';
import FeaturedNaats from '../components/FeaturedNaats';
import CategorySection from '../components/CategorySection';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedNaats />
      <TrendingSection />
      <CategorySection />
    </>
  );
}
