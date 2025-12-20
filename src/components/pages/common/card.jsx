'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { Heart, ArrowLeftRight, Share2 } from 'lucide-react';

const Card = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { toggleCompare, isInCompare } = useCompare();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const showNotification = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleAddToCart = () => {
        addToCart(product);
        showNotification('Added to cart!');
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        toggleWishlist(product);
        showNotification(isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist!');
    };

    const handleCompare = (e) => {
        e.preventDefault();
        toggleCompare(product);
        showNotification(isInCompare(product.id) ? 'Removed from compare' : 'Added to compare!');
    };

    const handleShare = async (e) => {
        e.preventDefault();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: product.description,
                    url: window.location.origin + `/shop/${product.id}`
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.origin + `/shop/${product.id}`);
            showNotification('Link copied to clipboard!');
        }
    };

    const isLiked = isInWishlist(product.id);
    const isCompared = isInCompare(product.id);

    return (
        <div className="group relative bg-[#F4F5F7] overflow-hidden transition-all duration-300 hover:shadow-xl">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-24 right-4 bg-[#B88E2F] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top duration-300">
                    {toastMessage}
                </div>
            )}

            {/* Image Container */}
            <div className="relative h-[301px] overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {product.discount && (
                        <span className="bg-[#E97171] text-white rounded-full w-12 h-12 flex items-center justify-center text-sm font-semibold">
                            -{product.discount}%
                        </span>
                    )}
                    {product.isNew && (
                        <span className="bg-[#2EC1AC] text-white rounded-full w-12 h-12 flex items-center justify-center text-sm font-semibold">
                            New
                        </span>
                    )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                    <button
                        onClick={handleAddToCart}
                        className="bg-white text-[#B88E2F] px-12 py-3 font-semibold hover:bg-[#B88E2F] hover:text-white transition-colors duration-300"
                    >
                        Add to cart
                    </button>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1 text-white hover:text-[#B88E2F] transition-colors"
                        >
                            <Share2 size={16} />
                            <span className="text-sm font-semibold">Share</span>
                        </button>
                        <button
                            onClick={handleCompare}
                            className={`flex items-center gap-1 transition-colors ${isCompared ? 'text-[#B88E2F]' : 'text-white hover:text-[#B88E2F]'
                                }`}
                        >
                            <ArrowLeftRight size={16} />
                            <span className="text-sm font-semibold">Compare</span>
                        </button>
                        <button
                            onClick={handleWishlist}
                            className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-red-500' : 'text-white hover:text-red-500'
                                }`}
                        >
                            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                            <span className="text-sm font-semibold">Like</span>
                        </button>
                    </div>
                    
                    {/* Visit Shop Button */}
                    {product.vendor && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(`/shop/vendor/${product.vendor}`, '_blank');
                            }}
                            className="bg-[#B88E2F] text-white px-8 py-2 text-sm font-semibold hover:bg-[#d4a574] transition-colors duration-300"
                        >
                            Visit Shop
                        </button>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="text-2xl font-semibold text-[#3A3A3A] mb-2">{product.title}</h3>
                <p className="text-[#898989] text-base mb-3">{product.subtitle}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold text-[#3A3A3A]">
                            Rp {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                            <span className="text-base text-[#B0B0B0] line-through">
                                Rp {product.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
