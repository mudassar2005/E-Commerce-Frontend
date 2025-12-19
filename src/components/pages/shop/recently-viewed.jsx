'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '../common/card';
import { useProducts } from '@/context/ProductsContext';

const RecentlyViewed = () => {
    const { products } = useProducts();
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const recent = viewedIds
            .map(id => products.find(p => p.id === id || p._id === id))
            .filter(Boolean)
            .slice(0, 4);
        setRecentProducts(recent);
    }, [products]);

    if (recentProducts.length === 0) return null;

    return (
        <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50">
            <h2 className="text-2xl font-bold text-center text-[#3A3A3A] mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {recentProducts.map(product => (
                    <Link key={product.id} href={`/shop/${product.id}`}>
                        <Card product={product} />
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RecentlyViewed;
