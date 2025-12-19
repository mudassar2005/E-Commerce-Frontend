'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignUpPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        vendorDetails: {
            businessName: '',
            address: '',
            phone: '',
            taxId: '',
            description: ''
        },
        agreeToTerms: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        setLoading(true);
        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: formData.role,
            vendorDetails: formData.role === 'vendor' ? formData.vendorDetails : undefined
        });

        if (result.success) {
            // Redirect to OTP verification page
            router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#3A3A3A] mb-2">Create Account</h1>
                    <p className="text-[#898989]">Sign up to get started</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                            placeholder="Enter your full name"
                        />
                    </div>

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
                            className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                            I am a
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent bg-white"
                        >
                            <option value="user">Customer</option>
                            <option value="vendor">Vendor</option>
                            <option value="admin">Admin (Demo)</option>
                        </select>
                    </div>

                    {/* Vendor Details */}
                    {formData.role === 'vendor' && (
                        <div className="space-y-6 border-l-4 border-[#B88E2F] pl-4 py-2 bg-gray-50 rounded-r-lg">
                            <h3 className="font-semibold text-gray-900">Vendor Business Details</h3>

                            <div>
                                <label htmlFor="businessName" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                                    Business Name
                                </label>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.vendorDetails?.businessName || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        vendorDetails: { ...prev.vendorDetails, businessName: e.target.value }
                                    }))}
                                    required={formData.role === 'vendor'}
                                    className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                    placeholder="Enter your business name"
                                />
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                                    Business Address
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.vendorDetails?.address || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            vendorDetails: { ...prev.vendorDetails, address: e.target.value }
                                        }))}
                                        required={formData.role === 'vendor'}
                                        className="flex-1 px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                        placeholder="Enter business address"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (navigator.geolocation) {
                                                navigator.geolocation.getCurrentPosition(async (position) => {
                                                    const { latitude, longitude } = position.coords;
                                                    try {
                                                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                                                        const data = await res.json();
                                                        if (data.display_name) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                vendorDetails: { ...prev.vendorDetails, address: data.display_name }
                                                            }));
                                                        }
                                                    } catch (error) {
                                                        console.error('Failed to get address:', error);
                                                        alert('Failed to get address from location');
                                                    }
                                                }, (error) => {
                                                    console.error('Geolocation error:', error);
                                                    alert('Failed to get location. Please allow location access.');
                                                });
                                            } else {
                                                alert('Geolocation is not supported by this browser.');
                                            }
                                        }}
                                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                        title="Use Current Location"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.vendorDetails?.phone || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            vendorDetails: { ...prev.vendorDetails, phone: e.target.value }
                                        }))}
                                        required={formData.role === 'vendor'}
                                        className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                        placeholder="Business phone"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="taxId" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                                        Tax ID
                                    </label>
                                    <input
                                        type="text"
                                        name="taxId"
                                        value={formData.vendorDetails?.taxId || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            vendorDetails: { ...prev.vendorDetails, taxId: e.target.value }
                                        }))}
                                        required={formData.role === 'vendor'}
                                        className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                        placeholder="Tax ID / VAT"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

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
                            className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                            placeholder="Create a password"
                        />
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
                            placeholder="Confirm your password"
                        />
                    </div>

                    {/* Terms & Conditions */}
                    <label className="flex items-start">
                        <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            required
                            className="w-4 h-4 mt-1 text-[#B88E2F] border-[#9F9F9F] rounded focus:ring-[#B88E2F]"
                        />
                        <span className="ml-2 text-sm text-[#3A3A3A]">
                            I agree to the{' '}
                            <Link href="/terms" className="text-[#B88E2F] hover:underline">
                                Terms & Conditions
                            </Link>
                        </span>
                    </label>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#B88E2F] text-white py-3 rounded-lg font-semibold hover:bg-[#9F7A28] transition-colors duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    {/* Login Link */}
                    <p className="text-center text-sm text-[#898989]">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#B88E2F] font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
