import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { Filter, X, Tag, DollarSign } from 'lucide-react';

const ProductFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    min_price: initialFilters.min_price || '',
    max_price: initialFilters.max_price || '',
  });

  // Sync with initialFilters when they change
  useEffect(() => {
    setFilters({
      category: initialFilters.category || '',
      min_price: initialFilters.min_price || '',
      max_price: initialFilters.max_price || '',
    });
  }, [initialFilters.category, initialFilters.min_price, initialFilters.max_price]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      const cats = data.results || data || [];
      setCategories(cats);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleFilterChange = (name, value) => {
    // Convert empty string to empty string (don't send to API)
    const newValue = value === '' ? '' : value;
    const newFilters = { ...filters, [name]: newValue };
    setFilters(newFilters);
    
    // Debug log
    console.log('Filter changed:', name, newValue, newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { category: '', min_price: '', max_price: '' };
    setFilters(resetFilters);
    console.log('Resetting filters:', resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="pf-wrapper">
      <style>{`
        .pf-wrapper {
          font-family: 'DM Sans', sans-serif;
        }
        .pf-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 0 12px 0;
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.07));
          margin-bottom: 16px;
        }
        .pf-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: var(--white, #ffffff);
          font-size: 0.95rem;
        }
        .pf-title svg {
          color: var(--gold, #f0a500);
        }
        .pf-reset {
          background: none;
          border: none;
          color: var(--muted, #8892aa);
          font-size: 0.75rem;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .pf-reset:hover {
          color: var(--gold, #f0a500);
        }
        .pf-group {
          margin-bottom: 20px;
        }
        .pf-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted, #8892aa);
          margin-bottom: 10px;
        }
        .pf-label svg {
          width: 14px;
          height: 14px;
          color: var(--gold, #f0a500);
        }
        .pf-select, .pf-input {
          width: 100%;
          padding: 10px 12px;
          background: var(--navy, #0d1635);
          border: 1.5px solid var(--border, rgba(255,255,255,0.07));
          border-radius: 12px;
          color: var(--white, #ffffff);
          font-size: 0.85rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s;
        }
        .pf-select:hover, .pf-input:hover {
          border-color: var(--gold-bdr, rgba(240,165,0,0.22));
        }
        .pf-select:focus, .pf-input:focus {
          border-color: var(--gold-bdr, rgba(240,165,0,0.5));
          background: var(--navy-2, #131c42);
        }
        .pf-price-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .pf-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pf-input-group span {
          font-size: 0.7rem;
          color: var(--muted, #8892aa);
        }
        .pf-reset-btn {
          width: 100%;
          margin-top: 12px;
          padding: 10px;
          background: var(--gold-dim, rgba(240,165,0,0.10));
          border: 1.5px solid var(--gold-bdr, rgba(240,165,0,0.22));
          border-radius: 12px;
          color: var(--gold, #f0a500);
          font-weight: 700;
          font-size: 0.85rem;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .pf-reset-btn:hover {
          background: var(--gold-dim, rgba(240,165,0,0.18));
          border-color: var(--gold-bdr, rgba(240,165,0,0.4));
          transform: translateY(-1px);
        }
        .category-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238892aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          appearance: none;
        }
      `}</style>

      <div className="pf-header">
        <div className="pf-title">
          <Filter size={15} />
          Filters
        </div>
        <button className="pf-reset" onClick={handleReset}>
          Reset all
        </button>
      </div>

      {/* Category */}
      <div className="pf-group">
        <div className="pf-label">
          <Tag size={13} />
          Category
        </div>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="pf-select category-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="pf-group">
        <div className="pf-label">
          <DollarSign size={13} />
          Price Range (PKR)
        </div>
        <div className="pf-price-row">
          <div className="pf-input-group">
            <span>Min</span>
            <input
              type="number"
              placeholder="0"
              value={filters.min_price}
              onChange={(e) => handleFilterChange('min_price', e.target.value)}
              className="pf-input"
              min="0"
            />
          </div>
          <div className="pf-input-group">
            <span>Max</span>
            <input
              type="number"
              placeholder="Any"
              value={filters.max_price}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              className="pf-input"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button onClick={handleReset} className="pf-reset-btn">
        <X size={14} />
        Clear Filters
      </button>
    </div>
  );
};

export default ProductFilters;