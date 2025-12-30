'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import api from '@/lib/api';
import { Search, Filter, Eye, ShoppingCart, X, MoreVertical } from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeMenu, setActiveMenu] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/all');
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            
            if (error.response?.status === 404) {
                console.log('No orders found or endpoint not available');
                setOrders([]); // Set empty array instead of showing error
            } else if (error.response?.status === 401) {
                alert('Authentication failed. Please login again.');
                window.location.href = '/login';
            } else if (error.response?.status === 403) {
                alert('Access denied. You don\'t have permission to view orders.');
            } else {
                alert('Failed to fetch orders. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
            setActiveMenu(null);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update order status');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    // Mobile Order Card
    const MobileOrderCard = ({ order }) => (
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="font-mono text-sm font-medium text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="relative">
                    <button 
                        onClick={() => setActiveMenu(activeMenu === order._id ? null : order._id)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                    >
                        <MoreVertical size={18} className="text-gray-500" />
                    </button>
                    {activeMenu === order._id && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[140px]">
                                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(order._id, status)}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 capitalize ${order.status === status ? 'font-medium text-[#B88E2F]' : 'text-gray-700'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm truncate">{order.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500 truncate">{order.user?.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>
                
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                        Rp {(order.total || order.totalAmount || 0).toLocaleString()}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg">
                        <Eye size={16} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
                </div>

                {/* Filters */}
                <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 mb-4 sm:mb-6 space-y-3 sm:space-y-0 sm:flex sm:gap-4 sm:justify-between">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F] text-sm"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500 hidden sm:block" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#B88E2F] text-sm bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Mobile View - Cards */}
                <div className="lg:hidden space-y-3">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="animate-spin w-8 h-8 border-2 border-[#B88E2F] border-t-transparent rounded-full mx-auto mb-4"></div>
                            Loading orders...
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500">No orders found</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <MobileOrderCard key={order._id} order={order} />
                        ))
                    )}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Order ID</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Total</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500">Loading orders...</td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500">No orders found</td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order._id} className="border-t border-gray-200 hover:bg-gray-50">
                                            <td className="py-4 px-6 font-mono text-sm text-gray-600">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.user?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="py-4 px-6 font-medium text-gray-900">
                                                Rp {(order.total || order.totalAmount || 0).toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 ${getStatusColor(order.status)}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Results count */}
                {!loading && filteredOrders.length > 0 && (
                    <p className="text-sm text-gray-500 mt-4 text-center sm:text-left">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </p>
                )}
            </div>
        </AdminLayout>
    );
}
