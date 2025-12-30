'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartSidebar() {
    const { cartItems, removeFromCart, getCartTotal, isCartOpen, setIsCartOpen } = useCart();

    if (!isCartOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-[999]"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-[380px] md:w-[417px] max-w-full bg-white z-[1000] shadow-xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-xl sm:text-2xl font-semibold text-[#3A3A3A]">Shopping Cart</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-8 sm:py-12">
                            <p className="text-[#898989] text-sm sm:text-base">Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-100">
                                    <div className="relative w-[80px] h-[80px] sm:w-[105px] sm:h-[105px] bg-[#F9F1E7] rounded-lg overflow-hidden flex-shrink-0">
                                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div>
                                            <h3 className="text-sm sm:text-base font-normal text-[#3A3A3A] line-clamp-2">{item.title}</h3>
                                            <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                                                <span className="text-xs sm:text-sm text-[#3A3A3A]">{item.quantity}</span>
                                                <span className="text-xs sm:text-sm text-[#3A3A3A]">×</span>
                                                <span className="text-xs sm:text-sm text-[#B88E2F] font-medium">
                                                    Rp {item.price ? item.price.toLocaleString() : '0'}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="self-start text-xs sm:text-sm text-red-500 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-4 sm:p-6 border-t border-gray-200">
                        <div className="flex justify-between mb-4 sm:mb-6">
                            <span className="text-sm sm:text-base font-normal text-[#3A3A3A]">Subtotal</span>
                            <span className="text-sm sm:text-base font-semibold text-[#B88E2F]">
                                Rp {getCartTotal().toLocaleString()}
                            </span>
                        </div>
                        <div className="flex gap-2 sm:gap-3">
                            <Link
                                href="/cart"
                                onClick={() => setIsCartOpen(false)}
                                className="flex-1 py-2 text-center border border-black rounded-full text-xs sm:text-sm hover:bg-black hover:text-white transition-colors"
                            >
                                Cart
                            </Link>
                            <Link
                                href="/checkout"
                                onClick={() => setIsCartOpen(false)}
                                className="flex-1 py-2 text-center border border-black rounded-full text-xs sm:text-sm hover:bg-black hover:text-white transition-colors"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
