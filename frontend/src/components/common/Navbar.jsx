import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  Package,
  Sparkles,
  Tag,
  Heart,
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  Zap,
  Bell, // Add Bell icon
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import CartSidebar from '../cart/CartSidebar';
import { productService } from '../../services/productService';
import notificationService from '../../services/notificationService'; // Add notification service

/* ─── Styles (add notification badge animation) ─── */
const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --midnight: #0a0f1e;
    --navy:     #0d1635;
    --navy-2:   #131c42;
    --slate:    #1e2a4a;
    --gold:     #f0a500;
    --gold-lt:  #fbbf24;
    --gold-dim: rgba(240,165,0,0.12);
    --gold-bdr: rgba(240,165,0,0.22);
    --muted:    #8892aa;
    --white:    #ffffff;
    --border:   rgba(255,255,255,0.07);
  }

  .nb-topbar {
    background: var(--navy-2);
    border-bottom: 1px solid var(--border);
    font-family: 'DM Sans', sans-serif;
    font-size: .78rem;
    color: var(--muted);
    padding: 7px 0;
  }
  .nb-topbar-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 32px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .nb-topbar-left { display: flex; gap: 20px; align-items: center; }
  .nb-topbar-left span { display: flex; align-items: center; gap: 5px; }
  .nb-topbar-left svg { color: var(--gold); }
  .nb-topbar-right { display: flex; gap: 16px; align-items: center; }
  .nb-topbar-right a {
    color: var(--muted); text-decoration: none; transition: color .2s;
    display: flex; align-items: center; gap: 5px;
  }
  .nb-topbar-right a:hover { color: var(--gold); }
  .nb-topbar-right .divider { width: 1px; height: 14px; background: var(--border); }
  .nb-topbar-sale {
    display: flex; align-items: center; gap: 6px;
    background: var(--gold-dim); border: 1px solid var(--gold-bdr);
    color: var(--gold); border-radius: 100px; padding: 3px 12px;
    font-weight: 600; font-size: .73rem; letter-spacing: .04em;
  }
  .nb-topbar-sale span { width: 6px; height: 6px; background: var(--gold); border-radius: 50%;
    animation: nb-pulse 1.5s ease infinite; }

  .nb-nav {
    background: var(--midnight);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 999;
    font-family: 'DM Sans', sans-serif;
    transition: background .3s, box-shadow .3s;
  }
  .nb-nav.scrolled {
    background: rgba(10,15,30,.96);
    backdrop-filter: blur(18px);
    box-shadow: 0 8px 40px rgba(0,0,0,.5);
  }
  .nb-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 32px;
    display: flex; align-items: center; gap: 32px; height: 68px;
  }
  .nb-logo {
    display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0;
  }
  .nb-logo-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, var(--gold), #f97316);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-weight: 700; color: #000;
    font-size: 1rem; letter-spacing: -.02em;
    box-shadow: 0 4px 16px rgba(240,165,0,.35);
    transition: transform .25s, box-shadow .25s;
  }
  .nb-logo:hover .nb-logo-icon { transform: scale(1.08); box-shadow: 0 6px 24px rgba(240,165,0,.5); }
  .nb-logo-text { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: var(--white); }
  .nb-logo-text em { font-style: normal; color: var(--gold); }

  .nb-search { flex: 1; max-width: 420px; position: relative; }
  .nb-search input {
    width: 100%; padding: 10px 16px 10px 44px;
    background: var(--navy); border: 1.5px solid var(--border);
    border-radius: 12px; color: var(--white); font-size: .9rem;
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color .2s, background .2s;
  }
  .nb-search input::placeholder { color: var(--muted); }
  .nb-search input:focus { border-color: var(--gold-bdr); background: var(--navy-2); }
  .nb-search-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--muted); transition: color .2s; pointer-events: none;
  }
  .nb-search:focus-within .nb-search-icon { color: var(--gold); }
  .nb-search-btn {
    position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
    background: var(--gold); border: none; border-radius: 8px; padding: 5px 12px;
    color: #000; font-weight: 700; font-size: .78rem; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: background .2s;
  }
  .nb-search-btn:hover { background: var(--gold-lt); }

  .nb-links { display: flex; align-items: center; gap: 2px; }
  .nb-link {
    padding: 8px 14px; border-radius: 10px; font-size: .9rem; font-weight: 500;
    color: var(--muted); text-decoration: none; transition: all .2s;
    display: flex; align-items: center; gap: 5px; white-space: nowrap;
    background: transparent; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
  }
  .nb-link:hover { color: var(--white); background: var(--navy); }
  .nb-link.active { color: var(--gold); background: var(--gold-dim); }
  .nb-link svg { transition: transform .25s; }
  .nb-link:hover svg.chevron { transform: rotate(180deg); }

  .nb-actions { display: flex; align-items: center; gap: 6px; margin-left: auto; flex-shrink: 0; }
  .nb-icon-btn {
    position: relative; width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: var(--navy); border: 1.5px solid var(--border);
    color: var(--muted); cursor: pointer; transition: all .2s;
  }
  .nb-icon-btn:hover { border-color: var(--gold-bdr); color: var(--gold); background: var(--gold-dim); }
  .nb-badge {
    position: absolute; top: -5px; right: -5px;
    background: var(--gold); color: #000; font-size: .65rem; font-weight: 800;
    width: 18px; height: 18px; border-radius: 50%; display: flex;
    align-items: center; justify-content: center;
    border: 2px solid var(--midnight);
    animation: nb-pop .3s cubic-bezier(.34,1.56,.64,1);
  }
  /* Notification badge - red variant */
  .nb-badge.notification {
    background: #ef4444;
    color: white;
  }
  .nb-login-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold); color: #000; padding: 9px 20px;
    border-radius: 10px; font-weight: 700; font-size: .88rem;
    text-decoration: none; transition: all .25s; white-space: nowrap;
    border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
  }
  .nb-login-btn:hover { background: var(--gold-lt); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(240,165,0,.35); }

  .nb-user { position: relative; }
  .nb-user-btn {
    display: flex; align-items: center; gap: 8px;
    background: var(--navy); border: 1.5px solid var(--border);
    border-radius: 10px; padding: 7px 12px; cursor: pointer;
    transition: all .2s; font-family: 'DM Sans', sans-serif;
  }
  .nb-user-btn:hover { border-color: var(--gold-bdr); }
  .nb-avatar {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, var(--gold), #f97316);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; color: #000; font-size: .82rem;
  }
  .nb-user-name { color: var(--white); font-size: .88rem; font-weight: 500; }
  .nb-user-chev { color: var(--muted); transition: transform .25s; }
  .nb-user:hover .nb-user-chev { transform: rotate(180deg); }

  .nb-dropdown {
    position: absolute; right: 0; top: calc(100% + 10px);
    background: var(--navy-2); border: 1px solid var(--border);
    border-radius: 16px; min-width: 220px; overflow: hidden;
    box-shadow: 0 24px 48px rgba(0,0,0,.5);
    opacity: 0; visibility: hidden; transform: translateY(-8px);
    transition: all .2s;
  }
  .nb-user:hover .nb-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
  .nb-dropdown-header { padding: 14px 16px; border-bottom: 1px solid var(--border); }
  .nb-dropdown-header .name { font-weight: 600; color: var(--white); font-size: .9rem; }
  .nb-dropdown-header .email { color: var(--muted); font-size: .75rem; margin-top: 2px; }
  .nb-dropdown-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 16px; color: var(--muted); text-decoration: none;
    transition: all .2s; font-size: .88rem; font-weight: 500;
    background: transparent; border: none; cursor: pointer; width: 100%;
    font-family: 'DM Sans', sans-serif; text-align: left;
  }
  .nb-dropdown-item:hover { color: var(--white); background: var(--slate); }
  .nb-dropdown-item svg { flex-shrink: 0; }
  .nb-dropdown-divider { height: 1px; background: var(--border); margin: 4px 0; }
  .nb-dropdown-item.danger { color: #f87171; }
  .nb-dropdown-item.danger:hover { background: rgba(248,113,113,.08); color: #fca5a5; }

  .nb-mega-wrap { position: relative; }
  .nb-mega {
    position: absolute; left: 50%; top: calc(100% + 14px);
    transform: translateX(-50%);
    background: var(--navy-2); border: 1px solid var(--border);
    border-radius: 20px; width: 780px; overflow: hidden;
    box-shadow: 0 32px 64px rgba(0,0,0,.6);
    opacity: 0; visibility: hidden; transform: translateX(-50%) translateY(-10px);
    transition: all .25s;
    pointer-events: none;
  }
  .nb-mega-wrap:hover .nb-mega,
  .nb-mega:hover { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); pointer-events: all; }
  .nb-mega-grid { display: grid; grid-template-columns: 220px 1fr 180px; }

  .nb-mega-cats { padding: 20px; border-right: 1px solid var(--border); background: var(--midnight); }
  .nb-mega-label { font-size: .7rem; text-transform: uppercase; letter-spacing: .1em; color: var(--muted); font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
  .nb-mega-label svg { color: var(--gold); }
  .nb-cat-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: 10px;
    color: var(--muted); text-decoration: none; font-size: .88rem; font-weight: 500;
    transition: all .2s; margin-bottom: 2px;
  }
  .nb-cat-item:hover { color: var(--white); background: var(--navy); }
  .nb-cat-item:hover .nb-cat-arrow { opacity: 1; transform: translateX(0); }
  .nb-cat-emoji { font-size: 1.1rem; width: 28px; text-align: center; }
  .nb-cat-arrow { color: var(--gold); margin-left: auto; opacity: 0; transform: translateX(-4px); transition: all .2s; }
  .nb-view-all {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    margin-top: 12px; padding: 9px; border-radius: 10px;
    background: var(--gold); color: #000; font-weight: 700; font-size: .82rem;
    text-decoration: none; transition: background .2s;
  }
  .nb-view-all:hover { background: var(--gold-lt); }

  .nb-mega-deals { padding: 20px; }
  .nb-deal-item {
    display: flex; gap: 12px; align-items: center; padding: 10px;
    border-radius: 12px; text-decoration: none; transition: background .2s; margin-bottom: 6px;
  }
  .nb-deal-item:hover { background: var(--slate); }
  .nb-deal-item img { width: 64px; height: 64px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
  .nb-deal-name { color: var(--white); font-size: .88rem; font-weight: 600; }
  .nb-deal-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
  .nb-deal-price { color: var(--gold); font-weight: 700; font-size: .88rem; }
  .nb-deal-badge { background: rgba(239,68,68,.15); color: #f87171; border: 1px solid rgba(239,68,68,.2); border-radius: 100px; padding: 2px 8px; font-size: .68rem; font-weight: 700; }

  .nb-mega-quick { padding: 20px; border-left: 1px solid var(--border); background: var(--midnight); }
  .nb-quick-item {
    display: flex; align-items: center; gap: 8px; padding: 9px 10px;
    border-radius: 10px; color: var(--muted); text-decoration: none;
    font-size: .85rem; font-weight: 500; transition: all .2s; margin-bottom: 2px;
  }
  .nb-quick-item:hover { color: var(--white); background: var(--navy); }
  .nb-quick-item svg { color: var(--gold); flex-shrink: 0; }

  .nb-mobile-toggle {
    display: none; width: 40px; height: 40px; border-radius: 10px;
    background: var(--navy); border: 1.5px solid var(--border);
    color: var(--muted); align-items: center; justify-content: center; cursor: pointer;
  }
  .nb-drawer {
    display: none; position: fixed; inset: 0; z-index: 9998;
  }
  .nb-drawer-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,.7);
    backdrop-filter: blur(4px);
  }
  .nb-drawer-panel {
    position: absolute; left: 0; top: 0; bottom: 0; width: min(340px, 92vw);
    background: var(--midnight); border-right: 1px solid var(--border);
    overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 6px;
    animation: nb-slide-in .28s cubic-bezier(.16,1,.3,1);
  }
  .nb-drawer-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .nb-mobile-search { position: relative; margin-bottom: 8px; }
  .nb-mobile-search input { width: 100%; padding: 10px 16px 10px 42px; background: var(--navy); border: 1.5px solid var(--border); border-radius: 12px; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: .9rem; outline: none; }
  .nb-mobile-search input::placeholder { color: var(--muted); }
  .nb-mobile-search input:focus { border-color: var(--gold-bdr); }
  .nb-mobile-search svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--muted); }
  .nb-m-link { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 12px; color: var(--muted); text-decoration: none; font-size: .93rem; font-weight: 500; transition: all .2s; }
  .nb-m-link:hover, .nb-m-link.active { color: var(--gold); background: var(--gold-dim); }
  .nb-m-section { font-size: .7rem; text-transform: uppercase; letter-spacing: .1em; color: var(--muted); font-weight: 700; padding: 14px 14px 6px; }
  .nb-m-cat { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border-radius: 10px; color: var(--muted); text-decoration: none; font-size: .87rem; transition: all .2s; }
  .nb-m-cat:hover { color: var(--white); background: var(--navy); }

  @keyframes nb-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes nb-pop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
  @keyframes nb-slide-in { from{transform:translateX(-100%)} to{transform:translateX(0)} }

  @media(max-width: 1024px) {
    .nb-links { display: none; }
    .nb-search { display: none; }
    .nb-mobile-toggle { display: flex; }
    .nb-user-name { display: none; }
    .nb-user-chev { display: none; }
    .nb-login-btn span { display: none; }
    .nb-login-btn { padding: 9px 12px; border-radius: 10px; }
  }
  @media(max-width: 640px) {
    .nb-topbar { display: none; }
    .nb-inner { padding: 0 16px; gap: 12px; }
    .nb-logo-text { display: none; }
  }
  .nb-drawer.open { display: block; }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [desktopSearch, setDesktopSearch] = useState('');
  const [mobileSearch, setMobileSearch] = useState('');
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Add unread count state

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch unread notifications count for logged-in user
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Poll every 30 seconds to update unread count
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

// In Navbar.jsx, update fetchUnreadCount:

// In Navbar.jsx, update fetchUnreadCount:
const fetchUnreadCount = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            setUnreadCount(0);
            return;
        }
        
        const data = await notificationService.getUnreadCount();
        setUnreadCount(data.unread_count || 0);
    } catch (error) {
       
        setUnreadCount(0);
    }
};

  useEffect(() => {
    const fetchNavData = async () => {
      setLoading(true);
      try {
        // 1. Fetch all categories and get top 5 by product_count
        const categoriesRes = await productService.getCategories();
        const allCategories = categoriesRes.results || categoriesRes || [];
        if (Array.isArray(allCategories)) {
          const topCats = [...allCategories]
            .sort((a, b) => (b.product_count || 0) - (a.product_count || 0))
            .slice(0, 5);
          setCategories(topCats);
        }

        // 2. Fetch featured products and take first 4
        const featuredRes = await productService.getFeaturedProducts();
        const allFeatured = featuredRes.results || featuredRes || [];
        if (Array.isArray(allFeatured)) {
          setFeaturedProducts(allFeatured.slice(0, 4));
        }
      } catch (error) {
      
        setCategories([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNavData();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleSearch = (e, query) => {
    e.preventDefault();
    const q = query?.trim();
    if (q) {
      navigate(`/products?search=${q}`);
      setDesktopSearch('');
      setMobileSearch('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const formatPrice = (price) => `PKR ${Math.round(price).toLocaleString()}`;
  const fallbackImage = 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=200';

  return (
    <>
      <style>{navStyles}</style>

      {/* Top bar */}
      <div className="nb-topbar">
        <div className="nb-topbar-inner">
          <div className="nb-topbar-left">
            <span><MapPin size={12} /> Shipping across Pakistan</span>
            <span><Clock size={12} /> Mon–Sat: 9AM – 8PM</span>
            <span><Phone size={12} /> +92 321 9455315</span>
          </div>
          <div className="nb-topbar-right">
            <div className="nb-topbar-sale"><span></span><Zap size={11} /> Flash Sale — Up to 50% Off</div>
            <div className="divider" />
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`nb-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nb-inner">
          <Link to="/" className="nb-logo">
            <div className="nb-logo-icon">GB</div>
            <span className="nb-logo-text">Gilgit <em>Bazaar</em></span>
          </Link>

          <form className="nb-search" onSubmit={(e) => handleSearch(e, desktopSearch)}>
            <Search className="nb-search-icon" size={17} />
            <input
              type="text"
              placeholder="Search products, crafts, fruits…"
              value={desktopSearch}
              onChange={(e) => setDesktopSearch(e.target.value)}
            />
            <button type="submit" className="nb-search-btn">Search</button>
          </form>

          <div className="nb-links">
            <Link to="/" className={`nb-link${isActive('/') ? ' active' : ''}`}>Home</Link>

            {/* Mega Menu */}
            <div className="nb-mega-wrap">
              <button className={`nb-link${isActive('/products') ? ' active' : ''}`}>
                Products <ChevronDown size={14} className="chevron" />
              </button>
              <div className="nb-mega">
                <div className="nb-mega-grid">
                  {/* Left: Categories (top 5) */}
                  <div className="nb-mega-cats">
                    <div className="nb-mega-label"><Package size={12} /> Categories</div>
                    {loading ? (
                      <div className="nb-cat-item" style={{ color: 'var(--muted)' }}>Loading...</div>
                    ) : categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link key={cat.id} to={`/products?category=${cat.slug}`} className="nb-cat-item">
                          <span className="nb-cat-emoji">{cat.icon || '📦'}</span>
                          {cat.name}
                          <ArrowRight size={13} className="nb-cat-arrow" />
                        </Link>
                      ))
                    ) : (
                      <div className="nb-cat-item" style={{ color: 'var(--muted)' }}>No categories</div>
                    )}
                    <Link to="/products" className="nb-view-all">View All Products <ArrowRight size={13} /></Link>
                  </div>

                  {/* Center: Featured products (top 4) */}
                  <div className="nb-mega-deals">
                    <div className="nb-mega-label"><Sparkles size={12} /> Featured Deals</div>
                    {loading ? (
                      <div className="nb-deal-item" style={{ color: 'var(--muted)' }}>Loading...</div>
                    ) : featuredProducts.length > 0 ? (
                      featuredProducts.map((prod) => (
                        <Link key={prod.id} to={`/products/${prod.slug}`} className="nb-deal-item">
                          <img src={prod.primary_image || fallbackImage} alt={prod.name} />
                          <div>
                            <div className="nb-deal-name">{prod.name}</div>
                            <div className="nb-deal-meta">
                              <span className="nb-deal-price">{formatPrice(prod.price)}</span>
                              {prod.discount_percentage > 0 && (
                                <span className="nb-deal-badge">-{prod.discount_percentage}%</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="nb-deal-item" style={{ color: 'var(--muted)' }}>No featured deals</div>
                    )}
                  </div>

                  {/* Right: Quick Links (including Gift Hampers) */}
                  <div className="nb-mega-quick">
                    <div className="nb-mega-label"><TrendingUp size={12} /> Quick Links</div>
                    <Link to="/products?featured=true" className="nb-quick-item"><Tag size={13} /> New Arrivals</Link>
                    <Link to="/products?sort=-sold"    className="nb-quick-item"><Sparkles size={13} /> Best Sellers</Link>
                    <Link to="/products?discount=true" className="nb-quick-item"><Tag size={13} /> On Sale</Link>
                    <Link to="/products?sort=price"    className="nb-quick-item"><TrendingUp size={13} /> Budget Picks</Link>
                    <Link to="/products?category=hand-crafts" className="nb-quick-item">🎨 Handicrafts</Link>
                    <Link to="/gift-hampers" className="nb-quick-item">🎁 Gift Hampers</Link>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/about" className={`nb-link${isActive('/about') ? ' active' : ''}`}>About</Link>
            <Link to="/contact" className={`nb-link${isActive('/contact') ? ' active' : ''}`}>Contact</Link>
          </div>

          <div className="nb-actions">
            {/* Notification Bell Icon */}
            <button className="nb-icon-btn" onClick={() => navigate('/notifications')}>
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="nb-badge notification">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>
            
            <button className="nb-icon-btn" onClick={() => navigate('/wishlist')}>
              <Heart size={18} />
            </button>
            
            <button className="nb-icon-btn" onClick={() => setShowCartSidebar(true)}>
              <ShoppingCart size={18} />
              {cart?.total_items > 0 && <span className="nb-badge">{cart.total_items}</span>}
            </button>
            
            {user ? (
              <div className="nb-user">
                <button className="nb-user-btn">
                  <div className="nb-avatar">
                    {(user.first_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <span className="nb-user-name">{user.first_name || 'Account'}</span>
                  <ChevronDown size={14} className="nb-user-chev" />
                </button>
                <div className="nb-dropdown">
                  <div className="nb-dropdown-header">
                    <div className="name">{user.first_name} {user.last_name}</div>
                    <div className="email">{user.email}</div>
                  </div>
                  <Link to="/profile" className="nb-dropdown-item"><User size={15} /> My Profile</Link>
                  <Link to="/orders" className="nb-dropdown-item"><Package size={15} /> My Orders</Link>
                  <Link to="/wishlist" className="nb-dropdown-item"><Heart size={15} /> Wishlist</Link>
                  <Link to="/notifications" className="nb-dropdown-item"><Bell size={15} /> Notifications</Link>
                  <div className="nb-dropdown-divider" />
                  <button onClick={handleLogout} className="nb-dropdown-item danger">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="nb-login-btn">
                <User size={15} />
                <span>Login</span>
              </Link>
            )}
            <button className="nb-mobile-toggle" onClick={() => setIsOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nb-drawer${isOpen ? ' open' : ''}`}>
        <div className="nb-drawer-overlay" onClick={() => setIsOpen(false)} />
        <div className="nb-drawer-panel">
          <div className="nb-drawer-header">
            <Link to="/" className="nb-logo" onClick={() => setIsOpen(false)}>
              <div className="nb-logo-icon">GB</div>
              <span className="nb-logo-text">Gilgit <em>Bazaar</em></span>
            </Link>
            <button className="nb-icon-btn" onClick={() => setIsOpen(false)}><X size={18} /></button>
          </div>
          <form className="nb-mobile-search" onSubmit={(e) => handleSearch(e, mobileSearch)}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search products…"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
            />
          </form>
          <Link to="/" className={`nb-m-link${isActive('/') ? ' active' : ''}`}>🏠 Home</Link>
          <Link to="/products" className={`nb-m-link${isActive('/products') ? ' active' : ''}`}>📦 All Products</Link>
          <Link to="/about" className={`nb-m-link${isActive('/about') ? ' active' : ''}`}>ℹ️ About</Link>
          <Link to="/contact" className={`nb-m-link${isActive('/contact') ? ' active' : ''}`}>📞 Contact</Link>
          <div className="nb-m-section">Categories</div>
          {categories.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`} className="nb-m-cat" onClick={() => setIsOpen(false)}>
              <span>{cat.icon || '📦'}</span> {cat.name}
            </Link>
          ))}
          <div className="nb-m-section">Quick Links</div>
          <Link to="/products?featured=true" className="nb-m-cat" onClick={() => setIsOpen(false)}>✨ New Arrivals</Link>
          <Link to="/products?sort=-sold"    className="nb-m-cat" onClick={() => setIsOpen(false)}>🔥 Best Sellers</Link>
          <Link to="/products?discount=true" className="nb-m-cat" onClick={() => setIsOpen(false)}>🏷️ On Sale</Link>
          <Link to="/gift-hampers" className="nb-m-cat" onClick={() => setIsOpen(false)}>🎁 Gift Hampers</Link>
          <Link to="/notifications" className="nb-m-cat" onClick={() => setIsOpen(false)}>🔔 Notifications</Link>
          {user ? (
            <>
              <div className="nb-m-section">Account</div>
              <Link to="/profile" className="nb-m-cat" onClick={() => setIsOpen(false)}>👤 My Profile</Link>
              <Link to="/orders" className="nb-m-cat" onClick={() => setIsOpen(false)}>📋 My Orders</Link>
              <Link to="/wishlist" className="nb-m-cat" onClick={() => setIsOpen(false)}>❤️ Wishlist</Link>
              <button onClick={handleLogout} className="nb-m-link" style={{ color:'#f87171', background:'rgba(248,113,113,.08)', marginTop:8, width:'100%', border:'none', cursor:'pointer' }}>
                🚪 Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nb-login-btn" style={{ marginTop:16, justifyContent:'center' }} onClick={() => setIsOpen(false)}>
              <User size={15} /> <span>Login / Register</span>
            </Link>
          )}
        </div>
      </div>

      <CartSidebar isOpen={showCartSidebar} onClose={() => setShowCartSidebar(false)} />
    </>
  );
};

export default Navbar;