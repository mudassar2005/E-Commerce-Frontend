'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingBag, Store } from 'lucide-react';

const Card = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const showNotification = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        showNotification('Added to cart!');
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
        showNotification(isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist!');
    };

    const handleVisitShop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.vendor) {
            window.open(`/shop/vendor/${product.vendor}`, '_blank');
        } else {
            console.warn('No vendor ID available for this product');
        }
    };

    const isLiked = isInWishlist(product.id);

    return (
        <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-medium z-50 animate-in fade-in slide-in-from-top-2">
                    {toastMessage}
                </div>
            )}

            {/* Image Container */}
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                <Image
                    src={product.images?.[0] || product.image || '/images/placeholder.svg'}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Dark Gradient Overlay on Hover */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.discount && (
                        <span className="bg-[#E97171] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                            -{product.discount}%
                        </span>
                    )}
                    {product.isNew && (
                        <span className="bg-[#2EC1AC] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                            NEW
                        </span>
                    )}
                </div>

                {/* Wishlist Button - Top Right */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm
                        ${isLiked
                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                            : 'bg-white/70 text-gray-700 hover:bg-white hover:text-red-500'
                        }`}
                >
                    <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={2.5} />
                </button>

                {/* Hover Actions - Slide Up */}
                <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-2">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-white text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 shadow-lg flex items-center justify-center gap-2"
                    >
                        <ShoppingBag size={16} />
                        Add to Cart
                    </button>
                    {product.vendor && (
                        <button
                            onClick={handleVisitShop}
                            className="w-full bg-black/40 text-white hover:bg-black/60 py-2 rounded-lg font-medium text-xs backdrop-blur-sm transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <Store size={14} />
                            Visit Shop
                        </button>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="text-gray-900 font-bold text-base mb-1 truncate group-hover:text-[#B88E2F] transition-colors">
                    {product.title}
                </h3>
                <p className="text-gray-500 text-xs mb-3 truncate">
                    {product.subtitle}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-[#3A3A3A]">
                            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                        </span>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                                ${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}
                            </span>
                        )}
                    </div>
                    {/* Rating or small indicator could go here */}
                </div>
            </div>
        </div>
    );
};

export default Card;
