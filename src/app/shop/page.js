'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/nav-bar/nav-bar';
import Footer from '@/components/footer/footer';
import Card from '@/components/pages/common/card';
import FilterSidebar from '@/components/shop/filter-sidebar';
import Breadcrumb from '@/components/pages/common/breadcrumb';
import { useProducts } from '@/context/ProductsContext';
import { Grid, List, SlidersHorizontal } from 'lucide-react';

function ShopContent() {
    const { products, loading, error } = useProducts();
    const searchParams = useSearchParams();
    
    const [filters, setFilters] = useState({
        categories: [],
        subCategories: [],
        colors: [],
        sizes: [],
        brands: [],
        genders: [],
        maxPrice: 20000000,
        minRating: 0
    });
    const [sortBy, setSortBy] = useState('default');
    const [viewMode, setViewMode] = useState('grid');
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    // Get category and subcategory from URL params
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');

    // Filter products based on URL params and filters
    const filteredProducts = products.filter(product => {
        // Filter by URL category parameter
        if (categoryParam && product.topCategory !== categoryParam) {
            return false;
        }

        // Filter by URL subcategory parameter
        if (subcategoryParam && product.subCategory !== subcategoryParam) {
            return false;
        }

        // Filter by selected categories in sidebar
        if (filters.categories.length > 0 &&
            !filters.categories.includes(product.topCategory)) {
            return false;
        }

        // Filter by selected subcategories in sidebar
        if (filters.subCategories.length > 0 &&
            !filters.subCategories.includes(product.subCategory)) {
            return false;
        }

        // Filter by price
        if (product.price > filters.maxPrice) {
            return false;
        }

        // Filter by colors
        if (filters.colors.length > 0 && product.colors) {
            const hasMatchingColor = filters.colors.some(color =>
                product.colors.includes(color)
            );
            if (!hasMatchingColor) return false;
        }

        // Filter by sizes
        if (filters.sizes.length > 0 && product.sizes) {
            const hasMatchingSize = filters.sizes.some(size =>
                product.sizes.includes(size)
            );
            if (!hasMatchingSize) return false;
        }

        // Filter by brands
        if (filters.brands.length > 0 && product.brand) {
            if (!filters.brands.includes(product.brand)) {
                return false;
            }
        }

        // Filter by genders
        if (filters.genders.length > 0 && product.gender) {
            if (!filters.genders.includes(product.gender)) {
                return false;
            }
        }

        // Filter by minimum rating
        if (filters.minRating > 0) {
            const productRating = product.rating || 0;
            if (productRating < filters.minRating) {
                return false;
            }
        }

        return true;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.title.localeCompare(b.title);
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'newest':
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            case 'popular':
                return (b.views || 0) - (a.views || 0);
            default:
                return 0;
        }
    });

    return (
        <div className="bg-white min-h-screen">


            {/* Hero Section */}
            <div className="bg-[#F9F1E7] py-8 sm:py-10 lg:py-12">
                <div className="container mx-auto px-4">
                    <Breadcrumb items={[
                        { label: 'Shop' },
                        ...(categoryParam ? [{ label: categoryParam }] : []),
                        ...(subcategoryParam ? [{ label: subcategoryParam }] : [])
                    ]} />
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3A3A3A] mt-3 sm:mt-4">
                        {subcategoryParam ? `${categoryParam} - ${subcategoryParam}` :
                            categoryParam ? categoryParam : 'Shop'}
                    </h1>
                    {(categoryParam || subcategoryParam) && (
                        <p className="text-gray-600 mt-2 text-sm sm:text-base">
                            Showing {filteredProducts.length} products
                        </p>
                    )}
                </div>
            </div>

            {/* Toolbar */}
            <div className="border-b border-gray-200 bg-[#F9F1E7] py-3 sm:py-4">
                <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowMobileFilter(true)}
                            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm"
                        >
                            <SlidersHorizontal size={18} />
                            <span>Filters</span>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 sm:p-2 rounded ${viewMode === 'grid' ? 'bg-[#B88E2F] text-white' : 'text-[#3A3A3A] hover:bg-gray-200'}`}
                        >
                            <Grid size={18} className="sm:w-5 sm:h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 sm:p-2 rounded ${viewMode === 'list' ? 'bg-[#B88E2F] text-white' : 'text-[#3A3A3A] hover:bg-gray-200'}`}
                        >
                            <List size={18} className="sm:w-5 sm:h-5" />
                        </button>
                        <span className="text-xs sm:text-sm text-[#3A3A3A] hidden xs:inline">
                            {sortedProducts.length} results
                        </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <label className="text-xs sm:text-sm text-[#3A3A3A] hidden sm:inline">Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B88E2F] text-xs sm:text-sm"
                        >
                            <option value="default">Default</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A to Z</option>
                            <option value="rating">Highest Rated</option>
                            <option value="newest">Newest First</option>
                            <option value="popular">Most Popular</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <FilterSidebar filters={filters} onFilterChange={setFilters} />
                    </aside>

                    {/* Mobile Filter Drawer */}
                    {showMobileFilter && (
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={setFilters}
                            isMobile={true}
                            onClose={() => setShowMobileFilter(false)}
                        />
                    )}

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {loading && (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B88E2F] mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading products...</p>
                            </div>
                        )}
                        
                        {error && (
                            <div className="text-center py-12">
                                <p className="text-red-600 mb-4">Error loading products: {error}</p>
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="px-4 py-2 bg-[#B88E2F] text-white rounded hover:bg-[#d4a574]"
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                        
                        {!loading && !error && (
                            <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${viewMode === 'grid'
                                ? 'grid-cols-1 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-3'
                                : 'grid-cols-1'
                                }`}>
                                {sortedProducts.map((product) => (
                                    <Link key={product.id} href={`/shop/${product.id}`}>
                                        <Card product={product} />
                                    </Link>
                                ))}
                            </div>
                        )}

                        {!loading && !error && sortedProducts.length === 0 && (
                            <div className="text-center py-8 sm:py-12">
                                <p className="text-[#898989] text-base sm:text-lg mb-4">No products found matching your filters.</p>
                                <p className="text-sm text-gray-500">
                                    Total products available: {products?.length || 0}
                                </p>
                                {products?.length > 0 && (
                                    <button 
                                        onClick={() => setFilters({
                                            categories: [],
                                            subCategories: [],
                                            colors: [],
                                            sizes: [],
                                            brands: [],
                                            genders: [],
                                            maxPrice: 20000000,
                                            minRating: 0
                                        })}
                                        className="mt-4 px-4 py-2 bg-[#B88E2F] text-white rounded hover:bg-[#d4a574]"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>


        </div>
    );
}
export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-24 w-24 sm:h-32 sm:w-32 border-b-2 border-[#B88E2F]"></div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}