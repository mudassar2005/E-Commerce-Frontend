'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/admin-layout';
import { useProducts } from '@/context/ProductsContext';
import { Plus, Edit, Trash2, Search, Package, X, MoreVertical } from 'lucide-react';
import Image from 'next/image';

export default function AdminProductsPage() {
    const { products, deleteProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMenu, setActiveMenu] = useState(null);

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.topCategory.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            deleteProduct(id);
        }
        setActiveMenu(null);
    };

    // Mobile Product Card
    const MobileProductCard = ({ product }) => (
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package size={24} />
                        </div>
                    )}
                </div>
                
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                            <p className="text-sm text-gray-500 truncate">{product.subtitle}</p>
                        </div>
                        
                        {/* Actions Menu */}
                        <div className="relative">
                            <button 
                                onClick={() => setActiveMenu(activeMenu === product.id ? null : product.id)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <MoreVertical size={18} className="text-gray-500" />
                            </button>
                            
                            {activeMenu === product.id && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-10" 
                                        onClick={() => setActiveMenu(null)}
                                    />
                                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[120px]">
                                        <Link
                                            href={`/admin/products/edit/${product.id}`}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id, product.title)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {/* Price & Category */}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">
                            Rp {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                                Rp {product.originalPrice.toLocaleString()}
                            </span>
                        )}
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {product.topCategory}
                        </span>
                    </div>
                    
                    {/* Status & Stock */}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                        {product.isNew && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-teal-100 text-teal-600">New</span>
                        )}
                        {product.isFeatured && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-600">Featured</span>
                        )}
                        {product.stock < 10 && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600">Low Stock</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
                    <Link
                        href="/admin/products/add"
                        className="flex items-center justify-center gap-2 bg-[#B88E2F] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-[#9F7A28] transition-colors text-sm sm:text-base font-medium"
                    >
                        <Plus size={18} />
                        Add Product
                    </Link>
                </div>

                {/* Search */}
                <div className="mb-4 sm:mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B88E2F] text-sm sm:text-base"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile View - Cards */}
                <div className="lg:hidden space-y-3">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                            <Package size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500">No products found</p>
                            <Link
                                href="/admin/products/add"
                                className="inline-flex items-center gap-2 mt-4 text-[#B88E2F] font-medium"
                            >
                                <Plus size={18} />
                                Add your first product
                            </Link>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <MobileProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Product</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Category</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Price</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Stock</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden relative">
                                                    {product.image ? (
                                                        <Image
                                                            src={product.image}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <Package size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{product.title}</p>
                                                    <p className="text-sm text-gray-500">{product.subtitle}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{product.topCategory}</td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-gray-900 font-medium">Rp {product.price.toLocaleString()}</p>
                                                {product.originalPrice && (
                                                    <p className="text-sm text-gray-500 line-through">
                                                        Rp {product.originalPrice.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{product.stock}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                {product.isNew && (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-600 w-fit">
                                                        New
                                                    </span>
                                                )}
                                                {product.isFeatured && (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-600 w-fit">
                                                        Featured
                                                    </span>
                                                )}
                                                {product.stock < 10 && (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 w-fit">
                                                        Low Stock
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.title)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No products found</p>
                        </div>
                    )}
                </div>

                {/* Product count */}
                {filteredProducts.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600 text-center sm:text-left">
                        Showing {filteredProducts.length} of {products.length} products
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
