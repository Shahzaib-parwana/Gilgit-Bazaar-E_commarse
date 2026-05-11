import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';

const GiftHamperCard = ({ hamper }) => {
  // Helper for discount percentage (if compare_price exists)
  const discount = hamper.compare_price && hamper.compare_price > hamper.price
    ? Math.round(((hamper.compare_price - hamper.price) / hamper.compare_price) * 100)
    : 0;

  const truncate = (str, len = 60) => str?.length > len ? str.substring(0, len) + '...' : str;

  // Get first 3 bundle items for preview
  const previewItems = hamper.bundle_items?.slice(0, 3) || [];

  return (
    <Link to={`/products/${hamper.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#131c42',
        borderRadius: '24px',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s',
        border: '1px solid rgba(255,255,255,0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 30px -12px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
        {/* Image Container */}
        <div style={{ position: 'relative', paddingTop: '75%', background: '#0a0f1e' }}>
          <img
            src={hamper.primary_image || 'https://via.placeholder.com/400x300?text=Hamper'}
            alt={hamper.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s'
            }}
          />
          {discount > 0 && (
            <span style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: '#ef4444',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '40px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              zIndex: 2
            }}>
              -{discount}%
            </span>
          )}
          {/* Bundle badge */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(240,165,0,0.9)',
            color: '#000',
            padding: '4px 10px',
            borderRadius: '40px',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Package size={12} /> Gift Hamper
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 8px 0',
            fontFamily: "'Playfair Display', serif"
          }}>
            {hamper.name}
          </h3>

          <p style={{ color: '#8892aa', fontSize: '0.85rem', marginBottom: '12px', lineHeight: 1.4 }}>
            {truncate(hamper.description, 80)}
          </p>

          {/* Bundle items preview */}
          {previewItems.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#f0a500', marginBottom: '8px', fontWeight: 600 }}>
                INCLUDES:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {previewItems.map((item, idx) => (
                  <span key={idx} style={{
                    background: 'rgba(240,165,0,0.15)',
                    color: '#f0a500',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 500
                  }}>
                    {item.quantity}x {item.product_name}
                  </span>
                ))}
                {hamper.bundle_items?.length > 3 && (
                  <span style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#aaa',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.7rem'
                  }}>
                    +{hamper.bundle_items.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price & CTA */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f0a500' }}>
                PKR {parseFloat(hamper.price).toFixed(2)}
              </span>
              {hamper.compare_price && (
                <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: '#6b7280' }}>
                  PKR {parseFloat(hamper.compare_price).toFixed(2)}
                </span>
              )}
            </div>
            <button style={{
              width: '100%',
              background: '#f0a500',
              border: 'none',
              borderRadius: '40px',
              padding: '12px',
              fontWeight: 'bold',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#fbbf24'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f0a500'}>
              <ShoppingBag size={16} /> View Hamper
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GiftHamperCard;