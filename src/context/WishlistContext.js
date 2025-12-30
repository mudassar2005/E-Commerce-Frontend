'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '@/lib/api';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load wishlist from API if user is logged in, else from localStorage
    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else if (typeof window !== 'undefined') {
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) {
                setWishlist(JSON.parse(savedWishlist));
            } else {
                setWishlist([]);
            }
        }
    }, [user]);

    // Save to localStorage if user is NOT logged in
    useEffect(() => {
        if (!user && typeof window !== 'undefined') {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/wishlist');
            // Map backend products to frontend structure
            const mappedProducts = data.products.map(product => ({
                ...product,
                id: product._id
            }));
            setWishlist(mappedProducts);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (product) => {
        if (user) {
            try {
                await api.post('/wishlist/toggle', { productId: product.id });
                await fetchWishlist();
            } catch (error) {
                console.error('Error adding to wishlist:', error);
            }
        } else {
            setWishlist(prev => {
                const exists = prev.find(item => item.id === product.id);
                if (exists) {
                    return prev;
                }
                return [...prev, product];
            });
        }
    };

    const removeFromWishlist = async (productId) => {
        if (user) {
            try {
                await api.delete(`/wishlist/${productId}`);
                await fetchWishlist();
            } catch (error) {
                console.error('Error removing from wishlist:', error);
            }
        } else {
            setWishlist(prev => prev.filter(item => item.id !== productId));
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const toggleWishlist = async (product) => {
        if (user) {
            try {
                await api.post('/wishlist/toggle', { productId: product.id });
                await fetchWishlist();
            } catch (error) {
                console.error('Error toggling wishlist:', error);
            }
        } else {
            if (isInWishlist(product.id)) {
                removeFromWishlist(product.id);
            } else {
                addToWishlist(product);
            }
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                toggleWishlist,
                loading
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
