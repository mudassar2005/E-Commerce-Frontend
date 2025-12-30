'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api, { API_BASE_URL } from '@/lib/api';
import { useAlert } from '@/context/AlertContext';
import {
  MapPin,
  Star,
  Package,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  Heart,
  ShoppingCart,
  Filter,
  Grid,
  List
} from 'lucide-react';

export default function ShopProfile() {
  const params = useParams();
  const { showError, showSuccess } = useAlert();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (params.vendorId) {
      fetchShopData();
    }
  }, [params.vendorId]);

  const fetchShopData = async () => {
    try {
      setLoading(true);

      let vendorData = null;

      // First, try to get vendor by vendor document ID
      try {
        console.log('Trying to fetch vendor with vendor ID:', params.vendorId);
        const vendorRes = await api.get(`/vendors/${params.vendorId}`);
        vendorData = vendorRes.data;
        console.log('Found vendor by vendor ID:', vendorData);
      } catch (error) {
        console.log('Vendor ID lookup failed:', error.response?.status, error.message);
        
        // If not found, try to get vendor by user ID (which is more common)
        try {
          console.log('Trying to fetch vendor by user ID:', params.vendorId);
          const vendorByUserRes = await api.get(`/vendors/by-user/${params.vendorId}`);
          vendorData = vendorByUserRes.data;
          console.log('Found vendor by user ID:', vendorData);
        } catch (userError) {
          console.log('User ID lookup also failed:', userError.response?.status, userError.message);
          
          if (error.response?.status === 404 && userError.response?.status === 404) {
            throw new Error('Shop not found. This vendor may not have set up their shop profile yet.');
          } else if (error.response?.status === 403 || userError.response?.status === 403) {
            throw new Error('Access denied. This shop may be private or suspended.');
          } else {
            throw new Error('Unable to load shop information.');
          }
        }
      }

      if (!vendorData) {
        throw new Error('Vendor not found');
      }

      // Check if vendor is approved and active
      if (vendorData.status !== 'approved') {
        throw new Error('This shop is not available. The vendor application may be pending approval.');
      }

      if (!vendorData.isActive) {
        throw new Error('This shop is currently inactive.');
      }

      setVendor(vendorData);

      // Fetch vendor products using the user ID
      const vendorUserId = vendorData.user?._id || vendorData.user;
      console.log('Fetching products for vendor user ID:', vendorUserId);
      
      if (vendorUserId) {
        try {
          const productsRes = await api.get(`/products?vendor=${vendorUserId}&limit=1000&isApproved=true`);
          console.log('Products response:', productsRes.data);
          setProducts(productsRes.data.products || []);
        } catch (productsError) {
          console.error('Error fetching products:', productsError);
          // Don't fail the whole page if products can't be loaded
          setProducts([]);
        }
      } else {
        console.warn('No vendor user ID found');
        setProducts([]);
      }

      // TODO: Fetch vendor reviews when review system is implemented
      setReviews([]);

    } catch (error) {
      console.error('Error fetching shop data:', error);
      console.error('Error details:', {
        status: error.response?.status || 'No status',
        statusText: error.response?.statusText || 'No status text',
        data: error.response?.data || 'No response data',
        message: error.message || 'No error message',
        url: error.config?.url || 'No URL',
        method: error.config?.method || 'No method'
      });
      
      let errorMessage = 'Failed to load shop information';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      showSuccess('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add product to cart');
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await api.post(`/wishlist/${productId}`);
      showSuccess('Product added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      showError('Failed to add product to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Shop Not Found</h1>
          <p className="text-gray-600">The shop you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Header */}
      <div className="relative">
        {/* Background Image */}
        <div
          className="h-64 bg-cover bg-center bg-gray-300"
          style={{
            backgroundImage: vendor.shopBackgroundImage
              ? `url(${API_BASE_URL}${vendor.shopBackgroundImage})`
              : 'linear-gradient(135deg, #B88E2F 0%, #d4a574 100%)'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Shop Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-6">
              {/* Shop Logo */}
              <div className="w-24 h-24 bg-white rounded-lg p-2 shadow-lg">
                <img
                  src={vendor.shopLogo || '/images/placeholder.svg'}
                  alt={vendor.shopName}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Shop Details */}
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">{vendor.shopName}</h1>
                <p className="text-lg opacity-90 mb-2">{vendor.businessName}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{vendor.averageRating?.toFixed(1) || '0.0'}</span>
                    <span className="opacity-75">({vendor.totalReviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{vendor.totalProducts || 0} products</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{vendor.businessAddress?.city}, {vendor.businessAddress?.state}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Shop Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Shop</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {vendor.shopDescription || vendor.businessDescription || 'No description available.'}
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{vendor.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{vendor.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <div>{vendor.businessAddress?.street}</div>
                    <div>{vendor.businessAddress?.city}, {vendor.businessAddress?.state}</div>
                    <div>{vendor.businessAddress?.zipCode}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Products</span>
                  <span className="text-sm font-medium">{vendor.totalProducts || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Orders</span>
                  <span className="text-sm font-medium">{vendor.totalOrders || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <span className="text-sm font-medium">{vendor.averageRating?.toFixed(1) || '0.0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Established</span>
                  <span className="text-sm font-medium">{vendor.establishedYear || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('products')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'products'
                      ? 'border-[#B88E2F] text-[#B88E2F]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Products ({products.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'reviews'
                      ? 'border-[#B88E2F] text-[#B88E2F]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Reviews ({reviews.length})
                  </button>
                </nav>
              </div>

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className="p-6">
                  {/* Controls */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#B88E2F] text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#B88E2F] text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Products Grid */}
                  {sortedProducts.length > 0 ? (
                    <div className={viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                    }>
                      {sortedProducts.map((product) => (
                        <div key={product._id} className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex' : ''
                          }`}>
                          <div className={viewMode === 'list' ? 'w-48 h-32' : 'aspect-w-1 aspect-h-1'}>
                            <img
                              src={product.images?.[0] || '/images/placeholder.svg'}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.subtitle}</p>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xl font-bold text-[#B88E2F]">${product.price ? product.price.toLocaleString() : '0'}</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-gray-600">{product.averageRating?.toFixed(1) || '0.0'}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => addToCart(product._id)}
                                className="flex-1 bg-[#B88E2F] text-white px-3 py-2 rounded text-sm hover:bg-[#d4a574] transition-colors flex items-center justify-center gap-1"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                              </button>
                              <button
                                onClick={() => addToWishlist(product._id)}
                                className="bg-gray-100 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
                              >
                                <Heart className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Yet</h3>
                      <p className="text-gray-600">This shop hasn't added any products yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="p-6">
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600">Be the first to review this shop!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}