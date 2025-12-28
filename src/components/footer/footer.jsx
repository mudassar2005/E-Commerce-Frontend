'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            await api.post('/newsletter/subscribe', { email });
            setStatus('success');
            setMessage('Subscribed successfully!');
            setEmail('');
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Failed to subscribe');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email Address"
                    className="border-b border-black text-sm py-1 outline-none placeholder:text-gray-400 flex-1 min-w-0 w-full sm:min-w-[200px]"
                    disabled={status === 'loading'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="border-b border-black text-sm font-medium uppercase py-1 hover:text-gray-600 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                    {status === 'loading' ? '...' : 'Subscribe'}
                </button>
            </div>
            {message && (
                <p className={`text-xs ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </form>
    );
}

export default function Footer() {
    return (
        <footer className="bg-white pt-8 sm:pt-10 lg:pt-12 pb-6 sm:pb-8 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
                    {/* Brand & Address */}
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-black">StyleHub.</h2>
                        <address className="not-italic text-gray-500 text-xs sm:text-sm leading-relaxed">
                            Air University, <br />
                            Islamabad <br />
                            <a href="tel:+923045650316" className="hover:text-[#B88E2F] transition-colors block mt-2">+92 304 5650316</a>
                            <a href="mailto:233000@students.au.edu.pk" className="hover:text-[#B88E2F] transition-colors block">233000@students.au.edu.pk</a>
                        </address>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <h3 className="text-gray-400 font-medium text-sm sm:text-base">Links</h3>
                        <nav className="flex flex-col gap-2 sm:gap-4 font-medium text-black text-sm sm:text-base">
                            <Link href="/" className="hover:underline">Home</Link>
                            <Link href="/shop" className="hover:underline">Shop</Link>
                            <Link href="/about" className="hover:underline">About</Link>
                            <Link href="/contact" className="hover:underline">Contact</Link>
                        </nav>
                    </div>

                    {/* Help */}
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <h3 className="text-gray-400 font-medium text-sm sm:text-base">Help</h3>
                        <nav className="flex flex-col gap-2 sm:gap-4 font-medium text-black text-sm sm:text-base">
                            <Link href="/payment-options" className="hover:underline">Payment Options</Link>
                            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                            <Link href="/terms-conditions" className="hover:underline">Terms & Conditions</Link>
                            <Link href="/track-order" className="hover:underline">Track Order</Link>
                        </nav>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <h3 className="text-gray-400 font-medium text-sm sm:text-base">Newsletter</h3>
                        <NewsletterForm />
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-200 pt-6 sm:pt-8">
                    <p className="text-black text-xs sm:text-sm text-center sm:text-left">
                        {new Date().getFullYear()} StyleHub. All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    );
}