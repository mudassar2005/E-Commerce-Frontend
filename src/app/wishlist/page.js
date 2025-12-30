'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/nav-bar/nav-bar';
import Footer from '@/components/footer/footer';
import Breadcrumb from '@/components/pages/common/breadcrumb';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Trash2 } from 'lucide-react';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist, loading } = useWishlist();
    const { addToCart } = useCart();

    if (loading) {
        return (
            <div>

                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-lg sm:text-xl text-gray-500">Loading wishlist...</p>
                </div>

            </div>
        );
    }

    return (
        <div>


            {/* Hero Section */}
            <div className="bg-[#F9F1E7] py-8 sm:py-10 lg:py-12">
                <div className="container mx-auto px-4">
                    <Breadcrumb items={[{ label: 'Wishlist' }]} />
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3A3A3A] mt-3 sm:mt-4">My Wishlist</h1>
                </div>
            </div>

            {/* Wishlist Content */}
            <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
                {wishlist.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                        <p className="text-[#898989] text-base sm:text-lg mb-4 sm:mb-6">Your wishlist is empty</p>
                        <Link
                            href="/shop"
                            className="inline-block bg-[#B88E2F] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#9F7A28] transition-colors text-sm sm:text-base"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {wishlist.map((product) => (
                            <div key={product.id} className="bg-white group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {/* Image */}
                                <div className="relative h-[200px] sm:h-[250px] lg:h-[300px] w-full overflow-hidden">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                            No Image
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 sm:gap-4 p-4">
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="bg-white text-[#B88E2F] px-4 sm:px-6 lg:px-8 py-2 sm:py-3 font-semibold hover:bg-[#B88E2F] hover:text-white transition-colors text-xs sm:text-sm"
                                        >
                                            Add to cart
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(product.id)}
                                            className="text-white flex items-center gap-1 sm:gap-2 hover:text-red-400 transition-colors text-xs sm:text-sm"
                                        >
                                            <Trash2 size={16} className="sm:w-5 sm:h-5" />
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-3 sm:p-4 bg-[#F4F5F7]">
                                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-[#3A3A3A] mb-1 line-clamp-1">{product.title}</h3>
                                    <p className="text-[#898989] text-xs sm:text-sm mb-2 line-clamp-1">{product.subtitle}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base sm:text-lg lg:text-xl font-bold text-[#3A3A3A]">Rp {product.price ? product.price.toLocaleString() : '0'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


        </div>
    );
}
