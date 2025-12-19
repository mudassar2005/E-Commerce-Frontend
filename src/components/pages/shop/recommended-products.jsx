'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '../common/card';
import { useProducts } from '@/context/ProductsContext';
import api from '@/lib/api';

const RecommendedProducts = ({ currentProductId }) => {
    const { products, getProductById } = useProducts();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // Try to get AI-powered recommendations from backend
                const { data } = await api.get(`/products/${currentProductId}/recommendations`);
                if (data && data.length > 0) {
                    setRecommendations(data.map(p => ({ ...p, id: p._id })));
                } else {
                    // Fallback to category-based recommendations
                    fallbackRecommendations();
                }
            } catch (error) {
                // Fallback to category-based recommendations
                fallbackRecommendations();
            } finally {
                setLoading(false);
            }
        };

        const fallbackRecommendations = () => {
            const currentProduct = getProductById(currentProductId);
            if (currentProduct) {
                const similar = products
                    .filter(p => p.id !== currentProductId && p.category === currentProduct.category)
                    .slice(0, 4);
                
                if (similar.length < 4) {
                    const others = products
                        .filter(p => p.id !== currentProductId && !similar.includes(p))
                        .slice(0, 4 - similar.length);
                    setRecommendations([...similar, ...others]);
                } else {
                    setRecommendations(similar);
                }
            }
        };

        if (currentProductId && products.length > 0) {
            fetchRecommendations();
        }
    }, [currentProductId, products, getProductById]);

    if (loading) {
        return (
            <section className="py-12">
                <h2 className="text-2xl font-bold text-center text-[#3A3A3A] mb-8">You May Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-200 animate-pulse h-[400px] rounded" />
                    ))}
                </div>
            </section>
        );
    }

    if (recommendations.length === 0) return null;

    return (
        <section className="py-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-center text-[#3A3A3A] mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map(product => (
                    <Link key={product.id} href={`/shop/${product.id}`}>
                        <Card product={product} />
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RecommendedProducts;
