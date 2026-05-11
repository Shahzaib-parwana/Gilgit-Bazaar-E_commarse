// pages/ProductList.jsx - Complete Working Version
import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import Loader from '../common/Loader';
import { productService } from '../../services/productService';
import { useSearchParams, useLocation } from 'react-router-dom';
import {
  Filter, X, Grid3X3, LayoutList, ChevronLeft, ChevronRight,
  SlidersHorizontal, Search, Package, Sparkles, TrendingUp,
  ArrowUpDown, ChevronDown, Tag, Zap
} from 'lucide-react';
import siteSettingsService from '../../services/siteSettingsService';

/* ─── Styles (keep your existing styles) ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --midnight: #0a0f1e;
    --navy:     #0d1635;
    --navy-2:   #131c42;
    --slate:    #1e2a4a;
    --gold:     #f0a500;
    --gold-lt:  #fbbf24;
    --gold-dim: rgba(240,165,0,0.10);
    --gold-bdr: rgba(240,165,0,0.22);
    --muted:    #8892aa;
    --border:   rgba(255,255,255,0.07);
    --surface:  #111827;
    --white:    #ffffff;
  }

  /* ── Page Wrapper ── */
  .pl-wrap {
    min-height: 100vh;
    background: var(--midnight);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Page Hero ── */
  .pl-hero {
    background: linear-gradient(135deg, var(--navy-2) 0%, var(--midnight) 60%);
    border-bottom: 1px solid var(--border);
    padding: 40px 0 32px;
    position: relative;
    overflow: hidden;
  }
  .pl-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0a500' fill-opacity='0.03'%3E%3Cpath d='M20 20.5V18H0v5h5v5H0v5h20v-5h15v-4H20zm0-20V0H0v5h5v5H0v5h20v-5h15V1H20z'/%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
  .pl-hero-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 32px;
    position: relative; z-index: 1;
  }
  .pl-breadcrumb {
    display: flex; align-items: center; gap: 6px;
    font-size: .78rem; color: var(--muted); margin-bottom: 14px;
  }
  .pl-breadcrumb a { color: var(--muted); text-decoration: none; transition: color .2s; }
  .pl-breadcrumb a:hover { color: var(--gold); }
  .pl-breadcrumb span { color: var(--border); }
  .pl-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 900; color: var(--white);
    margin-bottom: 6px;
  }
  .pl-hero h1 em { font-style: normal; color: var(--gold); }
  .pl-hero-sub { color: var(--muted); font-size: .95rem; }
  .pl-hero-stats {
    display: flex; gap: 28px; margin-top: 20px; flex-wrap: wrap;
  }
  .pl-hero-stat {
    display: flex; align-items: center; gap: 8px;
    font-size: .82rem; color: var(--muted);
  }
  .pl-hero-stat svg { color: var(--gold); }
  .pl-hero-stat strong { color: var(--white); font-weight: 600; }

  /* ── Toolbar ── */
  .pl-toolbar {
    background: var(--navy);
    border-bottom: 1px solid var(--border);
    padding: 14px 0;
    position: sticky; top: 68px; z-index: 40;
    backdrop-filter: blur(12px);
  }
  .pl-toolbar-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 32px;
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .pl-toolbar-left { display: flex; align-items: center; gap: 10px; flex: 1; }
  .pl-toolbar-right { display: flex; align-items: center; gap: 8px; }

  /* Filter toggle btn */
  .pl-filter-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 16px; border-radius: 10px;
    background: var(--navy-2); border: 1.5px solid var(--border);
    color: var(--muted); font-size: .87rem; font-weight: 600;
    cursor: pointer; transition: all .2s; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .pl-filter-btn:hover, .pl-filter-btn.active {
    border-color: var(--gold-bdr); color: var(--gold); background: var(--gold-dim);
  }
  .pl-filter-badge {
    background: var(--gold); color: #000;
    border-radius: 100px; font-size: .68rem; font-weight: 800;
    padding: 1px 7px; min-width: 18px; text-align: center;
  }

  /* Sort dropdown */
  .pl-sort-wrap { position: relative; }
  .pl-sort-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 14px; border-radius: 10px;
    background: var(--navy-2); border: 1.5px solid var(--border);
    color: var(--muted); font-size: .87rem; font-weight: 500;
    cursor: pointer; transition: all .2s; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .pl-sort-btn:hover { border-color: var(--gold-bdr); color: var(--white); }
  .pl-sort-dropdown {
    position: absolute; right: 0; top: calc(100% + 8px);
    background: var(--navy-2); border: 1px solid var(--border);
    border-radius: 14px; min-width: 200px; overflow: hidden;
    box-shadow: 0 20px 48px rgba(0,0,0,.5);
    opacity: 0; visibility: hidden; transform: translateY(-6px);
    transition: all .2s; z-index: 100;
  }
  .pl-sort-wrap:hover .pl-sort-dropdown,
  .pl-sort-dropdown:hover { opacity: 1; visibility: visible; transform: translateY(0); }
  .pl-sort-option {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 16px; color: var(--muted); font-size: .87rem; font-weight: 500;
    cursor: pointer; transition: all .2s;
  }
  .pl-sort-option:hover { color: var(--white); background: var(--slate); }
  .pl-sort-option.selected { color: var(--gold); }
  .pl-sort-option svg { color: var(--gold); flex-shrink: 0; }

  /* View toggle */
  .pl-view-toggle {
    display: flex; gap: 4px; background: var(--navy-2);
    border: 1.5px solid var(--border); border-radius: 10px; padding: 3px;
  }
  .pl-view-btn {
    width: 32px; height: 32px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); cursor: pointer; transition: all .2s;
    background: transparent; border: none;
  }
  .pl-view-btn.active, .pl-view-btn:hover { background: var(--gold-dim); color: var(--gold); }

  /* Result count */
  .pl-result-count { color: var(--muted); font-size: .85rem; }
  .pl-result-count strong { color: var(--white); }

  /* ── Active Filters ── */
  .pl-active-filters {
    max-width: 1280px; margin: 0 auto; padding: 12px 32px;
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }
  .pl-active-tag {
    display: flex; align-items: center; gap: 6px;
    background: var(--gold-dim); border: 1px solid var(--gold-bdr);
    color: var(--gold); border-radius: 100px; padding: 5px 12px;
    font-size: .78rem; font-weight: 600;
  }
  .pl-active-tag button {
    background: none; border: none; color: var(--gold); cursor: pointer;
    padding: 0; display: flex; align-items: center; line-height: 1;
    opacity: .7; transition: opacity .2s;
  }
  .pl-active-tag button:hover { opacity: 1; }
  .pl-clear-all {
    background: none; border: none; color: var(--muted); font-size: .78rem;
    cursor: pointer; text-decoration: underline; font-family: 'DM Sans', sans-serif;
    transition: color .2s; padding: 0;
  }
  .pl-clear-all:hover { color: var(--gold); }

  /* ── Main Layout ── */
  .pl-main {
    max-width: 1280px; margin: 0 auto; padding: 28px 32px;
    display: grid; grid-template-columns: 280px 1fr; gap: 28px;
  }
  .pl-main.no-sidebar { grid-template-columns: 1fr; }

  /* ── Sidebar ── */
  .pl-sidebar {
    position: sticky; top: 130px; height: fit-content;
  }
  .pl-sidebar-card {
    background: var(--navy); border: 1px solid var(--border);
    border-radius: 18px; overflow: hidden;
  }
  .pl-sidebar-header {
    padding: 18px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .pl-sidebar-title {
    display: flex; align-items: center; gap: 8px;
    font-weight: 700; color: var(--white); font-size: .95rem;
  }
  .pl-sidebar-title svg { color: var(--gold); }
  .pl-sidebar-reset {
    font-size: .75rem; color: var(--muted); background: none; border: none;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: color .2s;
  }
  .pl-sidebar-reset:hover { color: var(--gold); }
  .pl-sidebar-body { padding: 4px 0 12px; }

  /* ── Products Area ── */
  .pl-content { min-width: 0; }

  /* Quick filter chips */
  .pl-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .pl-chip {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 16px; border-radius: 100px;
    border: 1.5px solid var(--border); color: var(--muted);
    font-size: .82rem; font-weight: 500; cursor: pointer;
    transition: all .2s; background: none;
    font-family: 'DM Sans', sans-serif;
  }
  .pl-chip:hover, .pl-chip.active {
    border-color: var(--gold-bdr); color: var(--gold); background: var(--gold-dim);
  }
  .pl-chip svg { flex-shrink: 0; }

  /* Grid / List views */
  .pl-grid { display: grid; gap: 20px; }
  .pl-grid.grid-3 { grid-template-columns: repeat(3, 1fr); }
  .pl-grid.grid-4 { grid-template-columns: repeat(4, 1fr); }
  .pl-grid.list   { grid-template-columns: 1fr; }

  @media(max-width: 1024px) {
    .pl-main { grid-template-columns: 1fr; }
    .pl-sidebar { position: static; height: auto; }
    .pl-grid.grid-3 { grid-template-columns: repeat(2, 1fr); }
    .pl-grid.grid-4 { grid-template-columns: repeat(2, 1fr); }
  }
  @media(max-width: 640px) {
    .pl-main { padding: 16px; }
    .pl-hero-inner { padding: 0 16px; }
    .pl-toolbar-inner { padding: 0 16px; }
    .pl-grid.grid-3,
    .pl-grid.grid-4 { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .pl-active-filters { padding: 10px 16px; }
  }

  /* ── Empty State ── */
  .pl-empty {
    text-align: center; padding: 80px 24px;
    background: var(--navy); border: 1px solid var(--border);
    border-radius: 20px;
  }
  .pl-empty-icon {
    width: 72px; height: 72px; border-radius: 20px;
    background: var(--gold-dim); border: 1px solid var(--gold-bdr);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; color: var(--gold);
  }
  .pl-empty h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--white); margin-bottom: 10px; }
  .pl-empty p { color: var(--muted); font-size: .95rem; max-width: 320px; margin: 0 auto 24px; line-height: 1.7; }
  .pl-empty-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold); color: #000; padding: 11px 24px;
    border-radius: 12px; font-weight: 700; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: .93rem; transition: background .2s;
  }
  .pl-empty-btn:hover { background: var(--gold-lt); }

  /* ── Pagination ── */
  .pl-pagination {
    display: flex; justify-content: center; align-items: center;
    gap: 6px; margin-top: 40px; flex-wrap: wrap;
  }
  .pl-page-btn {
    min-width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: var(--navy); border: 1.5px solid var(--border);
    color: var(--muted); font-size: .88rem; font-weight: 600;
    cursor: pointer; transition: all .2s; font-family: 'DM Sans', sans-serif;
    padding: 0 12px;
  }
  .pl-page-btn:hover:not(:disabled) { border-color: var(--gold-bdr); color: var(--gold); background: var(--gold-dim); }
  .pl-page-btn.active { background: var(--gold); color: #000; border-color: var(--gold); }
  .pl-page-btn:disabled { opacity: .35; cursor: not-allowed; }
  .pl-page-dots { color: var(--muted); padding: 0 4px; }

  /* ── Flash sale badge ── */
  .pl-flash-strip {
    background: linear-gradient(90deg, #7c1a1a, #991b1b, #7c1a1a);
    border-radius: 12px; padding: 14px 20px; margin-bottom: 20px;
    display: flex; align-items: center; gap: 14px;
  }
  .pl-flash-strip svg { color: #fca5a5; flex-shrink: 0; }
  .pl-flash-strip-text { color: #fca5a5; font-size: .87rem; font-weight: 600; }
  .pl-flash-strip-text strong { color: #fff; }

  /* ── Animations ── */
  @keyframes pl-fade-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pl-fade-in { from { opacity:0; } to { opacity:1; } }
  .pl-fade-up { animation: pl-fade-up .5s ease forwards; }
  .pl-fade-in { animation: pl-fade-in .4s ease forwards; }

  /* Mobile filter drawer */
  .pl-filter-drawer {
    position: fixed; inset: 0; z-index: 9999; display: none;
  }
  .pl-filter-drawer.open { display: block; }
  .pl-filter-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,.7);
    backdrop-filter: blur(4px);
  }
  .pl-filter-panel {
    position: absolute; left: 0; top: 0; bottom: 0; width: min(340px, 92vw);
    background: var(--midnight); border-right: 1px solid var(--border);
    overflow-y: auto; padding: 20px;
    animation: pl-slide-in .28s cubic-bezier(.16,1,.3,1);
  }
  .pl-filter-panel-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;
  }
  .pl-filter-panel-title {
    font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--white); font-weight: 700;
  }
  .pl-filter-close {
    width: 36px; height: 36px; border-radius: 8px; background: var(--navy);
    border: 1px solid var(--border); color: var(--muted); display: flex;
    align-items: center; justify-content: center; cursor: pointer;
  }
  @keyframes pl-slide-in { from{transform:translateX(-100%)} to{transform:translateX(0)} }
`;

/* ─── Sort options ─── */
const SORT_OPTIONS = [
  { label: 'Newest First',    value: '-created_at', icon: Sparkles },
  { label: 'Price: Low → High', value: 'price',    icon: TrendingUp },
  { label: 'Price: High → Low', value: '-price',   icon: TrendingUp },
  { label: 'Best Sellers',    value: '-sold',       icon: Tag },
  { label: 'Top Rated',       value: '-rating',     icon: Sparkles },
];

const QUICK_CHIPS = [
  { label: 'New Arrivals', value: 'featured', icon: Sparkles },
  { label: 'On Sale',      value: 'discount', icon: Tag },
  { label: 'Best Sellers', value: 'best',     icon: TrendingUp },
  { label: 'Under PKR 2K', value: 'budget',   icon: Zap },
];

/* ─── Pagination helper ─── */
const buildPages = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('…');
    pages.push(total);
  } else if (current >= total - 3) {
    pages.push(1);
    pages.push('…');
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push('…');
    for (let i = current - 1; i <= current + 1; i++) pages.push(i);
    pages.push('…');
    pages.push(total);
  }
  return pages;
};

/* ─── Main Component ─── */
const ProductList = ({ initialFilters = {} }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // Get search query from URL
  const searchQuery = searchParams.get('search') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flashSale, setFlashSale] = useState(null);
  
  const [filters, setFilters] = useState(() => {
    const categoryFromUrl = searchParams.get('category') || '';
    const minPriceFromUrl = searchParams.get('min_price') || '';
    const maxPriceFromUrl = searchParams.get('max_price') || '';
    const budgetFromUrl = searchParams.get('budget') === 'true';
    
    return {
      ...initialFilters,
      ...(categoryFromUrl && { category: categoryFromUrl }),
      ...(minPriceFromUrl && { min_price: minPriceFromUrl }),
      ...(maxPriceFromUrl && { max_price: maxPriceFromUrl }),
      ...(budgetFromUrl && { budget: true }),
    };
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('productViewMode') || 'grid-3';
  });
  const [sortBy, setSortBy] = useState(() => {
    return searchParams.get('sort') || '-created_at';
  });
  const [activeChip, setActiveChip] = useState(() => {
    return searchParams.get('budget') === 'true' ? 'budget' : null;
  });
  
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [pagination, setPagination] = useState({ 
    count: 0, 
    next: null, 
    previous: null, 
    currentPage: parseInt(searchParams.get('page')) || 1 
  });

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem('productViewMode', viewMode);
  }, [viewMode]);

  // Fetch products when any filter/search/sort/page changes
  useEffect(() => {
    fetchProducts();
  }, [searchQuery, filters.category, sortBy, pagination.currentPage, filters.min_price, filters.max_price, filters.budget, filters.featured, filters.discount, filters.best]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build API params
      const params = {
        page: pagination.currentPage,
        page_size: 20,
        sort: sortBy,
      };
      
      // Add search query if present (this is the key fix!)
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      // Add category filter
      if (filters.category && filters.category !== '') {
        params.category = filters.category;
      }
      
      // Add price filters
      if (filters.min_price && filters.min_price !== '') {
        params.min_price = filters.min_price;
      }
      
      if (filters.max_price && filters.max_price !== '') {
        params.max_price = filters.max_price;
      }
      
      // Add chip filters
      if (filters.budget === true) {
        params.budget = true;
      }
      
      if (filters.featured === true) {
        params.featured = true;
      }
      
      if (filters.discount === true) {
        params.discount = true;
      }
      
      if (filters.best === true) {
        params.best = true;
      }
      
      // console.log('Fetching products with params:', params);
      
      const data = await productService.getProducts(params);
      
      setProducts(data.results || []);
      setPagination(prev => ({
        ...prev,
        count: data.count || 0,
        next: data.next,
        previous: data.previous,
      }));
      
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
    const fetchSiteSettings = async () => {
    try {
      const bannersData = await siteSettingsService.getHomeBanners();
      setAnnouncements(bannersData.announcements || []);
      setFlashSale(bannersData.flash_sale);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      // Fallback data if API fails
      setAnnouncements([
        { text: '🎁 Free Gift on orders over PKR 8,000', show_icon: true, icon: '🎁' },
        { text: '🚚 Express Delivery across Pakistan', show_icon: true, icon: '🚚' },
        { text: '✨ Authentic Northern Pakistan Products', show_icon: true, icon: '✨' },
        { text: '💳 Pay in 3 easy installments', show_icon: true, icon: '💳' }
      ]);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    // Update URL
    const newParams = new URLSearchParams(searchParams);
    
    if (newFilters.category !== undefined) {
      if (newFilters.category) {
        newParams.set('category', newFilters.category);
      } else {
        newParams.delete('category');
      }
    }
    
    if (newFilters.min_price !== undefined) {
      if (newFilters.min_price) {
        newParams.set('min_price', newFilters.min_price);
      } else {
        newParams.delete('min_price');
      }
    }
    
    if (newFilters.max_price !== undefined) {
      if (newFilters.max_price) {
        newParams.set('max_price', newFilters.max_price);
      } else {
        newParams.delete('max_price');
      }
    }
    
    if (newFilters.budget !== undefined) {
      if (newFilters.budget) {
        newParams.set('budget', 'true');
      } else {
        newParams.delete('budget');
      }
    }
    
    setSearchParams(newParams);
  };

  const handleChipClick = (chipValue) => {
    const next = activeChip === chipValue ? null : chipValue;
    setActiveChip(next);
    
    if (next === 'budget') {
      handleFilterChange({ budget: true, featured: false, discount: false, best: false });
    } else if (next === 'featured') {
      handleFilterChange({ featured: true, budget: false, discount: false, best: false });
    } else if (next === 'discount') {
      handleFilterChange({ discount: true, budget: false, featured: false, best: false });
    } else if (next === 'best') {
      handleFilterChange({ best: true, budget: false, featured: false, discount: false });
    } else {
      handleFilterChange({ budget: false, featured: false, discount: false, best: false });
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    if (typeof page !== 'number') return;
    setPagination(prev => ({ ...prev, currentPage: page }));
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setFilters({});
    setActiveCategory('');
    setActiveChip(null);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    // Clear all filter params but keep search if present
    const newParams = new URLSearchParams();
    if (searchQuery) {
      newParams.set('search', searchQuery);
    }
    setSearchParams(newParams);
  };

  const handleCategoryClick = (slug) => {
    setActiveCategory(slug);
    setFilters(prev => ({ ...prev, category: slug || undefined }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.min_price && filters.min_price !== '') count++;
    if (filters.max_price && filters.max_price !== '') count++;
    if (filters.budget === true) count++;
    if (filters.featured === true) count++;
    if (filters.discount === true) count++;
    if (filters.best === true) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  const totalPages = Math.ceil(pagination.count / 20);
  const pages = buildPages(pagination.currentPage, totalPages);

  // Get category display name
  const getCategoryDisplayName = () => {
    const categoryNames = {
      'handicrafts': 'Handicrafts',
      'dried-fruits': 'Dried Fruits',
      'traditional-wear': 'Traditional Wear',
      'home-decor': 'Home Decor',
      'jewelry': 'Jewelry',
      'organic-foods': 'Organic Foods',
      'gift-hamper': 'Gift Hampers'
    };
    return categoryNames[activeCategory] || activeCategory;
  };

  // Get page title
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search: "${searchQuery}"`;
    }
    if (activeCategory) {
      return getCategoryDisplayName();
    }
    return 'Discover Our Collection';
  };

  // Get page description
  const getPageDescription = () => {
    if (searchQuery && pagination.count === 0 && !loading) {
      return `No exact matches found for "${searchQuery}". Try searching for dried fruits, handicrafts, or traditional wear.`;
    }
    if (searchQuery) {
      return `Found ${pagination.count} result${pagination.count !== 1 ? 's' : ''} for "${searchQuery}"`;
    }
    if (activeCategory) {
      return `Explore our collection of premium ${getCategoryDisplayName().toLowerCase()}`;
    }
    return 'Authentic goods from the highlands of Gilgit-Baltistan';
  };

  // Generate search suggestions when no results
  const getSearchSuggestions = () => {
    const suggestionsMap = {
      'fru': ['dry fruits', 'dried fruits', 'apricots', 'walnuts', 'almonds'],
      'fruit': ['dry fruits', 'dried fruits', 'apricots', 'dates', 'figs'],
      'dry': ['dry fruits', 'dried fruits', 'apricots', 'walnuts', 'almonds', 'pistachios'],
      'nut': ['walnuts', 'almonds', 'pistachios', 'cashews', 'dry fruits'],
      'hand': ['handicrafts', 'handmade', 'traditional crafts', 'wooden crafts'],
      'craft': ['handicrafts', 'wooden items', 'traditional crafts', 'pottery'],
      'wear': ['traditional wear', 'shawls', 'caps', 'traditional dresses', 'ethnic wear'],
      'organic': ['organic foods', 'organic honey', 'organic fruits', 'dry fruits'],
    };
    
    const lowerQuery = searchQuery.toLowerCase();
    for (const [key, suggestions] of Object.entries(suggestionsMap)) {
      if (lowerQuery.includes(key)) {
        return suggestions;
      }
    }
    
    return ['dry fruits', 'handicrafts', 'traditional wear', 'gift hampers', 'organic foods'];
  };

  return (
    <div className="pl-wrap">
      <style>{styles}</style>

      {/* Hero Section */}
      <div className="pl-hero">
        <div className="pl-hero-inner">
          <div className="pl-breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/products">Products</a>
            {searchQuery && (
              <>
                <span>/</span>
                <span style={{ color: 'var(--gold)' }}>Search</span>
              </>
            )}
            {activeCategory && !searchQuery && (
              <>
                <span>/</span>
                <span style={{ color: 'var(--gold)' }}>{getCategoryDisplayName()}</span>
              </>
            )}
          </div>
          <h1>{getPageTitle()}</h1>
          <p className="pl-hero-sub">{getPageDescription()}</p>
          <div className="pl-hero-stats">
            <div className="pl-hero-stat">
              <Package size={14} />
              <strong>{pagination.count}</strong> Products
            </div>
            <div className="pl-hero-stat">
              <Sparkles size={14} />
              <strong>Free</strong> Shipping over PKR 5K
            </div>
            <div className="pl-hero-stat">
              <TrendingUp size={14} />
              <strong>4.9★</strong> Avg Rating
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="pl-toolbar">
        <div className="pl-toolbar-inner">
          <div className="pl-toolbar-left">
            <button 
              className={`pl-filter-btn${showFilters ? ' active' : ''}`} 
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={15} /> Filters
              {activeFiltersCount > 0 && <span className="pl-filter-badge">{activeFiltersCount}</span>}
            </button>
            {pagination.count > 0 && (
              <span className="pl-result-count">
                Showing <strong>{products.length}</strong> of <strong>{pagination.count}</strong> results
              </span>
            )}
          </div>
          <div className="pl-toolbar-right">
            <div className="pl-sort-wrap">
              <button className="pl-sort-btn">
                <ArrowUpDown size={14} />
                {SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Sort'}
                <ChevronDown size={13} />
              </button>
              <div className="pl-sort-dropdown">
                {SORT_OPTIONS.map(opt => (
                  <div
                    key={opt.value}
                    className={`pl-sort-option${sortBy === opt.value ? ' selected' : ''}`}
                    onClick={() => handleSortChange(opt.value)}
                  >
                    <opt.icon size={13} /> {opt.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="pl-view-toggle">
              <button 
                className={`pl-view-btn${viewMode === 'grid-3' ? ' active' : ''}`} 
                onClick={() => setViewMode('grid-3')} 
                title="Grid view"
              >
                <Grid3X3 size={15} />
              </button>
              <button 
                className={`pl-view-btn${viewMode === 'grid-4' ? ' active' : ''}`} 
                onClick={() => setViewMode('grid-4')} 
                title="Dense grid"
              >
                <Filter size={15} />
              </button>
              <button 
                className={`pl-view-btn${viewMode === 'list' ? ' active' : ''}`} 
                onClick={() => setViewMode('list')} 
                title="List view"
              >
                <LayoutList size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="pl-active-filters">
          <span style={{ fontSize: '.78rem', color: 'var(--muted)', marginRight: 4 }}>Active:</span>
          {activeCategory && (
            <span className="pl-active-tag">
              {getCategoryDisplayName()}
              <button onClick={() => handleCategoryClick('')}>
                <X size={11} />
              </button>
            </span>
          )}
          {filters.budget === true && (
            <span className="pl-active-tag">
              Under PKR 2K
              <button onClick={() => handleChipClick('budget')}>
                <X size={11} />
              </button>
            </span>
          )}
          {filters.featured === true && (
            <span className="pl-active-tag">
              New Arrivals
              <button onClick={() => handleChipClick('featured')}>
                <X size={11} />
              </button>
            </span>
          )}
          {filters.discount === true && (
            <span className="pl-active-tag">
              On Sale
              <button onClick={() => handleChipClick('discount')}>
                <X size={11} />
              </button>
            </span>
          )}
          {filters.best === true && (
            <span className="pl-active-tag">
              Best Sellers
              <button onClick={() => handleChipClick('best')}>
                <X size={11} />
              </button>
            </span>
          )}
          {filters.min_price && filters.min_price !== '' && (
            <span className="pl-active-tag">
              Min: PKR {filters.min_price}
              <button onClick={() => handleFilterChange({ ...filters, min_price: '' })}>
                <X size={11} />
              </button>
            </span>
          )}
          {filters.max_price && filters.max_price !== '' && (
            <span className="pl-active-tag">
              Max: PKR {filters.max_price}
              <button onClick={() => handleFilterChange({ ...filters, max_price: '' })}>
                <X size={11} />
              </button>
            </span>
          )}
          <button className="pl-clear-all" onClick={handleClearFilters}>
            Clear all
          </button>
        </div>
      )}

      {/* Main layout */}
      <div className={`pl-main${showFilters ? '' : ' no-sidebar'}`}>
        {/* Sidebar Filters */}
        {showFilters && (
          <aside className="pl-sidebar pl-fade-in">
            <div className="pl-sidebar-card">
              <div className="pl-sidebar-header">
                <div className="pl-sidebar-title">
                  <SlidersHorizontal size={15} /> Filters
                </div>
                {activeFiltersCount > 0 && (
                  <button className="pl-sidebar-reset" onClick={handleClearFilters}>
                    Reset all
                  </button>
                )}
              </div>
              <div className="pl-sidebar-body">
                <div style={{ padding: '12px 16px' }}>
                  <ProductFilters onFilterChange={handleFilterChange} initialFilters={filters} />
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Products Content */}
        <div className="pl-content">
          <div className="pl-chips">
            {QUICK_CHIPS.map(chip => (
              <button
                key={chip.value}
                className={`pl-chip${activeChip === chip.value ? ' active' : ''}`}
                onClick={() => handleChipClick(chip.value)}
              >
                <chip.icon size={12} /> {chip.label}
              </button>
            ))}
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

          {loading ? (
            <Loader />
          ) : products.length > 0 ? (
            <>
              <div className={`pl-grid ${viewMode} pl-fade-up`}>
                {products.map((product, i) => (
                  <div key={product.id} style={{ animationDelay: `${i * 0.04}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <>
                  <div className="pl-pagination">
                    <button 
                      className="pl-page-btn" 
                      onClick={() => handlePageChange(pagination.currentPage - 1)} 
                      disabled={!pagination.previous}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {pages.map((p, i) => 
                      p === '…' ? (
                        <span key={`dots-${i}`} className="pl-page-dots">…</span>
                      ) : (
                        <button 
                          key={p} 
                          className={`pl-page-btn${pagination.currentPage === p ? ' active' : ''}`} 
                          onClick={() => handlePageChange(p)}
                        >
                          {p}
                        </button>
                      )
                    )}
                    <button 
                      className="pl-page-btn" 
                      onClick={() => handlePageChange(pagination.currentPage + 1)} 
                      disabled={!pagination.next}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <p style={{ textAlign: 'center', marginTop: 14, color: 'var(--muted)', fontSize: '.8rem' }}>
                    Page {pagination.currentPage} of {totalPages}
                  </p>
                </>
              )}
            </>
          ) : (
            <div className="pl-empty pl-fade-up">
              <div className="pl-empty-icon">
                <Search size={30} />
              </div>
              <h3>No Products Found</h3>
              <p>
                {searchQuery 
                  ? `We couldn't find any products matching "${searchQuery}".` 
                  : "We couldn't find any products matching your filters."}
              </p>
              
              {searchQuery && (
                <div style={{ marginTop: '20px' }}>
                  <p style={{ color: 'var(--gold)', marginBottom: '12px' }}>Try searching for:</p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {getSearchSuggestions().map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          const newParams = new URLSearchParams();
                          newParams.set('search', suggestion);
                          setSearchParams(newParams);
                        }}
                        style={{
                          background: 'var(--gold-dim)',
                          border: '1px solid var(--gold-bdr)',
                          borderRadius: '40px',
                          padding: '8px 16px',
                          color: 'var(--gold)',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <button className="pl-empty-btn" onClick={handleClearFilters} style={{ marginTop: '30px' }}>
                <X size={15} /> Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div className={`pl-filter-drawer${showFilters && window.innerWidth < 1024 ? ' open' : ''}`}>
        <div className="pl-filter-overlay" onClick={() => setShowFilters(false)} />
        <div className="pl-filter-panel">
          <div className="pl-filter-panel-header">
            <div className="pl-filter-panel-title">Filters</div>
            <button className="pl-filter-close" onClick={() => setShowFilters(false)}>
              <X size={16} />
            </button>
          </div>
          <ProductFilters 
            onFilterChange={(f) => { 
              handleFilterChange(f); 
              setShowFilters(false); 
            }} 
            initialFilters={filters} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;