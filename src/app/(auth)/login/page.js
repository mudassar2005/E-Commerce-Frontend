'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundEffect from '@/components/ui/BackgroundEffect';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (!result.success) {
            setError(result.error);
            setLoading(false);
        }
        // If success, redirect is handled in AuthContext
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden px-4 py-12">
            <BackgroundEffect />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#3A3A3A] mb-2">Welcome Back</h1>
                    <p className="text-[#898989]">Login to your account</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent bg-white/50"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent bg-white/50"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="w-4 h-4 text-[#B88E2F] border-[#9F9F9F] rounded focus:ring-[#B88E2F]"
                            />
                            <span className="ml-2 text-sm text-[#3A3A3A]">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-sm text-[#B88E2F] hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#B88E2F] text-white py-3 rounded-lg font-semibold hover:bg-[#9F7A28] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center min-h-[50px]"
                    >
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="label"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    Login
                                    <motion.span
                                        initial={{ x: 0, opacity: 1 }}
                                        whileHover={{ x: 5 }}
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-transparent text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <a
                        href="http://localhost:3001/auth/google"
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </a>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-[#898989]">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-[#B88E2F] font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
