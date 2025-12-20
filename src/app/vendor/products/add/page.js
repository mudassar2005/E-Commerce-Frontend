'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function VendorAddProductContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        price: '',
        originalPrice: '',
        topCategory: 'Men',
        subCategory: 'T-Shirts',
        stock: '',
        isNew: false,
        isFeatured: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'topCategory') {
            // Reset subCategory when topCategory changes
            let defaultSubCategory = 'T-Shirts';
            if (value === 'Footwear') {
                defaultSubCategory = 'Sneakers';
            } else if (value === 'Kids') {
                defaultSubCategory = 'Kids Casual';
            }
            
            setFormData(prev => ({
                ...prev,
                [name]: value,
                subCategory: defaultSubCategory
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const removeImage = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let imageUrl = '/images/default-product.png'; // Default

            // Upload image if selected
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);
                const uploadRes = await api.post('/products/upload', uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadRes.data.url;
            }

            const productData = {
                ...formData,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                stock: Number(formData.stock),
                image: imageUrl
            };

            await api.post('/products', productData);
            router.push('/vendor/dashboard');
        } catch (err) {
            console.error('Failed to create product:', err);
            setError(err.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/vendor/dashboard" className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                                    placeholder="Enter product title"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subtitle <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    value={formData.subtitle}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                                    placeholder="Enter product subtitle"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                                    placeholder="Describe your product..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing & Inventory</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (PKR) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Original Price (Optional)
                                </label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Top Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="topCategory"
                                    value={formData.topCategory}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                                >
                                    <option value="Men">Men's Clothing</option>
                                    <option value="Women">Women's Clothing</option>
                                    <option value="Kids">Kids' Clothing</option>
                                    <option value="Footwear">Footwear</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sub Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                                >
                                    {formData.topCategory === 'Footwear' ? (
                                        <>
                                            <option value="Sneakers">Sneakers</option>
                                            <option value="Formal Shoes">Formal Shoes</option>
                                            <option value="Sandals">Sandals</option>
                                            <option value="Boots">Boots</option>
                                            <option value="Slippers">Slippers</option>
                                            <option value="Sports Shoes">Sports Shoes</option>
                                        </>
                                    ) : formData.topCategory === 'Kids' ? (
                                        <>
                                            <option value="Kids Casual">Kids Casual</option>
                                            <option value="Kids Formal">Kids Formal</option>
                                            <option value="Kids School">Kids School</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Unstitched">Unstitched</option>
                                            <option value="Stitched">Stitched</option>
                                            <option value="Jeans">Jeans</option>
                                            <option value="Shirts">Shirts</option>
                                            <option value="Dress Shirts">Dress Shirts</option>
                                            <option value="West">West</option>
                                            <option value="T-Shirts">T-Shirts</option>
                                            <option value="Trousers">Trousers</option>
                                            <option value="Jackets">Jackets</option>
                                            <option value="Sweaters">Sweaters</option>
                                            <option value="Hoodies">Hoodies</option>
                                            <option value="Blazers">Blazers</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Product Image */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Image</h2>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#B88E2F] transition-colors">
                            {previewUrl ? (
                                <div className="relative w-full max-w-md mx-auto">
                                    <div className="aspect-square relative">
                                        <Image
                                            src={previewUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload size={48} className="text-gray-400 mb-4" />
                                    <label className="cursor-pointer">
                                        <span className="bg-[#B88E2F] text-white px-6 py-3 rounded-lg hover:bg-[#9F7A28] transition-colors inline-block font-medium">
                                            Choose Image
                                        </span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="text-gray-500 mt-3 text-sm">PNG, JPG up to 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Settings</h2>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isNew"
                                    checked={formData.isNew}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-[#B88E2F] rounded focus:ring-[#B88E2F] focus:ring-2"
                                />
                                <span className="text-gray-700 font-medium">Mark as New Arrival</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-[#B88E2F] rounded focus:ring-[#B88E2F] focus:ring-2"
                                />
                                <span className="text-gray-700 font-medium">Mark as Featured</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4">
                        <Link
                            href="/vendor/dashboard"
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-center transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#B88E2F] text-white rounded-lg hover:bg-[#9F7A28] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Create Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function VendorAddProductPage() {
    return (
        <ProtectedRoute requiredRole="vendor">
            <VendorAddProductContent />
        </ProtectedRoute>
    );
}
