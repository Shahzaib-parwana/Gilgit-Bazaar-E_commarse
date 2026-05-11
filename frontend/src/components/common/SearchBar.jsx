import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const SearchBar = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsFocused(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsFocused(false);
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div
        className={`relative flex items-center transition-all ${
          isFocused ? 'ring-2 ring-primary-500 rounded-lg' : ''
        }`}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-all"
        />
        
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Suggestions (Optional - can be enhanced later) */}
      {isFocused && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-2">Press Enter to search for:</p>
            <p className="font-medium text-gray-900">"{searchQuery}"</p>
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchBar;