'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAlert } from '@/context/AlertContext';
import api from '@/lib/api';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showSuccess, showError, showWarning } = useAlert();
    const email = searchParams.get('email');

    const [formData, setFormData] = useState({
        otp: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            showWarning('Passwords do not match!');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                email,
                otp: formData.otp,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });
            showSuccess('Password reset successfully!');
            router.push('/login');
        } catch (error) {
            console.error('Failed to reset password:', error);
            showError(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (password.length === 0) return { strength: '', color: '' };
        if (password.length < 6) return { strength: 'Weak', color: 'text-red-500' };
        if (password.length < 10) return { strength: 'Medium', color: 'text-yellow-500' };
        return { strength: 'Strong', color: 'text-green-500' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#3A3A3A] mb-2">Reset Password</h1>
                    <p className="text-[#898989]">Enter your new password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* OTP */}
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                            OTP Code
                        </label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                            maxLength={6}
                            className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent tracking-widest text-center text-lg"
                            placeholder="123456"
                        />
                    </div>

                    {/* New Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                            placeholder="Enter new password"
                        />
                        {formData.password && (
                            <p className={`text-sm mt-1 ${passwordStrength.color}`}>
                                Password Strength: {passwordStrength.strength}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                            placeholder="Confirm new password"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#B88E2F] text-white py-3 rounded-lg font-semibold hover:bg-[#9F7A28] transition-colors duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>

                    {/* Back to Login */}
                    <Link
                        href="/login"
                        className="block text-center text-sm text-[#898989] hover:text-[#B88E2F]"
                    >
                        ← Back to Login
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
