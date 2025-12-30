'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import api from '@/lib/api';
import { Mail, Users, Send } from 'lucide-react';

export default function AdminNewsletterPage() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [emailForm, setEmailForm] = useState({
        subject: '',
        message: ''
    });

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const response = await api.get('/newsletter/subscribers');
            setSubscribers(response.data);
        } catch (error) {
            console.error('Failed to fetch subscribers:', error);
            alert('Failed to load subscribers');
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        if (!confirm(`Send this email to ${subscribers.length} subscribers?`)) return;

        setSending(true);
        try {
            await api.post('/newsletter/send', emailForm);
            alert('Newsletter sent successfully!');
            setEmailForm({ subject: '', message: '' });
        } catch (error) {
            console.error('Failed to send newsletter:', error);
            alert('Failed to send newsletter');
        } finally {
            setSending(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Newsletter Management</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Send newsletters to your subscribers</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                                <Users size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{subscribers.length}</p>
                                <p className="text-xs sm:text-sm text-gray-500">Total Subscribers</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                                <Mail size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">Active</p>
                                <p className="text-xs sm:text-sm text-gray-500">Newsletter Status</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* Send Email Form */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 h-fit order-2 lg:order-1">
                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                            <Send size={20} className="text-[#B88E2F]" />
                            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Send Newsletter</h2>
                        </div>
                        <form onSubmit={handleSendEmail} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                                <input
                                    type="text"
                                    value={emailForm.subject}
                                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                    required
                                    placeholder="Enter email subject..."
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F] text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                                <textarea
                                    value={emailForm.message}
                                    onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                                    required
                                    rows={6}
                                    placeholder="Write your newsletter content..."
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F] text-sm sm:text-base resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={sending || subscribers.length === 0}
                                className="w-full bg-[#B88E2F] text-white py-2.5 sm:py-3 rounded-lg hover:bg-[#9F7A28] active:bg-[#8A6B1F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send to {subscribers.length} Subscribers
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Subscribers List */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 order-1 lg:order-2">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div className="flex items-center gap-2">
                                <Users size={20} className="text-[#B88E2F]" />
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Subscribers</h2>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {subscribers.length} total
                            </span>
                        </div>
                        
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-2 border-[#B88E2F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-500 text-sm">Loading subscribers.....</p>
                            </div>
                        ) : subscribers.length === 0 ? (
                            <div className="text-center py-8 sm:py-12">
                                <Mail size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-500">No subscribers yet.</p>
                                <p className="text-xs sm:text-sm text-gray-400 mt-1">Subscribers will appear here when they sign up.</p>
                            </div>
                        ) : (
                            <>
                                {/* Mobile View - Cards */}
                                <div className="sm:hidden space-y-3 max-h-[400px] overflow-y-auto">
                                    {subscribers.map((sub) => (
                                        <div key={sub._id} className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-medium text-gray-900 truncate">{sub.email}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Subscribed {new Date(sub.subscribedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Desktop View - Table */}
                                <div className="hidden sm:block overflow-x-auto max-h-[400px] overflow-y-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 rounded-tl-lg">Email</th>
                                                <th className="px-4 py-3 rounded-tr-lg">Subscribed At</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {subscribers.map((sub) => (
                                                <tr key={sub._id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm truncate max-w-[200px]">{sub.email}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">
                                                        {new Date(sub.subscribedAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
