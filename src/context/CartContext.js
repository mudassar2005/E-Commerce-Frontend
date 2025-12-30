'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '@/lib/api';

const CartContext = createContext();

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Load cart from API if user is logged in, else from localStorage
    useEffect(() => {
        if (user) {
            fetchCart();
        } else if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            } else {
                setCartItems([]);
            }
        }
    }, [user]);

    // Save to localStorage if user is NOT logged in
    useEffect(() => {
        if (!user && typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/cart');
            // Map backend structure to frontend structure
            // Backend: { items: [{ product: {...}, quantity, price }] }
            // Frontend: [{ ...product, quantity }]
            const mappedItems = data.items.map(item => ({
                ...item.product,
                id: item.product._id, // Ensure ID is mapped
                quantity: item.quantity
            }));
            setCartItems(mappedItems);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        if (user) {
            try {
                await api.post('/cart/items', {
                    productId: product.id,
                    quantity
                });
                await fetchCart(); // Refresh cart from server
                setIsCartOpen(true);
            } catch (error) {
                console.error('Error adding to cart:', error);
                // Create a simple toast notification
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50';
                toast.innerHTML = `
                    <div class="flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                        </svg>
                        Failed to add to cart
                    </div>
                `;
                document.body.appendChild(toast);
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 5000);
            }
        } else {
            // Local storage fallback
            setCartItems(prev => {
                const existingItem = prev.find(item => item.id === product.id);
                if (existingItem) {
                    return prev.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                return [...prev, { ...product, quantity }];
            });
            setIsCartOpen(true);
        }
    };

    const removeFromCart = async (productId) => {
        if (user) {
            try {
                await api.delete(`/cart/items/${productId}`);
                await fetchCart();
            } catch (error) {
                console.error('Error removing from cart:', error);
            }
        } else {
            setCartItems(prev => prev.filter(item => item.id !== productId));
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        if (user) {
            try {
                await api.patch(`/cart/items/${productId}`, { quantity });
                await fetchCart();
            } catch (error) {
                console.error('Error updating cart quantity:', error);
            }
        } else {
            setCartItems(prev =>
                prev.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                )
            );
        }
    };

    const clearCart = async () => {
        if (user) {
            try {
                await api.delete('/cart');
                setCartItems([]);
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        } else {
            setCartItems([]);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
                isCartOpen,
                setIsCartOpen,
                loading
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
