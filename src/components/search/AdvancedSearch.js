'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Star, SlidersHorizontal } from 'lucide-react';
import api from '@/lib/api';

const AdvancedSearch = ({ onResults, onFiltersChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: 0,
    isNew: false,
    isFeatured: false,
    inStock: true,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  const categories = ['Chairs', 'Sofas', 'Tables', 'Beds', 'Storage'];
  const priceRanges = [
    { label: 'Under $500', min: 0, max: 500 },
    { label: '$500 - $1,000', min: 500, max: 1000 },
    { label: '$1,000 - $2,000', min: 1000, max: 2000 },
    { label: '$2,000 - $5,000', min: 2000, max: 5000 },
    { label: 'Over $5,000', min: 5000, max: '' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    try {
      const response = await api.get(`/products?search=${searchQuery}&limit=5`);
      setSuggestions(response.data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const handleSearch = async (query = searchQuery) => {
    setLoading(true);
    setShowSuggestions(false);

    try {
      const params = new URLSearchParams();

      if (query) params.append('search', query);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minRating > 0) params.append('minRating', filters.minRating);
      if (filters.isNew) params.append('isNew', 'true');
      if (filters.isFeatured) params.append('isFeatured', 'true');
      if (filters.inStock) params.append('inStock', 'true');

      const response = await api.get(`/products?${params.toString()}`);
      onResults(response.data || []);
      onFiltersChange && onFiltersChange({ query, filters });
    } catch (error) {
      console.error('Search failed:', error);
      onResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Auto-search when filters change
    if (searchQuery || Object.values(newFilters).some(v => v !== '' && v !== false && v !== 0)) {
      handleSearch(searchQuery);
    }
  };

  const setPriceRange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      isNew: false,
      isFeatured: false,
      inStock: true,
    });
    setSearchQuery('');
    onResults([]);
    onFiltersChange && onFiltersChange({ query: '', filters: {} });
  };

  const selectSuggestion = (product) => {
    setSearchQuery(product.title);
    setShowSuggestions(false);
    handleSearch(product.title);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 cursor-pointer ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        onClick={() => handleFilterChange('minRating', index + 1)}
      />
    ));
  };

  const hasActiveFilters = Object.values(filters).some(
    (value, index) => {
      if (index === 6) return false; // Skip inStock as it's default true
      return value !== '' && value !== false && value !== 0;
    }
  ) || searchQuery;

  return (
    <div className="w-full relative">
      {/* Search Bar */}
      <div className="relative" ref={searchRef}>
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#B88E2F]/20 focus-within:bg-white focus-within:shadow-md">
          <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for furniture..."
            className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 px-3 py-1 text-sm"
          />

          <div className="flex items-center gap-2 border-l border-gray-300 pl-3 ml-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-full transition-colors ${showFilters ? 'bg-[#B88E2F] text-white' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                }`}
              title="Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="p-1.5 rounded-full bg-[#B88E2F] text-white hover:bg-[#A07A28] transition-colors disabled:opacity-50 shadow-sm"
              title="Search"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-4 right-4 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1"
          >
            {suggestions.map((product) => (
              <div
                key={product._id}
                onClick={() => selectSuggestion(product)}
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-10 h-10 object-cover rounded mr-3"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.title}</p>
                  <p className="text-xs text-gray-500">{product.topCategory}</p>
                </div>
                <p className="text-sm font-semibold text-[#B88E2F]">
                  ${product.price ? product.price.toLocaleString() : '0'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border rounded-xl shadow-xl z-40 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="space-y-1">
                {priceRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => setPriceRange(range.min, range.max)}
                    className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-200 ${filters.minPrice == range.min && filters.maxPrice == range.max
                      ? 'bg-[#B88E2F] text-white'
                      : ''
                      }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Price
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="Min price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="Max price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                />
              </div>
            </div>

            {/* Other Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Filters
              </label>
              <div className="space-y-2">
                {/* Rating Filter */}
                <div>
                  <p className="text-xs text-gray-600 mb-1">Minimum Rating</p>
                  <div className="flex items-center">
                    {renderStars(filters.minRating)}
                    {filters.minRating > 0 && (
                      <button
                        onClick={() => handleFilterChange('minRating', 0)}
                        className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Checkboxes */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isNew}
                    onChange={(e) => handleFilterChange('isNew', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">New Products</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isFeatured}
                    onChange={(e) => handleFilterChange('isFeatured', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Featured</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={clearFilters}
                className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;