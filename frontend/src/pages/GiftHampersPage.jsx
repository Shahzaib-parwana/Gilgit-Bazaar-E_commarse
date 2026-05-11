import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import GiftHamperCard from '../components/products/GiftHamperCard';

const GiftHampersPage = () => {
  const [hampers, setHampers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured'); // featured, price_low, price_high

  useEffect(() => {
    fetchHampers();
  }, []);

  const fetchHampers = async () => {
    try {
      const res = await productService.getGiftHampers();
      const data = res?.results || res || [];
      setHampers(data);
    } catch (err) {
      console.error('Error fetching hampers:', err);
      setHampers([]);
    } finally {
      setLoading(false);
    }
  };

  const getSortedHampers = () => {
    let sorted = [...hampers];
    if (sortBy === 'price_low') {
      sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price_high') {
      sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === 'featured') {
      sorted.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }
    return sorted;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0f1e',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff'
      }}>
        <div>Loading hampers...</div>
      </div>
    );
  }

  const sortedHampers = getSortedHampers();

  return (
    <div style={{
      background: '#0a0f1e',
      minHeight: '100vh',
      padding: '120px 0 80px',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.8rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #f0a500, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            🎁 Gift Hampers
          </h1>
          <p style={{ color: '#8892aa', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Curated collections for every occasion – Eid, weddings, corporate gifts
          </p>
        </div>

        {/* Sort Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '32px',
          gap: '12px'
        }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: '#131c42',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '40px',
              padding: '8px 16px',
              color: '#fff',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <option value="featured">Featured</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>

        {/* Grid */}
        {sortedHampers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#131c42',
            borderRadius: '24px',
            color: '#8892aa'
          }}>
            No gift hampers available right now.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            {sortedHampers.map(hamper => (
              <GiftHamperCard key={hamper.id} hamper={hamper} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftHampersPage;