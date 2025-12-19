'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import api from '@/lib/api';
import { Search, Filter, Eye } from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/all');
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders(); // Refresh list
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
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Customer Name or Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
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

                {/* Orders Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                                                    className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 ${order.status === 'delivered' ? 'bg-green-100 text-green-800 focus:ring-green-500' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-800 focus:ring-blue-500' :
                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800 focus:ring-red-500' :
                                                                'bg-yellow-100 text-yellow-800 focus:ring-yellow-500'
                                                        }`}
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
            </div>
        </AdminLayout>
    );
}
