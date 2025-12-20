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
            const { data } = await api.get('/products');
            
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
            
            // Map _id to id for frontend compatibility
            const mappedProducts = productsArray.map(product => ({
                ...product,
                id: product._id || product.id
            }));
            
            setProducts(mappedProducts);
            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
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

    const getProductById = (id) => {
        return products.find(product => product.id === id);
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
