'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function DebugVendorsPage() {
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch all vendors
                const vendorsRes = await api.get('/vendors/all?limit=1000');
                const vendorsData = vendorsRes.data.vendors || [];
                setVendors(vendorsData);
                
                // Fetch some products to see vendor assignments
                const productsRes = await api.get('/products?limit=10');
                const productsData = productsRes.data.products || [];
                setProducts(productsData);
                
                console.log('Vendors:', vendorsData);
                console.log('Products:', productsData);
                
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Debug Vendors</h1>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Debug Vendors</h1>
                <p className="text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Debug Vendors & Products</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vendors Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Vendors ({vendors.length})</h2>
                    <div className="space-y-4">
                        {vendors.map((vendor) => (
                            <div key={vendor._id} className="border rounded p-4">
                                <h3 className="font-semibold">{vendor.shopName}</h3>
                                <p className="text-sm text-gray-600">{vendor.businessName}</p>
                                <p className="text-sm">Status: {vendor.status}</p>
                                <p className="text-sm">Vendor ID: {vendor._id}</p>
                                <p className="text-sm">User ID: {vendor.user?._id || vendor.user}</p>
                                <a 
                                    href={`/shop/vendor/${vendor._id}`}
                                    className="text-blue-600 hover:underline text-sm"
                                    target="_blank"
                                >
                                    Visit Shop (Vendor ID)
                                </a>
                                <br />
                                <a 
                                    href={`/shop/vendor/${vendor.user?._id || vendor.user}`}
                                    className="text-green-600 hover:underline text-sm"
                                    target="_blank"
                                >
                                    Visit Shop (User ID)
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Products Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Sample Products ({products.length})</h2>
                    <div className="space-y-4">
                        {products.map((product) => (
                            <div key={product._id} className="border rounded p-4">
                                <h3 className="font-semibold">{product.title}</h3>
                                <p className="text-sm text-gray-600">{product.subtitle}</p>
                                <p className="text-sm">Product ID: {product._id}</p>
                                <p className="text-sm">Vendor (User ID): {product.vendor}</p>
                                <p className="text-sm">Category: {product.topCategory}</p>
                                <p className="text-sm">Approved: {product.isApproved ? 'Yes' : 'No'}</p>
                                <a 
                                    href={`/shop/vendor/${product.vendor}`}
                                    className="text-blue-600 hover:underline text-sm"
                                    target="_blank"
                                >
                                    Visit Vendor Shop
                                </a>
                                <br />
                                <a 
                                    href={`/shop/${product._id}`}
                                    className="text-green-600 hover:underline text-sm"
                                    target="_blank"
                                >
                                    View Product
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Vendor-Product Mapping */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Vendor-Product Mapping</h2>
                <div className="bg-gray-100 p-4 rounded">
                    <h3 className="font-semibold mb-2">Products by Vendor:</h3>
                    {vendors.map((vendor) => {
                        const vendorProducts = products.filter(p => 
                            p.vendor === vendor.user?._id || p.vendor === vendor.user
                        );
                        return (
                            <div key={vendor._id} className="mb-2">
                                <strong>{vendor.shopName}:</strong> {vendorProducts.length} products
                                {vendorProducts.length > 0 && (
                                    <span className="text-sm text-gray-600 ml-2">
                                        ({vendorProducts.map(p => p.title).join(', ')})
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}