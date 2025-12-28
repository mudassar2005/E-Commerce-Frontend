'use client';

import React, { useState } from 'react';
import Navbar from '@/components/nav-bar/nav-bar';
import Footer from '@/components/footer/footer';
import Breadcrumb from '@/components/pages/common/breadcrumb';
import api from '@/lib/api';

export default function TrackOrderPage() {
    const [formData, setFormData] = useState({
        orderId: '',
        email: ''
    });
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const { data } = await api.post('/orders/track', formData);
            setOrder(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to track order. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>


            <div className="bg-[#F9F1E7] py-12">
                <div className="container mx-auto px-4">
                    <Breadcrumb items={[{ label: 'Track Order' }]} />
                    <h1 className="text-4xl font-bold text-[#3A3A3A] mt-4">Track Your Order</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
                        <p className="text-[#898989] mb-6">
                            To track your order please enter your Order ID in the box below and press the "Track" button.
                            This was given to you on your receipt and in the confirmation email you should have received.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="orderId" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                                    Order ID
                                </label>
                                <input
                                    type="text"
                                    id="orderId"
                                    name="orderId"
                                    value={formData.orderId}
                                    onChange={handleChange}
                                    required
                                    placeholder="Found in your order confirmation email."
                                    className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                                    Billing Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Email you used during checkout."
                                    className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#B88E2F] text-white py-3 rounded-lg font-semibold hover:bg-[#9F7A28] transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Tracking...' : 'Track'}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
                                {error}
                            </div>
                        )}
                    </div>

                    {order && (
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                                <div>
                                    <h2 className="text-xl font-bold text-[#3A3A3A]">Order #{order.orderNumber}</h2>
                                    <p className="text-sm text-[#898989]">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize
                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="space-y-4 mb-6">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            {item.product?.image && (
                                                <img src={item.product.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                                            )}
                                            <div>
                                                <p className="font-medium text-[#3A3A3A]">{item.title}</p>
                                                <p className="text-sm text-[#898989]">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">Rp {item.price.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-gray-100 space-y-2">
                                <div className="flex justify-between text-[#898989]">
                                    <span>Subtotal</span>
                                    <span>Rp {order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[#898989]">
                                    <span>Shipping</span>
                                    <span>{order.shipping === 0 ? 'Free' : `Rp ${order.shipping.toLocaleString()}`}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-[#3A3A3A] pt-2">
                                    <span>Total</span>
                                    <span>Rp {order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}
