import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';

// ⬇️⬇️⬇️ PASTE YOUR FULL STYLES FROM Home.jsx HERE ⬇️⬇️⬇️
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
  .ann-bar { background:var(--gold); color:#000; font-size:.82rem; font-weight:600; padding:8px 0; overflow:hidden; }
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
  .hero-stat { }
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
  .flash { background:linear-gradient(135deg,#7c1a1a 0%,#991b1b 50%,#7c1a1a 100%); border-radius:20px; padding:32px 40px; display:flex; align-items:center; justify-content:space-between; gap:24px; margin-bottom:24px; position:relative; overflow:hidden; }
  .flash::before { content:'SALE'; position:absolute; right:-10px; top:-10px; font-size:10rem; font-weight:900; color:rgba(255,255,255,.04); line-height:1; pointer-events:none; }
  .flash-left { display:flex; align-items:center; gap:20px; }
  .flash-icon { font-size:2.5rem; animation:float 2s ease-in-out infinite; }
  .flash h3 { font-family:'Playfair Display',serif; font-size:1.8rem; color:#fff; font-weight:700; }
  .flash p { color:rgba(255,255,255,.7); font-size:.9rem; }
  .countdown { display:flex; gap:12px; }
  .countdown-unit { background:rgba(0,0,0,.3); border-radius:10px; padding:10px 16px; text-align:center; min-width:64px; }
  .countdown-unit .num { font-family:'Playfair Display',serif; font-size:1.8rem; font-weight:700; color:#fff; line-height:1; }
  .countdown-unit .unit { font-size:.68rem; color:rgba(255,255,255,.6); text-transform:uppercase; letter-spacing:.1em; }

  /* ── Category Pills ── */
  .cat-pills { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:40px; }
  .cat-pill { padding:8px 20px; border-radius:100px; border:1.5px solid rgba(255,255,255,.1); color:var(--muted); font-size:.87rem; font-weight:500; cursor:pointer; transition:all .2s; text-decoration:none; }
  .cat-pill:hover, .cat-pill.active { border-color:var(--gold); color:var(--gold); background:var(--gold-dim); }

  /* ── Category Cards ── */
  .cat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
  .cat-card { position:relative; border-radius:20px; overflow:hidden; aspect-ratio:3/4; cursor:pointer; text-decoration:none; display:block; }
  .cat-card img { width:100%; height:100%; object-fit:cover; transition:transform .5s ease; }
  .cat-card:hover img { transform:scale(1.08); }
  .cat-card-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.1) 60%,transparent 100%); display:flex; flex-direction:column; justify-content:flex-end; padding:20px; }
  .cat-card-overlay h3 { font-family:'Playfair Display',serif; font-size:1.3rem; color:#fff; font-weight:700; }
  .cat-card-overlay p { font-size:.78rem; color:rgba(255,255,255,.65); margin-top:4px; }
  .cat-card-overlay .arrow { display:inline-flex; align-items:center; gap:6px; margin-top:10px; color:var(--gold); font-size:.82rem; font-weight:600; opacity:0; transform:translateX(-8px); transition:all .3s; }
  .cat-card:hover .arrow { opacity:1; transform:translateX(0); }
  .cat-card .badge { position:absolute; top:14px; left:14px; background:var(--gold); color:#000; font-size:.72rem; font-weight:700; padding:4px 10px; border-radius:100px; text-transform:uppercase; }

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
  .review-stars { display:flex; gap:4px; margin-bottom:14px; }
  .review-stars svg { color:var(--gold); fill:var(--gold); }
  .review-text { color:rgba(255,255,255,.8); font-size:.93rem; line-height:1.7; margin-bottom:20px; }
  .reviewer { display:flex; align-items:center; gap:12px; }
  .reviewer-avatar { width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,var(--gold),#f97316); display:flex; align-items:center; justify-content:center; font-weight:700; color:#000; font-size:.9rem; flex-shrink:0; }
  .reviewer-name { font-weight:600; font-size:.9rem; }
  .reviewer-loc { font-size:.75rem; color:var(--muted); display:flex; align-items:center; gap:4px; margin-top:2px; }

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
`;

// ⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await productService.getCategories();
        let categoriesArray = [];
        if (Array.isArray(response)) {
          categoriesArray = response;
        } else if (response?.results && Array.isArray(response.results)) {
          categoriesArray = response.results;
        } else if (response?.data && Array.isArray(response.data)) {
          categoriesArray = response.data;
        } else {
          categoriesArray = [];
        }
        const activeCategories = categoriesArray.filter(cat => cat.is_active !== false);
        activeCategories.sort((a, b) => (b.product_count || 0) - (a.product_count || 0));
        setCategories(activeCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCategories();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className="home-wrap" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <style>{styles}</style>
      <div className="section-inner">
        <div className="section-head" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 className="section-title">All <span>Categories</span></h1>
            <p className="section-subtitle">Explore our complete range of authentic northern products</p>
          </div>
        </div>

        <div className="cat-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
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

        {categories.length === 0 && !loading && (
          <div style={{ textAlign: 'center', color: '#8892aa', padding: '4rem 0' }}>
            No categories available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;