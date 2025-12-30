'use client';

import React, { useEffect, useState } from 'react';
import VendorLayout from '@/components/vendor/vendor-layout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Package, DollarSign, TrendingUp, ShoppingBag, Clock } from 'lucide-react';

export default function VendorDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalSales: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/products/vendor/me');
            setStats(prev => ({
                ...prev,
                totalProducts: data.length
            }));
        } catch (error) {
            console.error('Failed to fetch vendor stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <VendorLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Welcome back, {user?.vendorDetails?.businessName || user?.name}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Total Products */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="p-2.5 sm:p-3 bg-blue-100 rounded-full text-blue-600">
                                <Package size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <span className="text-xs sm:text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {loading ? (
                                <span className="inline-block w-8 h-6 bg-gray-200 animate-pulse rounded"></span>
                            ) : stats.totalProducts}
                        </h3>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">Total Products</p>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="p-2.5 sm:p-3 bg-green-100 rounded-full text-green-600">
                                <DollarSign size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <span className="text-xs sm:text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">+8%</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Rp 0</h3>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">Total Revenue</p>
                    </div>

                    {/* Total Sales */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="p-2.5 sm:p-3 bg-purple-100 rounded-full text-purple-600">
                                <TrendingUp size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <span className="text-xs sm:text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">+24%</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">0</h3>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">Total Sales.</p>
                    </div>
                </div>

                {/* Quick Actions - Mobile Friendly */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 lg:hidden">
                    <a 
                        href="/vendor/products/add" 
                        className="flex flex-col items-center justify-center p-4 bg-[#B88E2F] text-white rounded-xl hover:bg-[#9F7A28] transition-colors"
                    >
                        <Package size={24} className="mb-2" />
                        <span className="text-sm font-medium">Add Product</span>
                    </a>
                    <a 
                        href="/vendor/products" 
                        className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <ShoppingBag size={24} className="mb-2" />
                        <span className="text-sm font-medium">View Products</span>
                    </a>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <Clock size={20} className="text-gray-500" />
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Activity</h2>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="text-center py-6 sm:py-8 text-gray-500">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <Clock size={32} className="text-gray-400" />
                            </div>
                            <p className="text-sm sm:text-base">No recent activity to show.</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Your recent orders and updates will appear here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </VendorLayout>
    );
}
