import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Loader from '../common/Loader';

const fallbackCategories = [
  {
    id: 'fallback-1',
    name: 'Handicrafts',
    slug: 'handicrafts',
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=500',
    product_count: 120,
  },
  {
    id: 'fallback-2',
    name: 'Dried Fruits',
    slug: 'dried-fruits',
    image: 'https://images.unsplash.com/photo-1563746924237-b35f38b94f6d?w=500',
    product_count: 80,
  },
  {
    id: 'fallback-3',
    name: 'Traditional Wear',
    slug: 'traditional-wear',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500',
    product_count: 95,
  },
  {
    id: 'fallback-4',
    name: 'Home Decor',
    slug: 'home-decor',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500',
    product_count: 65,
  },
];

const CategoryShowcase = ({ categories, loading, limit = 3 }) => {
  if (loading) {
    return (
      <div className="cat-grid">
        <Loader />
      </div>
    );
  }

  const displayCategories =
    categories && categories.length > 0 ? categories.slice(0, limit) : fallbackCategories.slice(0, limit);

  return (
    <div className="cat-grid">
      {displayCategories.map((cat) => (
        <Link
          key={cat.id || cat.slug}
          to={`/products?category=${cat.slug}`}
          className="cat-card"
        >
          <img
            src={cat.image || 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500'}
            alt={cat.name}
            loading="lazy"
          />
          <div className="cat-card-overlay">
            <h3>{cat.name}</h3>
            <p>{cat.product_count || 0} items</p>
            <div className="arrow">
              Shop Now <ArrowRight size={14} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryShowcase;