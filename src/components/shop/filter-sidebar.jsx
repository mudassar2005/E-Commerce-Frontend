'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react';
import { useProducts } from '@/context/ProductsContext';

export default function FilterSidebar({ filters, onFilterChange, isMobile = false, onClose }) {
    const { products } = useProducts();
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        price: true,
        colors: true,
        sizes: true,
        brands: true,
        gender: true,
        rating: false
    });

    // Extract unique values from products for dynamic filters
    const [availableFilters, setAvailableFilters] = useState({
        categories: [],
        subCategories: [],
        colors: [],
        sizes: [],
        brands: [],
        genders: []
    });

    useEffect(() => {
        if (products && products.length > 0) {
            const categories = [...new Set(products.map(p => p.topCategory).filter(Boolean))];
            const subCategories = [...new Set(products.map(p => p.subCategory).filter(Boolean))];
            const colors = [...new Set(products.flatMap(p => p.colors || []).filter(Boolean))];
            const sizes = [...new Set(products.flatMap(p => p.sizes || []).filter(Boolean))];
            const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
            const genders = [...new Set(products.map(p => p.gender).filter(Boolean))];

            setAvailableFilters({
                categories: categories.sort(),
                subCategories: subCategories.sort(),
                colors: colors.sort(),
                sizes: sizes.sort(),
                brands: brands.sort(),
                genders: genders.sort()
            });
        }
    }, [products]);

    // Predefined color mapping for better UI
    const colorMapping = {
        'Black': 'bg-black',
        'White': 'bg-white border border-gray-300',
        'Red': 'bg-red-500',
        'Blue': 'bg-blue-500',
        'Green': 'bg-green-500',
        'Yellow': 'bg-yellow-500',
        'Purple': 'bg-purple-500',
        'Pink': 'bg-pink-500',
        'Orange': 'bg-orange-500',
        'Brown': 'bg-amber-700',
        'Gray': 'bg-gray-500',
        'Grey': 'bg-gray-500',
        'Navy': 'bg-blue-900',
        'Maroon': 'bg-red-900',
        'Gold': 'bg-yellow-400',
        'Silver': 'bg-gray-300',
        'Beige': 'bg-amber-100',
        'Cream': 'bg-amber-50',
        'Khaki': 'bg-yellow-600'
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleFilterChange = (filterType, value, isChecked) => {
        const currentValues = filters[filterType] || [];
        const newValues = isChecked
            ? [...currentValues, value]
            : currentValues.filter(v => v !== value);
        
        onFilterChange({ ...filters, [filterType]: newValues });
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.categories?.length > 0) count += filters.categories.length;
        if (filters.subCategories?.length > 0) count += filters.subCategories.length;
        if (filters.colors?.length > 0) count += filters.colors.length;
        if (filters.sizes?.length > 0) count += filters.sizes.length;
        if (filters.brands?.length > 0) count += filters.brands.length;
        if (filters.genders?.length > 0) count += filters.genders.length;
        if (filters.maxPrice && filters.maxPrice < 20000000) count += 1;
        if (filters.minRating && filters.minRating > 0) count += 1;
        return count;
    };

    const FilterContent = () => (
        <>
            {/* Active Filters Count */}
            {getActiveFiltersCount() > 0 && (
                <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-amber-800">
                            {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} active
                        </span>
                        <button
                            onClick={() => onFilterChange({ 
                                categories: [], 
                                subCategories: [], 
                                colors: [], 
                                sizes: [], 
                                brands: [], 
                                genders: [], 
                                maxPrice: 20000000,
                                minRating: 0
                            })}
                            className="text-xs text-amber-600 hover:text-amber-800 underline"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}

            {/* Categories */}
            {availableFilters.categories.length > 0 && (
                <div className="mb-6 sm:mb-8">
                    <button 
                        onClick={() => toggleSection('categories')}
                        className="flex items-center justify-between w-full text-sm sm:text-base font-medium text-[#3A3A3A] mb-3 sm:mb-4"
                    >
                        <span>Categories</span>
                        {expandedSections.categories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedSections.categories && (
                        <div className="space-y-2 sm:space-y-3 max-h-48 overflow-y-auto">
                            {availableFilters.categories.map((category) => (
                                <label key={category} className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.categories?.includes(category) || false}
                                        onChange={(e) => handleFilterChange('categories', category, e.target.checked)}
                                        className="w-4 h-4 text-[#B88E2F] border-gray-300 rounded focus:ring-[#B88E2F] focus:ring-2"
                                    />
                                    <span className="ml-3 text-xs sm:text-sm text-[#3A3A3A] group-hover:text-[#B88E2F] transition-colors">
                                        {category}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Sub Categories */}
            {availableFilters.subCategories.length > 0 && (
                <div className="mb-6 sm:mb-8">
                    <button 
                        onClick={() => toggleSection('subCategories')}
                        className="flex items-center justify-between w-full text-sm sm:text-base font-medium text-[#3A3A3A] mb-3 sm:mb-4"
                    >
                        <span>Sub Categories</span>
                        {expandedSections.subCategories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedSections.subCategories && (
                        <div className="space-y-2 sm:space-y-3 max-h-48 overflow-y-auto">
                            {availableFilters.subCategories.map((subCategory) => (
                                <label key={subCategory} className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.subCategories?.includes(subCategory) || false}
                                        onChange={(e) => handleFilterChange('subCategories', subCategory, e.target.checked)}
                                        className="w-4 h-4 text-[#B88E2F] border-gray-300 rounded focus:ring-[#B88E2F] focus:ring-2"
                                    />
                                    <span className="ml-3 text-xs sm:text-sm text-[#3A3A3A] group-hover:text-[#B88E2F] transition-colors">
                                        {subCategory}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Price Range */}
            <div className="mb-6 sm:mb-8">
                <button 
                    onClick={() => toggleSection('price')}
                    className="flex items-center justify-between w-full text-sm sm:text-base font-medium text-[#3A3A3A] mb-3 sm:mb-4"
                >
                    <span>Price Range</span>
                    {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.price && (
                    <div className="space-y-3 sm:space-y-4">
                        <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            <input
                                type="range"
                                min="0"
                                max="20000000"
                                step="100000"
                                value={filters.maxPrice || 20000000}
                                onChange={(e) => onFilterChange({ ...filters, maxPrice: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#B88E2F]"
                            />
                            <div className="flex justify-between text-xs sm:text-sm text-[#898989] mt-2">
                                <span>Rs 0</span>
                                <span>Rs {(filters.maxPrice || 20000000).toLocaleString()}</span>
                            </div>
                        </div>
                        
                        {/* Quick Price Filters */}
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: 'Under Rs 5,000', max: 5000 },
                                { label: 'Rs 5,000 - 15,000', max: 15000 },
                                { label: 'Rs 15,000 - 50,000', max: 50000 },
                                { label: 'Above Rs 50,000', max: 20000000 }
                            ].map((range) => (
                                <button
                                    key={range.label}
                                    onClick={() => onFilterChange({ ...filters, maxPrice: range.max })}
                                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                                        filters.maxPrice === range.max
                                            ? 'border-[#B88E2F] bg-[#B88E2F] text-white'
                                            : 'border-gray-300 text-gray-600 hover:border-[#B88E2F]'
                                    }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Colors */}
            {availableFilters.colors.length > 0 && (
                <div className="mb-6 sm:mb-8">
                    <button 
                        onClick={() => toggleSection('colors')}
                        className="flex items-center justify-between w-full text-sm sm:text-base font-medium text-[#3A3A3A] mb-3 sm:mb-4"
                    >
                        <span>Colors</span>
                        {expandedSections.colors ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedSections.colors && (
                        <div className="grid grid-cols-4 gap-2 sm:gap-3">
                            {availableFilters.colors.map((color) => (
                                <div key={color} className="flex flex-col items-center">
                                    <button
                                        onClick={() => {
                                            const newColors = filters.colors?.includes(color)
                                                ? filters.colors.filter(c => c !== color)
                                                : [...(filters.colors || []), color];
                                            onFilterChange({ ...filters, colors: newColors });
                                        }}
                                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                                            colorMapping[color] || 'bg-gray-400'
                                        } ${
                                            filters.colors?.includes(color) 
                                                ? 'ring-2 ring-offset-2 ring-[#B88E2F]' 
                                                : 'hover:ring-2 hover:ring-offset-1 hover:ring-gray-300'
                                        } transition-all duration-200`}
                                        title={color}
                                    />
                                    <span className="text-xs mt-1 text-center text-gray-600 truncate w-full">
                                        {color}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Sizes */}
            {availableFilters.sizes.length > 0 && (
                <div className="mb-6 sm:mb-8">
                    <button 
                        onClick={() => toggleSection('sizes')}
                        className="flex items-center justify-between w-full text-sm sm:text-base font-medium text-[#3A3A3A] mb-3 sm:mb-4"
                    >
                        <span>Sizes</span>
                        {expandedSections.sizes ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedSections.sizes && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                            {availableFilters.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => {
                                        const newSizes = filters.sizes?.includes(size)
                                            ? filters.sizes.filter(s => s !== size)
                                            : [...(filters.sizes || []), size];
                                        onFilterChange({ ...filters, sizes: newSizes });
                                    }}
                                    className={`h-10 sm:h-12 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                                        filters.sizes?.includes(size)
                                            ? 'border-[#B88E2F] bg-[#B88E2F] text-white shadow-md'
                                            : 'border-gray-300 bg-white text-[#3A3A3A] hover:border-[#B88E2F] hover:shadow-sm'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Brands */}
            {availableFilters.brands.length > 0 && (
                <div className="mb-6 sm:mb-8">
                    <button 
                        onClick={() => toggleSection('brands')}
                        className="flex items-center justify-between w-full text-sm sm:text-base font-medium text-[#3A3A3A] mb-3 sm:mb-4"
                    >
                        <span>Brands</span>
                        {expandedSections.brands ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedSections.brands && (
                        <div className="space-y-2 sm:space-y-3 max-h-48 overflow-y-auto">
                            {availableFilters.brands.map((brand) => (
                                <label key={brand} className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.brands?.includes(brand) || false}
                                        onChange={(e) => handleFilterChange('brands', brand, e.target.checked)}
                                        className="w-4 h-4 text-[#B88E2F] border-gray-300 rounded focus:ring-[#B88E2F] focus:ring-2"
                                    />
                                    <span className="ml-3 text-xs sm:text-sm text-[#3A3A3A] group-hover:text-[#B88E2F] transition-colors">
                                        {brand}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Gender */}
            {availableFilters.genders.length > 0 && (
                <div className="mb-6 sm:mb-8">
                    <button 
                        onClick={() => toggleSection('gender')}
                        className="flex items-center justify-between w-full text-sm sm:text-base font-medium text-[#3A3A3A] mb-3 sm:mb-4"
                    >
                        <span>Gender</span>
                        {expandedSections.gender ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedSections.gender && (
                        <div className="space-y-2 sm:space-y-3">
                            {availableFilters.genders.map((gender) => (
                                <label key={gender} className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.genders?.includes(gender) || false}
                                        onChange={(e) => handleFilterChange('genders', gender, e.target.checked)}
                                        className="w-4 h-4 text-[#B88E2F] border-gray-300 rounded focus:ring-[#B88E2F] focus:ring-2"
                                    />
                                    <span className="ml-3 text-xs sm:text-sm text-[#3A3A3A] group-hover:text-[#B88E2F] transition-colors capitalize">
                                        {gender}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Rating Filter */}
            <div className="mb-6 sm:mb-8">
                <button 
                    onClick={() => toggleSection('rating')}
                    className="flex items-center justify-between w-full text-sm sm:text-base font-medium text-[#3A3A3A] mb-3 sm:mb-4"
                >
                    <span>Minimum Rating</span>
                    {expandedSections.rating ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.rating && (
                    <div className="space-y-2">
                        {[4, 3, 2, 1].map((rating) => (
                            <label key={rating} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={(filters.minRating || 0) === rating}
                                    onChange={() => onFilterChange({ ...filters, minRating: rating })}
                                    className="w-4 h-4 text-[#B88E2F] border-gray-300 focus:ring-[#B88E2F] focus:ring-2"
                                />
                                <span className="ml-3 text-xs sm:text-sm text-[#3A3A3A] group-hover:text-[#B88E2F] transition-colors">
                                    {rating}+ Stars
                                </span>
                            </label>
                        ))}
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="radio"
                                name="rating"
                                checked={(filters.minRating || 0) === 0}
                                onChange={() => onFilterChange({ ...filters, minRating: 0 })}
                                className="w-4 h-4 text-[#B88E2F] border-gray-300 focus:ring-[#B88E2F] focus:ring-2"
                            />
                            <span className="ml-3 text-xs sm:text-sm text-[#3A3A3A] group-hover:text-[#B88E2F] transition-colors">
                                All Ratings
                            </span>
                        </label>
                    </div>
                )}
            </div>

            {/* Clear Filters */}
            <button
                onClick={() => onFilterChange({ 
                    categories: [], 
                    subCategories: [], 
                    colors: [], 
                    sizes: [], 
                    brands: [], 
                    genders: [], 
                    maxPrice: 20000000,
                    minRating: 0
                })}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-[#B88E2F] font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
                Clear All Filters
            </button>
        </>
    );

    // Mobile drawer version
    if (isMobile) {
        return (
            <div className="fixed inset-0 z-50 lg:hidden">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <div className="fixed left-0 top-0 h-full w-[320px] sm:w-[360px] bg-white shadow-xl overflow-y-auto">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#B88E2F] text-white">
                        <div className="flex items-center gap-2">
                            <Filter size={20} />
                            <h3 className="text-lg font-semibold">Filters</h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-4">
                        <FilterContent />
                    </div>
                </div>
            </div>
        );
    }

    // Desktop version
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Filter size={20} className="text-[#B88E2F]" />
                <h3 className="text-lg sm:text-xl font-semibold text-[#3A3A3A]">Filters</h3>
            </div>
            <FilterContent />
        </div>
    );
}
