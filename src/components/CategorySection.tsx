import './CategorySection.css';

const categories = [
  { id: 'bollywood', name: 'Bollywood', gradient: 'linear-gradient(135deg, #FF008C, #FF6B00)' },
  { id: 'punjabi', name: 'Punjabi', gradient: 'linear-gradient(135deg, #E60074, #FFD700)' },
  { id: 'pakistani', name: 'Pakistani Music', gradient: 'linear-gradient(135deg, #68003D, #00C9A7)' },
  { id: 'english', name: 'English Music', gradient: 'linear-gradient(135deg, #B77CFF, #FF008C)' },
  { id: 'hollywood', name: 'Naats & Nasheeds', gradient: 'linear-gradient(135deg, #43001F, #2E8B57)' },
  { id: 'sufi', name: 'Sufi & Qawwali', gradient: 'linear-gradient(135deg, #FF1493, #4A0080)' },
  { id: 'romantic', name: 'Romantic', gradient: 'linear-gradient(135deg, #FF9AD5, #E60074)' },
  { id: 'sad', name: 'Sad Songs', gradient: 'linear-gradient(135deg, #43001F, #1a0030)' },
  { id: 'chill', name: 'Chill & Lo-fi', gradient: 'linear-gradient(135deg, #B77CFF, #00B4D8)' },
  { id: 'workout', name: 'Workout', gradient: 'linear-gradient(135deg, #FF008C, #FF3D00)' },
  { id: 'party', name: 'Party Hits', gradient: 'linear-gradient(135deg, #E60074, #FFEA00)' },
  { id: 'instrumental', name: 'Instrumental', gradient: 'linear-gradient(135deg, #68003D, #7B2CBF)' },
];

export default function CategorySection() {
  return (
    <section className="category-section">
      <div className="section-header">
        <h2>EXPLORE CATEGORIES</h2>
      </div>
      <div className="category-grid">
        {categories.map((c) => (
          <div
            key={c.id}
            className="category-card"
            style={{ background: c.gradient }}
          >
            <span>{c.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
