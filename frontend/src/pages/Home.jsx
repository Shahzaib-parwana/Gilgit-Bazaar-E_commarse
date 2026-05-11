// src/pages/Home.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, TruckIcon, ShieldCheck, HeadphonesIcon,
  Star, MapPin, Gift, Zap, RefreshCw  // RefreshCw added
} from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';
import CategoryShowcase from '../components/Catogarys/CategoryShowcase';
import PromoBanners from '../components/products/PromoBanners';
import reviewService from '../services/reviewService';
import siteSettingsService from '../services/siteSettingsService';

/* ─── Inline styles & keyframes (no Tailwind compiler needed) ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --midnight: #0a0f1e;
    --navy: #0d1635;
    --navy-2: #131c42;
    --gold: #f0a500;
    --gold-light: #fbbf24;
    --gold-dim: rgba(240,165,0,0.12);
    --slate: #1e2a4a;
    --muted: #8892aa;
    --surface: #111827;
    --white: #ffffff;
    --off-white: #f8f7f4;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, .home-wrap { background: var(--midnight); color: var(--white); font-family: 'DM Sans', sans-serif; }

  /* ── Animations ── */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer  { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes float    { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes scroll-x { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(240,165,0,.3)} 50%{box-shadow:0 0 40px rgba(240,165,0,.7)} }
  @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes countUp  { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }

  .anim-fade-up   { opacity:0; animation: fadeUp .7s ease forwards; }
  .anim-fade-in   { opacity:0; animation: fadeIn .8s ease forwards; }
  .delay-1 { animation-delay:.1s; }
  .delay-2 { animation-delay:.25s; }
  .delay-3 { animation-delay:.4s; }
  .delay-4 { animation-delay:.55s; }
  .delay-5 { animation-delay:.7s; }

  /* ── Announcement Bar ── */
  .ann-bar { font-size:.82rem; font-weight:600; padding:8px 0; overflow:hidden; position:relative; z-index:100; }
  .ann-track { display:flex; gap:60px; width:max-content; animation: scroll-x 22s linear infinite; white-space:nowrap; }
  .ann-track span { display:flex; align-items:center; gap:6px; }

  /* ── Hero ── */
  .hero {
    position:relative; overflow:hidden; min-height:92vh;
    display:flex; align-items:center;
    background: radial-gradient(ellipse 80% 70% at 60% 40%, #1a2550 0%, var(--midnight) 70%);
  }
  .hero::before {
    content:''; position:absolute; inset:0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0a500' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events:none;
  }
  .hero-content { position:relative; z-index:2; max-width:1280px; margin:0 auto; padding:0 32px; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; width:100%; }
  .hero-badge { display:inline-flex; align-items:center; gap:8px; background:var(--gold-dim); border:1px solid rgba(240,165,0,.25); color:var(--gold); padding:6px 16px; border-radius:100px; font-size:.82rem; font-weight:600; letter-spacing:.05em; text-transform:uppercase; margin-bottom:20px; }
  .hero-badge span { width:8px; height:8px; background:var(--gold); border-radius:50%; animation:pulse 1.5s ease infinite; }
  .hero h1 { font-family:'Playfair Display',serif; font-size:clamp(2.8rem,5vw,4.2rem); font-weight:900; line-height:1.08; color:#fff; margin-bottom:20px; }
  .hero h1 em { font-style:normal; background:linear-gradient(90deg,var(--gold),var(--gold-light)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .hero-sub { color:var(--muted); font-size:1.1rem; line-height:1.7; margin-bottom:32px; max-width:480px; }
  .hero-ctas { display:flex; gap:16px; flex-wrap:wrap; align-items:center; }
  .btn-primary { display:inline-flex; align-items:center; gap:10px; background:var(--gold); color:#000; padding:14px 28px; border-radius:12px; font-weight:700; font-size:1rem; text-decoration:none; transition:all .25s; }
  .btn-primary:hover { background:var(--gold-light); transform:translateY(-2px); box-shadow:0 12px 32px rgba(240,165,0,.35); }
  .btn-outline { display:inline-flex; align-items:center; gap:10px; border:1.5px solid rgba(255,255,255,.2); color:#fff; padding:14px 28px; border-radius:12px; font-weight:600; font-size:1rem; text-decoration:none; transition:all .25s; }
  .btn-outline:hover { border-color:var(--gold); color:var(--gold); }
  .hero-stats { display:flex; gap:32px; margin-top:40px; }
  .hero-stat .num { font-family:'Playfair Display',serif; font-size:2rem; font-weight:700; color:var(--gold); }
  .hero-stat .lbl { font-size:.78rem; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; }
  .hero-img-wrap { position:relative; animation:float 5s ease-in-out infinite; }
  .hero-img-wrap img { width:100%; border-radius:24px; object-fit:cover; aspect-ratio:4/3; }
  .hero-img-wrap::before { content:''; position:absolute; inset:-2px; border-radius:26px; background:linear-gradient(135deg,var(--gold),transparent 60%); z-index:-1; }
  .hero-badge-float { position:absolute; background:var(--navy-2); border:1px solid rgba(240,165,0,.2); border-radius:14px; padding:12px 18px; backdrop-filter:blur(10px); }
  .hero-badge-float.top-left { top:-20px; left:-20px; }
  .hero-badge-float.bot-right { bottom:-20px; right:-20px; }
  .hero-badge-float .val { font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:700; color:var(--gold); }
  .hero-badge-float .desc { font-size:.75rem; color:var(--muted); }

  /* ── Trust Strip ── */
  .trust { background:var(--navy); padding:28px 0; border-top:1px solid rgba(255,255,255,.06); border-bottom:1px solid rgba(255,255,255,.06); }
  .trust-grid { max-width:1280px; margin:0 auto; padding:0 32px; display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
  .trust-item { display:flex; align-items:center; gap:14px; }
  .trust-icon { width:48px; height:48px; border-radius:12px; background:var(--gold-dim); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .trust-icon svg { color:var(--gold); }
  .trust-item h4 { font-size:.93rem; font-weight:600; color:#fff; }
  .trust-item p { font-size:.78rem; color:var(--muted); margin-top:2px; }

  /* ── Section commons ── */
  .section { padding:80px 0; }
  .section-inner { max-width:1280px; margin:0 auto; padding:0 32px; }
  .section-head { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:40px; }
  .section-title { font-family:'Playfair Display',serif; font-size:2.2rem; font-weight:700; color:#fff; }
  .section-title span { color:var(--gold); }
  .section-subtitle { color:var(--muted); font-size:.95rem; margin-top:6px; }
  .see-all { display:inline-flex; align-items:center; gap:6px; color:var(--gold); font-weight:600; font-size:.9rem; text-decoration:none; transition:gap .2s; }
  .see-all:hover { gap:10px; }

  /* ── Flash Sale Banner ── */
  .flash { border-radius:20px; padding:32px 40px; display:flex; align-items:center; justify-content:space-between; gap:24px; margin-bottom:24px; position:relative; overflow:hidden; }
  .flash::before { content:'SALE'; position:absolute; right:-10px; top:-10px; font-size:10rem; font-weight:900; color:rgba(255,255,255,.04); line-height:1; pointer-events:none; }
  .flash-left { display:flex; align-items:center; gap:20px; }
  .flash-icon { font-size:2.5rem; animation:float 2s ease-in-out infinite; }
  .flash h3 { font-family:'Playfair Display',serif; font-size:1.8rem; color:#fff; font-weight:700; }
  .flash p { color:rgba(255,255,255,.7); font-size:.9rem; }
  .countdown { display:flex; gap:12px; }
  .countdown-unit { background:rgba(0,0,0,.3); border-radius:10px; padding:10px 16px; text-align:center; min-width:64px; }
  .countdown-unit .num { font-family:'Playfair Display',serif; font-size:1.8rem; font-weight:700; color:#fff; line-height:1; }
  .countdown-unit .unit { font-size:.68rem; color:rgba(255,255,255,.6); text-transform:uppercase; letter-spacing:.1em; }

  /* ── Category Cards ── */
  .cat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px; }
  .cat-card { position: relative; border-radius: 24px; overflow: hidden; aspect-ratio: 4 / 5; cursor: pointer; text-decoration: none; display: block; transition: transform 0.3s ease; }
  .cat-card:hover { transform: translateY(-6px); }
  .cat-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .cat-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 28px 20px; }
  .cat-card-overlay h3 { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .cat-card-overlay p { font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-top: 4px; }
  .cat-card-overlay .arrow { display: inline-flex; align-items: center; gap: 8px; margin-top: 14px; color: var(--gold); font-size: 0.9rem; font-weight: 600; opacity: 0; transform: translateX(-10px); transition: all 0.3s ease; }
  .cat-card:hover .arrow { opacity: 1; transform: translateX(0); }

  /* ── Products Grid ── */
  .products-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }

  /* ── Promo Banners ── */
  .promo-grid { display:grid; grid-template-columns:1.4fr 1fr; gap:24px; }
  .promo-card { border-radius:20px; overflow:hidden; position:relative; min-height:280px; display:flex; flex-direction:column; justify-content:flex-end; padding:32px; text-decoration:none; }
  .promo-card img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .5s; }
  .promo-card:hover img { transform:scale(1.06); }
  .promo-card-overlay { position:absolute; inset:0; background:linear-gradient(135deg,rgba(0,0,0,.75) 0%,rgba(0,0,0,.2) 100%); }
  .promo-content { position:relative; z-index:2; }
  .promo-eyebrow { font-size:.75rem; text-transform:uppercase; letter-spacing:.12em; color:var(--gold); font-weight:700; margin-bottom:8px; }
  .promo-content h3 { font-family:'Playfair Display',serif; font-size:1.7rem; color:#fff; font-weight:700; margin-bottom:6px; }
  .promo-content p { color:rgba(255,255,255,.7); font-size:.87rem; margin-bottom:16px; }
  .promo-btn { display:inline-flex; align-items:center; gap:8px; background:var(--gold); color:#000; padding:10px 20px; border-radius:10px; font-weight:700; font-size:.87rem; width:fit-content; }

  /* ── Testimonials ── */
  .testimonials-bg { background:var(--navy); }
  .reviews-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  .review-card { background:var(--navy-2); border:1px solid rgba(255,255,255,.07); border-radius:18px; padding:28px; transition:border-color .3s; }
  .review-card:hover { border-color:rgba(240,165,0,.3); }
  .review-stars { display:flex; gap:6px; margin-bottom:8px; }
  .review-stars svg { color:var(--gold); fill:var(--gold); }
  .reviewer-info { display: flex; align-items: center; gap: 12px; margin: 16px 0; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
  .reviewer-details { flex: 1; }
  .reviewer-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), #f97316); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000; font-size: 1rem; flex-shrink: 0; }
  .reviewer-name { font-weight: 600; font-size: 1rem; color: #fff; margin-bottom: 4px; }
  .reviewer-loc { font-size: 0.75rem; color: var(--muted); display: flex; align-items: center; gap: 4px; margin-top: 2px; }
  .review-date { font-size: 0.7rem; color: var(--muted); margin-top: 4px; }
  .review-text { color: rgba(255, 255, 255, 0.85); font-size: 0.93rem; line-height: 1.6; margin: 12px 0; font-style: italic; }
  .review-product { margin-top: 12px; padding-top: 8px; font-size: 0.7rem; color: var(--gold); border-top: 1px solid rgba(255, 255, 255, 0.1); display: inline-block; }

  /* ── Brands / Partners ── */
  .brands { background:var(--midnight); border-top:1px solid rgba(255,255,255,.06); }
  .brands-inner { max-width:1280px; margin:0 auto; padding:40px 32px; }
  .brands-label { text-align:center; color:var(--muted); font-size:.8rem; text-transform:uppercase; letter-spacing:.1em; margin-bottom:28px; }
  .brands-row { display:flex; justify-content:center; align-items:center; gap:56px; flex-wrap:wrap; }
  .brand-logo { color:rgba(255,255,255,.2); font-family:'Playfair Display',serif; font-size:1.1rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; transition:color .3s; }
  .brand-logo:hover { color:var(--gold); }

  /* ── Newsletter ── */
  .newsletter { background:linear-gradient(135deg,var(--navy-2) 0%,var(--slate) 100%); border-top:1px solid rgba(255,255,255,.06); border-bottom:1px solid rgba(255,255,255,.06); padding:80px 32px; text-align:center; }
  .newsletter-inner { max-width:560px; margin:0 auto; }
  .newsletter h2 { font-family:'Playfair Display',serif; font-size:2.4rem; color:#fff; margin-bottom:12px; }
  .newsletter h2 span { color:var(--gold); }
  .newsletter p { color:var(--muted); margin-bottom:32px; line-height:1.7; }
  .newsletter-form { display:flex; gap:12px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); border-radius:14px; padding:8px; }
  .newsletter-form input { flex:1; background:transparent; border:none; outline:none; color:#fff; font-size:.95rem; padding:8px 12px; font-family:'DM Sans',sans-serif; }
  .newsletter-form input::placeholder { color:var(--muted); }
  .newsletter-form button { background:var(--gold); color:#000; border:none; padding:12px 24px; border-radius:10px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:.93rem; white-space:nowrap; transition:background .2s; }
  .newsletter-form button:hover { background:var(--gold-light); }
  .newsletter-perks { display:flex; justify-content:center; gap:24px; margin-top:20px; flex-wrap:wrap; }
  .newsletter-perks span { font-size:.78rem; color:var(--muted); display:flex; align-items:center; gap:6px; }
  .newsletter-perks svg { color:var(--gold); }

  /* ── Responsive ── */
  @media(max-width:900px) {
    .hero-content { grid-template-columns:1fr; }
    .hero-img-wrap { display:none; }
    .trust-grid { grid-template-columns:repeat(2,1fr); }
    .cat-grid { grid-template-columns:repeat(2,1fr); }
    .products-grid { grid-template-columns:repeat(2,1fr); }
    .promo-grid { grid-template-columns:1fr; }
    .reviews-grid { grid-template-columns:1fr; }
  }
  @media(max-width:600px) {
    .trust-grid { grid-template-columns:1fr; }
    .cat-grid { grid-template-columns:repeat(2,1fr); }
    .products-grid { grid-template-columns:1fr; }
    .hero h1 { font-size:2.4rem; }
    .countdown { gap:8px; }
    .flash { flex-direction:column; align-items:flex-start; }
  }
  @media (max-width: 900px) {
    .cat-grid { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
    .cat-card-overlay h3 { font-size: 1.3rem; }
  }
  @media (max-width: 600px) {
    .cat-grid { grid-template-columns: 1fr; gap: 20px; }
    .cat-card { aspect-ratio: 3 / 4; }
    .cat-card-overlay { padding: 20px; }
    .cat-card-overlay h3 { font-size: 1.2rem; }
  }
`;

/* ─── Countdown Hook ─── */
/* ─── Countdown Hook ─── */
const useCountdown = (targetDate) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return; // Don't run effect if no target date

    const updateCountdown = () => {
      const now = new Date();
      const endDate = new Date(targetDate);
      const diff = Math.max(0, endDate - now);
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (3600000)) / (1000 * 60));
      const seconds = Math.floor((diff % (60000)) / 1000);
      
      setTime({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return time;
};

/* ─── Sub-components ─── */
const CountUnit = ({ val, label }) => (
  <div className="countdown-unit">
    <div className="num">{String(val).padStart(2, '0')}</div>
    <div className="unit">{label}</div>
  </div>
);

const trustFeatures = [
  { icon: TruckIcon, title: 'Free Shipping', desc: 'On all orders over PKR 10,000' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: '100% protected transactions' },
  { icon: RefreshCw, title: 'Easy Returns', desc: 'Dameged goods 7-day hassle-free returns' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Dedicated customer care' },
];

/* ─── Main Component ─── */
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
  // Dynamic content states
  const [announcements, setAnnouncements] = useState([]);
  const [flashSale, setFlashSale] = useState(null);

  // Get countdown time if flash sale is active
  const countdownTime = useCountdown(flashSale?.end_date || null);

  // Helper function to get user initials for avatar
  const getUserInitials = (userName) => {
    if (!userName || userName === 'Anonymous') return 'U';
    const names = userName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Fetch site settings (announcements and flash sale)
  const fetchSiteSettings = async () => {
    try {
      const bannersData = await siteSettingsService.getHomeBanners();
      setAnnouncements(bannersData.announcements || []);
      setFlashSale(bannersData.flash_sale);
    } catch (error) {
      // Fallback data if API fails
      setAnnouncements([
        { text: '🎁 Free Gift on orders over PKR 8,000', show_icon: true, icon: '🎁' },
        { text: '🚚 Express Delivery across Pakistan', show_icon: true, icon: '🚚' },
        { text: '✨ Authentic Northern Pakistan Products', show_icon: true, icon: '✨' },
        { text: '💳 Pay in 3 easy installments', show_icon: true, icon: '💳' }
      ]);
    }
  };

  // Fetch high-rated reviews
  const fetchHighRatedReviews = async () => {
    try {
      setReviewsLoading(true);
      const productsResponse = await productService.getFeaturedProducts();
      const products = productsResponse.slice(0, 5);
      
      let allReviews = [];
      
      for (const product of products) {
        try {
          const reviewsData = await reviewService.getProductReviews(product.id, {
            page: 1,
            pageSize: 20,
            ordering: '-rating'
          });
          
          let reviewsList = [];
          if (Array.isArray(reviewsData)) {
            reviewsList = reviewsData;
          } else if (reviewsData?.results && Array.isArray(reviewsData.results)) {
            reviewsList = reviewsData.results;
          } else if (reviewsData?.data && Array.isArray(reviewsData.data)) {
            reviewsList = reviewsData.data;
          }
          
          const productReviews = reviewsList
            .filter(review => review.rating >= 4 && review.status === 'approved')
            .map(review => ({
              ...review,
              product_name: product.name
            }));
          
          allReviews = [...allReviews, ...productReviews];
        } catch (error) {
          errorToast("Failed to load reviews for " + product.name);
        }
      }
      
      const topReviews = allReviews
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      
      setReviews(topReviews);
    } catch (error) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [productsData, categoriesResponse] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getCategories()
        ]);
        
        // Normalize categories
        let categoriesArray = [];
        if (Array.isArray(categoriesResponse)) {
          categoriesArray = categoriesResponse;
        } else if (categoriesResponse?.results && Array.isArray(categoriesResponse.results)) {
          categoriesArray = categoriesResponse.results;
        } else if (categoriesResponse?.data && Array.isArray(categoriesResponse.data)) {
          categoriesArray = categoriesResponse.data;
        }

        const sortedCategories = categoriesArray
          .filter(cat => cat.is_active !== false)
          .sort((a, b) => (b.product_count || 0) - (a.product_count || 0))
          .slice(0, 5);

        setFeaturedProducts(productsData);
        setCategories(sortedCategories);
        
        // Fetch all dynamic data
        await Promise.all([
          fetchSiteSettings(),
          fetchHighRatedReviews()
        ]);
      } catch (e) {
        errorToast('Failed to load some content. Please refresh the page.');
      } finally {
        setLoading(false);
        setCategoriesLoading(false);
      }
    })();
  }, []);

  return (
    <div className="home-wrap">
      <style>{styles}</style>

      {/* ── Dynamic Announcement Bar ── */}
      {announcements.length > 0 && (
        <div 
          className="ann-bar"
          style={{
            backgroundColor: announcements[0]?.background_color || 'var(--gold)',
            color: announcements[0]?.text_color || '#000000'
          }}
        >
          <div className="ann-track">
            {announcements.map((announcement, index) => (
              <span key={index}>
                {announcement.show_icon !== false && (announcement.icon || '🎁')}
                {" " + announcement.text}
                {announcement.link_url && announcement.link_text && (
                  <a href={announcement.link_url} style={{ color: 'inherit', marginLeft: '8px', fontWeight: 'bold' }}>
                    {announcement.link_text} →
                  </a>
                )}
              </span>
            ))}
            {/* Duplicate for seamless scrolling */}
            {announcements.map((announcement, index) => (
              <span key={`dup-${index}`}>
                {announcement.show_icon !== false && (announcement.icon || '🎁')}
                {" " + announcement.text}
                {announcement.link_url && announcement.link_text && (
                  <a href={announcement.link_url} style={{ color: 'inherit', marginLeft: '8px', fontWeight: 'bold' }}>
                    {announcement.link_text} →
                  </a>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section className="hero">
        <div className="hero-content">
          <div>
            <div className="hero-badge anim-fade-up delay-1">
              <span></span> Now shipping nationwide
            </div>
            <h1 className="anim-fade-up delay-2">
              Discover the Soul of <em>Gilgit-Baltistan</em>
            </h1>
            <p className="hero-sub anim-fade-up delay-3">
              Authentic handicrafts, organic dried fruits & traditional treasures
              — delivered directly from the breathtaking northern highlands of Pakistan.
            </p>
            <div className="hero-ctas anim-fade-up delay-4">
              <Link to="/products" className="btn-primary">
                Shop Collection <ArrowRight size={18} />
              </Link>
              <Link to="/products?category=hand-crafts" className="btn-outline">
                Explore Crafts
              </Link>
            </div>
            <div className="hero-stats anim-fade-up delay-5">
              {[['5K+','Happy Customers'],['200+','Products'],['15+','Categories'],['4.9★','Rating']].map(([num, lbl]) => (
                <div className="hero-stat" key={lbl}>
                  <div className="num">{num}</div>
                  <div className="lbl">{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-img-wrap anim-fade-in delay-2">
            <div className="hero-badge-float top-left">
              <div className="val">200+</div>
              <div className="desc">Unique Products</div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700"
              alt="Northern Pakistan Products"
            />
            <div className="hero-badge-float bot-right">
              <div className="val">98%</div>
              <div className="desc">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <div className="trust">
        <div className="trust-grid">
          {trustFeatures.map(({ icon: Icon, title, desc }) => (
            <div className="trust-item" key={title}>
              <div className="trust-icon"><Icon size={22} /></div>
              <div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dynamic Flash Sale ── */}
      {flashSale && flashSale.is_running && (
        <section className="section">
          <div className="section-inner">
            <div 
              className="flash"
              style={{ 
                background: flashSale.background_color || 'linear-gradient(135deg,#7c1a1a 0%,#991b1b 50%,#7c1a1a 100%)'
              }}
            >
              <div className="flash-left">
                <div className="flash-icon">⚡</div>
                <div>
                  <h3>{flashSale.title || 'Flash Sale — Up to 50% Off'}</h3>
                  <p>{flashSale.subtitle || 'Limited time offer on selected northern crafts & dried fruits'}</p>
                </div>
              </div>
              {flashSale.show_countdown !== false && (
                <div className="countdown">
                  <CountUnit val={countdownTime.hours} label="Hours" />
                  <CountUnit val={countdownTime.minutes} label="Mins" />
                  <CountUnit val={countdownTime.seconds} label="Secs" />
                </div>
              )}
              <Link to={flashSale.button_link || "/products?sale=true"} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                {flashSale.button_text || 'Grab Deals'} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Categories Section ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="section-head">
            <div>
              <h2 className="section-title">Shop by <span>Category</span></h2>
              <p className="section-subtitle">Handpicked collections from the highlands</p>
            </div>
            <Link to="/categories" className="see-all">
              Browse All <ArrowRight size={16} />
            </Link>
          </div>

          <CategoryShowcase categories={categories} loading={categoriesLoading} limit={3}/>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="section-head">
            <div>
              <h2 className="section-title">Featured <span>Products</span></h2>
              <p className="section-subtitle">Our most-loved picks this season</p>
            </div>
            <Link to="/products" className="see-all">View All <ArrowRight size={16} /></Link>
          </div>
          {loading ? <Loader /> : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Promo Banners ── */}
      <PromoBanners/>

      {/* ── Testimonials Section ── */}
      <section className="section testimonials-bg">
        <div className="section-inner">
          <div className="section-head">
            <div>
              <h2 className="section-title">What Our <span>Customers Say</span></h2>
              <p className="section-subtitle">Real reviews from real people across Pakistan</p>
            </div>
          </div>
          {reviewsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Loader />
            </div>
          ) : reviews.length > 0 ? (
            <div className="reviews-grid">
              {reviews.map((review, i) => (
                <div className="review-card" key={review.id || i}>
                  {/* Rating at the top */}
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={18} 
                        fill={star <= review.rating ? "var(--gold)" : "none"}
                        color={star <= review.rating ? "var(--gold)" : "rgba(255,255,255,0.2)"}
                      />
                    ))}
                  </div>
                  
                  {/* User Information */}
                  <div className="reviewer-info">
                    {review.user_avatar ? (
                      <img 
                        src={review.user_avatar} 
                        alt={review.user_name}
                        className="reviewer-avatar"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="reviewer-avatar">
                        {getUserInitials(review.user_name || review.user?.full_name || 'Customer')}
                      </div>
                    )}
                    <div className="reviewer-details">
                      <div className="reviewer-name">
                        {review.user_name || review.user?.full_name || review.user?.username || 'Verified Customer'}
                      </div>
                      <div className="reviewer-loc">
                        <MapPin size={12} />
                        {review.user_city || review.user?.city || review.location || 'Pakistan'}
                      </div>
                      {review.created_at && (
                        <div className="review-date">
                          {new Date(review.created_at).toLocaleDateString('en-PK', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Review Title */}
                  {review.title && (
                    <h4 style={{ color: 'var(--gold)', marginBottom: '8px', fontSize: '1rem' }}>
                      {review.title}
                    </h4>
                  )}
                  
                  {/* Review Comment */}
                  <p className="review-text">"{review.comment || review.text || 'No comment provided'}"</p>
                  
                  {/* Product Info */}
                  {review.product_name && (
                    <div className="review-product">
                      <span>✓ Verified Purchase: {review.product_name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
              No reviews available yet. Be the first to review our products!
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;