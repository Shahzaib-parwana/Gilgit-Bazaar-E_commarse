// components/PromoBanners.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { productService } from '../../services/productService';

const PromoBanners = () => {
  const [giftHamper, setGiftHamper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGiftHamper = async () => {
      try {
        const response = await productService.getProducts({ is_bundle: true });
        const hampers = response.results || response;
        if (hampers && hampers.length > 0) {
          const selected = hampers.find(h => h.is_featured) || hampers[0];
          setGiftHamper(selected);
        }
      } catch (error) {
        console.error('Error fetching gift hamper:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGiftHamper();
  }, []);

  // Static fallback (if no hamper exists)
  const defaultHamper = {
    name: 'Gift Hampers',
    description: 'Curated for every occasion – Eid, weddings & corporate gifting',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800',
  };

  const hamper = giftHamper || defaultHamper;
  const hamperImage = giftHamper?.primary_image || defaultHamper.image;
  const hamperTitle = loading ? 'Gift Hampers' : hamper.name;
  const hamperDesc = loading
    ? 'Curated for every occasion – Eid, weddings & corporate gifting'
    : (hamper.description?.substring(0, 80) || defaultHamper.description);

  // Hover effect styles (keeps your existing classes + adds animations)
  const hoverStyles = `
    .promo-card {
      display: block;
      text-decoration: none;
      transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1), box-shadow 0.3s ease;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 20px -5px rgba(0,0,0,0.2);
    }
    .promo-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 35px -8px rgba(0,0,0,0.4);
    }
    .promo-card:hover img {
      transform: scale(1.05);
    }
    .promo-card img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .promo-card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2));
      transition: background 0.3s ease;
    }
    .promo-card:hover .promo-card-overlay {
      background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3));
    }
    .promo-content {
      position: absolute;
      bottom: 24px;
      left: 24px;
      right: 24px;
      color: white;
      transition: transform 0.3s ease;
    }
    .promo-card:hover .promo-content {
      transform: translateY(-4px);
    }
    .promo-eyebrow {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
      transition: color 0.2s;
    }
    .promo-card:hover .promo-eyebrow {
      color: #f0a500;
    }
    .promo-content h3 {
      font-size: 1.5rem;
      margin: 0 0 8px 0;
    }
    .promo-content p {
      font-size: 0.875rem;
      margin: 0 0 16px 0;
      opacity: 0.9;
    }
    .promo-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid white;
      padding-bottom: 4px;
      transition: gap 0.2s, border-color 0.2s;
    }
    .promo-card:hover .promo-btn {
      gap: 12px;
      border-bottom-color: #f0a500;
    }
    @media (max-width: 768px) {
      .promo-content { bottom: 16px; left: 16px; right: 16px; }
      .promo-content h3 { font-size: 1.2rem; }
      .promo-content p { font-size: 0.75rem; }
    }
  `;

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <style>{hoverStyles}</style>
      <div className="section-inner">
        <div className="promo-grid">
          {/* Banner 1: Gift Hamper – links to LISTING page, but shows dynamic content */}
          <Link to="/gift-hampers" className="promo-card">
            <img src={hamperImage} alt={hamperTitle} loading="lazy" />
            <div className="promo-card-overlay" />
            <div className="promo-content">
              <div className="promo-eyebrow">
                {loading ? 'Loading...' : 'Limited Edition'}
              </div>
              <h3>{hamperTitle}</h3>
              <p>{hamperDesc}</p>
              <div className="promo-btn">
                Shop Now <ArrowRight size={14} />
              </div>
            </div>
          </Link>

          {/* Banner 2: Our Story (static) */}
          <Link to="/our-story" className="promo-card">
            <img
              src="../../../our-story.jpg"
              alt="Artisan story"
              loading="lazy"
            />
            <div className="promo-card-overlay" />
            <div className="promo-content">
              <div className="promo-eyebrow">Behind the product</div>
              <h3>Our Story</h3>
              <p>Meet the Gilgit artisans & farms behind your favourite goods</p>
              <div className="promo-btn">
                Learn More <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;