'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // Fetch all approved products for the shop (set high limit to get all products)
            const { data } = await api.get('/products?isApproved=true&limit=1000');
            
            // Handle the API response format - the backend returns { products: [], total, page, etc. }
            let productsArray = [];
            if (data && Array.isArray(data.products)) {
                productsArray = data.products;
            } else if (Array.isArray(data)) {
                productsArray = data;
            } else {
                console.warn('Unexpected API response format:', data);
                productsArray = [];
            }
            
            // Map _id to id for frontend compatibility and filter approved products
            const mappedProducts = productsArray
                .filter(product => product.isApproved === true) // Extra safety filter
                .map(product => ({
                    ...product,
                    id: product._id || product.id
                }));
            
            setProducts(mappedProducts);
            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(`Failed to load products: ${err.message}`);
            setProducts([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addProduct = async (productData) => {
        try {
            const { data } = await api.post('/products', productData);
            const newProduct = { ...data, id: data._id };
            setProducts(prev => [...prev, newProduct]);
            return newProduct;
        } catch (err) {
            console.error('Error adding product:', err);
            throw err;
        }
    };

    const updateProduct = async (id, updatedData) => {
        try {
            const { data } = await api.patch(`/products/${id}`, updatedData);
            const updatedProduct = { ...data, id: data._id };
            setProducts(prev =>
                prev.map(product =>
                    product.id === id ? updatedProduct : product
                )
            );
            return updatedProduct;
        } catch (err) {
            console.error('Error updating product:', err);
            throw err;
        }
    };

    const deleteProduct = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(product => product.id !== id));
        } catch (err) {
            console.error('Error deleting product:', err);
            throw err;
        }
    };

    // Enhanced CRUD operations
    const getProductById = async (id) => {
        // First check local state
        const localProduct = products.find(product => product.id === id);
        if (localProduct) {
            return localProduct;
        }
        
        // If not found locally, fetch from API
        try {
            const { data } = await api.get(`/products/${id}`);
            return { ...data, id: data._id };
        } catch (err) {
            console.error('Error fetching product by ID:', err);
            throw err;
        }
    };

    const searchProducts = async (searchTerm, filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (filters.category) params.append('category', filters.category);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.isApproved !== undefined) params.append('isApproved', filters.isApproved);
            
            // Add high limit to get all matching products
            params.append('limit', '1000');
            
            const { data } = await api.get(`/products?${params.toString()}`);
            const productsArray = data.products || [];
            return productsArray.map(product => ({
                ...product,
                id: product._id || product.id
            }));
        } catch (err) {
            console.error('Error searching products:', err);
            throw err;
        }
    };

    const getProductsByVendor = async (vendorId) => {
        try {
            const { data } = await api.get(`/products?vendor=${vendorId}&limit=1000`);
            const productsArray = data.products || [];
            return productsArray.map(product => ({
                ...product,
                id: product._id || product.id
            }));
        } catch (err) {
            console.error('Error fetching vendor products:', err);
            throw err;
        }
    };

    const uploadProductImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const { data } = await api.post('/products/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data.url;
        } catch (err) {
            console.error('Error uploading product image:', err);
            throw err;
        }
    };

    const bulkUpdateProducts = async (productIds, updateData) => {
        try {
            const promises = productIds.map(id => 
                api.patch(`/products/${id}`, updateData)
            );
            const results = await Promise.all(promises);
            
            // Update local state
            setProducts(prev =>
                prev.map(product => {
                    if (productIds.includes(product.id)) {
                        const updatedProduct = results.find(r => r.data._id === product.id);
                        return updatedProduct ? { ...updatedProduct.data, id: updatedProduct.data._id } : product;
                    }
                    return product;
                })
            );
            
            return results.map(r => ({ ...r.data, id: r.data._id }));
        } catch (err) {
            console.error('Error bulk updating products:', err);
            throw err;
        }
    };

    const bulkDeleteProducts = async (productIds) => {
        try {
            const promises = productIds.map(id => api.delete(`/products/${id}`));
            await Promise.all(promises);
            
            // Update local state
            setProducts(prev => prev.filter(product => !productIds.includes(product.id)));
        } catch (err) {
            console.error('Error bulk deleting products:', err);
            throw err;
        }
    };

    const getProductsByCategory = (category) => {
        return products.filter(product => 
            product.topCategory === category || 
            product.category === category
        );
    };

    const getFeaturedProducts = () => {
        return products.filter(product => product.isFeatured);
    };

    const getNewProducts = () => {
        return products.filter(product => product.isNew);
    };

    return (
        <ProductsContext.Provider
            value={{
                products,
                loading,
                error,
                fetchProducts,
                addProduct,
                updateProduct,
                deleteProduct,
                getProductById,
                searchProducts,
                getProductsByVendor,
                uploadProductImage,
                bulkUpdateProducts,
                bulkDeleteProducts,
                getProductsByCategory,
                getFeaturedProducts,
                getNewProducts
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
}
